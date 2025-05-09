import React from 'react';
import { Box } from '@mui/material';
import { UsersPage } from '../../users/pages/UsersPage';

/**
 * Компонент вкладки управления пользователями в панели администрирования
 * 
 * Переиспользует компонент UsersPage для отображения и управления пользователями
 */
export const AdminUsersTab: React.FC = () => {
  return (
    <Box>
      <UsersPage />
    </Box>
  );
};

export default AdminUsersTab;
