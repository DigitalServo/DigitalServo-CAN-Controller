"use client";

import React from "react";

import ParameterTable from "@/components/specialized-components/table/parameter";
import RecipeTable from "@/components/specialized-components/table/recipe";
import { Box, Grid } from "@mui/material";
import PageContainer from "@/components/styled-components/page-container";
import useRecipeList from "@/hooks/recipe/use-recipe-list";
import { GridEventListener, GridRowParams } from "@mui/x-data-grid";
import { Recipe } from "@/types/recipe";
import useRecipeParameter from "@/hooks/recipe/use-recipe-parameters";

export default function Parameter() {

  const [selectedRecipe, setSelectedRecipe] = React.useState<Recipe | undefined>(undefined);
  const onRecipeRowClick: GridEventListener<'rowClick'> = (recipe: GridRowParams<Recipe>): void => {
    setSelectedRecipe(recipe.row);
  }

  const { data: recipes } = useRecipeList();
  const { data: parameters } = useRecipeParameter(selectedRecipe?.id);

  return (
    <>
      <PageContainer title="Parameter">

        <Grid container sx={{ mt: 3, mx: 'auto', width: '100%', height: '80%' }}>

          <Grid size={{ xs: 12, md: 6 }} sx={{px: 1}}>
            <Box sx={{height: '70vh'}}>
              <RecipeTable rows={recipes || []} onRowClick={onRecipeRowClick}/>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={{px: 1}}>
            <Box sx={{height: '70vh'}}>
              <ParameterTable rows={parameters || []} recipe={selectedRecipe}/>
            </Box>
          </Grid>

        </Grid>
      </PageContainer>
    </>
  );
}
