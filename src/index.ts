import { JSDOM } from "jsdom";
import fetch from "node-fetch";

const HEADERS = {
  "User-Agent": "github.com/jackharrhy/newsline-api",
  Accept: "text/html",
};

const DOMAIN = "http://cliffy.ucs.mun.ca";
const ARCHIVE_INDEX = `${DOMAIN}/archives/newsline.html`;

const SORT_QUERY_PARAMS = '&O=D&H=0&D=1&T=0';

const fetchText = async (uri : string) : Promise<string> => {
  const response = await fetch(uri, { headers: HEADERS });
  return await response.text();
};

interface IMonth {
  name: string;
  url: string;
}

const parseArchiveIndex = (text : string) : IMonth[] => {
  const dom = new JSDOM(text);
  const lis = Array.from(dom.window.document.querySelectorAll("li"));
  lis.shift();
  return lis.map((li) => {
    const a = li.children[0] as HTMLAnchorElement;
    return {
      name: a.text,
      url: `${DOMAIN}${a.href}${SORT_QUERY_PARAMS}`,
    }
  });
};

interface IPostDetails {
  sender: string,
  from: string,
  subject: string,
  contentType: string,
  text: string,
  htmlUrl: string,
  html: string | null,
}
interface IPost {
  title: string;
  url: string;
  date: Date;
  details: IPostDetails | null;
}

const parsePostInMonth = (li : HTMLLIElement): IPost => {
  const a = li.childNodes[0] as HTMLAnchorElement;
  const dateText = li.childNodes[9].textContent as string;

  return {
    title: a.text,
    url: `${DOMAIN}${a.href}`,
    date: new Date(dateText),
    details: null,
  };
};

const parseMonth = (text : string): IPost[] => {
  const dom = new JSDOM(text);
  const table = dom.window.document.querySelectorAll('table')[1];
  const ol = table.querySelector('ol') as HTMLOListElement;
  const lis = Array.from(ol.querySelectorAll('li'));
  return lis.map((li) => {
    return parsePostInMonth(li);
  });
};

const parsePost = (text : string): IPostDetails => {
  const dom = new JSDOM(text);
  const post = dom.window.document.getElementById('nonprop') as HTMLPreElement;

  const sender = post.querySelector('#MSGHDR-SENDER-PRE')?.textContent as string;
  const from = (post.querySelector('#MSGHDR-FROM-PRE') as HTMLAnchorElement).textContent as string;
  const subject = post.querySelector('#MSGHDR-SUBJECT-PRE')?.textContent as string;
  const contentType = post.querySelector('#MSGHDR-CONTENT-TYPE-PRE')?.textContent as string;

  const postText = post.children[3].textContent as string;
  const htmlUrl = post.querySelectorAll('a')[1].href;

  return {
    sender,
    from,
    subject,
    contentType,
    text: postText,
    htmlUrl,
    html: null,
  };
};

// things to do
// - populate posts with posts details
// - populate a post with its html

(async () => {
  const archiveIndexText = await fetchText(ARCHIVE_INDEX);
  const archiveIndexData = parseArchiveIndex(archiveIndexText);
  const latestMonth = archiveIndexData[0];
  const latestMonthText = await fetchText(latestMonth.url);
  const posts = parseMonth(latestMonthText);
  const latestPost = posts[0];
  const latestPostText = await fetchText(latestPost.url);
  const postDetails = parsePost(latestPostText);
  console.log(postDetails);
})();
