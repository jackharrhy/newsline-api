import { fetchText } from "./utils";
import { ARCHIVE_INDEX } from "./consts";
import { parseArchiveIndex } from "./parsers/archiveIndex";
import { parseMonth } from "./parsers/month";
import { parsePost } from "./parsers/post";
import initExpress from "./express";
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
        const details = await parsePost(post, postText);

        await insertIfNotExistsPostDetails(db, details);
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
    const { listen } = await initExpress(db);

    if (isFresh) {
      log("db is fresh, cooking up some posts...");
      await populateAll(db);
    } else {
      log("db is not fresh");
    }

    // TODO every so often keep the database up to date with new posts

    listen();
  } catch (err) {
    console.error(err);
  }
};

main();
