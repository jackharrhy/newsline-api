import express from "express";

import { DB } from "./db";
import { IPostOverview } from "./interfaces";
import logFactory from "./log";
const log = logFactory("express");

export default async (db: DB, { port = 4000 } = {}) => {
  const app = express();

  app.get("/", async (req, res) => {
    const postOverview = await db.all<IPostOverview>("SELECT * FROM post_overview");
    return res.json(postOverview);
  });

  return {
    listen: () => {
      app.listen(port, () => {
        log(`server started at http://localhost:${port}`);
      });
    },
  };
};
