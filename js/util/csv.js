const commaRegexText = '[,](?=(?:(?:[^"]*"){2})*[^"]*$)';
const termRegexText = '^\s*["](.*)["]\s*$';

export function importCsv({
  text = '',
  delimiter = ';,',
  stringDelimiter = '"',
}) {
  delimiter = RegExp.escape(delimiter);
  stringDelimiter = RegExp.escape(stringDelimiter);
  const results = [];
  const termRegex = new RegExp(
    termRegexText.replaceAll('"', stringDelimiter)
  );
  const commaRegex = new RegExp(
    commaRegexText
      .replaceAll('"', stringDelimiter)
      .replaceAll(',', delimiter)
  );
  for (const line of text.split('\n')) {
    if (!line) {
      continue;
    }
    const columns = line.split(commaRegex)
      .map(col => col.replace(termRegex, '$1'));
    results.push(columns);
  }
  return results;
}
