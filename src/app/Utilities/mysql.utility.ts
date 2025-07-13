import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';
import { logDBQuery } from './logging.utility';

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

export async function doDBQuery(query: string, log: boolean = true) {
  try {
    const connection = await getDBConnection();
    
    await connection.connect();
    if (log)
      logDBQuery(query);
    const [results] = await connection.execute(query)
    connection.end();

    return NextResponse.json(results, {status: 200});
  }
  catch (err) {
    console.log("DB ERROR:");
    console.log(err);
    return NextResponse.json({error: err}, {status: 500})
  }
}