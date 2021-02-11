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

interface IPost {
  title: string;
  url: string;
  date: Date;
}

const parsePostInMonth = (li : HTMLLIElement): IPost => {
  const a = li.childNodes[0] as HTMLAnchorElement;
  const dateText = li.childNodes[9].textContent as string;

  return {
    title: a.text,
    url: `${DOMAIN}${a.href}`,
    date: new Date(dateText),
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

(async () => {
  const archiveIndexText = await fetchText(ARCHIVE_INDEX);
  const archiveIndexData = parseArchiveIndex(archiveIndexText);
  const latest = archiveIndexData[0];
  const latestText = await fetchText(latest.url);
  console.log(parseMonth(latestText));
})();
