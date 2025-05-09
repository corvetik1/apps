/**
 * Компонент диалогового окна формы пользователя
 *
 * Этот компонент отображает форму для создания или редактирования пользователя.
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  CircularProgress,
  SelectChangeEvent,
  IconButton,
  Typography,
  Divider,
  Tooltip,
  useTheme,
  Avatar,
  Chip,
} from '@mui/material';

// SVG иконки
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
  </svg>
);
import { User, Role, CreateUserDto, UpdateUserDto } from '@finance-platform/shared';

/**
 * Интерфейс для ошибок формы
 */
interface FormErrors {
  name?: string;
  email?: string;
  role?: string;
  password?: string;
}

/**
 * Пропсы компонента UserFormDialog
 */
export interface UserFormDialogProps {
  /** Флаг открытия диалога */
  open: boolean;
  /** Пользователь для редактирования (null для создания нового) */
  user: User | null;
  /** Флаг процесса сохранения */
  isSaving: boolean;
  /** Ошибки API при сохранении */
  apiErrors?: Record<string, string[]>;
  /** Обработчик закрытия диалога */
  onClose: () => void;
  /** Обработчик сохранения пользователя */
  onSave: (userData: CreateUserDto | UpdateUserDto) => void;
}

/**
 * Компонент диалогового окна формы пользователя
 */
