import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';
import type { AlertColor } from '@mui/material';

/**
 * Configuración de una notificación Snackbar
 */
interface SnackbarMessage {
  message: string;
  severity: AlertColor;
  duration?: number;
}

/**
 * Contexto para manejar notificaciones Snackbar
 */
interface SnackbarContextType {
  showSnackbar: (message: string, severity?: AlertColor, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

/**
 * Hook personalizado para usar el contexto de Snackbar
 */
export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar debe usarse dentro de un SnackbarProvider');
  }
  return context;
};

/**
 * Provider del contexto de Snackbar
 */
export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [snackbar, setSnackbar] = useState<SnackbarMessage | null>(null);

  const showSnackbar = (
    message: string, 
    severity: AlertColor = 'info', 
    duration: number = 4000
  ) => {
    setSnackbar({ message, severity, duration });
  };

  const success = (message: string, duration?: number) => 
    showSnackbar(message, 'success', duration);

  const error = (message: string, duration?: number) => 
    showSnackbar(message, 'error', duration);

  const warning = (message: string, duration?: number) => 
    showSnackbar(message, 'warning', duration);

  const info = (message: string, duration?: number) => 
    showSnackbar(message, 'info', duration);

  const handleClose = () => {
    setSnackbar(null);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, success, error, warning, info }}>
      {children}
      <Snackbar
        open={!!snackbar}
        autoHideDuration={snackbar?.duration || 4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleClose} 
          severity={snackbar?.severity || 'info'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
