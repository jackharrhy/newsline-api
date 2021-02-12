import fetch from "node-fetch";

import { HEADERS } from "./consts";

export const fetchText = async (uri: string): Promise<string> => {
  console.log(`fetching ${uri}...`);
  const response = await fetch(uri, { headers: HEADERS });
  const text = await response.text();
  console.log(`fetched ${uri}`);
  return text;
};
