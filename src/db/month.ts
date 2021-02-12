import { IMonth } from "../interfaces";
import { DB } from "../db";
import logFactory from "../log";
const log = logFactory("db/month");

interface ISqliteMonthExistsQuery {
  name: string;
}

export const insertIfNotExistsMonth = async (db: DB, month: IMonth) => {
  db.exec("BEGIN TRANSACTION");
  const monthExists = await db.get<ISqliteMonthExistsQuery | undefined>(
    `SELECT name FROM month WHERE name = ?`,
    month.name
  );

  if (monthExists === undefined) {
    await db.run(
      "INSERT INTO month (name, url, last_updated) VALUES (?, ?, ?)",
      month.name,
      month.url,
      new Date().toISOString()
    );
    log(`month: ${month.name} now exists!`);
  } else {
    log(`month: ${month.name} already exists`);
  }
  db.exec("COMMIT");
};
