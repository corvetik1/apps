/**
 * Стили для страницы администрирования
 */

import { SxProps, Theme } from '@mui/material/styles';

/**
 * Интерфейс для стилей страницы администрирования
 */
export interface AdminPageStyles {
  root: SxProps<Theme>;
  header: SxProps<Theme>;
  title: SxProps<Theme>;
  subtitle: SxProps<Theme>;
  content: SxProps<Theme>;
  tabsContainer: SxProps<Theme>;
  tabContent: SxProps<Theme>;
}

/**
 * Стили страницы администрирования
 */
export const styles: AdminPageStyles = {
  root: {
    p: 3,
    maxWidth: '100%',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 2,
    flexDirection: { xs: 'column', sm: 'row' },
    gap: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  subtitle: {
    color: 'text.secondary',
    fontSize: '0.875rem',
    mb: 2,
  },
  content: {
    mt: 2,
    bgcolor: 'background.paper',
    borderRadius: 1,
    boxShadow: 1,
  },
  tabsContainer: {
    borderBottom: 1,
    borderColor: 'divider',
  },
  tabContent: {
    p: 2,
  },
};

export default styles;
