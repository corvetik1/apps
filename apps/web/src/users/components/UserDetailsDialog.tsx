/**
 * Компонент диалогового окна с детальной информацией о пользователе
 *
 * Этот компонент отображает детальную информацию о выбранном пользователе.
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Divider,
  Box,
  Chip,
} from '@mui/material';
import { User, Role } from '@finance-platform/shared';

/**
 * Пропсы компонента UserDetailsDialog
 */
export interface UserDetailsDialogProps {
  /** Пользователь для отображения */
  user: User | null;
  /** Флаг открытия диалога */
  open: boolean;
  /** Обработчик закрытия диалога */
  onClose: () => void;
  /** Обработчик редактирования пользователя */
  onEdit?: () => void;
}

/**
 * Компонент диалогового окна с детальной информацией о пользователе
 */
export const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({
  user,
  open,
  onClose,
  onEdit,
}) => {
  if (!user) return null;

  // Форматирование дат
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Форматирование роли
  const formatRole = (role: string) => {
    const roleMap: Record<string, string> = {
      [Role.Admin]: 'Администратор',
      [Role.Manager]: 'Менеджер',
      [Role.User]: 'Пользователь',
      [Role.Guest]: 'Гость',
      [Role.Accountant]: 'Бухгалтер',
    };
    return roleMap[role] || role;
  };

  // Цвет для роли
  const getRoleColor = (role: string) => {
    const colorMap: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'error'> = {
      [Role.Admin]: 'error',
      [Role.Manager]: 'warning',
      [Role.User]: 'primary',
      [Role.Guest]: 'secondary',
      [Role.Accountant]: 'success',
    };
    return colorMap[role] || 'default';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="user-details-dialog-title"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="user-details-dialog-title">
        Информация о пользователе
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid component="div" item xs={12}>
            <Typography variant="h6" component="div">
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Grid>

          <Grid component="div" item xs={12}>
            <Divider />
          </Grid>

          <Grid component="div" item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Роль
            </Typography>
            <Typography variant="body2">
              <Chip
                label={user.role}
                size="small"
                color={getRoleColor(user.role)}
                sx={{ fontWeight: 'medium' }}
              />
            </Typography>
          </Grid>

          <Grid component="div" item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Идентификатор
            </Typography>
            <Typography variant="body2">{user.id}</Typography>
          </Grid>

          <Grid component="div" item xs={12}>
            <Divider />
          </Grid>

          <Grid component="div" item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Дата создания
            </Typography>
            <Typography variant="body2">{formatDate(user.createdAt)}</Typography>
          </Grid>

          <Grid component="div" item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Последнее обновление
            </Typography>
            <Typography variant="body2">{formatDate(user.updatedAt)}</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {onEdit && (
          <Button onClick={onEdit} color="primary">
            Редактировать
          </Button>
        )}
        <Button onClick={onClose} color="inherit">
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};
