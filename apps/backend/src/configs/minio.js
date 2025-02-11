import * as Minio from "minio";
import { logger } from "../utils/logger.js";

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_HOST || "localhost",
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: false,
  accessKey: process.env.MINIO_ROOT_USER,
  secretKey: process.env.MINIO_ROOT_PASSWORD,
});

async function ensureBucketExists(bucketName) {
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName, "us-east-1");
      logger.info(`✅ Bucket "${bucketName}" created.`);
    } else {
      // logger.info(`✅ Bucket "${bucketName}" exists.`);
    }
  } catch (error) {
    logger.error(`❌ Bucket "${bucketName}" failed to create.`);
  }
}
export { minioClient, ensureBucketExists };
