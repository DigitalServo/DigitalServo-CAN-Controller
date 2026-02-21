import { open } from "@tauri-apps/plugin-dialog";

export type FilePathProps = {
  dirname: string,
  base: string,
  ext: string,
  filename: string
}

export async function getFileStatus (path: string): Promise<FilePathProps> {
  const {basename, extname} = await import("@tauri-apps/api/path");

  const base: string = await basename(path);
  const ext: string = await extname(path);
  const filename: string = base.replace('.' + ext, '');
  const dirname: string = path.replace(base, '');

  return {dirname, base, ext, filename};
}

export async function openExcelFile (): Promise<string | null> {
  return await open({
    title: 'Open Spreadsheet',
    multiple: false,
    directory: false,
    filters: [{name: 'Excel Workbook', extensions: ['xls', 'xlsx']}]
  });
};
