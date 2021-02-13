import { fetchText } from "./utils";
import { ARCHIVE_INDEX } from "./consts";
import { parseArchiveIndex } from "./parsers/archiveIndex";
import { parseMonth } from "./parsers/month";
import { parsePost } from "./parsers/post";
import dbFactory, { DB } from "./db";
import { insertIfNotExistsMonth } from "./db/month";
import { insertIfNotExistsPost } from "./db/post";
import { insertIfNotExistsPostDetails } from "./db/postDetail";
import logFactory from "./log";

const log = logFactory("index");

const populateAll = async (db: DB) => {
  log("populating all...");
  const archiveIndexText = await fetchText(ARCHIVE_INDEX);
  const months = parseArchiveIndex(archiveIndexText);

  try {
    db.exec("BEGIN TRANSACTION");
    for (const month of months) {
      await insertIfNotExistsMonth(db, month);

      const monthText = await fetchText(month.url);
      const posts = await parseMonth(monthText);

      for (const post of posts) {
        await insertIfNotExistsPost(db, month, post);

        const postText = await fetchText(post.url);
        const details = await parsePost(postText);

        await insertIfNotExistsPostDetails(db, post, details);
      }
    }
    db.exec("COMMIT");
  } catch (err) {
    console.error(err);
    db.exec("ROLLBACK");
  }
  log("populated all!");
};

const main = async () => {
  try {
    const { isFresh, db } = await dbFactory({ shouldNuke: true });

    if (isFresh) {
      await populateAll(db);
    }
  } catch (err) {
    console.error(err);
  }
};

main();
