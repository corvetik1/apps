import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import { styles } from './AppBarAndMenu.styles';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faGavel,
  faChartLine,
  faCoins,
  faNoteSticky,
  faImage,
  faUserCog,
  faBars,
  faUser,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Role } from '@finance-platform/shared';

interface AuthState {
  isAuthenticated: boolean;
  name: string | null;
  role: Role | null;
}

interface AppBarAndMenuProps {
  onLogout: () => Promise<void>;
}

/**
 * Компонент AppBarAndMenu - главное меню приложения
 * 
 * Отображает верхнюю панель и боковое меню с пунктами навигации,
 * которые фильтруются в зависимости от роли пользователя.
 */
const AppBarAndMenu: React.FC<AppBarAndMenuProps> = React.memo(({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth) as AuthState;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Функция для получения отображаемого названия роли
  const getRoleDisplayName = (role?: Role) => {
    if (!role) return 'Пользователь';
    
    switch (role) {
      case Role.Admin:
        return 'Администратор';
      case Role.Manager:
        return 'Менеджер';
      case Role.User:
        return 'Пользователь';
      case Role.Guest:
        return 'Гость';
      case Role.Accountant:
        return 'Бухгалтер';
      default:
        return 'Пользователь';
    }
  };

  // Тексты для интерфейса
  const t = {
    home: 'Главная',
    tenders: 'Тендеры',
    analytics: 'Аналитика',
    finance: 'Финансы',
    investments: 'Инвестиции',
    notes: 'Заметки',
    gallery: 'Галерея',
    admin: 'Админка',
    profile: 'Профиль',
    logout: 'Выйти',
  };

  // Интерфейс для пунктов меню
  interface MenuItem {
    label: string;
    path: string;
    icon: any;
    pageId: string;
    visible: boolean;
  }

  // Определение пунктов меню с учетом прав доступа
  // Основные пункты меню
  const mainMenuItems = useMemo(() => {
    const items: MenuItem[] = [
      { 
        label: t.home, 
        path: '/dashboard', 
        icon: faHouse, 
        pageId: 'dashboard',
        visible: true
      },
      { 
        label: t.tenders, 
        path: '/tenders', 
        icon: faGavel, 
        pageId: 'tenders',
        visible: true
      },
      { 
        label: t.analytics, 
        path: '/analytics', 
        icon: faChartLine, 
        pageId: 'analytics',
        visible: true
      },
      { 
        label: t.finance, 
        path: '/finance', 
        icon: faCoins, 
        pageId: 'finance',
        visible: true
      },
      { 
        label: t.investments, 
        path: '/investments', 
        icon: faChartLine, 
        pageId: 'investments',
        visible: true
      },
      { 
        label: t.notes, 
        path: '/notes', 
        icon: faNoteSticky, 
        pageId: 'notes',
        visible: true
      },
      { 
        label: t.gallery, 
        path: '/gallery', 
        icon: faImage, 
        pageId: 'gallery',
        visible: true
      },
      { 
        label: t.admin, 
        path: '/admin', 
        icon: faUserCog, 
        pageId: 'admin',
        visible: role === Role.Admin
      },
    ];
    
    return items.filter(item => item.visible);
  }, [t, role]);
  
  // Пункты меню для правой части
  const rightMenuItems = useMemo(() => {
    const items: MenuItem[] = [
      { 
        label: t.profile, 
        path: '/profile', 
        icon: faUser, 
        pageId: 'profile',
        visible: true
      },
      { 
        label: t.logout, 
        path: '#', // Специальный путь для обработки выхода
        icon: faSignOutAlt, 
        pageId: 'logout',
        visible: true
      },
    ];
    
    return items.filter(item => item.visible);
  }, [t]);

  // Обработчик переключения мобильного меню
  const handleMobileMenuToggle = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  // Обработчик выхода из системы
  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await onLogout();
      navigate('/login');
    } catch (error) {
      console.error('Ошибка при выходе:', (error as Error).message);
    } finally {
      setIsLoggingOut(false);
    }
  }, [onLogout, navigate]);

  return (
    <Box>
      {/* Верхнее меню */}
      <Box sx={styles.appBar}>
        <Box sx={styles.logoBox}>
          <IconButton
            onClick={handleMobileMenuToggle}
            sx={styles.mobileMenuToggleButton}
            aria-label="Открыть мобильное меню"
          >
            <FontAwesomeIcon icon={faBars} />
          </IconButton>
          
          {/* Пункты меню в верхней панели */}
          <Box sx={styles.mainMenuBox}>
            {mainMenuItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              
              return (
                <Box
                  key={item.pageId}
                  component={Link}
                  to={item.path}
                  sx={{
                    ...styles.mainMenuItemBase as any,
                    ...(isActive ? styles.mainMenuItemActive as any : {})
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FontAwesomeIcon icon={item.icon} size="sm" style={{ width: '16px', marginRight: '0.3rem' }} />
                    <span style={{ fontSize: '0.95rem' }}>{item.label}</span>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isAuthenticated && (
            <>
              {/* Имя пользователя и его роль */}
              <Typography variant="body2" sx={styles.userRoleChip}>
                {getRoleDisplayName(role || undefined) || 'Пользователь'}
              </Typography>
              
              {/* Правые пункты меню для десктопа */}
              <Box sx={styles.rightMenuBox}>
                {rightMenuItems.map((item) => {
                  const isActive = location.pathname.startsWith(item.path) && item.pageId !== 'logout';
                  const isLogout = item.pageId === 'logout';
                  
                  return (
                    <Box
                      key={item.pageId}
                      component={isLogout ? 'div' : Link}
                      to={!isLogout ? item.path : undefined}
                      onClick={isLogout ? handleLogout : undefined}
                      sx={styles.rightMenuItem(isActive, isLogout) as any}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FontAwesomeIcon icon={item.icon} size="sm" style={{ width: '14px', marginRight: '0.25rem' }} />
                        <span style={{ fontSize: '0.85rem' }}>{item.label}</span>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
              
              {/* Кнопка выхода для мобильных устройств */}
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleLogout}
                disabled={isLoggingOut}
                sx={styles.mobileLogoutButton}
                startIcon={<FontAwesomeIcon icon={faSignOutAlt} size="sm" />}
              >
                {isLoggingOut ? <CircularProgress size={20} /> : t.logout}
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Боковое меню (только для мобильных устройств) */}
      <Box
        sx={{
          ...styles.sideMenu,
          left: mobileMenuOpen ? 0 : '-250px',
        }}
      >
        <Box sx={{ padding: '1rem 0' }}>
          {/* Основные пункты меню */}
          {mainMenuItems.map((item) => (
            <Box
              key={item.pageId}
              component={Link}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              sx={styles.sideMenuListItem}
            >
              <FontAwesomeIcon icon={item.icon} style={{ marginRight: '8px' }} />
              {item.label}
            </Box>
          ))}
          
          {/* Разделитель */}
          <Box sx={{ height: '1px', backgroundColor: '#e0e0e0', margin: '0.5rem 1rem' }} />
          
          {/* Правые пункты меню */}
          {rightMenuItems.map((item) => (
            <Box
              key={item.pageId}
              component={item.pageId === 'logout' ? 'div' : Link}
              to={item.pageId !== 'logout' ? item.path : undefined}
              onClick={item.pageId === 'logout' 
                ? () => { handleLogout(); setMobileMenuOpen(false); } 
                : () => setMobileMenuOpen(false)}
              sx={styles.sideMenuListItem}
            >
              <FontAwesomeIcon icon={item.icon} style={{ marginRight: '8px' }} />
              {item.label}
            </Box>
          ))}
        </Box>
        
        {/* Кнопка закрытия */}
        <IconButton
          onClick={handleMobileMenuToggle}
          sx={styles.mobileCloseButton}
          aria-label="Закрыть мобильное меню"
        >
          <FontAwesomeIcon icon={faBars} />
        </IconButton>
      </Box>
      
      {/* Затемнение за мобильным меню */}
      {mobileMenuOpen && (
        <Box
          onClick={handleMobileMenuToggle}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 800,
            display: { xs: 'block', md: 'none' },
          }}
        />
      )}
      
      {/* Пространство для контента */}
      <Box sx={{ height: '64px' }} />
    </Box>
  );
});

export default AppBarAndMenu;
