import React, { SyntheticEvent } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { styles } from './AdminPage.styles';
import { UsersPage } from '../../users/pages/UsersPage';
import { Role } from '@finance-platform/shared';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

/**
 * Интерфейс для вкладки администрирования
 */
interface AdminTab {
  id: string;
  label: string;
  path: string;
  component: React.ReactNode;
  requiredRole: Role;
}

/**
 * Компонент страницы администрирования
 * 
 * Отображает систему вкладок для различных разделов администрирования
 */
export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useSelector((state: RootState) => state.auth);
  
  // Определение доступных вкладок
  const adminTabs: AdminTab[] = [
    {
      id: 'users',
      label: 'Пользователи',
      path: '/admin/users',
      component: <UsersPage />,
      requiredRole: Role.Admin
    },
    {
      id: 'settings',
      label: 'Настройки',
      path: '/admin/settings',
      component: <Typography>Настройки системы (в разработке)</Typography>,
      requiredRole: Role.Admin
    },
    {
      id: 'audit',
      label: 'Журнал аудита',
      path: '/admin/audit',
      component: <Typography>Журнал аудита (в разработке)</Typography>,
      requiredRole: Role.Admin
    }
  ];
  
  // Фильтрация вкладок по правам доступа
  const availableTabs = adminTabs.filter(tab => 
    role === Role.Admin || (role === Role.Manager && tab.id === 'users')
  );
  
  // Определение активной вкладки на основе текущего пути
  const currentPath = location.pathname;
  const activeTabIndex = Math.max(
    0,
    availableTabs.findIndex(tab => currentPath === tab.path || currentPath.startsWith(tab.path + '/'))
  );
  
  // Обработчик изменения вкладки
  const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
    navigate(availableTabs[newValue].path);
  };
  
  return (
    <Box sx={styles.root}>
      <Box sx={styles.header}>
        <Typography variant="h1" sx={styles.title}>
          Панель администрирования
        </Typography>
      </Box>
      
      <Typography sx={styles.subtitle}>
        Управление пользователями, настройками и другими системными параметрами
      </Typography>
      
      <Box sx={styles.content}>
        <Box sx={styles.tabsContainer}>
          <Tabs 
            value={activeTabIndex} 
            onChange={handleTabChange}
            aria-label="Вкладки администрирования"
            variant="scrollable"
            scrollButtons="auto"
          >
            {availableTabs.map((tab) => (
              <Tab key={tab.id} label={tab.label} />
            ))}
          </Tabs>
        </Box>
        
        <Box sx={styles.tabContent}>
          {availableTabs[activeTabIndex]?.component || <Outlet />}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminPage;
