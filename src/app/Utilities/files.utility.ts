"use server";

import fs from "fs";

export async function getLatestFileName(path: string, comparison: "Time" | "Version" = "Time") {
  const files = fs.readdirSync(path);
  let latest = {name: "", time: 0};
  files.forEach((f) => {
    const fPath = `${path}/${f}`;
    const stats = fs.statSync(fPath);
    const vTime = parseInt(f.replace(/^.*v((\d|\.)+)[^v]*$/, "$1").replace(".", ""));
    if (latest.time == 0 || (comparison == "Time" ? latest.time < stats.mtime.getTime() : latest.time < vTime))
      latest = {name: f, time: comparison == "Time" ? stats.mtime.getTime() : vTime};
  });
  return latest.name;
}