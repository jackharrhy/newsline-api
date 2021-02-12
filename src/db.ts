import sqlite3 from "sqlite3"
import { open } from "sqlite"

const initSql = `
CREATE TABLE IF NOT EXISTS month (
    name TEXT PRIMARY KEY,
    date TEXT NOT NULL,
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
    subject TEXT NOT NULL,
    contenttype TEXT NOT NULL,
    text TEXT NOT NULL,
    htmlurl TEXT NOT NULL,
    html TEXT,
    PRIMARY KEY (title, url)
);
`;

export default async () => {
    const db = await open({
        filename: './newsline-api.db',
        driver: sqlite3.Database
    });
    await db.exec(initSql);
    return db;
};