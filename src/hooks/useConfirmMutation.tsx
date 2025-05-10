// src/hooks/useConfirmMutation.ts
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useState } from "react";
import CustomizedConfirmDialog from "@/components/shared/CustomizedConfirmDialog";

interface ConfirmDialogConfig {
  title?: string;
  content?: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
}

export function useConfirmMutation<TData = unknown, TVariables = unknown, TContext = unknown>(
  options: UseMutationOptions<TData, Error, TVariables, TContext> & {
    confirmConfig?: ConfirmDialogConfig;
  }
) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingVariables, setPendingVariables] = useState<TVariables | null>(null);
  const [pendingOptions, setPendingOptions] = useState<Parameters<typeof mutation.mutate>[1] | null>(null);
 
  const { confirmConfig, ...mutationOptions } = options;

  const mutation = useMutation<TData, Error, TVariables, TContext>(mutationOptions);

  const mutate = async (variables: TVariables, options?: Parameters<typeof mutation.mutate>[1]) => {
    if (confirmConfig) {
      setPendingVariables(variables);
      setPendingOptions(options);
      setIsConfirmOpen(true);
    } else {
      mutation.mutate(variables);
    }
  };

  const mutateAsync = async (variables: TVariables, options?: Parameters<typeof mutation.mutateAsync>[1]) => {
    if (confirmConfig) {
      setPendingVariables(variables);
      setPendingOptions(options);
      setIsConfirmOpen(true);
    } else {
      await mutation.mutateAsync(variables);
    }
  };

  const handleConfirm = async () => {
    if (pendingVariables) {
      try {
        await mutation.mutateAsync(pendingVariables, pendingOptions || undefined);
      } catch (error) {
        console.error("Error saving reports:", error);
      }
    }
    setIsConfirmOpen(false);
    setPendingVariables(null);
    setPendingOptions(null);
  };

  const handleCancel = () => {
    setIsConfirmOpen(false);
    setPendingVariables(null);
  };

  const ConfirmDialog = confirmConfig ? (
    <CustomizedConfirmDialog open={isConfirmOpen} onClose={handleCancel} onConfirm={handleConfirm} {...confirmConfig} isLoading={mutation.isPending} disableBackdropClick />
  ) : null;

  return {
    ...mutation,
    mutateAsync,
    mutate,
    ConfirmDialog
  };
}
