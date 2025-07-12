import { ethers } from "ethers";
import { authActionClient } from "../safe-action";
import { prisma } from "@/lib/db/prisma";
import { NotFoundError } from "@/lib/validation/exceptions";
import { TatumSDK, Network, Chiliz } from '@tatumio/tatum'
import type { Session } from "next-auth";

// Type pour les informations d'un club
type ClubInfo = {
  token: string;
  name: string;
  symbol: string;
  totalStaked: string;
};

const erc20Abi = [
  'function getAllowedTokensWithTotalStaked() external view returns (address[] memory, uint256[] memory)',
  'function name() external view returns (string)',
  'function symbol() external view returns (string)',
];

const contractAddress = process.env.PERSONAL_SMART_CONTRACT_ID || '';



// Fonction pour récupérer les informations d'un token
async function getTokenInfo(tokenAddress: string, provider: ethers.JsonRpcProvider) {
  try {
    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);
    const [name, symbol] = await Promise.all([
      tokenContract.name(),
      tokenContract.symbol()
    ]);
    return { name, symbol };
  } catch (error) {
    console.error(`Erreur lors de la récupération des infos du token ${tokenAddress}:`, error);
    return { name: 'Unknown', symbol: 'UNK' };
  }
}

export const getClubs = authActionClient
  .metadata({ actionName: 'getClubs' })
  .action(async ({ ctx: { session } }: { ctx: { session: Session | null } }) => {
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
      const provider = new ethers.JsonRpcProvider('https://spicy-rpc.chiliz.com');

      // Vérifier si le contrat existe
      const code = await provider.getCode(contractAddress);
      if (code === '0x') {
        throw new Error(`Aucun contrat trouvé à l'adresse: ${contractAddress}`);
      }

      const contract = new ethers.Contract(contractAddress, erc20Abi, provider);

      // Vérifier si la fonction existe
      try {
        const result = await contract.getAllowedTokensWithTotalStaked();
        const addresses = result[0];
        const stakedValues = result[1];

        if (!addresses || addresses.length === 0) {
          console.log('Aucun token autorisé trouvé dans le contrat');
          return [];
        }

        // Récupérer les informations de chaque token
        const tokenInfoPromises = addresses.map(async (address: string, i: number): Promise<ClubInfo> => {
          const tokenInfo = await getTokenInfo(address, provider);
          return {
            token: address,
            name: tokenInfo.name,
            symbol: tokenInfo.symbol,
            totalStaked: ethers.formatUnits(stakedValues[i], 18)
          };
        });

        const formatted: ClubInfo[] = await Promise.all(tokenInfoPromises);

        // Tri décroissant par montant total staké
        const sortedClubs = formatted.sort((a, b) => {
          const aStaked = parseFloat(a.totalStaked);
          const bStaked = parseFloat(b.totalStaked);
          return bStaked - aStaked; // Tri décroissant
        });

        return sortedClubs;

      } catch (functionError) {
        console.error('Erreur lors de l\'appel de getAllowedTokensWithTotalStaked:', functionError);

        // Retourner des données de test si le contrat n'a pas la fonction
        return [
          {
            token: '0xd6f6c45387961973e8307f606c29795647e9bed9',
            name: 'Paris Saint-Germain Fan Token',
            symbol: 'PSG',
            totalStaked: '1000.0'
          },
          {
            token: '0x43fab8e48ac6b73a443c82d041d9f96d58b5206d',
            name: 'AC Milan Fan Token',
            symbol: 'ACM',
            totalStaked: '850.0'
          },
          {
            token: '0x8f7749575288bb9d5a8a91f9566a0cf8ccddc925',
            name: 'Atletico Madrid Fan Token',
            symbol: 'ATM',
            totalStaked: '720.0'
          }
        ];
      }

    } catch (error) {
      console.error('Erreur lors de la récupération des clubs:', error);
      throw new Error(`Impossible de récupérer les clubs: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  });



