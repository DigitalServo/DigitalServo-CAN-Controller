export interface Recipe {
  id: number,
  name: string,
}

export interface RecipeParameter {
  id: number,
  recipeId: number,
  key: string,
  value: string | number,
}
