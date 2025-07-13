"use server";

import { HTTP_METHOD } from "next/dist/server/web/http";

export async function log(message: string) {
  console.log(`[${getTimestamp()}] ${message}`);
}

export async function logError(message: string) {
  log(`!!!!! ERROR: ${message}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function logRequest(url: string, method: HTTP_METHOD, body?: any) {
  log(`<<<<< Outgoing ${method} Request To ${url}`);
  if (body)
    log(`<<<<< Request Body: ${applyMasking(body)}`);
}

export async function logResponse(response: Response) {
  log(`>>>>> Incoming Response From ${response.url}`);
  log(`>>>>> Response Body: ${applyMasking(await (response.clone().text()))}`);
}

export async function logDBQuery(query: string) {
  const hideBody = /.*pass(word)?.*/.test(query) || query.length > 255;
  log(`@@@@@ DB Query: ${hideBody ? query.replace(/(WHERE|VALUES).*$/, "") : query.replace(/pass(word)?='.*'/, "")}`);
}

function getTimestamp() {
  return new Date().toISOString();
}

function applyMasking(raw: string) {
  const masked = raw;
  masked.replaceAll(/password": ?"[^"]*"/g, "password\": \"**********\"");
  masked.replaceAll(/pass": ?"[^"]*"/g, "pass\": \"**********\"");
  masked.replaceAll(/token": ?"[^"]*"/g, "password\": \"**********\"");
  return masked;
}