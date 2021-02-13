import fs from "fs";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

import logFactory from "./log";
const log = logFactory("db");

const initSql = `
CREATE TABLE IF NOT EXISTS month (
  name TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  last_updated TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS post (
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  date TEXT NOT NULL,
  month TEXT NOT NULL REFERENCES month,
  created TEXT NOT NULL,
  PRIMARY KEY (title, url)
);

CREATE TABLE IF NOT EXISTS post_detail (
  title TEXT NOT NULL REFERENCES post(title),
  url TEXT NOT NULL REFERENCES post(url),
  sender TEXT NOT NULL,
  "from" TEXT NOT NULL,
  subject TEXT,
  contenttype TEXT NOT NULL,
  text TEXT NOT NULL,
  htmlurl TEXT,
  html TEXT,
  PRIMARY KEY (title, url)
);
`;

export type DB = Database<sqlite3.Database, sqlite3.Statement>;

interface ISqliteMasterNameQuery {
  name: string;
}

export default async ({
  dbPath = "./newsline-api.db",
  shouldNuke = false,
} = {}) => {
  log(`dbPath: ${dbPath}, shouldNuke: ${shouldNuke}`);

  if (shouldNuke) {
    log("nuking...");
    try {
      fs.unlinkSync(dbPath);
    } catch (err) {
      console.error(err);
      log("error nuking, likely no file existed");
    }
    log("nuked");
  }

  const db = await open({
    filename: "./newsline-api.db",
    driver: sqlite3.Database,
  });

  const monthExists = await db.get<ISqliteMasterNameQuery | undefined>(
    `SELECT name FROM sqlite_master WHERE type='table' AND name = ?`,
    "month"
  );

  let isFresh = false;
  if (monthExists === undefined) {
    isFresh = true;
  }
  log(`isFresh: ${isFresh}`);

  await db.exec(initSql);

  return { isFresh, db };
};
