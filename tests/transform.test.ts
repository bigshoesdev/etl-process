import {
  ExtractService,
  FILE_SIZE_THRESHOLD,
  TransformService,
} from "@services";
import { getFileNameListFromFolder } from "@utils/file";

import fs from "fs";
import path from "path";
import { EXTRACT_FOLDER_PATH, OUTPUT_FOLDER_PATH } from "./__mocks__/constant";
import { MOCK_INPUT_ITEM } from "./__mocks__/data";

describe("Testing Transform Service", () => {
  it("should convert input item into event items", async () => {
    const service = new TransformService(
      EXTRACT_FOLDER_PATH,
      OUTPUT_FOLDER_PATH
    );

    const eventItems = service.getEventItemsFromInput(MOCK_INPUT_ITEM);

    expect(eventItems.length).toBe(7);
    expect(eventItems[0]).toEqual({
      ec: { et: "ur" },
      timestamp: 1669976045207,
      url_object: {
        domain: "www.someplace.com",
        hash: "#/afkwua",
        path: "/zxbyzs",
        query_object: { b3: "4", b9: "70", var1: "82", var4: "28" },
      },
    });
    expect(eventItems[6]).toEqual({
      ec: { er: { l: 28, m: "unknown error", s: "call stack" }, et: "j" },
      timestamp: 1669976045207,
      url_object: {
        domain: "www.someplace.com",
        hash: "#/afkwua",
        path: "/zxbyzs",
        query_object: { b3: "4", b9: "70", var1: "82", var4: "28" },
      },
    });
  });

  it("should transform into json and the file size should be less than threshold", async () => {
    const extractService = new ExtractService(EXTRACT_FOLDER_PATH);

    await extractService.extractZipInput(
      path.resolve(__dirname, "./assets/test-input.zip")
    );

    const service = new TransformService(
      EXTRACT_FOLDER_PATH,
      OUTPUT_FOLDER_PATH
    );

    service.transform();

    const fileNames = getFileNameListFromFolder(OUTPUT_FOLDER_PATH, ".json");

    expect(fileNames.length).toBe(2);

    const filePath1 = path.join(OUTPUT_FOLDER_PATH, fileNames[0]);

    const jsonFile1Stats = fs.statSync(filePath1);
    expect(jsonFile1Stats.size).toBeLessThan(FILE_SIZE_THRESHOLD);

    const filePath2 = path.join(OUTPUT_FOLDER_PATH, fileNames[1]);

    const jsonFile2Stats = fs.statSync(filePath2);
    expect(jsonFile2Stats.size).toBeLessThan(FILE_SIZE_THRESHOLD);

    const fileData1 = fs.readFileSync(filePath1);

    const fileData2 = fs.readFileSync(filePath2);

    expect(
      JSON.parse(fileData1.toString()).length +
        JSON.parse(fileData2.toString()).length
    ).toBe(11);
  });
});
