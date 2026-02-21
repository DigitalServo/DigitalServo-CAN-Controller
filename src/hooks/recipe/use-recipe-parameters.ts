import useSWR, { SWRConfiguration } from "swr";

import { useSqliteStore } from "@/stores/sqlite";
import Database from "@tauri-apps/plugin-sql";
import { RecipeParameter } from "@/types/recipe";

import { mutate } from "swr";

const API: string = "get_recipe_parameter";

type Data = RecipeParameter[] | null;
type Args = [string, Database, number] | null;

export default function useRecipeParameter (recipeId: number | null | undefined, option?: SWRConfiguration) {

  const { db } = useSqliteStore();

  async function fetcher(props: Args): Promise<Data> {
    if (props === null) return [];
    return props[1] && await props[1].select<RecipeParameter[]>('SELECT * FROM recipe_parameter WHERE recipe_id = $1', [props[2]]);
  }

  const effectiveKey: Args | null = (db !== null && !!recipeId) ? [API, db, recipeId] : null;

  const swr = useSWR<Data, Error, Args> (
    effectiveKey,
    fetcher,
    option || {}
  );

  return swr;
}

export async function forcedMutate() {
  await mutate((key: string) => Array.isArray(key) && key[0] === API)
}
