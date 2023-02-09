import { ExtractService } from "@services";
import { getFileNameListFromFolder } from "@utils/file";

import path from "path";
import { EXTRACT_FOLDER_PATH } from "./__mocks__/constant";

describe("Testing Extract Service", () => {
  it("should extract json files from input zip into extract folder", async () => {
    const service = new ExtractService(EXTRACT_FOLDER_PATH);

    await service.extractZipInput(
      path.resolve(__dirname, "./assets/test-input.zip")
    );

    const fileNames = getFileNameListFromFolder(EXTRACT_FOLDER_PATH, ".json");

    expect(fileNames.length).toBe(2);
    expect(fileNames[0]).toBe("t1669976028340.json");
    expect(fileNames[1]).toBe("t1669976029630.json");
  });
});
