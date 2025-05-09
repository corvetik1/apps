/**
 * Стили для компонента UsersTable
 */

import { SxProps, Theme } from '@mui/material/styles';

/**
 * Интерфейс для стилей компонента UsersTable
 */
export interface UsersTableStyles {
  root: SxProps<Theme>;
  tableContainer: SxProps<Theme>;
  table: SxProps<Theme>;
  tableHead: SxProps<Theme>;
  tableHeadCell: SxProps<Theme>;
  tableRow: SxProps<Theme>;
  tableCell: SxProps<Theme>;
  tablePagination: SxProps<Theme>;
  noDataCell: SxProps<Theme>;
  actions: SxProps<Theme>;
  actionButton: SxProps<Theme>;
  deleteButton: SxProps<Theme>;
  editButton: SxProps<Theme>;
  viewButton: SxProps<Theme>;
  sortLabel: SxProps<Theme>;
  loadingOverlay: SxProps<Theme>;
}

/**
 * Стили компонента UsersTable
 */
export const styles: UsersTableStyles = {
  root: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'background.paper',
    boxShadow: 1,
    borderRadius: 1,
    position: 'relative',
  },
  tableContainer: {
    maxHeight: 'calc(100vh - 300px)',
    minHeight: '400px',
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
  },
  table: {
    minWidth: 750,
  },
  tableHead: {
    backgroundColor: '#f5f5f5',
    '& th': {
      fontWeight: 'bold',
    },
    position: 'sticky',
    top: 0,
    zIndex: 10,
    borderBottom: '2px solid',
    borderColor: 'primary.main',
  },
  tableHeadCell: {
    fontWeight: 'bold',
    color: '#333333',
    fontSize: '0.9rem',
    padding: '12px 16px',
    '& .MuiTableSortLabel-root': {
      color: '#333333',
      '&:hover': {
        color: 'primary.main',
      },
      '&.Mui-active': {
        color: 'primary.main',
        '& .MuiTableSortLabel-icon': {
          color: 'primary.main !important',
        },
      },
    },
  },
  tableRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: 'action.hover',
    },
    '&:hover': {
      backgroundColor: 'action.selected',
    },
  },
  tableCell: {
    padding: '8px 16px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '200px',
  },
  tablePagination: {
    overflow: 'hidden',
  },
  noDataCell: {
    padding: 4,
    textAlign: 'center',
    color: 'text.secondary',
  },
  actions: {
    display: 'flex',
    gap: 1,
    justifyContent: 'flex-end',
  },
  actionButton: {
    minWidth: 'auto',
    padding: '4px',
    margin: '0 2px',
    borderRadius: '50%',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
  },
  deleteButton: {
    color: 'error.main',
    '&:hover': {
      backgroundColor: 'error.light',
    },
  },
  editButton: {
    color: 'info.main',
    '&:hover': {
      backgroundColor: 'info.light',
    },
  },
  viewButton: {
    color: 'success.main',
    '&:hover': {
      backgroundColor: 'success.light',
    },
  },
  sortLabel: {
    fontWeight: 'bold',
    color: 'inherit',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 1,
  },
};