export const UserFormDialog: React.FC<UserFormDialogProps> = ({
  open,
  user,
  isSaving,
  apiErrors,
  onClose,
  onSave,
}) => {
  // Режим формы (создание или редактирование)
  const isEditMode = Boolean(user);

  // Состояние формы
  const [formData, setFormData] = useState<CreateUserDto | UpdateUserDto>({
    name: '',
    email: '',
    role: Role.User,
    password: '',
  });

  // Состояние ошибок формы
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Обновляем состояние формы при изменении пользователя
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '', // Пароль не заполняем при редактировании
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: Role.User,
        password: '',
      });
    }
    setFormErrors({});
  }, [user, open]);

  // Обработчики изменения полей формы
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, name: event.target.value }));
    setFormErrors((prev) => ({ ...prev, name: undefined }));
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, email: event.target.value }));
    setFormErrors((prev) => ({ ...prev, email: undefined }));
  };

  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    setFormData((prev) => ({ ...prev, role: event.target.value }));
    setFormErrors((prev) => ({ ...prev, role: undefined }));
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, password: event.target.value }));
    setFormErrors((prev) => ({ ...prev, password: undefined }));
  };

  // Валидация формы
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!formData.name) {
      errors.name = 'Имя обязательно';
      isValid = false;
    }

    if (!formData.email) {
      errors.email = 'Email обязателен';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Некорректный формат email';
      isValid = false;
    }

    if (!formData.role) {
      errors.role = 'Роль обязательна';
      isValid = false;
    }

    if (!isEditMode && !formData.password) {
      errors.password = 'Пароль обязателен';
      isValid = false;
    } else if (!isEditMode && formData.password && formData.password.length < 6) {
      errors.password = 'Пароль должен содержать минимум 6 символов';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Обработчик отправки формы
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  // Получаем тему для доступа к цветам
  const theme = useTheme();
  
  // Генерируем аватар на основе имени пользователя
  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0] || '')
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Генерируем цвет аватара на основе роли
  const getRoleColor = (role: string | undefined) => {
    if (!role) return theme.palette.grey[500];
    
    switch (role) {
      case Role.Admin:
        return theme.palette.error.main;
      case Role.Manager:
        return theme.palette.info.main;
      case Role.Accountant:
        return theme.palette.success.main;
      case Role.User:
        return theme.palette.primary.main;
      default:
        return theme.palette.grey[500];
    }
  };
  
  return (
    <Dialog
      open={open}
      onClose={isSaving ? undefined : onClose}
      aria-labelledby="user-form-dialog-title"
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3,
        },
      }}
    >
      <DialogTitle 
        id="user-form-dialog-title"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
          backgroundColor: 'primary.light',
          color: 'primary.contrastText',
        }}
      >
        <Typography variant="h6" component="div">
          {isEditMode ? 'Редактирование пользователя' : 'Создание пользователя'}
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          disabled={isSaving}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          {isEditMode && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  bgcolor: getRoleColor(formData.role),
                  width: 56,
                  height: 56,
                  mr: 2,
                }}
              >
                {getInitials(formData.name)}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {formData.name}
                </Typography>
                <Chip 
                  label={formData.role} 
                  size="small" 
                  sx={{ 
                    bgcolor: getRoleColor(formData.role),
                    color: 'white',
                    mt: 0.5,
                  }} 
                />
              </Box>
            </Box>
          )}
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <TextField
                id="name"
                label="Имя"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.name}
                onChange={handleNameChange}
                error={Boolean(formErrors.name || (apiErrors && apiErrors.name))}
                helperText={
                  formErrors.name || (apiErrors && apiErrors.name ? apiErrors.name.join(', ') : '')
                }
                disabled={isSaving}
                required
                size="small"
              />
            </Box>

            <Box>
              <TextField
                id="email"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={formData.email}
                onChange={handleEmailChange}
                error={Boolean(formErrors.email || (apiErrors && apiErrors.email))}
                helperText={
                  formErrors.email || (apiErrors && apiErrors.email ? apiErrors.email.join(', ') : '')
                }
                disabled={isSaving}
                required
                size="small"
              />
            </Box>

            <Box sx={{ gridColumn: { xs: '1', sm: '1 / span 2' } }}>
              <FormControl
                fullWidth
                variant="outlined"
                error={Boolean(formErrors.role || (apiErrors && apiErrors.role))}
                disabled={isSaving}
                size="small"
              >
                <InputLabel id="role-label">Роль</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  value={formData.role}
                  onChange={handleRoleChange}
                  label="Роль"
                  required
                >
                  <MenuItem value={Role.Admin}>Администратор</MenuItem>
                  <MenuItem value={Role.Manager}>Менеджер</MenuItem>
                  <MenuItem value={Role.User}>Пользователь</MenuItem>
                  <MenuItem value={Role.Guest}>Гость</MenuItem>
                  <MenuItem value={Role.Accountant}>Бухгалтер</MenuItem>
                </Select>
                {(formErrors.role || (apiErrors && apiErrors.role)) && (
                  <FormHelperText>
                    {formErrors.role || (apiErrors && apiErrors.role ? apiErrors.role.join(', ') : '')}
                  </FormHelperText>
                )}
              </FormControl>
            </Box>

            <Box sx={{ gridColumn: { xs: '1', sm: '1 / span 2' } }}>
              <TextField
                id="password"
                label={isEditMode ? 'Новый пароль (оставьте пустым, чтобы не менять)' : 'Пароль'}
                type="password"
                fullWidth
                variant="outlined"
                value={formData.password}
                onChange={handlePasswordChange}
                error={Boolean(formErrors.password || (apiErrors && apiErrors.password))}
                helperText={
                  formErrors.password ||
                  (apiErrors && apiErrors.password ? apiErrors.password.join(', ') : '')
                }
                disabled={isSaving}
                required={!isEditMode}
                size="small"
              />
            </Box>

          </Box>

          {/* Общие ошибки API */}
          {apiErrors && apiErrors.message && (
            <Box sx={{ color: 'error.main', mt: 2, p: 1, bgcolor: 'error.light', borderRadius: 1 }}>
              <Typography variant="body2">{apiErrors.message}</Typography>
            </Box>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={onClose} 
            color="inherit" 
            disabled={isSaving}
            variant="outlined"
            size="small"
          >
            Отмена
          </Button>
          <Tooltip title={isSaving ? 'Сохранение...' : 'Сохранить пользователя'}>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={isSaving}
              startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
              size="small"
            >
              {isSaving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </Tooltip>
        </DialogActions>
      </form>
    </Dialog>
  );
};
