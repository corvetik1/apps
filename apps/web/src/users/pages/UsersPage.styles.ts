/**
 * Стили для компонента UsersPage
 */

import { SxProps, Theme } from '@mui/material/styles';

/**
 * Интерфейс для стилей компонента UsersPage
 */
export interface UsersPageStyles {
  root: SxProps<Theme>;
  header: SxProps<Theme>;
  title: SxProps<Theme>;
  subtitle: SxProps<Theme>;
  actions: SxProps<Theme>;
  content: SxProps<Theme>;
  fab: SxProps<Theme>;
  fabMobile: SxProps<Theme>;
  filterContainer: SxProps<Theme>;
}

/**
 * Стили компонента UsersPage
 */
export const styles: UsersPageStyles = {
  root: {
    padding: 3,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 2,
    mb: 2,
  },
  title: {
    fontWeight: 'bold',
    color: 'primary.main',
    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
  },
  subtitle: {
    color: 'text.secondary',
    mb: 2,
    fontSize: { xs: '0.875rem', sm: '1rem' },
  },
  actions: {
    display: 'flex',
    gap: 1,
  },
  content: {
    flexGrow: 1,
    overflow: 'hidden',
    borderRadius: 2,
    boxShadow: 3,
  },
  fab: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    zIndex: 1000,
    boxShadow: 3,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.1)',
      boxShadow: 6,
    },
  },
  fabMobile: {
    position: 'fixed',
    bottom: 16,
    right: 16,
    zIndex: 1000,
    boxShadow: 4,
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: 5,
    },
  },
  filterContainer: {
    mb: 2,
    p: 2,
    backgroundColor: 'background.paper',
    borderRadius: 2,
    boxShadow: 1,
  },
};
