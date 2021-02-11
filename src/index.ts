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

(async () => {
  const archiveIndex = await fetchArchiveIndex();
  console.log(archiveIndex);
})();
