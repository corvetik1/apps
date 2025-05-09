/**
 * Стили для компонента UsersFilter
 */

import { SxProps, Theme } from '@mui/material/styles';

/**
 * Интерфейс для стилей компонента UsersFilter
 */
export interface UsersFilterStyles {
  root: SxProps<Theme>;
  form: SxProps<Theme>;
  formControl: SxProps<Theme>;
  inputField: SxProps<Theme>;
  buttonGroup: SxProps<Theme>;
  resetButton: SxProps<Theme>;
  applyButton: SxProps<Theme>;
}

/**
 * Стили компонента UsersFilter
 */
export const styles: UsersFilterStyles = {
  root: {
    width: '100%',
    backgroundColor: 'background.paper',
    boxShadow: 1,
    borderRadius: 1,
    mb: 2,
    p: 2,
  },
  form: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: { xs: 'stretch', md: 'flex-end' },
    gap: 2,
  },
  formControl: {
    flex: 1,
    minWidth: { xs: '100%', md: '200px' },
  },
  inputField: {
    width: '100%',
  },
  buttonGroup: {
    display: 'flex',
    gap: 1,
    justifyContent: { xs: 'flex-end', md: 'flex-start' },
    mt: { xs: 1, md: 0 },
  },
  resetButton: {
    color: 'text.secondary',
  },
  applyButton: {
    minWidth: '100px',
  },
};
