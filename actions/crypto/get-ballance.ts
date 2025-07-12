import { ethers } from "ethers";
import { authActionClient } from "../safe-action";
import { prisma } from "@/lib/db/prisma";
import { NotFoundError } from "@/lib/validation/exceptions";
  import { TatumSDK, Network, Chiliz } from '@tatumio/tatum'



const getCHZBalance = async (address: string) => {
  const provider = new ethers.JsonRpcProvider('https://spicy-rpc.chiliz.com');
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}


const erc20Abi = [
  'function balanceOf(address owner) view returns (uint256)',
  'function name() view returns (string)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

const mockedFanTokenAdresses = [
  '0xd6f6c45387961973e8307f606c29795647e9bed9',
  '0x43fab8e48ac6b73a443c82d041d9f96d58b5206d',
  '0x8f7749575288bb9d5a8a91f9566a0cf8ccddc925',
]


const getFanTokenBalance = async (address: string, contractAddress: string) => {
  const provider = new ethers.JsonRpcProvider('https://spicy-rpc.chiliz.com');
  const contract = new ethers.Contract(contractAddress, erc20Abi, provider);
  const balanceRaw = await contract.balanceOf(address);
  const decimals = await contract.decimals();
  const name = await contract.name();
  const symbol = await contract.symbol();
  // const symbol = 'test'

  const balanceFormatted = Number(ethers.formatUnits(balanceRaw, decimals));

  console.log(`balance: ${balanceFormatted}`);
  console.log(decimals);
  return {
    balance: balanceFormatted,
    name: name,
    symbol: symbol
  };
}


export const getAllTokensBalance = authActionClient
  .metadata({ actionName: 'getCHZBalance' })
  .action(async ({ ctx: { session } }) => {
    if (!session?.user?.id) {
      throw new NotFoundError('Session utilisateur introuvable');
    }

    const finalCryptoArray = [];

    try {
      // Récupérer l'adresse du wallet depuis la base de données
      const user = await prisma.user.findFirst({
        where: { id: session.user.id },
        select: { walletAddress: true }
      });

      if (!user || !user.walletAddress) {
        throw new NotFoundError('Adresse du wallet non trouvée pour cet utilisateur');
      }

    const chzBalance = await getCHZBalance(user.walletAddress);

     finalCryptoArray.push({
      balance: chzBalance,
      symbol: 'CHZ'
    });

    const fanTokenPromises = mockedFanTokenAdresses.map(async (address) => {
      console.log("address", address);
      const result = await getFanTokenBalance(user.walletAddress, address);
      console.log("result", result);
      return {
        balance: result.balance,
        symbol: result.symbol
      };
    });

    const fanTokenResults = await Promise.all(fanTokenPromises);
    finalCryptoArray.push(...fanTokenResults);

    console.log("here", finalCryptoArray);

    return finalCryptoArray;



    } catch (error) {
      console.error('Erreur lors de la récupération de la balance CHZ:', error);
      throw new Error('Impossible de récupérer la balance CHZ');
    }
  });
  


