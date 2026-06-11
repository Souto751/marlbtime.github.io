import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, type ButtonProps } from '@mui/material';
import { useAppNavigate } from '../hooks/useAppNavigate';

interface BackButtonProps extends Omit<ButtonProps, 'onClick'> {
  fallback?: string;
  label?: string;
}

export default function BackButton({
  fallback = '/',
  label = 'Volver',
  variant = 'text',
  size = 'small',
  sx,
  ...props
}: BackButtonProps) {
  const { goBack } = useAppNavigate();

  return (
    <Button
      variant={variant}
      size={size}
      startIcon={<ArrowBackIcon />}
      onClick={() => goBack(fallback)}
      sx={{ alignSelf: 'flex-start', mb: 1, ...sx }}
      {...props}
    >
      {label}
    </Button>
  );
}
