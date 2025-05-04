import { SxProps, Theme } from '@mui/material';

// Определение типа для хранения всех стилей компонента
export interface AppBarAndMenuStyles {
  appBar: SxProps<Theme>;
  logoBox: SxProps<Theme>;
  logoImage: SxProps<Theme>;
  logoText: SxProps<Theme>;
  mainMenuBox: SxProps<Theme>;
  mainMenuItemBase: SxProps<Theme>;
  mainMenuItemActive: SxProps<Theme>;
  userRoleChip: SxProps<Theme>;
  rightMenuBox: SxProps<Theme>;
  rightMenuItem: (isActive: boolean, isLogout: boolean) => SxProps<Theme>;
  mobileLogoutButton: SxProps<Theme>;
  mobileMenuToggleButton: SxProps<Theme>;
  sideMenu: SxProps<Theme>;
  sideMenuListItem: SxProps<Theme>;
  mobileCloseButton: SxProps<Theme>;
}

// Создание объекта стилей
export const styles: AppBarAndMenuStyles = {
  appBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.4rem 0.7rem',
    background: 'linear-gradient(90deg, #e0f7fa 0%, #b2ebf2 100%)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  
  logoBox: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
  },

  logoImage: {
    height: 40,
    marginRight: '0.5rem',
  },

  logoText: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
    color: '#0277bd',
    letterSpacing: '-0.5px',
    display: { xs: 'none', sm: 'block' },
  },

  mainMenuBox: {
    display: { xs: 'none', md: 'flex' },
    alignItems: 'center',
    marginLeft: '1.5rem',
  },

  mainMenuItemBase: {
    padding: '0.5rem 0.8rem',
    color: '#424242',
    textDecoration: 'none',
    fontWeight: 'normal',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s ease',
    '&:hover': {
      color: '#0277bd',
      borderBottom: '2px solid #0277bd',
    },
  },

  mainMenuItemActive: {
    color: '#0277bd',
    fontWeight: 'bold',
    borderBottom: '2px solid #0277bd',
  },

  userRoleChip: {
    marginRight: '0.5rem',
    display: { xs: 'none', md: 'flex' },
    alignItems: 'center',
    padding: '0.2rem 0.5rem',
    background: 'rgba(2, 119, 189, 0.1)',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: 500,
    border: '1px solid rgba(2, 119, 189, 0.15)',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(2, 119, 189, 0.15)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
  },

  rightMenuBox: {
    display: { xs: 'none', md: 'flex' },
    alignItems: 'center',
  },

  rightMenuItem: (isActive, isLogout) => ({
    padding: '0.3rem 0.5rem',
    marginLeft: '0.3rem',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '4px',
    color: isActive 
      ? '#0277bd'
      : (isLogout ? '#f44336' : '#424242'),
    textDecoration: 'none',
    fontWeight: isActive ? 'bold' : 'normal',
    background: isActive
      ? 'linear-gradient(to bottom, rgba(2, 119, 189, 0.1), rgba(178, 235, 242, 0.3))'
      : 'transparent',
    border: isActive
      ? '1px solid rgba(2, 119, 189, 0.2)'
      : '1px solid transparent',
    boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      color: isLogout ? '#d32f2f' : '#0277bd',
      background: isLogout
        ? 'rgba(244, 67, 54, 0.05)'
        : 'linear-gradient(to bottom, rgba(2, 119, 189, 0.05), rgba(178, 235, 242, 0.15))',
      boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
      border: isLogout
        ? '1px solid rgba(244, 67, 54, 0.2)'
        : '1px solid rgba(2, 119, 189, 0.15)',
    },
  }),

  mobileLogoutButton: {
    minWidth: '100px',
    display: { xs: 'flex', md: 'none' },
    borderRadius: '20px',
    textTransform: 'none',
    padding: '0.3rem 0.7rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
    }
  },

  mobileMenuToggleButton: {
    display: { xs: 'flex', md: 'none' },
    marginRight: '0.5rem',
  },

  sideMenu: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '250px',
    height: '100%',
    backgroundColor: '#fff',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
    zIndex: 1100,
    transform: 'translateX(-250px)',
    transition: 'transform 0.3s ease',
  },

  sideMenuListItem: {
    padding: '0.75rem 1rem',
    display: 'flex',
    alignItems: 'center',
    color: '#424242',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(2, 119, 189, 0.05)',
      color: '#0277bd',
    },
  },

  mobileCloseButton: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
  },
};
