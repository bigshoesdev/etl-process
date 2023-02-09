import {
  getFileNameListFromFolder,
  createFolder,
  getSizeInByte,
} from "@utils/file";
import { Logger } from "@utils/logger";
import { InputItem, EventItem } from "@definitions";
import fs from "fs";
import path from "path";
import URL from "url";
import { v4 as uuidv4 } from "uuid";

export const FILE_SIZE_THRESHOLD = 8 * 1024;

export class TransformService {
  constructor(
    private extractFolderPath: string,
    private outputFolderPath: string
  ) {
    createFolder(outputFolderPath);
  }

  public async transform(): Promise<void> {
    Logger.info(
      `Starting transforming json data from files in ${this.extractFolderPath} folder`
    );

    const fileNames: string[] = getFileNameListFromFolder(
      this.extractFolderPath,
      ".json"
    );

    let bufferedEventItems: EventItem[] = [];

    for (const fileName of fileNames) {
      const data = fs.readFileSync(path.join(this.extractFolderPath, fileName));
      const inputItem = JSON.parse(data.toString()) as InputItem;

      const eventItems = this.getEventItemsFromInput(inputItem);

      if (
        getSizeInByte(bufferedEventItems) + getSizeInByte(eventItems) >
        FILE_SIZE_THRESHOLD
      ) {
        for (let i = 0; i < eventItems.length; i++) {
          const subEventItems = eventItems.slice(0, i + 1);
          if (
            getSizeInByte(bufferedEventItems) + getSizeInByte(subEventItems) >
            FILE_SIZE_THRESHOLD
          ) {
            this.saveEventItems(
              bufferedEventItems.concat(eventItems.slice(0, i))
            );
            bufferedEventItems = eventItems.splice(i, eventItems.length);
            break;
          }
        }
      } else {
        bufferedEventItems = bufferedEventItems.concat(eventItems);
      }
    }

    this.saveEventItems(bufferedEventItems);

    Logger.info(
      `Finished transforming json data from files in ${this.extractFolderPath} folder`
    );
  }

  private saveEventItems(eventItems: EventItem[]) {
    fs.writeFileSync(
      path.join(this.outputFolderPath, `${uuidv4()}.json`),
      JSON.stringify(eventItems)
    );
  }

  public getEventItemsFromInput(inputItem: InputItem): EventItem[] {
    let eventItemList: EventItem[] = [];

    for (const event of inputItem.e) {
      let url = URL.parse(inputItem.u, true);

      let output: EventItem = {
        timestamp: inputItem.ts,
        url_object: {
          domain: url.hostname || "",
          path: url.pathname || "",
          query_object: url.query || {},
          hash: url.hash || "",
        },
        ec: event,
      };

      eventItemList.push(output);
    }

    return eventItemList;
  }
}
