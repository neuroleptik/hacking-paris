'use client';

import * as React from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { TrashIcon } from 'lucide-react';
import { Form, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { CropPhotoModal } from '@/components/dashboard/settings/account/profile/crop-photo-modal';
import { NextButton } from '@/components/onboarding/next-button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { ImageDropzone } from '@/components/ui/image-dropzone';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { MAX_IMAGE_SIZE } from '@/constants/limits';
import { cn, getInitials } from '@/lib/utils';
import { type CompleteUserOnboardingSchema } from '@/schemas/onboarding/complete-user-onboarding-schema';
import { FileUploadAction } from '@/types/file-upload-action';

export type CompleteProfileStepProps = Omit<
  React.HtmlHTMLAttributes<HTMLDivElement>,
  'onSubmit'
> & {
  onFormSubmit: (data: CompleteUserOnboardingSchema) => void;
};

export function CompleteProfileStep({
  onFormSubmit,
  className,
  ...other
}: CompleteProfileStepProps): React.JSX.Element {
  const form = useForm<CompleteUserOnboardingSchema>({
    defaultValues: {
      name: '',
      email: '',
      image: undefined,
      action: FileUploadAction.None
    }
  });

  const image = form.watch('image');
  const name = form.watch('name');

  const handleDrop = async (files: File[]): Promise<void> => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error("Uploaded image shouldn't exceed 5mb size limit");
      } else {
        const base64Image: string = await NiceModal.show(CropPhotoModal, {
          file,
          aspectRatio: 1,
          circularCrop: true
        });

        if (base64Image) {
          form.setValue('action', FileUploadAction.Update);
          form.setValue('image', base64Image, {
            shouldValidate: true,
            shouldDirty: true
          });
        }
      }
    }
  };

  const handleRemoveImage = (): void => {
    form.setValue('action', FileUploadAction.Delete);
    form.setValue('image', undefined, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  const handleFormSubmit = (data: CompleteUserOnboardingSchema): void => {
    onFormSubmit(data);
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-4"
      >
        <div
          className={cn('flex flex-col gap-4', className)}
          {...other}
        >
          <div className="mt-4 flex items-center justify-center pb-6">
            <div className="relative">
              <ImageDropzone
                accept={{ 'image/*': [] }}
                multiple={false}
                borderRadius="full"
                onDrop={handleDrop}
                src={image}
                className="max-h-[120px] min-h-[120px] w-[120px] p-0.5"
              >
                <Avatar className="size-28">
                  <AvatarFallback className="size-28 text-2xl">
                    {name && getInitials(name)}
                  </AvatarFallback>
                </Avatar>
              </ImageDropzone>
              {image && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute -bottom-1 -right-1 z-10 size-8 rounded-full bg-background !opacity-100"
                      onClick={handleRemoveImage}
                    >
                      <TrashIcon className="size-4 shrink-0" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Remove image</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
          <div className="grid gap-x-8 gap-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      maxLength={64}
                      autoComplete="name"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    maxLength={255}
                    autoComplete="email"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <NextButton
            loading={form.formState.isSubmitting}
            disabled={!form.formState.isValid}
            isLastStep={true}
          />
        </div>
      </form>
    </FormProvider>
  );
}
