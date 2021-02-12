import sqlite3 from "sqlite3"
import { open } from "sqlite"

export default async () => {
    const db = await open({
        filename: 'newsline-api.db',
        driver: sqlite3.Database
    });
    // await db.exec(`CREATE TABLE`);
    return db;
};