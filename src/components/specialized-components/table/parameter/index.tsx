import React from "react";

import { StyledMultilineGridTable, CustomNoRowsOverlay, CustomPagination } from "@/components/styled-components/dataGrid";
import { GridActionsCellItem, GridColDef, GridRowModel, GridRowParams } from "@mui/x-data-grid";

import ParameterTableToolbar from "./toolbar";
import { Recipe, RecipeParameter } from "@/types/recipe";
import { useSqliteStore } from "@/stores/sqlite";
import { forcedMutate } from "@/hooks/recipe/use-recipe-parameters";
import { Tooltip } from "@mui/material";

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useNodeIdStore } from "@/stores/nodeId";
import { useSnackbar } from "notistack";
import { KeyValues } from "@/types/json";
import { invoke } from "@tauri-apps/api/core";

export default function ParameterTable({ rows }: ({
  rows?: RecipeParameter[],
  recipe?: Recipe,
})): React.ReactElement {

  const { enqueueSnackbar } = useSnackbar();

  const { db } = useSqliteStore();
  const { nodeId } = useNodeIdStore();

  function downloadParameters(params: GridRowParams<RecipeParameter>) {
    if (nodeId == null) {
      enqueueSnackbar("Node ID Not Set", { variant: "error" });
      return;
    }

    const parameters: KeyValues = [{ key: params.row.key, value: params.row.value }];

    invoke<null>("cands_set_parameters", { nodeId, parameters })
      .then(_ => {
        enqueueSnackbar("Parameter Set Successfully", { variant: "success" });
      })
      .catch(err => {
        enqueueSnackbar(err, { variant: "error" });
      });
  }

  const handleProcessRowUpdate = React.useCallback(
    (newRow: GridRowModel<RecipeParameter>, oldRow: GridRowModel<RecipeParameter>) => {
      if (!rows || db === null) return oldRow;

      return db.execute(`UPDATE recipe_parameter SET key = $1, value = $2 WHERE id = $3`, [newRow.key, newRow.value, newRow.id])
        .then(() => {
          forcedMutate();
          return newRow;
        })
        .catch(err => {
          console.log(err);
          return oldRow;
        });
    },
    [rows, db]
  );



  const COLUMNS: GridColDef<RecipeParameter>[] = [
    {
      field: 'key',
      headerName: 'Key',
      width: 200,
      headerAlign: 'left',
      align: 'left',
      disableColumnMenu: true,
      sortable: false,
      editable: true,
    },
    {
      field: 'value',
      headerName: 'Value',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      disableColumnMenu: true,
      sortable: false,
      editable: true,
    },
    {
      field: "actions",
      type: 'actions',
      width: 80,
      align: 'right',
      getActions: (params: GridRowParams<RecipeParameter>) => [
        <GridActionsCellItem
          label="Set"
          showInMenu={false}
  				icon={<Tooltip title="Set"><PlayArrowIcon /></Tooltip>}
  				key={'parameter-set'}
          onClick={async _ => downloadParameters(params)}
				/>,
      ]
    }
  ];

  return (
		<StyledMultilineGridTable
      getRowHeight={() => 'auto'}
			columns={COLUMNS}
			rows={rows}
      density="compact"
			processRowUpdate={handleProcessRowUpdate}
      onProcessRowUpdateError={e => console.log(e)}
			pagination
      hideFooterSelectedRowCount={true}
      showToolbar={true}
      slots={{
        toolbar: ParameterTableToolbar,
				noRowsOverlay: CustomNoRowsOverlay,
			}}
      slotProps={{
        toolbar: {},
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
