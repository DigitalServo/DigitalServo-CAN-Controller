import React from "react";

import { StyledMultilineGridTable, CustomNoRowsOverlay, CustomPagination } from "@/components/styled-components/dataGrid";
import { GridActionsCellItem, GridColDef, GridEventListener, GridRowModel, GridRowParams } from "@mui/x-data-grid";

import { KeyValue } from "@/types/json";
import RecipeTableToolbar, { RecipeTableToolbarProps } from "./toolbar";
import { Recipe, RecipeParameter } from "@/types/recipe";
import RecipeFooter from "./footer";
import { useDialogs } from "@toolpad/core/useDialogs";
import { useSqliteStore } from "@/stores/sqlite";
import useRecipeList from "@/hooks/recipe/use-recipe-list";

import EditIcon from '@mui/icons-material/Edit';
import RemoveIcon from '@mui/icons-material/RemoveCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Tooltip } from "@mui/material";
import RenameRecipeDialog from "./dialogs/rename";
import CopyRecipeDialog from "./dialogs/copy";
import RemoveRecipeDialog from "./dialogs/remove";

export default function ParameterTable({ rows, onRowClick }: ({
  rows?: Recipe[],
  onRowClick?: GridEventListener<'rowClick'>,
})): React.ReactElement {

  const dialogs = useDialogs();
  const { db } = useSqliteStore();
  const { mutate } = useRecipeList();

  async function onRenameClick(params: GridRowParams<Recipe>) {
    if (db === null) return;

    const req = await dialogs.open(RenameRecipeDialog, params.row.id);
    if (req === null) return;

    db.execute(`UPDATE recipe SET name = $1 WHERE id = $2`, [req.name, req.id])
      .then(() => mutate())
      .catch(console.log);
  };

  async function onRemoveClick(params: GridRowParams<Recipe>) {
    if (db === null) return;

    const req = await dialogs.open(RemoveRecipeDialog, null);
    if (req === null) return;

    db.execute(`DELETE FROM recipe WHERE id = $1`, [params.row.id])
      .then(() => mutate())
      .catch(console.log);
  };

  async function onCopyClick(params: GridRowParams<Recipe>) {
    if (db === null) return;

    const req = await dialogs.open(CopyRecipeDialog, params.row.id);
    if (req === null) return;

    const parameters = await db.select<RecipeParameter[]>(`SELECT * FROM recipe_parameter WHERE recipe_id = $1`, [req.original_recipe_id])
      .catch(err => {
        console.log(err);
        return null;
      })
    if (parameters === null) return;

    const ret = await db.select<Recipe[]>(`INSERT INTO recipe (name) VALUES ($1) RETURNING *`, [req.new_recipe_name])
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

    mutate();
  }

  const COLUMNS: GridColDef<Recipe>[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      disableColumnMenu: true,
      sortable: false,
      editable: false,
    },
    {
      field: 'actions',
      type: 'actions',
      width: 40,
      align: 'right',
      getActions: (params: GridRowParams<Recipe>) => [
				<GridActionsCellItem
					label="Rename"
          showInMenu
					icon={<Tooltip title="Rename"><EditIcon /></Tooltip>}
					key={'recipe-rename'}
          onClick={async _ => onRenameClick(params)}
				/>,
        <GridActionsCellItem
					label="Remove"
          showInMenu
					icon={<Tooltip title="Remove"><RemoveIcon /></Tooltip>}
					key={'recipe-delete'}
          onClick={async _ => onRemoveClick(params)}
        />,
        <GridActionsCellItem
					showInMenu
					label="Copy"
					icon={<Tooltip title="Copy"><ContentCopyIcon /></Tooltip>}
					key={'recipe-copy'}
          onClick={async _ => onCopyClick(params)}
				/>,
      ]
		}
  ];

  const handleProcessRowUpdate = React.useCallback(
    (newRow: GridRowModel<KeyValue>, oldRow: GridRowModel<KeyValue>) => {
      if (!rows) return oldRow;

      const index = rows.findIndex((row) => row.id === newRow.id);
      if (index === -1) return oldRow;

      return newRow;
    },
    [rows]
  );

  return (
		<StyledMultilineGridTable
      getRowHeight={() => 'auto'}
			columns={COLUMNS}
			rows={rows}
      density="compact"
			processRowUpdate={handleProcessRowUpdate}
      onProcessRowUpdateError={e => console.log(e)}
      onRowClick={onRowClick}
			pagination
      hideFooterSelectedRowCount={true}
      showToolbar={true}
      slots={{
        toolbar: RecipeTableToolbar,
        footer: RecipeFooter,
				noRowsOverlay: CustomNoRowsOverlay,
			}}
      slotProps={{
        toolbar: {} as RecipeTableToolbarProps,
        basePagination: {
          material: {
            ActionsComponent: CustomPagination,
          },
        },
      }}
			initialState={{ pagination: { paginationModel: { pageSize: 100 } }, }}
			pageSizeOptions={[100]}
		/>
	);
}
