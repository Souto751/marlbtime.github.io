import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, type ButtonProps } from '@mui/material';
import { useAppNavigate } from '../hooks/useAppNavigate';
import { useTenantPath } from '../hooks/useTenantPath';

interface BackButtonProps extends Omit<ButtonProps, 'onClick'> {
  fallback?: string;
  label?: string;
}

export default function BackButton({
  fallback,
  label = 'Volver',
  variant = 'text',
  size = 'small',
  sx,
  ...props
}: BackButtonProps) {
  const { goBack } = useAppNavigate();
  const { home } = useTenantPath();
  const resolvedFallback = fallback ?? home;

  return (
    <Button
      variant={variant}
      size={size}
      startIcon={<ArrowBackIcon />}
      onClick={() => goBack(resolvedFallback)}
      sx={{ alignSelf: 'flex-start', mb: 1, ...sx }}
      {...props}
    >
      {label}
    </Button>
  );
}
