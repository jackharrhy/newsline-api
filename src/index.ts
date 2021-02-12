import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import { IMonth, IPost, IPostDetails } from "./interfaces";

const HEADERS = {
  "User-Agent": "github.com/jackharrhy/newsline-api",
  Accept: "text/html",
};

const DOMAIN = "http://cliffy.ucs.mun.ca";
const ARCHIVE_INDEX = `${DOMAIN}/archives/newsline.html`;

const SORT_QUERY_PARAMS = '&O=D&H=0&D=1&T=0';

const fetchText = async (uri : string) : Promise<string> => {
  console.log(`fetching ${uri}...`);
  const response = await fetch(uri, { headers: HEADERS });
  const text = await response.text();
  console.log(`fetched ${uri}`);
  return text;
};

const parseArchiveIndex = (text : string) : IMonth[] => {
  const dom = new JSDOM(text);
  const lis = Array.from(dom.window.document.querySelectorAll("li"));
  lis.shift();
  return lis.map((li) => {
    const a = li.children[0] as HTMLAnchorElement;
    return {
      name: a.text,
      url: `${DOMAIN}${a.href}${SORT_QUERY_PARAMS}`,
      posts: [],
    }
  });
};

const parsePostInMonth = async (li : HTMLLIElement): Promise<IPost> => {
  const a = li.childNodes[0] as HTMLAnchorElement;
  const dateText = li.childNodes[9].textContent as string;

  const url = `${DOMAIN}${a.href}`;
  const postText = await fetchText(url);
  const details = await parsePost(postText);

  return {
    title: a.text,
    url: `${DOMAIN}${a.href}`,
    date: new Date(dateText),
    details,
  };
};

const parseMonth = async (text : string): Promise<IPost[]> => {
  const dom = new JSDOM(text);
  const table = dom.window.document.querySelectorAll('table')[1];

  const ol = table.querySelector('ol') as HTMLOListElement;
  const lis = Array.from(ol.querySelectorAll('li'));

  const posts = [];
  for (const li of lis) {
    try {
      posts.push(await parsePostInMonth(li));
    } catch(err) {
      console.error(err);
    }
  }
  return posts;
};

const parsePost = async (text : string): Promise<IPostDetails> => {
  const dom = new JSDOM(text);
  const post = dom.window.document.getElementById('nonprop') as HTMLPreElement;

  const sender = post.querySelector('#MSGHDR-SENDER-PRE')?.textContent as string;
  const from = (post.querySelector('#MSGHDR-FROM-PRE') as HTMLAnchorElement).textContent as string;
  const subject = post.querySelector('#MSGHDR-SUBJECT-PRE')?.textContent as string;
  const contentType = post.querySelector('#MSGHDR-CONTENT-TYPE-PRE')?.textContent as string;

  const postText = post.children[3].textContent as string;
  const htmlUrl = `${DOMAIN}${(post.querySelector('a[target=blank]') as HTMLAnchorElement).href}`;

  let html = null;
  try {
    html = await fetchText(htmlUrl);
  } catch(err) {
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

const main = async () => {
  const archiveIndexText = await fetchText(ARCHIVE_INDEX);
  const archiveIndexData = parseArchiveIndex(archiveIndexText);
  const latestMonth = archiveIndexData[0];
  const latestMonthText = await fetchText(latestMonth.url);
  try {
    const posts = await parseMonth(latestMonthText);
  } catch(err) {
    console.error(err);
  }
};

try {
  main();
} catch(err) {
  console.error(err);
}
