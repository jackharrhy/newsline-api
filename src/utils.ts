import fetch from "node-fetch";

import { HEADERS } from "./consts";
import logFactory from "./log";
const log = logFactory("utils");

export const fetchText = async (uri: string): Promise<string> => {
  log(`fetching ${uri}...`);
  const response = await fetch(uri, { headers: HEADERS });
  const text = await response.text();
  log(`fetched ${uri}`);
  return text;
};
