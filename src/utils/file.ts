import fs from "fs";

export const getFileNameListFromFolder = (
  folderPath: string,
  pattern: string
): string[] => {
  return fs.readdirSync(folderPath).filter((file) => file.endsWith(pattern));
};

export const createFolder = (folderPath: string) =>
  !fs.existsSync(folderPath) && fs.mkdirSync(folderPath);

export const getSizeInByte = (data: any) => JSON.stringify(data).length;
