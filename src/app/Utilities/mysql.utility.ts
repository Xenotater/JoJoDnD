import mysql from "mysql2/promise";
import { NextResponse } from "next/server";
import { logDBQuery, logError } from "./logging.utility";

const connectParams = {
  host: 'localhost',
  port: 3306,
  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  database: "JoJoDnD"
};

export async function getDBConnection() {
  return await mysql.createConnection(connectParams);
}

//TODO: is this a security risk..? It shouldn't be exposed to the client
export async function doDBQuery(query: string, values: (string | null)[] = [], log: boolean = true) {
  try {
    const connection = await getDBConnection();
    
    await connection.connect();
    if (log)
      logDBQuery(query, values);
    const [results] = await connection.execute(query, values);
    connection.end();

    return NextResponse.json(results, {status: 200});
  }
  catch (err) {
    logError("DB ERROR: " + (err as Error).message);
    switch(err.errno) {
      case 1062:
        return NextResponse.json({error: err}, {status: 409})
      default:
        return NextResponse.json({error: err}, {status: 500})
    }
  }
}