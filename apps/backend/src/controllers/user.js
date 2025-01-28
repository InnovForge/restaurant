import { minioClient } from "../configs/minio.js";
import userModel from "../models/user.js";
import { uploadFile } from "../utils/s3.js";

export const createUser = async (req, res) => {
  const { username, password, name, email } = req.body;
  try {
    await userModel.createUser({
      username,
      password,
      name,
      email,
    });
    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    minioClient.listBuckets(function (err, buckets) {
      if (err) return console.log(err);
      console.log("buckets :>> ", buckets);
    });
    const fileUrl = await uploadFile("users/test", "./text.txt");
    const users = await userModel.getAllUsers();
    return res.status(200).json({ users, fileUrl });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
