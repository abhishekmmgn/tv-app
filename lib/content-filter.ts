export function isContentSafe(item: any): boolean {
  if (!item) return false;
  if (item.adult === true) return false;

  const blockedWords = ["porn", "porno", "erotica", "x-rated", "xxx"];
  const title = (item.title || item.name || "").toLowerCase();

  for (const word of blockedWords) if (title.includes(word)) return false;

  return true;
}
