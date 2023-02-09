import { InputEventData } from "./InputEventData";

export interface EventItem {
  timestamp: number;
  url_object: {
    domain: string;
    path: string;
    query_object: { [key: string]: string | string[] | undefined };
    hash: string;
  };
  ec: InputEventData;
}
