"use client";
import React from "react";
import { type CSSProperties, type ReactElement, type ReactNode } from "react";
import { toast, Slide, type ToastIcon } from "react-toastify";
import { useTheme, type Theme } from "@mui/material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import "react-toastify/dist/ReactToastify.css";

export type CustomToastTypes = "error" | "success" | "warning" | "info" | "brand";

interface UseCustomToastRes {
  addToast: (newToast: ReactElement | string, toastType: CustomToastTypes) => void;
}

const useToast: () => UseCustomToastRes = () => {
  const theme = useTheme();

  const toastStyles: Record<CustomToastTypes, { styles: CSSProperties; icon: () => ReactNode }> = {
    success: {
      styles: {
        background: theme.palette.background.paper,
        color: theme.palette.success.main,
        border: `1px solid ${theme.palette.success.main}`,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: theme.palette.success.main,
        boxShadow: "none",
        borderRadius: 5
      },
      icon: () => (
        <>
          <CheckCircleOutlinedIcon sx={{ color: theme.palette.success.main }} />
        </>
      )
    },
    error: {
      styles: {
        background: theme.palette.background.paper,
        color: theme.palette.error.main,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: theme.palette.error.main,
        boxShadow: "none",
        borderRadius: 5
      },
      icon: () => (
        <>
          <ErrorOutlineOutlinedIcon sx={{ color: theme.palette.error.main }} />
        </>
      )
    },
    warning: {
      styles: {
        background: theme.palette.background.paper,
        color: theme.palette.warning.main,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: theme.palette.warning.main,
        boxShadow: "none",
        borderRadius: 5
      },
      icon: () => (
        <>
          <WarningAmberOutlinedIcon sx={{ color: theme.palette.warning.main }} />
        </>
      )
    },
    info: {
      styles: {
        background: theme.palette.background.paper,
        color: theme.palette.info.main,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: theme.palette.info.main,
        boxShadow: "none",
        borderRadius: 5
      },
      icon: () => (
        <>
          <InfoOutlinedIcon sx={{ color: theme.palette.info.main }} />
        </>
      )
    },
    brand: {
      styles: {
        background: theme.palette.background.paper,
        color: theme.palette.primary.main,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: theme.palette.primary.main,
        boxShadow: "none",
        borderRadius: 5
      },
      icon: () => (
        <>
          <InfoOutlinedIcon sx={{ color: theme.palette.primary.main }} />
        </>
      )
    }
  };

  const toastHandler = (newToast: ReactElement | string, toastType: CustomToastTypes) => {
    toast(newToast, {
      type: toastType === "brand" ? "default" : toastType,
      style: toastStyles[toastType].styles,
      icon: toastStyles[toastType].icon as ToastIcon,
      hideProgressBar: true,
      position: "bottom-right",
      closeOnClick: true,
      transition: Slide,
    
    });
  };

  return {
    addToast: toastHandler
  };
};

export default useToast;
