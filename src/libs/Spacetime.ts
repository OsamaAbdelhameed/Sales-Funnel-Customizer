const SPACETIMEDB_URL = process.env.DATABASE_URL || 'http://localhost:3000';

export async function callReducer(reducerName: string, args: any[]) {
  try {
    const response = await fetch(`${SPACETIMEDB_URL}/database/call/${reducerName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args),
    });
    return await response.json();
  } catch (error) {
    console.error(`Error calling reducer ${reducerName}:`, error);
    throw error;
  }
}

export async function queryTable(tableName: string) {
  try {
    const response = await fetch(`${SPACETIMEDB_URL}/database/query/${tableName}`, {
      method: 'GET',
    });
    return await response.json();
  } catch (error) {
    console.error(`Error querying table ${tableName}:`, error);
    throw error;
  }
}
