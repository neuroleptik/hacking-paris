import { z } from 'zod';

import { FileUploadAction } from '@/types/file-upload-action';

export const completeUserOnboardingSchema = z.object({
  action: z.nativeEnum(FileUploadAction, {
    required_error: 'Action is required',
    invalid_type_error: 'Action must be a string'
  }),
  image: z
    .string({
      invalid_type_error: 'Image must be a string.'
    })
    .optional()
    .or(z.literal('')),
  name: z
    .string({
      required_error: 'Name is required.',
      invalid_type_error: 'Name must be a string.'
    })
    .trim()
    .min(1, 'Name is required.')
    .max(64, 'Maximum 64 characters allowed.'),
  email: z
    .string({
      invalid_type_error: 'Email must be a string.'
    })
    .trim()
    .email('Invalid email address.')
    .max(255, 'Maximum 255 characters allowed.')
    .optional()
    .or(z.literal('')),
  theme: z.literal('light').or(z.literal('dark').or(z.literal('system')))
});

export type CompleteUserOnboardingSchema = z.infer<
  typeof completeUserOnboardingSchema
>;
