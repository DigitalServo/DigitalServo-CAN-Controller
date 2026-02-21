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
} from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';

import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import FileUploadIcon from '@mui/icons-material/FileUpload';

import { useSnackbar } from 'notistack';

import { StyledComponent } from '@emotion/styled';
import { GridToolbarProps } from '@mui/x-data-grid/internals';
import { invoke } from '@tauri-apps/api/core';
import { KeyValue, KeyValues, ValueType } from '@/types/json';
import { open } from '@tauri-apps/plugin-dialog';
import { Box, PopperProps, SvgIconProps } from '@mui/material';

import type { GridSlotsComponentsProps } from '@mui/x-data-grid';
import { useDialogs } from '@toolpad/core/useDialogs';
import ImportRecipeDialog from './dialogs/import';
import { Recipe } from '@/types/recipe';
import { useSqliteStore } from '@/stores/sqlite';
import useRecipeList from '@/hooks/recipe/use-recipe-list';
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

export interface RecipeTableToolbarProps extends GridToolbarProps {
  onLoaded?: (newRows: KeyValues) => void,
  onResetRequest?: (newRows: KeyValues) => void,
}

export default function RecipeTableToolbar(props: RecipeTableToolbarProps) {

  const { enqueueSnackbar } = useSnackbar();
  const dialogs = useDialogs();
  const { db } = useSqliteStore();
  const { mutate } = useRecipeList();

  async function importRecipe() {

    if (db === null) return;

    const path = await open({
      title: 'JSON parameter',
      multiple: false,
      directory: false,
      filters: [{ name: 'JSON', extensions: ["json"] }]
    });
    if (path == null) return;

    const parameters = await invoke<KeyValues>("recipe_load_from_json", { path })
      .then((ret: KeyValues) => {
        const params: KeyValues = ret.map((param: KeyValue, id: number): KeyValue => {
          const type =
            typeof param.value === "number" ? ValueType.Number :
            typeof param.value === "string" ? ValueType.String :
            undefined;
          return { ...param, id, type }
        });
        return params;
      })
      .catch(err => {
        console.log(err);
        return null;
      });
    if (parameters === null) return;

    const new_recipe_name = await dialogs.open(ImportRecipeDialog, null);
    if (new_recipe_name === null) return;

    const ret = await db.select<Recipe[]>(`INSERT INTO recipe (name) VALUES ($1) RETURNING *`, [new_recipe_name])
      .then(ret => {
        return ret[0];
      })
      .catch(err => {
        console.log(err);
        return null;
      })
    if (ret === null) return;

    const new_recipe_id = ret.id;

    if (parameters.length > 0) {
      for (const parameter of parameters) {
        const ret = await db.execute("INSERT INTO recipe_parameter (recipe_id, key, value) VALUES ($1, $2, $3)", [new_recipe_id, parameter.key, parameter.value])
          .catch(err => {
            console.log(err);
            return null;
          });
        if (ret === null) {
          await db.execute("DELETE FROM recipe WHERE id = $1", [new_recipe_id])
            .catch(console.log)
          return;
        }
      }
    }

    enqueueSnackbar("Import Recipe", {variant: "success"});
    mutate();
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
          <CuntomIconButton icon={FileUploadIcon} tooltip="Upload JSON" placement="top" onClick={importRecipe} />
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
                // ownerState={{ state.expanded }}
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
