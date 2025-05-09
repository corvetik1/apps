/**
 * Компонент диалога подтверждения удаления пользователя
 *
 * Этот компонент отображает диалог для подтверждения удаления пользователя.
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { User } from '@finance-platform/shared';

/**
 * Пропсы компонента DeleteConfirmation
 */
export interface DeleteConfirmationProps {
  /** Пользователь для удаления */
  user: User | null;
  /** Флаг открытия диалога */
  open: boolean;
  /** Флаг процесса удаления */
  isDeleting: boolean;
  /** Обработчик закрытия диалога */
  onClose: () => void;
  /** Обработчик подтверждения удаления */
  onConfirm: () => void;
}

/**
 * Компонент диалога подтверждения удаления пользователя
 */
export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  user,
  open,
  isDeleting,
  onClose,
  onConfirm,
}) => {
  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={isDeleting ? undefined : onClose}
      aria-labelledby="delete-user-dialog-title"
      aria-describedby="delete-user-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="delete-user-dialog-title">
        Подтверждение удаления пользователя
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-user-dialog-description">
          Вы действительно хотите удалить пользователя{' '}
          <Box component="span" fontWeight="bold">
            {user.name}
          </Box>{' '}
          с email{' '}
          <Box component="span" fontWeight="bold">
            {user.email}
          </Box>
          ?
        </DialogContentText>
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          Это действие нельзя будет отменить.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="inherit"
          disabled={isDeleting}
          autoFocus
        >
          Отмена
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isDeleting}
        >
          {isDeleting ? 'Удаление...' : 'Удалить'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
