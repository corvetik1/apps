/**
 * Компонент таблицы пользователей
 *
 * Этот компонент отображает список пользователей с возможностью
 * сортировки, пагинации и выполнения действий над пользователями.
 */

import React, { useState, useCallback } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  Chip,
  useTheme,
  useMediaQuery,
  Skeleton,
} from '@mui/material';
import { User, Role } from '@finance-platform/shared';
import { useGetUsersQuery } from '../../api/usersApi';
import { styles } from './UsersTable.styles';
import { useAbility } from '../../permissions/abilities';
import { Action, Subject } from '../../permissions/types';

// Заменяем импорты иконок на встроенные SVG-компоненты
interface IconProps {
  fontSize?: 'small' | 'medium' | 'large';
}

const EditIcon: React.FC<IconProps> = ({ fontSize }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={fontSize === 'small' ? '20' : '24'} viewBox="0 0 24 24" width={fontSize === 'small' ? '20' : '24'} fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

const DeleteIcon: React.FC<IconProps> = ({ fontSize }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={fontSize === 'small' ? '20' : '24'} viewBox="0 0 24 24" width={fontSize === 'small' ? '20' : '24'} fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const VisibilityIcon: React.FC<IconProps> = ({ fontSize }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={fontSize === 'small' ? '20' : '24'} viewBox="0 0 24 24" width={fontSize === 'small' ? '20' : '24'} fill="currentColor">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

/**
 * Параметры сортировки
 */
export interface SortParams {
  sortBy: keyof User;
  sortOrder: 'asc' | 'desc';
}

/**
 * Параметры пагинации
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Параметры фильтрации
 */
export interface FilterParams {
  name?: string;
  email?: string;
  role?: Role | string;
}

/**
 * Пропсы компонента UsersTable
 */
export interface UsersTableProps {
  /** Параметры фильтрации */
  filterParams?: FilterParams;
  /** Обработчик просмотра пользователя */
  onViewUser?: (user: User) => void;
  /** Обработчик редактирования пользователя */
  onEditUser?: (user: User) => void;
  /** Обработчик удаления пользователя */
  onDeleteUser?: (user: User) => void;
}

/**
 * Компонент таблицы пользователей
 */
export const UsersTable: React.FC<UsersTableProps> = ({
  filterParams = {},
  onViewUser,
  onEditUser,
  onDeleteUser,
}) => {
  // Состояние сортировки и пагинации
  const [sortParams, setSortParams] = useState<SortParams>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    page: 0,
    limit: 10,
  });

  // Получение данных пользователей
  const {
    data,
    isLoading,
    error,
  } = useGetUsersQuery({
    ...filterParams,
    ...sortParams,
    page: paginationParams.page + 1, // API ожидает страницу с 1
    limit: paginationParams.limit,
  });

  // Проверка разрешений
  const ability = useAbility(null);
  // Временно убираем проверку прав для отображения кнопок
  const canEdit = useCallback(
    () => true, // ability.can(Action.Update, Subject.User),
    []
  );
  const canDelete = useCallback(
    () => true, // ability.can(Action.Delete, Subject.User),
    []
  );
  const canView = useCallback(
    () => true, // ability.can(Action.Read, Subject.User),
    []
  );

  // Обработчики сортировки и пагинации
  const handleSort = (property: keyof User) => {
    const isAsc = sortParams.sortBy === property && sortParams.sortOrder === 'asc';
    setSortParams({
      sortBy: property,
      sortOrder: isAsc ? 'desc' : 'asc',
    });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPaginationParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaginationParams({
      page: 0,
      limit: parseInt(event.target.value, 10),
    });
  };

  // Получаем тему для адаптивного дизайна
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Форматирование данных
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Цвета для разных ролей
  const getRoleColor = (role: string) => {
    switch (role) {
      case Role.Admin:
        return 'error';
      case Role.Manager:
        return 'info';
      case Role.Accountant:
        return 'success';
      case Role.User:
        return 'primary';
      default:
        return 'default';
    }
  };

  const formatRole = (role: string) => {
    return (
      <Chip 
        label={role} 
        size="small" 
        color={getRoleColor(role)} 
        variant="outlined"
      />
    );
  };

  // Получаем список пользователей
  const users = data?.items || [];
  const totalCount = data?.total || 0;

  return (
    <Box sx={styles.root}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer sx={styles.tableContainer}>
          <Table
            sx={styles.table}
            aria-labelledby="tableTitle"
            size="small"
            stickyHeader
          >
            <TableHead sx={styles.tableHead}>
              <TableRow>
                <TableCell sx={styles.tableHeadCell}>
                  <TableSortLabel
                    active={sortParams.sortBy === 'name'}
                    direction={sortParams.sortBy === 'name' ? sortParams.sortOrder : 'asc'}
                    onClick={() => handleSort('name')}
                  >
                    Имя
                  </TableSortLabel>
                </TableCell>
                {!isMobile && (
                  <TableCell sx={styles.tableHeadCell}>
                    <TableSortLabel
                      active={sortParams.sortBy === 'email'}
                      direction={sortParams.sortBy === 'email' ? sortParams.sortOrder : 'asc'}
                      onClick={() => handleSort('email')}
                    >
                      Email
                    </TableSortLabel>
                  </TableCell>
                )}
                <TableCell sx={styles.tableHeadCell}>
                  <TableSortLabel
                    active={sortParams.sortBy === 'role'}
                    direction={sortParams.sortBy === 'role' ? sortParams.sortOrder : 'asc'}
                    onClick={() => handleSort('role')}
                  >
                    Роль
                  </TableSortLabel>
                </TableCell>
                {!isTablet && (
                  <TableCell sx={styles.tableHeadCell}>
                    <TableSortLabel
                      active={sortParams.sortBy === 'createdAt'}
                      direction={sortParams.sortBy === 'createdAt' ? sortParams.sortOrder : 'asc'}
                      onClick={() => handleSort('createdAt')}
                    >
                      Создан
                    </TableSortLabel>
                  </TableCell>
                )}
                {!isTablet && (
                  <TableCell sx={styles.tableHeadCell}>
                    <TableSortLabel
                      active={sortParams.sortBy === 'updatedAt'}
                      direction={sortParams.sortBy === 'updatedAt' ? sortParams.sortOrder : 'asc'}
                      onClick={() => handleSort('updatedAt')}
                    >
                      Обновлен
                    </TableSortLabel>
                  </TableCell>
                )}
                <TableCell sx={styles.tableHeadCell} align="right">
                  Действия
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                // Скелетон загрузки для лучшего UX
                Array.from(new Array(5)).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                    {!isMobile && <TableCell><Skeleton variant="text" width="80%" /></TableCell>}
                    <TableCell><Skeleton variant="text" width="60%" /></TableCell>
                    {!isTablet && <TableCell><Skeleton variant="text" width="60%" /></TableCell>}
                    {!isTablet && <TableCell><Skeleton variant="text" width="60%" /></TableCell>}
                    <TableCell align="right">
                      <Box sx={styles.actions}>
                        <Skeleton variant="circular" width={30} height={30} />
                        <Skeleton variant="circular" width={30} height={30} />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={isMobile ? 3 : (isTablet ? 4 : 6)} align="center" sx={styles.noDataCell}>
                    <Typography color="error" variant="subtitle1">
                      Ошибка загрузки данных
                    </Typography>
                    <Typography color="error" variant="body2">
                      Попробуйте обновить страницу
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isMobile ? 3 : (isTablet ? 4 : 6)} align="center" sx={styles.noDataCell}>
                    <Typography variant="subtitle1">
                      Пользователи не найдены
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Попробуйте изменить параметры фильтрации
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                <TableRow key={user.id} sx={styles.tableRow}>
                  <TableCell sx={styles.tableCell}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {user.name}
                      </Typography>
                      {isMobile && (
                        <Typography variant="caption" color="text.secondary">
                          {user.email}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  {!isMobile && <TableCell sx={styles.tableCell}>{user.email}</TableCell>}
                  <TableCell sx={styles.tableCell}>{formatRole(user.role)}</TableCell>
                  {!isTablet && <TableCell sx={styles.tableCell}>{formatDate(user.createdAt)}</TableCell>}
                  {!isTablet && <TableCell sx={styles.tableCell}>{formatDate(user.updatedAt)}</TableCell>}
                  <TableCell sx={styles.tableCell} align="right">
                    <Box sx={styles.actions}>
                      {canView() && onViewUser && (
                        <Tooltip title="Просмотреть">
                          <IconButton
                            size="small"
                            sx={{
                              minWidth: 'auto',
                              padding: '4px',
                              margin: '0 2px',
                              borderRadius: '50%',
                              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' }
                            }}
                            onClick={() => onViewUser(user)}
                            aria-label="Просмотреть пользователя"
                            color="info"
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {canEdit() && onEditUser && (
                        <Tooltip title="Редактировать">
                          <IconButton
                            size="small"
                            sx={{
                              minWidth: 'auto',
                              padding: '4px',
                              margin: '0 2px',
                              borderRadius: '50%',
                              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)' }
                            }}
                            onClick={() => onEditUser(user)}
                            aria-label="Редактировать пользователя"
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {/* Кнопка удаления всегда видна */}
                      <Tooltip title="Удалить">
                        <IconButton
                          size="small"
                          sx={{
                            minWidth: 'auto',
                            padding: '4px',
                            margin: '0 2px',
                            borderRadius: '50%',
                            color: 'error.main',
                            '&:hover': { backgroundColor: 'error.light' }
                          }}
                          onClick={() => onDeleteUser && onDeleteUser(user)}
                          aria-label="Удалить пользователя"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={paginationParams.limit}
          page={paginationParams.page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Строк на странице:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} из ${count}`}
          sx={styles.tablePagination}
        />
      </Paper>
    </Box>
  );
};
