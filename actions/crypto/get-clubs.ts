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

console.log('contractAddress', contractAddress);

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
    try {

            const provider = new ethers.JsonRpcProvider('https://spicy-rpc.chiliz.com');
            const contract = new ethers.Contract(contractAddress, erc20Abi, provider);
            const result = await contract.getAllowedTokensWithTotalStaked();
            console.log("result", result);

            // result[0] = tableau d'adresses, result[1] = tableau de valeurs stakées
            const addresses = result[0];
            const stakedValues = result[1];

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

            console.log(sortedClubs);

        return sortedClubs;

    } catch (error) {
      console.error('Erreur lors de la récupération de la balance CHZ:', error);
      throw new Error('Impossible de récupérer la balance CHZ');
    }
  });



