import { JSDOM } from "jsdom";
import fetch from "node-fetch";

const HEADERS = {
  "User-Agent": "github.com/jackharrhy/newsline-api",
  Accept: "text/html",
};

const DOMAIN = "http://cliffy.ucs.mun.ca";
const ARCHIVE_INDEX = `${DOMAIN}/archives/newsline.html`;

const fetchArchiveIndex = async () : Promise<string> => {
  const response = await fetch(ARCHIVE_INDEX, { headers: HEADERS });
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
      url: `${DOMAIN}${a.href}`,
    }
  });
};

(async () => {
  const archiveIndexText = await fetchArchiveIndex();
  const archiveIndexData = parseArchiveIndex(archiveIndexText);
  console.log(archiveIndexData);
})();
