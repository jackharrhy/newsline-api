import { JSDOM } from "jsdom";

import { DOMAIN } from "../consts";
import { IPost } from "../interfaces";

export const parseMonth = async (text: string): Promise<IPost[]> => {
  const dom = new JSDOM(text);
  const table = dom.window.document.querySelectorAll("table")[1];

  const ol = table.querySelector("ol") as HTMLOListElement;
  const lis = Array.from(ol.querySelectorAll("li"));

  const posts = [];
  for (const li of lis) {
    try {
      posts.push(await parsePostInMonth(li));
    } catch (err) {
      console.error(err);
    }
  }
  return posts;
};

export const parsePostInMonth = async (li: HTMLLIElement): Promise<IPost> => {
  const a = li.childNodes[0] as HTMLAnchorElement;
  const dateText = li.childNodes[9].textContent as string;
  const url = `${DOMAIN}${a.href}`;

  return {
    title: a.text,
    url,
    date: new Date(dateText),
    details: null,
  };
};
