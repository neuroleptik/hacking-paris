'use server';

import { ethers } from 'ethers';
import { prisma } from '@/lib/db/prisma';
import { Routes } from '@/constants/routes';
import { IdentityProvider } from '@/types/identity-provider';
import { signIn } from '@/lib/auth';

const nonces = new Map<string, string>();

export async function getNonce(address: string): Promise<string> {
  if (!address) throw new Error('Missing address');
  const nonce = crypto.randomUUID();
  nonces.set(address.toLowerCase(), nonce);
  return nonce;
}

export async function verifySignature({
  address,
  signature,
}: {
  address: string;
  signature: string;
}): Promise<{ success: boolean; error?: string; shouldRedirect?: boolean; step?: number }> {
  const nonce = nonces.get(address.toLowerCase());
  if (!nonce) {
    return { success: false, error: 'Nonce not found or expired' };
  }

  try {
    const signer = ethers.verifyMessage(nonce, signature);
    if (signer.toLowerCase() !== address.toLowerCase()) {
      return { success: false, error: 'Invalid signature' };
    }

    console.log("Adress verified successfully");

    nonces.delete(address.toLowerCase());

    // verify if user already exists
    const user = await prisma.user.findUnique({
      where: {
        walletAddress: address.toLowerCase()
      }
    });

    if (user) {
      if(user.email && user.emailVerified){
         await signIn(IdentityProvider.Wallet, {
        walletAddress: address,
      });
      console.log("User already exists");
        // redirect to dashboard
        // redirect(Routes.Dashboard);
        return { success: true, shouldRedirect: true };
      }
      else{
        if(user.email && !user.emailVerified){
           await signIn(IdentityProvider.Wallet, {
        walletAddress: address,
      });
      console.log("User already exists 2");
          // redirect to email verification
          return { success: true, step: 2 };
        }
        else{
          if(!user.email && !user.emailVerified){// redirect to profile completion
             await signIn(IdentityProvider.Wallet, {
        walletAddress: address,
      });
      console.log("User already exists 3");
            return { success: true, step: 1 };
          }
        }
      }
    }
    else{
      //create user 
      // create the organization
      const organization = await prisma.organization.create({
        data: {
          name: "Default Organization",
          stripeCustomerId: "cus_1234567890",
          completedOnboarding: true,
          
        }
      });
      await prisma.user.create({
        data: {
          walletAddress: address.toLowerCase(),
          organizationId: organization.id,
          name: "Default User",
          email: "default@example.com",
        }
      });
      
      // connect user to session
      console.log("Creating user and connecting to session");
      console.log(address);

      await signIn(IdentityProvider.Wallet, {
        walletAddress: address,
      });
      return { success: true, shouldRedirect: true };
    }

  } catch (error) {
    console.log(error);
    console.log("Verification failed");
    return { success: false, error: 'Verification failed' };
  }
}

