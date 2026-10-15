'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DrinkTypePicker } from './drink-type-picker';
import { AmountInput } from './amount-input';
import { useHydroStore } from '@/lib/store/hydro-store';
import type { DrinkType } from '@/types';

const schema = z.object({
  drinkType: z.enum(['water', 'coffee', 'soda', 'alcohol', 'other']),
  amount: z.number().min(1, 'Amount must be at least 1ml').max(5000, 'Amount cannot exceed 5000ml'),
});

type FormData = z.infer<typeof schema>;

interface AddDrinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDrinkModal({ open, onOpenChange }: AddDrinkModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addLog = useHydroStore((state) => state.addLog);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      drinkType: undefined,
      amount: undefined,
    },
  });

  const drinkType = form.watch('drinkType');
  const amount = form.watch('amount');

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await addLog(data.drinkType, data.amount);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to add log:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = drinkType && amount && amount > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Drink</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <DrinkTypePicker
            value={drinkType}
            onChange={(type) => form.setValue('drinkType', type)}
          />

          <AmountInput
            value={amount ?? ''}
            onChange={(val) => form.setValue('amount', val === '' ? undefined as any : val)}
          />

          {form.formState.errors.amount && (
            <p className="text-sm text-destructive">
              {form.formState.errors.amount.message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
