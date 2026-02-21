import * as React from 'react';
import { styled, Theme } from '@mui/material/styles';
import { CSSObject } from '@emotion/react';
import {
  Toolbar,
  ToolbarButton,
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
  QuickFilterTrigger,
  QuickFilterProps,
  ToolbarButtonProps,
  useGridApiContext,
  gridPaginatedVisibleSortedGridRowEntriesSelector,
} from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';

import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';

import SaveAsIcon from '@mui/icons-material/SaveAs';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import { enqueueSnackbar } from 'notistack';

import { StyledComponent } from '@emotion/styled';
import { GridToolbarProps } from '@mui/x-data-grid/internals';
import { invoke } from '@tauri-apps/api/core';
import { useNodeIdStore } from '@/stores/nodeId';
import { save } from '@tauri-apps/plugin-dialog';
import { Box, PopperProps, SvgIconProps } from '@mui/material';

import type { GridSlotsComponentsProps } from '@mui/x-data-grid';
import { RecipeParameter } from '@/types/recipe';
import { KeyValues } from '@/types/json';
type TextFieldProps = NonNullable<GridSlotsComponentsProps['baseTextField']>;

type OwnerState = {
  expanded: boolean;
};

interface StyledTextFieldProps extends TextFieldProps {
  ownerState: OwnerState
};

interface StyledToolbarButtonProps extends ToolbarButtonProps {
  ownerState: OwnerState
};

const StyledQuickFilter: StyledComponent<QuickFilterProps> = styled(QuickFilter)({
  display: 'grid',
  alignItems: 'center',
});

const StyledToolbarButton: StyledComponent<StyledToolbarButtonProps> = styled(ToolbarButton)<{ ownerState: OwnerState }>(
  ({ theme, ownerState }: { theme: Theme; ownerState: OwnerState }): CSSObject => ({
    gridArea: '1 / 1',
    width: 'min-content',
    height: 'min-content',
    zIndex: 1,
    opacity: ownerState.expanded ? 0 : 1,
    pointerEvents: ownerState.expanded ? 'none' : 'auto',
    transition: theme.transitions.create(['opacity']),
  }),
);

const StyledTextField: StyledComponent<StyledTextFieldProps> = styled(TextField)<{
  ownerState: OwnerState;
}>(({ theme, ownerState }: { theme: Theme; ownerState: OwnerState }): CSSObject => ({
  gridArea: '1 / 1',
  overflowX: 'clip',
  width: ownerState.expanded ? 200 : 'var(--trigger-width)',
  opacity: ownerState.expanded ? 1 : 0,
  transition: theme.transitions.create(['width', 'opacity']),
  margin: 0,
  '& .MuiInputBase-root': {
    height: '28px',
    minHeight: '28px',
    fontSize: '0.875rem',
    paddingLeft: "8px",
  },
  '& .MuiInputBase-input': {
    padding: '0px 6px',
    height: '100%',
  },
}));

export default function ParameterTableToolbar(props: GridToolbarProps) {

  const { nodeId } = useNodeIdStore();
  const apiRef = useGridApiContext();

  async function saveAsJson() {

    const displayedEntries = gridPaginatedVisibleSortedGridRowEntriesSelector(apiRef);
    const rows = displayedEntries.map(entry => entry.model as RecipeParameter);
    if (rows.length == 0) {
      enqueueSnackbar("Parameters Not Loaded", { variant: "error" });
      return;
    }

    const parameters: KeyValues = rows.map(param => ({ key: param.key, value: param.value }));

    const path = await save({
      title: 'JSON parameter',
      defaultPath: "recipe",
      filters: [{ name: 'JSON', extensions: ["json"] }]
    });
    if (path == null) return;

    invoke<null>("recipe_save_to_json", { path, parameters })
      .then(_ => {})
      .catch(console.log)
  }

  function downloadParameters() {
    if (nodeId == null) {
      enqueueSnackbar("Node ID Not Set", { variant: "error" });
      return;
    }

    const displayedEntries = gridPaginatedVisibleSortedGridRowEntriesSelector(apiRef);
    const rows = displayedEntries.map(entry => entry.model as RecipeParameter); // または entry.row
    if (rows.length == 0) {
      enqueueSnackbar("Parameters Not Loaded", { variant: "error" });
      return;
    }

    enqueueSnackbar("Sending Parameters...", { variant: "info" });

    const parameters: KeyValues = rows.map(param => ({ key: param.key, value: param.value }));

    invoke<null>("cands_set_parameters", { nodeId, parameters })
      .then(_ => {
        enqueueSnackbar("Parameter Set Successfully", { variant: "success" });
      })
      .catch(err => {
        enqueueSnackbar(err, { variant: "error" });
      });
  }

  return (
    <Toolbar>
      {props.title && (
        <Typography fontWeight="medium" sx={{ flex: 1, mx: 0.5 }}>
          {props.title}
        </Typography>
      )}


      <Box display="flex" sx={{width: "100%"}}>
        <Box flex={1}>
          <CuntomIconButton icon={SaveAsIcon} tooltip="Save as JSON" placement="top" onClick={saveAsJson} />
        </Box>
        <Box>
          <CuntomIconButton icon={PlayArrowIcon} tooltip="Set All" placement="top" onClick={downloadParameters} />
        </Box>
      </Box>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5}} />

      <StyledQuickFilter debounceMs={props.quickFilterProps?.debounceMs}>
        <QuickFilterTrigger
          render={(triggerProps, state) => (
            <Tooltip title="Search" enterDelay={0}>
              <StyledToolbarButton
                {...triggerProps}
                ownerState={{ expanded: true }}
                color="default"
                aria-disabled={state.expanded}
              >
                <SearchIcon fontSize="small" />
              </StyledToolbarButton>
            </Tooltip>
          )}
        />
        <QuickFilterControl
          render={({ ref, ...controlProps }, state) => (
            <StyledTextField
              {...controlProps}
              ownerState={{ expanded: true }}
              // ownerState={{ state.expanded }}
              inputRef={ref}
              aria-label="Search"
              placeholder="Search..."
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start" sx={{mr: 0}}>
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: state.value ? (
                    <InputAdornment position="end">
                      <QuickFilterClear
                        edge="end"
                        size="small"
                        aria-label="Clear search"
                        material={{ sx: { marginRight: -0.75 } }}
                      >
                        <CancelIcon fontSize="small" />
                      </QuickFilterClear>
                    </InputAdornment>
                  ) : null,
                  ...controlProps.slotProps?.input,
                },
                ...controlProps.slotProps,
              }}
            />
          )}
        />
      </StyledQuickFilter>
    </Toolbar>
  );
}



interface CustomIconButtonProps extends ToolbarButtonProps {
  icon: React.ComponentType<SvgIconProps>,
  tooltip?: React.ReactNode
  placement?: PopperProps['placement']
};


function CuntomIconButton({icon: Icon, tooltip, placement, ...props }: CustomIconButtonProps) {
  return (
    <>
      <Tooltip title={tooltip ?? ""} placement={ placement }>
        <ToolbarButton {...props}>
          <Icon fontSize={ props.size } />
        </ToolbarButton>
      </Tooltip>
    </>
  );
}
