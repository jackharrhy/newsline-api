import { IMonth, IPost } from "../interfaces";
import { DB } from "../db";
import logFactory from "../log";
const log = logFactory("db/post");

interface ISqlitePostExistsQuery {
  id: string;
}

export const insertIfNotExistsPost = async (
  db: DB,
  month: IMonth,
  post: IPost
) => {
  const postExists = await db.get<ISqlitePostExistsQuery | undefined>(
    `SELECT id FROM post WHERE id = ?`,
    post.id
  );

  if (postExists === undefined) {
    await db.run(
      "INSERT INTO post (id, title, url, date, month, created) VALUES (?, ?, ?, ?, ?, ?)",
      post.id,
      post.title,
      post.url,
      post.date.toISOString(),
      month.name,
      new Date().toISOString()
    );
    log(`post: ${post.title} now exists!`);
    return true;
  } else {
    log(`post: ${post.title} already exists`);
    return false;
  }
};
