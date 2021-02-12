import { fetchText } from "./utils";
import { ARCHIVE_INDEX } from "./consts";
import { parseArchiveIndex } from "./parsers/archiveIndex";
import { parseMonth } from "./parsers/month";

import dbFactory, { DB } from "./db";
import { insertIfNotExistsMonth } from "./db/month";

const populateAll = async (db: DB) => {
  const archiveIndexText = await fetchText(ARCHIVE_INDEX);
  const months = parseArchiveIndex(archiveIndexText);

  for (const month of months) {
    await insertIfNotExistsMonth(db, month);
  }
};

const main = async () => {
  const { isFresh, db } = await dbFactory({ shouldNuke: true });

  if (isFresh) {
    await populateAll(db);
  }

  /*
  const latestMonth = archiveIndexData[0];
  const latestMonthText = await fetchText(latestMonth.url);
  const posts = await parseMonth(latestMonthText);
  // const postText = await fetchText(url);
  // const details = await parsePost(postText);
  */
};

try {
  main();
} catch (err) {
  console.error(err);
}
