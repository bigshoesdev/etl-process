import { ExtractService, TransformService } from "@services";


async function main() {
  const inputZipPath = process.env.INPUT_ZIP_PATH as string;
  const extractFolderPath = process.env.EXTRACT_FOLDER_PATH as string;
  const outputFolderPath = process.env.OUTPUT_FOLDER_PATH as string;

  const extractService = new ExtractService(extractFolderPath);
  await extractService.extractZipInput(inputZipPath);

  const transformService = new TransformService(
    extractFolderPath,
    outputFolderPath
  );

  await transformService.transform();
}

main();
