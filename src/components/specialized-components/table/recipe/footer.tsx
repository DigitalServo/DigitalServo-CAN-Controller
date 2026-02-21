import { Box, IconButton, Tooltip } from "@mui/material";
import { GridFooter, GridSlotsComponentsProps } from "@mui/x-data-grid";

import AddRecipeIcon from '@mui/icons-material/PostAdd';
import { useDialogs } from "@toolpad/core/useDialogs";
import CreateRecipeDialog from "./dialogs/create";
import { useSqliteStore } from "@/stores/sqlite";
import useRecipeList from "@/hooks/recipe/use-recipe-list";

export default function RecipeFooter(_props: GridSlotsComponentsProps['footer']) {

  const dialogs = useDialogs();
  const { db } = useSqliteStore();
  const { mutate } = useRecipeList();

  async function onCreate() {
    if (db === null) return;

    const name = await dialogs.open(CreateRecipeDialog, null);
    if (name === null) return;

    db.execute(`INSERT INTO recipe (name) VALUES ($1)`, [name])
      .then(() => {
        mutate();
      })
      .catch(console.log);
  }

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ position: 'absolute', height: '100%', display: 'flex', alignItems: 'center', ml: 1.5, zIndex: 999 }}>
          <Tooltip title="Add recipe" placement="right">
            <IconButton onClick={onCreate}>
              <AddRecipeIcon color="inherit" />
            </IconButton>
          </Tooltip>
        </Box>
        <GridFooter />
      </Box>
    </>
  )
}
