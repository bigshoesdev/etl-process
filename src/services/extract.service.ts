import { createFolder, getFileNameListFromFolder } from "@utils/file";
import { Logger } from "@utils/logger";
import fs from "fs";
import StreamZip from "node-stream-zip";
import zlib from "zlib";
import path from "path";

export class ExtractService {
  constructor(private extractFolderPath: string) {
    createFolder(extractFolderPath);
  }

  public async extractZipInput(zipInputPath: string): Promise<void> {
    Logger.info(
      `Started extracting ${zipInputPath} into ${this.extractFolderPath} folder`
    );
    await this.extractZipInputIntoTempFolder(zipInputPath);
    Logger.info(
      `Ended extracting ${zipInputPath} into ${this.extractFolderPath} folder`
    );
    Logger.info(
      `Started extracting json from gzip files in ${this.extractFolderPath} folder`
    );
    await this.extractJsonFilesFromGZipInFolder();
    Logger.info(
      `Ended extracting json files from gzip files in ${this.extractFolderPath} folder`
    );
  }

  private async extractZipInputIntoTempFolder(
    zipInputPath: string
  ): Promise<void> {
    const zip = new StreamZip.async({ file: zipInputPath });

    const entries = await zip.entries();

    const zipContentItems = Object.values(entries);

    await Promise.all(
      zipContentItems.map((item) =>
        zip.extract(item.name, this.extractFolderPath)
      )
    );

    await zip.close();
  }

  private async extractJsonFilesFromGZipInFolder(): Promise<void> {
    const fileNames: string[] = getFileNameListFromFolder(
      this.extractFolderPath,
      ".gz"
    );

    await Promise.all(
      fileNames.map((fileName) => {
        const gzFilePath = path.join(this.extractFolderPath, fileName);
        const jsonFileName = fileName.split(".gz")[0];

        const data = fs.readFileSync(gzFilePath);

        const result = zlib.gunzipSync(data);

        fs.writeFileSync(
          path.join(this.extractFolderPath, jsonFileName),
          result
        );

        fs.unlinkSync(gzFilePath);
      })
    );
  }
}
