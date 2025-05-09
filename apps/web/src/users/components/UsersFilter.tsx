/**
 * Компонент фильтрации пользователей
 *
 * Этот компонент предоставляет интерфейс для фильтрации списка пользователей
 * по имени, email и роли.
 */

import React, { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  SelectChangeEvent,
} from '@mui/material';
import { Role } from '@finance-platform/shared';
import { styles } from './UsersFilter.styles';
import { FilterParams } from './UsersTable';

/**
 * Пропсы компонента UsersFilter
 */
export interface UsersFilterProps {
  /** Начальные параметры фильтрации */
  initialFilters?: FilterParams;
  /** Обработчик изменения фильтров */
  onFilterChange: (filters: FilterParams) => void;
}

/**
 * Компонент фильтрации пользователей
 */
export const UsersFilter: React.FC<UsersFilterProps> = ({
  initialFilters = {},
  onFilterChange,
}) => {
  // Состояние фильтров
  const [filters, setFilters] = useState<FilterParams>({
    name: initialFilters.name || '',
    email: initialFilters.email || '',
    role: initialFilters.role || '',
  });

  // Обновляем состояние при изменении начальных фильтров
  useEffect(() => {
    setFilters({
      name: initialFilters.name || '',
      email: initialFilters.email || '',
      role: initialFilters.role || '',
    });
  }, [initialFilters]);

  // Обработчики изменения полей
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, name: event.target.value }));
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, email: event.target.value }));
  };

  const handleRoleChange = (event: SelectChangeEvent<string>) => {
    setFilters((prev) => ({ ...prev, role: event.target.value }));
  };

  // Обработчик сброса фильтров
  const handleReset = () => {
    const resetFilters = {
      name: '',
      email: '',
      role: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  // Обработчик применения фильтров
  const handleApply = () => {
    onFilterChange(filters);
  };

  // Обработчик отправки формы
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleApply();
  };

  return (
    <Paper sx={styles.root}>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Box sx={styles.form}>
          <FormControl sx={styles.formControl}>
            <TextField
              id="user-filter-name"
              label="Имя пользователя"
              variant="outlined"
              size="small"
              value={filters.name}
              onChange={handleNameChange}
              sx={styles.inputField}
              placeholder="Введите имя для поиска"
            />
          </FormControl>

          <FormControl sx={styles.formControl}>
            <TextField
              id="user-filter-email"
              label="Email"
              variant="outlined"
              size="small"
              value={filters.email}
              onChange={handleEmailChange}
              sx={styles.inputField}
              placeholder="Введите email для поиска"
            />
          </FormControl>

          <FormControl sx={styles.formControl} size="small">
            <InputLabel id="user-filter-role-label">Роль</InputLabel>
            <Select
              labelId="user-filter-role-label"
              id="user-filter-role"
              value={filters.role}
              onChange={handleRoleChange}
              label="Роль"
              sx={styles.inputField}
            >
              <MenuItem value="">Все роли</MenuItem>
              <MenuItem value={Role.Admin}>Администратор</MenuItem>
              <MenuItem value={Role.Manager}>Менеджер</MenuItem>
              <MenuItem value={Role.User}>Пользователь</MenuItem>
              <MenuItem value={Role.Guest}>Гость</MenuItem>
              <MenuItem value={Role.Accountant}>Бухгалтер</MenuItem>
            </Select>
          </FormControl>

          <Box sx={styles.buttonGroup}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleReset}
              sx={styles.resetButton}
            >
              Сбросить
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={styles.applyButton}
            >
              Применить
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};
