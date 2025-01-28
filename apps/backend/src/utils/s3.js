import { minioClient } from "../configs/minio.js";

const BUCKET_NAME = process.env.MINIO_BUCKET || "media";

export const uploadFile = async (objectName, filePath) => {
  try {
    await minioClient.fPutObject(BUCKET_NAME, objectName, filePath);
    const fileUrl = `http://${process.env.MINIO_HOST}:${process.env.MINIO_PORT}/${BUCKET_NAME}/${objectName}`;
    return fileUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};
