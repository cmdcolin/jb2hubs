/**
 * Parses a single line from a tab-separated table into an object.
 * It maps column values to their respective column names.
 * Handles escaped tabs within the line (e.g., '\t').
 * @param line The tab-separated string representing a row in the table.
 * @param colNames An array of column names, in the order they appear in the line.
 * @returns An object where keys are column names and values are the parsed column data.
 */
export function parseTableLine(
  line: string,
  colNames: string[],
): Record<string, string> {
  // Replace escaped tabs with a placeholder before splitting, then split by tab
  const values = line.replaceAll('\\t', '__ESCAPED_TAB__').split('\t')

  const parsedObject: Record<string, string> = {}
  values.forEach((value, index) => {
    const colName = colNames[index]
    if (colName) {
      // Replace placeholder back to tab
      parsedObject[colName] = value.replaceAll('__ESCAPED_TAB__', '\t')
    }
  })

  return parsedObject
}
