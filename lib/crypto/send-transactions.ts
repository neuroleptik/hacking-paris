import { ethers } from 'ethers';

interface TransactionData {
  to: string;
  data: string;
  gasLimit: string;
  estimatedCost: string;
}

interface StakeResult {
  success: boolean;
  message: string;
  transactionHash?: string;
  approveHash?: string;
  error?: string;
}

export async function sendStakeTransactions(
  approveTx: TransactionData,
  stakeTx: TransactionData,
  userWalletAddress: string
): Promise<StakeResult> {
  try {
    // Vérifier que MetaMask est disponible
    if (!window.ethereum) {
      throw new Error('MetaMask n\'est pas installé');
    }

    // Demander la connexion au wallet
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const userAccount = accounts[0];

    if (userAccount.toLowerCase() !== userWalletAddress.toLowerCase()) {
      throw new Error('Le wallet connecté ne correspond pas à votre wallet enregistré');
    }

    // Créer le provider et signer
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    console.log('🚀 Envoi des vraies transactions blockchain...');

    // Transaction 1: Approbation
    console.log('📝 Transaction 1/2: Approbation...');
    const approveTransaction = {
      to: approveTx.to,
      data: approveTx.data,
      gasLimit: BigInt(approveTx.gasLimit)
    };

    const approveTxResponse = await signer.sendTransaction(approveTransaction);
    console.log('⏳ Attente confirmation approbation...');
    const approveReceipt = await approveTxResponse.wait();

    if (!approveReceipt) {
      throw new Error('Transaction d\'approbation non confirmée');
    }

    console.log('✅ Approbation confirmée');
    console.log('   Hash:', approveReceipt.hash);
    console.log('   Gas utilisé:', approveReceipt.gasUsed.toString());

    // Transaction 2: Staking
    console.log('📝 Transaction 2/2: Staking...');
    const stakeTransaction = {
      to: stakeTx.to,
      data: stakeTx.data,
      gasLimit: BigInt(stakeTx.gasLimit)
    };

    const stakeTxResponse = await signer.sendTransaction(stakeTransaction);
    console.log('⏳ Attente confirmation staking...');
    const stakeReceipt = await stakeTxResponse.wait();

    if (!stakeReceipt) {
      throw new Error('Transaction de staking non confirmée');
    }

    console.log('✅ Staking confirmé');
    console.log('   Hash:', stakeReceipt.hash);
    console.log('   Gas utilisé:', stakeReceipt.gasUsed.toString());

    return {
      success: true,
      message: 'Staking confirmé - Transactions blockchain envoyées avec succès',
      transactionHash: stakeReceipt.hash,
      approveHash: approveReceipt.hash
    };

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi des transactions:', error);
    return {
      success: false,
      message: 'Erreur lors de l\'envoi des transactions',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}
