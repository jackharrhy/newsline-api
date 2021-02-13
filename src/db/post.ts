import { IMonth, IPost } from "../interfaces";
import { DB } from "../db";
import logFactory from "../log";
const log = logFactory("db/post");

interface ISqlitePostExistsQuery {
  title: string;
}

export const insertIfNotExistsPost = async (
  db: DB,
  month: IMonth,
  post: IPost
) => {
  const postExists = await db.get<ISqlitePostExistsQuery | undefined>(
    `SELECT title FROM post WHERE title = ? AND url = ?`,
    post.title,
    post.url
  );

  if (postExists === undefined) {
    await db.run(
      "INSERT INTO post (title, url, date, month, created) VALUES (?, ?, ?, ?, ?)",
      post.title,
      post.url,
      post.date.toISOString(),
      month.name,
      new Date().toISOString()
    );
    log(`post: ${post.title} now exists!`);
  } else {
    log(`post: ${post.title} already exists`);
  }
};
