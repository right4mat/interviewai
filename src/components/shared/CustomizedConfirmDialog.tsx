"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  type SxProps,
  type Theme,
  CircularProgress
} from "@mui/material";

interface CustomizedConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  content?: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  cancelColor?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  confirmVariant?: "text" | "outlined" | "contained";
  cancelVariant?: "text" | "outlined" | "contained";
  confirmSx?: SxProps<Theme>;
  cancelSx?: SxProps<Theme>;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
  isLoading?: boolean;
}

export default function CustomizedConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Confirm Action",
  content = "Are you sure you want to proceed?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmColor = "primary",
  cancelColor = "primary",
  confirmVariant = "contained",
  cancelVariant = "outlined",
  confirmSx,
  cancelSx,
  maxWidth = "sm",
  fullWidth = true,
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  isLoading = false
}: CustomizedConfirmDialogProps) {
  const handleClose = (event: object, reason: string) => {
    if (disableBackdropClick && reason === "backdropClick") {
      return;
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      disableEscapeKeyDown={disableEscapeKeyDown}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {typeof content === "string" ? (
          <DialogContentText>{content}</DialogContentText>
        ) : (
          content
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color={cancelColor}
          variant={cancelVariant}
          sx={cancelSx}
          disabled={isLoading}
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant={confirmVariant}
          autoFocus
          sx={confirmSx}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 