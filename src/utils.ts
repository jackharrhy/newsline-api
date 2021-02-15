import { promises as fs } from "fs";
import fetch from "node-fetch";
import md5 from "md5";

import { HEADERS } from "./consts";
import logFactory from "./log";
const log = logFactory("utils");

export function generatePostId(url: string, title: string): string {
  return md5(`${encodeURI(url)}/${encodeURI(title)}`);
}

async function exists(path: string): Promise<boolean> {
  try {
    await fs.stat(path);
    return true;
  } catch (e) {
    return false;
  }
}

const actuallyFetch = async (uri: string): Promise<string> => {
  const response = await fetch(uri, { headers: HEADERS });
  const text = await response.text();

  const cachedFile = `./fetch-cache/${md5(uri)}`;
  await fs.writeFile(cachedFile, text);

  return text;
};

export const fetchText = async (
  uri: string,
  cache: boolean = true
): Promise<string> => {
  log(`fetching ${uri}...`);

  if (cache) {
    const cachedFile = `./fetch-cache/${md5(uri)}`;
    if (await exists(cachedFile)) {
      log("cache hit :)");
      return fs.readFile(cachedFile, "utf8");
    }

    log("cache miss :(");
  }

  return actuallyFetch(uri);
};
