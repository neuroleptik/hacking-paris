import { ethers } from "ethers";
import { authActionClient } from "../safe-action";
import { prisma } from "@/lib/db/prisma";
import { NotFoundError } from "@/lib/validation/exceptions";
  import { TatumSDK, Network, Chiliz } from '@tatumio/tatum'


// Adresse du contrat CHZ (Ethereum Mainnet)
const CHZ_CONTRACT_ADDRESS = "0x3506424F91fC5e3eAfDFF7846c2078fF6cB84cBf";
const ETHEREUM_RPC_URL = "https://spicy-rpc.chiliz.com/";

// ABI minimal ERC20
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

export const getCHZBalance = authActionClient
  .metadata({ actionName: 'getCHZBalance' })
  .action(async ({ ctx: { session } }) => {
    if (!session?.user?.id) {
      throw new NotFoundError('Session utilisateur introuvable');
    }

    try {
      // Récupérer l'adresse du wallet depuis la base de données
      const user = await prisma.user.findFirst({
        where: { id: session.user.id },
        select: { walletAddress: true }
      });

      if (!user || !user.walletAddress) {
        throw new NotFoundError('Adresse du wallet non trouvée pour cet utilisateur');
      }

    
const tatum = await TatumSDK.init<Chiliz>({
  network: Network.CHILIZ,
  apiKey: 't-68716240b5c812f6688fcee1-c38e4136a317485f97bb3f5d',
})
const balance = await tatum.rpc.getBalance(user.walletAddress)

console.log(balance.result?.toString());
await tatum.destroy()
      
      return {
        balance: balance.result?.toString(),
        address: user.walletAddress,
        symbol: 'CHZ'
      };
    } catch (error) {
      console.error('Erreur lors de la récupération de la balance CHZ:', error);
      throw new Error('Impossible de récupérer la balance CHZ');
    }
  });
  


