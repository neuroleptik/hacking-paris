import { redirect } from 'next/navigation';
import { ethers } from 'ethers';

import { Routes } from '@/constants/routes';
import { prisma } from '@/lib/db/prisma';

const nonces = new Map<string, string>();

export async function updateUserData(
  username: string,
  email: string
): Promise<string> {
  if (!username || !email) throw new Error('Missing username or email');
  const user = await prisma.user.update({
    where: {
      walletAddress: username
    },
    data: {
      email: email,
      name: username
    }
  });
  return user.id;
}
