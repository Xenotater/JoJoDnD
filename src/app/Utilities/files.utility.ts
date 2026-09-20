import fs from "fs";

const listablePaths = ["public/static/resources"];

export async function getLatestFileName(path: string, comparison: "Time" | "Version" = "Time") {
  const files = await getAllFiles(path);
  let latest = {name: "", time: 0};
  files.forEach((f) => {
    const vTime = parseInt(f.name.replace(/^.*v((\d|\.)+)[^v]*$/, "$1").replace(".", ""));
    if (latest.time == 0 || (comparison == "Time" ? latest.time < f.time.getTime() : latest.time < vTime))
      latest = {name: f.name, time: comparison == "Time" ? f.time.getTime() : vTime};
  });
  return latest.name;
}

export async function getAllFiles(path: string) {
  if (!isListable)
    return [];

  const files = fs.readdirSync(path);
  return files.map(f => {
    const fPath = `${path}/${f}`;
    const stats = fs.statSync(fPath);
    return {name: f, time: stats.mtime};
  });
}

function isListable(path: string) {
  listablePaths.forEach(p => {
    if (path.includes(p))
      return true;
  });
  return false;
}