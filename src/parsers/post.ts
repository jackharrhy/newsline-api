import { JSDOM } from "jsdom";

import { DOMAIN } from "../consts";
import { fetchText } from "../utils";
import { IPostDetails } from "../interfaces";

export const parsePost = async (text: string): Promise<IPostDetails> => {
  const dom = new JSDOM(text);
  const post = dom.window.document.getElementById("nonprop") as HTMLPreElement;

  const sender = post.querySelector("#MSGHDR-SENDER-PRE")
    ?.textContent as string;
  const from = (post.querySelector("#MSGHDR-FROM-PRE") as HTMLAnchorElement)
    .textContent as string;
  const subject = post.querySelector("#MSGHDR-SUBJECT-PRE")
    ?.textContent as string;
  const contentType = post.querySelector("#MSGHDR-CONTENT-TYPE-PRE")
    ?.textContent as string;

  const postText = post.children[3].textContent as string;
  const htmlUrl = `${DOMAIN}${
    (post.querySelector("a[target=blank]") as HTMLAnchorElement).href
  }`;

  let html = null;
  try {
    html = await fetchText(htmlUrl);
  } catch (err) {
    console.error(err);
  }

  return {
    sender,
    from,
    subject,
    contentType,
    text: postText,
    htmlUrl,
    html,
  };
};
