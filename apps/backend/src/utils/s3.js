import { minioClient } from "../configs/minio.js";

export const uploadFileUser = async (objectName, file) => {
	const BUCKET_NAME = "users";
	try {
		await minioClient.putObject(
			BUCKET_NAME,
			objectName,
			file.buffer,
			file.size,
			{
				"Content-Type": file.mimetype,
			},
		);
		const protocol = process.env.MINIO_PORT === "443" ? "https" : "http";
		const fileUrl = `${protocol}://${process.env.MINIO_HOST}:${process.env.MINIO_PORT}/${BUCKET_NAME}/${objectName}`;
		return fileUrl;
	} catch (error) {
		console.error("Error uploading file:", error);
	}
};
