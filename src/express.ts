import express from "express";

import { DB } from "./db";
import { ISqlPostDetails, ISqlPostOverview } from "./interfaces";
import logFactory from "./log";
const log = logFactory("express");

const PAGINATION_LIMIT = 100;

export default async (db: DB, { port = 4000 } = {}) => {
  const app = express();

  app.get("/posts", async (req, res) => {
    const page = Number(req.query.page ?? "0");
    const limit = Number(req.query.limit ?? "10");

    if (limit > PAGINATION_LIMIT) {
      res.sendStatus(400);
      return;
    }

    const offset = page * limit;

    res.json(
      await db.all<ISqlPostOverview[]>(
        "SELECT * FROM post_overview LIMIT ? OFFSET ?",
        limit,
        offset
      )
    );
  });

  app.get("/posts/:id/detail", async (req, res) => {
    const id = req.params.id;

    const data = await db.get<ISqlPostDetails | undefined>(
      "SELECT * FROM post_detail WHERE id = ?",
      id
    );

    if (data === undefined) {
      res.sendStatus(404);
    } else {
      res.json(data);
    }
  });

  return {
    listen: () => {
      app.listen(port, () => {
        log(`server started at http://localhost:${port}`);
      });
    },
  };
};
