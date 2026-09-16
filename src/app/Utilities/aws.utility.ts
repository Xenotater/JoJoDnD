import { CopyObjectCommand, DeleteObjectCommand, DeleteObjectsCommand, GetObjectCommand, ListObjectsV2Command, NoSuchKey, PutObjectCommand, S3Client, S3ServiceException } from "@aws-sdk/client-s3";
import { SendEmailCommand, SendEmailCommandInput, SESClient, SESServiceException } from "@aws-sdk/client-ses";
import { Readable } from "stream";
import { log, logError, logRequest } from "./logging.utility";

const s3Client = new S3Client({region: "us-east-1"});
const sesClient = new SESClient({region: "us-east-1"});

export async function getBucketName() {
  return process.env.S3_BUCKET;
}

export async function getBucketURL() {
  return `https://${await getBucketName()}.s3.us-east-1.amazonaws.com`;
}

export async function getS3File(filePath: string) {
  logRequest(await getBucketURL() + `/${filePath}`, "GET");
  try {
    return await s3Client.send(new GetObjectCommand({
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

  logRequest(await getBucketURL() + `/${key}`, "PUT", `file: ${file.name}`);
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

export async function delS3File(key: string, logErr = true) {
  logRequest(await getBucketURL() + `/${key}`, "DELETE");
  
  try {
    return await s3Client.send(new DeleteObjectCommand({
      Bucket: await getBucketName(),
      Key: key
    }));
  }
  catch (e) {
    if (e instanceof S3ServiceException && logErr)
      logError("Error communicating with S3: " + e.message);
    return null;
  }
}

export async function copyS3File(oldKey: string, newKey: string, logErr = true) {
  logRequest(await getBucketURL() + `/${newKey}`, "PUT");
  
  try {
    return await s3Client.send(new CopyObjectCommand({
      Bucket: await getBucketName(),
      CopySource: `/${await getBucketName()}/${oldKey}`,
      Key: newKey
    }));
  }
  catch (e) {
    if (e instanceof S3ServiceException && logErr)
      logError("Error communicating with S3: " + e.message);
    return null;
  }
}

export async function moveS3File(oldKey: string, newKey: string) {
  await copyS3File(oldKey, newKey).then(async (resp) => {
    if (resp)
      return await delS3File(oldKey);
    else
      return null;
  }).catch(() => {return null;});
}

export async function listFilesInFolder(path: string) {
  if (path.slice(-1) != '/')
    path += '/';
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
  const keys = (await listFilesInFolder(path))?.map((f) => ({Key: f})) ?? [];
  if (keys.length == 0)
    return null;
  logRequest(await getBucketURL() + `/${path}/`, "DELETE");
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

export async function copyFilesInFolder(oldPath: string, newPath: string) {
  let success = true;
  const keys = await listFilesInFolder(oldPath);
  if (!keys || keys.length == 0)
    return null;
  logRequest(await getBucketURL() + `/${newPath}/`, "PUT");
  for (const key of keys) {
    const resp = await copyS3File(key, `${newPath}/${key.split("/").slice(-1)}`);
    if (!resp)
      success = false;
  }
  return success;
}

export async function moveFilesInFolder(oldPath: string, newPath: string) {
  await copyFilesInFolder(oldPath, newPath).then(async (resp) => {
    if (resp)
      return await clearFilesInFolder(oldPath);
    else
      return null;
  }).catch(() => {return null;});
}

export async function sendEmail(system: string, recipient: string, subject: string, content: string) {
  const params = {
    Source: `JoJo D&D <no-reply@${system}.jojodnd.com>`,
    Destination: {
      ToAddresses: [recipient],
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: subject
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: content
        },
        Text: {
          Charset: "UTF-8",
          Data: content.replace("<br/>", "\n\n").replace(/<[^>]*>/g, '')
        }
      }
    }
  } as SendEmailCommandInput;
  
  try {
    log(`Sending email [${subject}] to ${recipient}`);
    return await sesClient.send(new SendEmailCommand(params));
  }
  catch (e) {
    if (e instanceof SESServiceException)
      logError("Error communicating with SES: " + e.message);
    return null;
  }
}