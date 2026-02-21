import { CSSProperties, styled } from '@mui/material/styles';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';

export * from './noDataIcon';
export { CustomPagination } from './pagination';

export const StyledGridTable: React.FC<DataGridProps> = styled(DataGrid)((_: DataGridProps): CSSProperties => ({
    boxShadow: '2px 2px 2px #ddd',
    backgroundColor: '#fff',
    border: '1px solid #eee',
    borderColor: '#ccc',
    borderRadius: '8px',
    '& .MuiDataGrid-toolbarContainer': {
      borderBottom: '1px solid #ccc',
    },
    '& .MuiDataGrid-footerContainer': {
      borderTop: '1px solid #ccc',
    },
    '& .MuiDataGrid-columnHeaders': {
      borderBottom: '1px solid #ccc',
    },
    '& .MuiDataGrid-row': {
    },
    '& .MuiDataGrid-virtualScrollerRenderZone': {
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 'bold'
    },
    '& .MuiDataGrid-columnHeader:focus-within': {
      outline: 'none'
    },
    '& .MuiDataGrid-cell:hover': {
      color: 'primary.main',
    },
    '& .MuiDataGrid-cell:focus-within': {
      outline: 'none'
    },
    '& .MuiDataGrid-iconSeparator': {
      display: 'none',
    },
    '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
      userSelect: 'none',
      padding: '0px 8px 0px 10px',
    },
    '& .MuiDataGrid-columnHeader:first-of-type, .MuiDataGrid-cell:first-of-type': {
    },
}));


export const StyledMultilineGridTable: React.FC<DataGridProps> = styled(DataGrid)((_: DataGridProps): CSSProperties => ({
  boxShadow: '2px 2px 2px #ddd',
  backgroundColor: '#fff',
  border: '1px solid #eee',
  borderColor: '#ccc',
  borderRadius: '8px',
  '& .MuiDataGrid-footerContainer': {
    borderTop: '1px solid #ccc',
  },
  '& .MuiDataGrid-columnHeaders': {
    borderBottom: '1px solid #ccc',
  },
  '& .MuiDataGrid-row': {
  },
  '& .MuiDataGrid-virtualScrollerRenderZone': {
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 'bold'
  },
  '& .MuiDataGrid-columnHeader:focus-within': {
    outline: 'none'
  },
  '& .MuiDataGrid-cell:hover': {
    color: 'primary.main',
  },
  '& .MuiDataGrid-cell:focus-within': {
    outline: 'none'
  },
  '& .MuiDataGrid-iconSeparator': {
    display: 'none',
  },
  '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
    userSelect: 'none',
    padding: '6px 8px 4px 8px',
  },
  '& .MuiDataGrid-columnHeader:first-of-type, .MuiDataGrid-cell:first-of-type': {
  },
  '& .MuiDataGrid-toolbar': {
    minHeight: '40px !important'
  },
  '& .MuiDataGrid-toolbarContainer': {
    borderBottom: '1px solid #ccc',
  },
  '& .MuiDataGrid-toolbarQuickFilter .MuiInputBase-root': {
    height: '28px',
    fontSize: '0.875rem',
  },

  '& .MuiDataGrid-toolbarQuickFilter .MuiInputBase-input': {
    padding: '4px 8px',
  },

  // 要素間の隙間が気になる場合
  '& .MuiToolbar-root': {
    gap: '8px',
    minHeight: 'unset',
  },
}));
