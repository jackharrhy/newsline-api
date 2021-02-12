import { JSDOM } from "jsdom";

import { DOMAIN, SORT_QUERY_PARAMS } from "../consts";
import { IMonth } from "../interfaces";

export const parseArchiveIndex = (text: string): IMonth[] => {
  const dom = new JSDOM(text);
  const lis = Array.from(dom.window.document.querySelectorAll("li"));
  lis.shift();
  return lis.map((li) => {
    const a = li.children[0] as HTMLAnchorElement;
    return {
      name: a.text,
      url: `${DOMAIN}${a.href}${SORT_QUERY_PARAMS}`,
      posts: [],
    };
  });
};
