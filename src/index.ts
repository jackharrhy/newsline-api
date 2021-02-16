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

const POPULATE_INTERVAL = 5 * 60 * 1000; // 5 minutes

const log = logFactory("index");

const populate = async (db: DB): Promise<number> => {
  log("populating...");
  let newPosts = 0;
  const archiveIndexText = await fetchText(ARCHIVE_INDEX, false);
  const months = parseArchiveIndex(archiveIndexText);

  try {
    db.exec("BEGIN TRANSACTION");
    for (const month of months) {
      log(`populating ${month.name}...`);
      await insertIfNotExistsMonth(db, month);

      const monthText = await fetchText(month.url, false);
      const posts = await parseMonth(monthText);

      let sawAnyNewPosts = false;

      for (const post of posts) {
        const postCreated = await insertIfNotExistsPost(db, month, post);

        if (postCreated) {
          newPosts += 1;
          sawAnyNewPosts = true;

          const postText = await fetchText(post.url);
          const details = await parsePost(post, postText);

          await insertIfNotExistsPostDetails(db, details);
        }
      }

      if (!sawAnyNewPosts) {
        log("saw no new posts in month, stopping population...");
        break;
      }
      log(`populated ${month.name}`);
    }
    db.exec("COMMIT");
  } catch (err) {
    console.error(err);
    db.exec("ROLLBACK");
  }
  log(`populated, ${newPosts} new posts!`);
  return newPosts;
};

const main = async () => {
  try {
    const { db } = await dbFactory();
    const { listen } = await initExpress(db);

    await populate(db);

    setInterval(async () => {
      log("updating...");
      await populate(db);
    }, POPULATE_INTERVAL);

    listen();
  } catch (err) {
    console.error(err);
  }
};

main();
