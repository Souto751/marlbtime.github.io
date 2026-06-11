import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

interface UnsavedChangesPromptProps {
  when: boolean;
  title?: string;
  message?: string;
}

export default function UnsavedChangesPrompt({
  when,
  title = 'Cambios sin guardar',
  message = 'Tenés cambios que no guardaste. Si salís ahora, se perderán. ¿Querés continuar sin guardar?',
}: UnsavedChangesPromptProps) {
  const blocker = useBlocker(when);

  useEffect(() => {
    if (!when) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [when]);

  const isBlocked = blocker.state === 'blocked';

  return (
    <Dialog open={isBlocked} onClose={() => blocker.reset?.()} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={() => blocker.reset?.()} variant="contained">
          Seguir editando
        </Button>
        <Button onClick={() => blocker.proceed?.()} color="inherit">
          Salir sin guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
