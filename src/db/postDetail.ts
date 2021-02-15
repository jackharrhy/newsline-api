import { IPostDetails } from "../interfaces";
import { DB } from "../db";
import logFactory from "../log";
const log = logFactory("db/postDetails");

interface ISqlitePostDetailsExistsQuery {
  id: string;
}

export const insertIfNotExistsPostDetails = async (
  db: DB,
  postDetails: IPostDetails
) => {
  const postDetailsExists = await db.get<
    ISqlitePostDetailsExistsQuery | undefined
  >(`SELECT id FROM post_detail WHERE id = ?`, postDetails.id);

  if (postDetailsExists === undefined) {
    await db.run(
      `INSERT INTO post_detail (
        id, sender, "from", subject, contenttype, text, htmlurl, html
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      postDetails.id,
      postDetails.sender,
      postDetails.from,
      postDetails.subject,
      postDetails.contentType,
      postDetails.text,
      postDetails.htmlUrl,
      postDetails.html
    );
    log(`postDetails: ${postDetails.id} now exists!`);
  } else {
    log(`postDetails: ${postDetails.id} already exists`);
  }
};
