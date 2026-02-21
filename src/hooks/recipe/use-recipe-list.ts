import useSWR, { SWRConfiguration } from "swr";

import { useSqliteStore } from "@/stores/sqlite";
import Database from "@tauri-apps/plugin-sql";
import { Recipe } from "@/types/recipe";

const API: string = "get_printer_network"

type Data = Recipe[] | null;
type Args = [string, Database] | null;

export default function useRecipeList (option?: SWRConfiguration) {

  const { db } = useSqliteStore();

  async function fetcher(props: Args): Promise<Data> {
    if (props === null) return [];
    return props[1] && await props[1].select<Recipe[]>('SELECT * FROM recipe');
  }

  const effectiveKey: Args | null = (db !== null) ? [API, db] : null;

  const swr = useSWR<Data, Error, Args> (
    effectiveKey,
    fetcher,
    option || {}
  );

  return swr;
}
