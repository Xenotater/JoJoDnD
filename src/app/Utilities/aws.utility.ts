import { DeleteObjectCommand, DeleteObjectsCommand, GetObjectCommand, ListObjectsV2Command, NoSuchKey, PutObjectCommand, S3Client, S3ServiceException } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { logError, logRequest } from "./logging.utility";

const s3Client = new S3Client({region: "us-east-1"});

export async function getBucketName() {
  return process.env.S3_BUCKET;
}

export async function getBucketURL() {
  return `https://${await getBucketName()}.s3.us-east-1.amazonaws.com`;
}

export async function getS3File(filePath: string) {
  logRequest(await getBucketURL() + `/${filePath}`, "GET");
  try {
    return s3Client.send(new GetObjectCommand({
      Bucket: await getBucketName(),
      Key: filePath
    }));
  }
  catch (e) {
    if (e instanceof NoSuchKey)
      logError("Object not found: " + filePath);
    if (e instanceof S3ServiceException)
      logError("Error communicating with S3: " + e.message);
    return null;
  }
}

export async function postS3File(fileData: FormData, key: string = "") {
  const file = fileData.get("file") as File;
  const buffer = Buffer.from((await file.arrayBuffer()));
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  logRequest(await getBucketURL() + `/${key}`, "POST", `file: ${file.name}`);
  try {
    return await s3Client.send(new PutObjectCommand({
      Bucket: await getBucketName(),
      Key: key,
      Body: stream,
      ContentType: file.type,
      ContentLength: buffer.length
    }));
  }
  catch (e) {
    if (e instanceof S3ServiceException)
      logError("Error communicating with S3: " + e.message);
    return null;
  }
}

export async function delS3File(key: string) {
  logRequest(await getBucketURL() + `/${key}`, "DELETE");
  
  try {
    return await s3Client.send(new DeleteObjectCommand({
      Bucket: await getBucketName(),
      Key: key
    }));
  }
  catch (e) {
    if (e instanceof S3ServiceException)
      logError("Error communicating with S3: " + e.message);
    return null;
  }
}

export async function getFilesInFolder(path: string) {
  logRequest(await getBucketURL() + `/${path}`, "GET");
  try {
    return (await s3Client.send(new ListObjectsV2Command({
      Bucket: await getBucketName(),
      Prefix: path
    }))).Contents?.flatMap((o) => o.Key ? o.Key : []) ?? [];
  }
  catch (e) {
    if (e instanceof S3ServiceException)
      logError("Error communicating with S3: " + e.message);
    return null;
  }
}

export async function clearFilesInFolder(path: string) {
  const keys = (await getFilesInFolder(path))?.map((f) => ({Key: f})) ?? [];
  if (keys.length == 0)
    return null;
  logRequest(await getBucketURL() + `/${path}`, "DELETE");
  try {
    return await s3Client.send(new DeleteObjectsCommand({
      Bucket: await getBucketName(),
      Delete: {
        Objects: keys
      },
    }));
  }
  catch (e) {
    if (e instanceof S3ServiceException)
      logError("Error communicating with S3: " + e.message);
    return null;
  }
}