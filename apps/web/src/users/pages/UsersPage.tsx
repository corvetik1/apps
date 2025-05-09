/**
 * Страница управления пользователями
 *
 * Эта страница отображает список пользователей с возможностью фильтрации,
 * сортировки, пагинации и выполнения действий над пользователями.
 */

import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  Paper,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
// Заменяем импорт иконок на встроенные компоненты
const AddIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
    <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
  </svg>
);
import { User, CreateUserDto, UpdateUserDto } from '@finance-platform/shared';
import { useAbility } from '../../permissions/abilities';
import { Action, Subject } from '../../permissions/types';
import { styles } from './UsersPage.styles';
import { UsersTable } from '../components/UsersTable';
import { FilterParams } from '../components/UsersTable';
import { UsersFilter } from '../components/UsersFilter';
import { UserFormDialog } from '../components/UserFormDialog';
import { UserDetailsDialog } from '../components/UserDetailsDialog';
import { DeleteConfirmation } from '../components/DeleteConfirmation';
import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '../../api/usersApi';
import { getErrorMessage } from '../../api';

/**
 * Страница управления пользователями
 */
export const UsersPage: React.FC = () => {
  // Состояние фильтров
  const [filters, setFilters] = useState<FilterParams>({});

  // Состояние для модальных окон
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Состояние для уведомлений
  const [notification, setNotification] = useState<{
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
    open: boolean;
  }>({
    message: '',
    severity: 'info',
    open: false,
  });

  // Проверка разрешений
  const ability = useAbility(null);
  // Временно отключаем проверку прав для отображения кнопки
  // const canCreate = ability.can(Action.Manage, Subject.All);
  const canCreate = true; // Всегда показываем кнопку
  
  // Определение размера экрана
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Мутации API
  const [createUser, { isLoading: isCreating, error: createError }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating, error: updateError }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Обработчики фильтрации
  const handleFilterChange = useCallback((newFilters: FilterParams) => {
    setFilters(newFilters);
  }, []);

  // Обработчики действий с пользователями
  const handleViewUser = useCallback((user: User) => {
    setSelectedUser(user);
    setIsDetailsDialogOpen(true);
  }, []);

  const handleEditUser = useCallback((user: User) => {
    setSelectedUser(user);
    setIsFormDialogOpen(true);
  }, []);

  const handleDeleteUser = useCallback((user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  }, []);

  // Обработчики модальных окон
  const handleOpenCreateDialog = useCallback(() => {
    setSelectedUser(null);
    setIsFormDialogOpen(true);
  }, []);

  const handleCloseFormDialog = useCallback(() => {
    setIsFormDialogOpen(false);
  }, []);

  const handleCloseDetailsDialog = useCallback(() => {
    setIsDetailsDialogOpen(false);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
  }, []);

  // Обработчик перехода к редактированию из диалога просмотра
  const handleEditFromDetails = useCallback(() => {
    setIsDetailsDialogOpen(false);
    setIsFormDialogOpen(true);
  }, []);

  // Обработчики сохранения и удаления
  const handleSaveUser = useCallback(
    async (userData: CreateUserDto | UpdateUserDto) => {
      try {
        if (selectedUser) {
          // Обновление существующего пользователя
          await updateUser({ id: selectedUser.id, data: userData as UpdateUserDto }).unwrap();
          setNotification({
            message: 'Пользователь успешно обновлен',
            severity: 'success',
            open: true,
          });
        } else {
          // Создание нового пользователя
          // Проверяем, что userData содержит все обязательные поля CreateUserDto
          if ('email' in userData && userData.email && 'name' in userData && userData.name && 
              'role' in userData && userData.role && 'password' in userData && userData.password) {
            await createUser(userData as CreateUserDto).unwrap();
            setNotification({
              message: 'Пользователь успешно создан',
              severity: 'success',
              open: true,
            });
          } else {
            throw new Error('Недостаточно данных для создания пользователя');
          }
        }
        setIsFormDialogOpen(false);
      } catch (error) {
        console.error('Error saving user:', error);
        setNotification({
          message: getErrorMessage(error),
          severity: 'error',
          open: true,
        });
      }
    },
    [selectedUser, createUser, updateUser]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id).unwrap();
      setNotification({
        message: 'Пользователь успешно удален',
        severity: 'success',
        open: true,
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      setNotification({
        message: getErrorMessage(error),
        severity: 'error',
        open: true,
      });
    }
  }, [selectedUser, deleteUser]);

  // Обработчик закрытия уведомления
  const handleCloseNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, open: false }));
  }, []);

  // Получение ошибок API
  const getApiErrors = useCallback((): Record<string, string[]> | undefined => {
    const error = selectedUser ? updateError : createError;
    if (error && 'data' in error && error.data && typeof error.data === 'object' && 'errors' in error.data) {
      return error.data.errors as Record<string, string[]>;
    }
    return undefined;
  }, [selectedUser, createError, updateError]);

  // Состояние фильтров
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  return (
    <Box sx={styles.root}>
      {/* Заголовок страницы */}
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Box sx={styles.header}>
          <Box>
            <Typography variant="h5" component="h1" sx={styles.title}>
              Управление пользователями
            </Typography>
            <Typography variant="body2" sx={styles.subtitle}>
              Создавайте, редактируйте и управляйте пользователями системы
            </Typography>
          </Box>
          <Box sx={styles.actions}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenCreateDialog}
              sx={{ 
                fontWeight: 'bold',
                boxShadow: 3,
                backgroundColor: 'primary.main',
                '&:hover': { boxShadow: 6, backgroundColor: 'primary.dark' },
                display: 'flex',
                mr: 2,
                px: 2,
                py: 1,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              {isMobile ? 'Создать' : 'Создать пользователя'}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FilterIcon />}
              onClick={toggleFilters}
            >
              Фильтры
            </Button>
          </Box>
        </Box>

        {/* Фильтры */}
        {showFilters && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <UsersFilter initialFilters={filters} onFilterChange={handleFilterChange} />
          </Box>
        )}
      </Paper>

      {/* Таблица пользователей */}
      <Paper elevation={3} sx={styles.content}>
        <UsersTable
          filterParams={filters}
          onViewUser={handleViewUser}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      </Paper>
      
      {/* Убираем плавающую кнопку, так как основная кнопка теперь всегда видна */}

      {/* Диалоги */}
      <UserFormDialog
        open={isFormDialogOpen}
        user={selectedUser}
        isSaving={isCreating || isUpdating}
        apiErrors={getApiErrors()}
        onClose={handleCloseFormDialog}
        onSave={handleSaveUser}
      />

      <UserDetailsDialog
        open={isDetailsDialogOpen}
        user={selectedUser}
        onClose={handleCloseDetailsDialog}
        onEdit={handleEditFromDetails}
      />

      <DeleteConfirmation
        open={isDeleteDialogOpen}
        user={selectedUser}
        isDeleting={isDeleting}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />

      {/* Уведомления */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};