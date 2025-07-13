import { ethers } from 'ethers';
import type { Session } from 'next-auth';

import { prisma } from '@/lib/db/prisma';
import { NotFoundError } from '@/lib/validation/exceptions';

import { authActionClient } from '../safe-action';

const stakingContractAbi = [
  'function getUserStake(address user, address token) external view returns (uint256)'
];

const contractAddress = process.env.PERSONAL_SMART_CONTRACT_ID || '';

const mockedFanTokenAdresses = [
  '0xd6f6c45387961973e8307f606c29795647e9bed9',
  '0x43fab8e48ac6b73a443c82d041d9f96d58b5206d',
  '0x8f7749575288bb9d5a8a91f9566a0cf8ccddc925'
];

export const getPersonalStakes = authActionClient
  .metadata({ actionName: 'getPersonalStakes' })
  .action(
    async ({ ctx: { session } }: { ctx: { session: Session | null } }) => {
      if (!session?.user?.id) {
        throw new NotFoundError('Session utilisateur introuvable');
      }
      if (!contractAddress) {
        throw new NotFoundError('Contract address not found');
      }

      // Vérifier si l'adresse du contrat est valide
      if (!ethers.isAddress(contractAddress)) {
        throw new Error(`Adresse de contrat invalide: ${contractAddress}`);
      }
      

      try {
        const provider = new ethers.JsonRpcProvider(
          'https://spicy-rpc.chiliz.com'
        );

        // Vérifier si le contrat existe
        const code = await provider.getCode(contractAddress);
        if (code === '0x') {
          throw new Error(
            `Aucun contrat trouvé à l'adresse: ${contractAddress}`
          );
        }

        const contract = new ethers.Contract(
          contractAddress,
          stakingContractAbi,
          provider
        );

        const userAddress = await prisma.user.findUnique({
          where: {
            id: session.user.id
          },
          select: {
            walletAddress: true
          }
        });

        console.log('userAddress', userAddress);

        const totalStaked = [];

        // Appeler la fonction getTotalStakedAllTokens
        for (const token of mockedFanTokenAdresses) {
          const totalStakedRaw = await contract.getUserStake(userAddress?.walletAddress, token);
          const totalStakedFormatted = ethers.formatUnits(totalStakedRaw, 18);
          console.log('Total staked all tokens:', totalStakedFormatted);
          totalStaked.push({
            totalStaked: totalStakedFormatted,
            address: token,
            error: null
          });
        }

        return totalStaked;
      } catch (error) {
        console.error('Erreur lors de la récupération du total staké:', error);

        // Retourner une valeur par défaut en cas d'erreur
        return {
          totalStaked: '0',
          totalStakedRaw: '0',
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        };
      }
    }
  );
