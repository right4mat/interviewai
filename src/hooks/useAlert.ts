import { useState } from 'react';

interface AlertInfo {
  show: boolean;
  message: string;
  severity: "success" | "error" | "warning" | "info";
}

interface UseAlertReturn {
  alertInfo: AlertInfo;
  showAlert: (message: string, severity: AlertInfo["severity"]) => void;
  hideAlert: () => void;
}

export const useAlert = (): UseAlertReturn => {
  const [alertInfo, setAlertInfo] = useState<AlertInfo>({
    show: false,
    message: "",
    severity: "success"
  });

  const showAlert = (message: string, severity: AlertInfo["severity"]) => {
    setAlertInfo({
      show: true,
      message,
      severity,
    });
  };

  const hideAlert = () => {
    setAlertInfo(prev => ({ ...prev, show: false }));
  };

  return {
    alertInfo,
    showAlert,
    hideAlert,
  };
}; 