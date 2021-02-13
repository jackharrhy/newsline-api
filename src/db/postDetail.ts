import { IPost, IPostDetails } from "../interfaces";
import { DB } from "../db";
import logFactory from "../log";
const log = logFactory("db/postDetails");

interface ISqlitePostDetailsExistsQuery {
  title: string;
}

export const insertIfNotExistsPostDetails = async (
  db: DB,
  post: IPost,
  postDetails: IPostDetails
) => {
  const postDetailsExists = await db.get<
    ISqlitePostDetailsExistsQuery | undefined
  >(
    `SELECT title FROM post_detail WHERE title = ? AND url = ?`,
    post.title,
    post.url
  );

  if (postDetailsExists === undefined) {
    await db.run(
      `INSERT INTO post_detail (
        title, url, sender, "from", subject, contenttype, text, htmlurl, html
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      post.title,
      post.url,
      postDetails.sender,
      postDetails.from,
      postDetails.subject,
      postDetails.contentType,
      postDetails.text,
      postDetails.htmlUrl,
      postDetails.html
    );
    log(`postDetails: ${post.title} now exists!`);
  } else {
    log(`postDetails: ${post.title} already exists`);
  }
};
