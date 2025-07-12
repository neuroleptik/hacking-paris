import { z } from 'zod';

export const createTokenPoolSchema = z.object({
  symbol: z
    .string({
      required_error: 'Token symbol is required.',
      invalid_type_error: 'Token symbol must be a string.'
    })
    .trim()
    .min(1, 'Token symbol is required.')
    .max(10, 'Maximum 10 characters allowed.'),
  amount: z
    .number({
      required_error: 'Amount is required.',
      invalid_type_error: 'Amount must be a number.'
    })
    .min(0.000001, 'Minimum amount is 0.000001')
    .max(1000000, 'Maximum amount is 1,000,000')
});

export type CreateTokenPoolSchema = z.infer<typeof createTokenPoolSchema>; 