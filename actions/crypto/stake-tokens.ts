import { ethers } from 'ethers';
import type { Session } from 'next-auth';
import { z } from 'zod';

import { prisma } from '@/lib/db/prisma';
import { NotFoundError } from '@/lib/validation/exceptions';

import { authActionClient } from '../safe-action';

// Schéma de validation pour le staking
const stakeTokensSchema = z.object({
  tokenAddress: z.string().min(1, 'Adresse du token requise'),
  amount: z.string().min(1, 'Montant requis'),
  signature: z.string().min(1, 'Signature requise'),
  message: z.string().min(1, 'Message requis')
});

const erc20Abi = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function balanceOf(address owner) external view returns (uint256)',
  'function transferFrom(address from, address to, uint256 amount) external returns (bool)'
];

const stakingContractAbi = [
  'function stake(address tokenAddress, uint256 amount) external',
  'function getAllowedTokensWithTotalStaked() external view returns (address[] memory, uint256[] memory)'
];

const contractAddress = process.env.PERSONAL_SMART_CONTRACT_ID || '';
const privateKey = process.env.PRIVATE_KEY || '';

export const stakeTokens = authActionClient
  .metadata({ actionName: 'stakeTokens' })
  .schema(stakeTokensSchema)
  .action(
    async ({
      parsedInput,
      ctx: { session }
    }: {
      parsedInput: z.infer<typeof stakeTokensSchema>;
      ctx: { session: Session | null };
    }) => {
      if (!session?.user?.id) {
        throw new NotFoundError('Session utilisateur introuvable');
      }
      if (!contractAddress) {
        throw new NotFoundError('Contract address not found');
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

        const provider = new ethers.JsonRpcProvider(
          'https://spicy-rpc.chiliz.com'
        );

        // Vérifier que l'adresse signée correspond à l'utilisateur
        const recoveredAddress = ethers.verifyMessage(
          parsedInput.message,
          parsedInput.signature
        );
        if (
          recoveredAddress.toLowerCase() !== user.walletAddress.toLowerCase()
        ) {
          throw new Error('Signature invalide');
        }

        // Vérifier le solde de l'utilisateur
        const tokenContract = new ethers.Contract(
          parsedInput.tokenAddress,
          erc20Abi,
          provider
        );
        const balance = await tokenContract.balanceOf(user.walletAddress);
        const amountToStake = ethers.parseUnits(parsedInput.amount, 18);

        if (balance < amountToStake) {
          throw new Error('Solde insuffisant pour staker ce montant');
        }

        // Vérifier que le token est autorisé dans le contrat de staking
        const stakingContract = new ethers.Contract(
          contractAddress,
          stakingContractAbi,
          provider
        );
        const allowedTokens =
          await stakingContract.getAllowedTokensWithTotalStaked();
        const isTokenAllowed = allowedTokens[0].includes(
          parsedInput.tokenAddress
        );

        if (!isTokenAllowed) {
          throw new Error('Token non autorisé pour le staking');
        }

        // Si pas de clé privée, simuler la transaction (mode test)
        if (!privateKey) {
          console.log(
            '⚠️  MODE TEST: Aucune vraie transaction blockchain - pas de frais de gas'
          );
          console.log(
            "Pour une vraie transaction avec frais, définissez PRIVATE_KEY dans vos variables d'environnement"
          );

          // Simuler un délai de transaction
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Générer un hash de transaction factice pour les tests
          const fakeHash = `0x${Math.random().toString(16).slice(2, 66)}`;
          const fakeApproveHash = `0x${Math.random().toString(16).slice(2, 66)}`;

          return {
            success: true,
            message: `Staking simulé (MODE TEST) - Pas de vraie transaction blockchain`,
            transactionHash: fakeHash,
            blockNumber: Math.floor(Math.random() * 1000000),
            amount: parsedInput.amount,
            tokenAddress: parsedInput.tokenAddress,
            approveHash: fakeApproveHash,
            isTestMode: true,
            gasUsed: '0',
            gasPrice: '0',
            totalGasCost: '0 CHZ'
          };
        }

        // MODE PRODUCTION: Vraie transaction avec frais de gas
        console.log(
          '🚀 MODE PRODUCTION: Transaction blockchain avec frais de gas'
        );

        // Créer le wallet avec la clé privée
        const wallet = new ethers.Wallet(privateKey, provider);

        // Récupérer le prix du gas
        const gasPrice = await provider.getFeeData();
        console.log(
          'Prix du gas:',
          ethers.formatUnits(gasPrice.gasPrice || 0, 'gwei'),
          'gwei'
        );

        // Créer les instances de contrats avec le wallet
        const tokenContractWithWallet = new ethers.Contract(
          parsedInput.tokenAddress,
          erc20Abi,
          wallet
        );
        const stakingContractWithWallet = new ethers.Contract(
          contractAddress,
          stakingContractAbi,
          wallet
        );

        // Approuver le contrat de staking pour dépenser les tokens
        console.log('📝 Transaction 1/2: Approbation des tokens...');
        const approveTx = await tokenContractWithWallet.approve(
          contractAddress,
          amountToStake
        );
        const approveReceipt = await approveTx.wait();
        const approveGasUsed = approveReceipt.gasUsed;
        const approveGasCost = approveGasUsed * (gasPrice.gasPrice || 0n);

        console.log('✅ Approbation confirmée');
        console.log('   Hash:', approveReceipt.hash);
        console.log('   Gas utilisé:', approveGasUsed.toString());
        console.log('   Coût gas:', ethers.formatEther(approveGasCost), 'CHZ');

        // Staker les tokens
        console.log('📝 Transaction 2/2: Staking des tokens...');
        const stakeTx = await stakingContractWithWallet.stake(
          parsedInput.tokenAddress,
          amountToStake
        );
        const receipt = await stakeTx.wait();
        const stakeGasUsed = receipt.gasUsed;
        const stakeGasCost = stakeGasUsed * (gasPrice.gasPrice || 0n);

        console.log('✅ Staking confirmé');
        console.log('   Hash:', receipt.hash);
        console.log('   Gas utilisé:', stakeGasUsed.toString());
        console.log('   Coût gas:', ethers.formatEther(stakeGasCost), 'CHZ');

        // Vérifier que les transactions sont confirmées
        if (!receipt.hash) {
          throw new Error('Transaction non confirmée');
        }

        const totalGasUsed = approveGasUsed + stakeGasUsed;
        const totalGasCost = approveGasCost + stakeGasCost;

        return {
          success: true,
          message: `Staking confirmé - Frais: ${ethers.formatEther(totalGasCost)} CHZ`,
          transactionHash: receipt.hash,
          blockNumber: receipt.blockNumber,
          amount: parsedInput.amount,
          tokenAddress: parsedInput.tokenAddress,
          approveHash: approveReceipt.hash,
          isTestMode: false,
          gasUsed: totalGasUsed.toString(),
          gasPrice: ethers.formatUnits(gasPrice.gasPrice || 0, 'gwei'),
          totalGasCost: `${ethers.formatEther(totalGasCost)} CHZ`,
          approveGasUsed: approveGasUsed.toString(),
          stakeGasUsed: stakeGasUsed.toString()
        };
      } catch (error) {
        console.error('Erreur lors du staking:', error);
        throw new Error(
          `Impossible de staker les tokens: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
        );
      }
    }
  );
