import { ethers } from 'ethers';
import type { Session } from 'next-auth';

import { prisma } from '@/lib/db/prisma';
import { NotFoundError } from '@/lib/validation/exceptions';

import { authActionClient } from '../safe-action';

const stakingContractAbi = [
  'function getTotalStakedAllTokens() external view returns (uint256)'
];

const contractAddress = process.env.PERSONAL_SMART_CONTRACT_ID || '';

export const getTotalStakedAllTokens = authActionClient
  .metadata({ actionName: 'getTotalStakedAllTokens' })
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

        // Appeler la fonction getTotalStakedAllTokens
        const totalStakedRaw = await contract.getTotalStakedAllTokens();

        // Convertir le BigInt en string formaté avec 18 décimales
        const totalStakedFormatted = ethers.formatUnits(totalStakedRaw, 18);

        console.log('Total staked all tokens:', totalStakedFormatted);

        return {
          totalStaked: totalStakedFormatted,
          totalStakedRaw: totalStakedRaw.toString(),
          symbol: 'CHZ' // Assuming all tokens are denominated in CHZ or similar base unit
        };
      } catch (error) {
        console.error('Erreur lors de la récupération du total staké:', error);

        // Retourner une valeur par défaut en cas d'erreur
        return {
          totalStaked: '0',
          totalStakedRaw: '0',
          symbol: 'CHZ',
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        };
      }
    }
  );
