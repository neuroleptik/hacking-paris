import { ethers } from "ethers";
import { authActionClient } from "../safe-action";
import { prisma } from "@/lib/db/prisma";
import { NotFoundError } from "@/lib/validation/exceptions";
import { TatumSDK, Network, Chiliz } from '@tatumio/tatum'


const erc20Abi = [
  'function getAllowedTokensWithTotalStaked() external view returns (address[] memory, uint256[] memory)',
];

const contractAddress = process.env.PERSONAL_SMART_CONTRACT_ID || '';

console.log('contractAddress', contractAddress);

export const getClubs = authActionClient
  .metadata({ actionName: 'getClubs' })
  .action(async ({ ctx: { session } }) => {
    if (!session?.user?.id) {
      throw new NotFoundError('Session utilisateur introuvable');
    }
    if (!contractAddress) {
      throw new NotFoundError('Contract address not found');
    }
    try {

            const provider = new ethers.JsonRpcProvider('https://spicy-rpc.chiliz.com');
            const contract = new ethers.Contract(contractAddress, erc20Abi, provider);
            const totalStaked = await contract.getAllowedTokensWithTotalStaked();
            console.log("totalStaked", totalStaked);

            const formatted = totalStaked.map((address: string, i: number) => ({
              token: address,
              totalStaked: ethers.formatUnits(totalStaked[i], 18)
            }));

            console.log(formatted);

        return totalStaked;

    } catch (error) {
      console.error('Erreur lors de la récupération de la balance CHZ:', error);
      throw new Error('Impossible de récupérer la balance CHZ');
    }
  });
  


