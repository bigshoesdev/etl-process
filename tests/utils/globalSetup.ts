import {
  EXTRACT_FOLDER_PATH,
  OUTPUT_FOLDER_PATH,
} from "@tests/__mocks__/constant";
import fs from "fs";

beforeEach(() => removeFolders());

afterEach(() => removeFolders());

const removeFolders = () => {
  fs.rmSync(EXTRACT_FOLDER_PATH, { recursive: true, force: true });
  fs.rmSync(OUTPUT_FOLDER_PATH, { recursive: true, force: true });
};
