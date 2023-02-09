import { InputEventData } from "./InputEventData";

export type InputItem = {
  ts: number;
  u: string;
  e: Array<InputEventData>;
};
