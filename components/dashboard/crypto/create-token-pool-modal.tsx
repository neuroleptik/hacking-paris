'use client';

import NiceModal, { type NiceModalHocProps } from '@ebay/nice-modal-react';
import { type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';

import { createTokenPool } from '@/actions/crypto/create-token-pool';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormProvider
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { MediaQueries } from '@/constants/media-queries';
import { useEnhancedModal } from '@/hooks/use-enhanced-modal';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useZodForm } from '@/hooks/use-zod-form';
import {
  createTokenPoolSchema,
  type CreateTokenPoolSchema
} from '@/schemas/crypto/create-token-pool-schema';

const availableTokens = [
  { symbol: 'ACM', name: 'AC Milan Fan Token' },
  { symbol: 'JUV', name: 'Juventus Fan Token' },
  { symbol: 'PSG', name: 'Paris Saint-Germain Fan Token' },
  { symbol: 'CHZ', name: 'Chiliz' }
];

export type CreateTokenPoolModalProps = NiceModalHocProps;

export const CreateTokenPoolModal = NiceModal.create<CreateTokenPoolModalProps>(
  () => {
    const modal = useEnhancedModal();
    const mdUp = useMediaQuery(MediaQueries.MdUp, { ssr: false });
    const methods = useZodForm({
      schema: createTokenPoolSchema,
      mode: 'onSubmit',
      defaultValues: {
        symbol: '',
        amount: 0
      }
    });

    const title = 'Create Token Pool';
    const description =
      'Select a token and specify the amount to create a new pool.';

    const canSubmit =
      !methods.formState.isSubmitting &&
      (!methods.formState.isSubmitted || methods.formState.isDirty);

    const onSubmit: SubmitHandler<CreateTokenPoolSchema> = async (values) => {
      if (!canSubmit) {
        return;
      }
      // const result = await createTokenPool(values);
      // if (!result?.serverError && !result?.validationErrors) {
      //   toast.success('Token pool created successfully');
      //   modal.handleClose();
      // } else {
      //   toast.error("Couldn't create token pool");
      // }
    };

    const renderForm = (
      <div className="space-y-4 py-4">
        <FormField
          control={methods.control}
          name="symbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a token" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableTokens.map((token) => (
                    <SelectItem
                      key={token.symbol}
                      value={token.symbol}
                    >
                      {token.name} ({token.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={methods.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.000001"
                  min="0.000001"
                  max="1000000"
                  placeholder="Enter amount"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );

    const renderButtons = (
      <>
        <Button
          type="button"
          variant="outline"
          onClick={modal.handleClose}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="default"
          disabled={!canSubmit}
          loading={methods.formState.isSubmitting}
          onClick={methods.handleSubmit(onSubmit)}
        >
          Create Pool
        </Button>
      </>
    );

    return (
      <FormProvider {...methods}>
        {mdUp ? (
          <Dialog open={modal.visible}>
            <DialogContent
              className="max-w-sm"
              onClose={modal.handleClose}
              onAnimationEndCapture={modal.handleAnimationEndCapture}
            >
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
              </DialogHeader>
              {renderForm}
              <DialogFooter>{renderButtons}</DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer
            open={modal.visible}
            onOpenChange={modal.handleOpenChange}
          >
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle>{title}</DrawerTitle>
                <DrawerDescription>{description}</DrawerDescription>
              </DrawerHeader>
              {renderForm}
              <DrawerFooter className="flex-col-reverse pt-4">
                {renderButtons}
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </FormProvider>
    );
  }
);
