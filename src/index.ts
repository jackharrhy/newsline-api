import { fetchText } from "./utils";
import { ARCHIVE_INDEX } from "./consts";
import { parseArchiveIndex } from "./parsers/archiveIndex";
import { parseMonth } from "./parsers/month";

const main = async () => {
  const archiveIndexText = await fetchText(ARCHIVE_INDEX);
  const archiveIndexData = parseArchiveIndex(archiveIndexText);
  const latestMonth = archiveIndexData[0];
  const latestMonthText = await fetchText(latestMonth.url);
  const posts = await parseMonth(latestMonthText);

  // const postText = await fetchText(url);
  // const details = await parsePost(postText);
};

try {
  main();
} catch(err) {
  console.error(err);
}
