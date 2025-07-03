import pkg from 'node-sql-parser'
const { Parser } = pkg

/**
 * Extracts column names and table name from a SQL CREATE TABLE statement.
 * @param sqlContent The SQL CREATE TABLE statement as a string.
 * @returns An object containing the table name and an array of column names.
 * @throws Error if the SQL content cannot be parsed or does not contain a CREATE TABLE statement.
 */
export function getColNames(sqlContent: string): {
  tableName: string
  colNames: string[]
} {
  const parser = new Parser()
  // Parse the SQL content. Assumes MySQL grammar by default.
  const ast = parser.astify(sqlContent)

  // Find the CREATE TABLE statement in the AST
  // @ts-expect-error - The AST type definition might not perfectly match runtime structure
  const createStatement = ast.find(node => node.type === 'create')

  if (
    !createStatement ||
    !createStatement.table ||
    !createStatement.create_definitions
  ) {
    throw new Error(
      'Invalid SQL content: Could not find a CREATE TABLE statement or its definitions.',
    )
  }

  const tableName = createStatement.table[0].table

  // Filter for column definitions
  const columnDefinitions = createStatement.create_definitions.filter(
    (def: any) => def.resource === 'column',
  ) as { column: { column: string } }[]

  const colNames = columnDefinitions.map(colDef => colDef.column.column)

  return {
    tableName,
    colNames,
  }
}
