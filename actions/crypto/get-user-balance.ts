import { ethers } from 'ethers';
import type { Session } from 'next-auth';
import { z } from 'zod';

import { prisma } from '@/lib/db/prisma';
import { NotFoundError } from '@/lib/validation/exceptions';

import { authActionClient } from '../safe-action';

const getUserBalanceSchema = z.object({
  tokenAddress: z.string().min(1, 'Adresse du token requise')
});

const erc20Abi = [
  'function balanceOf(address owner) view returns (uint256)',
  'function name() view returns (string)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
];

const getTokenBalance = async (address: string, contractAddress: string) => {
  const provider = new ethers.JsonRpcProvider('https://spicy-rpc.chiliz.com');
  const contract = new ethers.Contract(contractAddress, erc20Abi, provider);
  const balanceRaw = await contract.balanceOf(address);
  const decimals = await contract.decimals();
  const name = await contract.name();
  const symbol = await contract.symbol();

  const balanceFormatted = ethers.formatUnits(balanceRaw, decimals);

  console.log(`balance: ${balanceFormatted}`);
  console.log(`decimals: ${decimals}`);
  console.log(`name: ${name}`);
  console.log(`symbol: ${symbol}`);

  return {
    balance: balanceFormatted,
    name: name,
    symbol: symbol,
    decimals: Number(decimals), // Convertir BigInt en number
    rawBalance: balanceRaw.toString() // Déjà en string
  };
};

export const getUserBalance = authActionClient
  .metadata({ actionName: 'getUserBalance' })
  .schema(getUserBalanceSchema)
  .action(
    async ({
      parsedInput,
      ctx: { session }
    }: {
      parsedInput: z.infer<typeof getUserBalanceSchema>;
      ctx: { session: Session | null };
    }) => {
      if (!session?.user?.id) {
        throw new NotFoundError('Session utilisateur introuvable');
      }

      try {
        // Récupérer l'adresse du wallet de l'utilisateur
        const user = await prisma.user.findFirst({
          where: { id: session.user.id },
          select: { walletAddress: true }
        });

        if (!user || !user.walletAddress) {
          throw new NotFoundError(
            'Adresse du wallet non trouvée pour cet utilisateur'
          );
        }

        const result = await getTokenBalance(
          user.walletAddress,
          parsedInput.tokenAddress
        );

        return {
          balance: result.balance,
          rawBalance: result.rawBalance,
          decimals: result.decimals,
          name: result.name,
          symbol: result.symbol
        };
      } catch (error) {
        console.error('Erreur lors de la récupération du solde:', error);
        throw new Error(
          `Impossible de récupérer le solde: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
        );
      }
    }
  );
