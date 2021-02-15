import { JSDOM } from "jsdom";

import { DOMAIN } from "../consts";
import { fetchText, generatePostId } from "../utils";
import { IPost, IPostDetails } from "../interfaces";

export const parsePost = async (
  parent: IPost,
  text: string
): Promise<IPostDetails> => {
  const dom = new JSDOM(text);
  const post = dom.window.document.getElementById("nonprop") as HTMLPreElement;

  const sender = post.querySelector("#MSGHDR-SENDER-PRE")
    ?.textContent as string;
  const from = (post.querySelector("#MSGHDR-FROM-PRE") as HTMLAnchorElement)
    .textContent as string;
  const subject =
    post.querySelector("#MSGHDR-SUBJECT-PRE")?.textContent ?? null;
  const contentType = post.querySelector("#MSGHDR-CONTENT-TYPE-PRE")
    ?.textContent as string;

  const postText = post.querySelector("p")?.textContent as string;

  const htmlAnchorEl = post.querySelector("a[target=blank]");

  let htmlUrl = null;
  let html = null;
  if (htmlAnchorEl !== null) {
    htmlUrl = `${DOMAIN}${(htmlAnchorEl as HTMLAnchorElement).href}`;

    try {
      html = await fetchText(htmlUrl);
    } catch (err) {
      console.error(err);
    }
  }

  return {
    id: generatePostId(parent.url, parent.title),
    sender,
    from,
    subject,
    contentType,
    text: postText,
    htmlUrl,
    html,
  };
};
