import { minioClient } from "../configs/minio.js";
import userModel from "../models/user.js";
import { uploadFileUser } from "../utils/s3.js";

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

export const updateUser = async (req, res) => {
	const { id } = req.params;
	// console.log("id :>> ", id);
	// console.log("req.body :>> ", req.body);
	const { name, gender, email, username, password, phone_number, role } =
		req.body;
	try {
		const f = await userModel.updateUser(id, {
			name,
			gender,
			email,
			username,
			password,
			role,
			phone_number,
		});
		if (!f) {
			return res.status(400).json({
				message: "No changes detected",
			});
		}
		return res.status(200).json({
			message: "User updated successfully",
		});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const updateUserAvatar = async (req, res) => {
	const { id } = req.params;
	console.log("req.file :>> ", req.file);
	const file = req.file;
	// const
	try {
		const url = await uploadFileUser(`${id}/avatar`, file);
		console.log("url", url);
		const f = await userModel.updateUser(id, { avatar_url: url });
		if (!f) {
			return res.status(400).json({
				message: "No changes detected",
			});
		}
		return res.status(200).json({
			message: "User avatar updated successfully",
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
		const fileUrl = await uploadFileUser("users/test", "./text.txt");
		const users = await userModel.getAllUsers();
		return res.status(200).json({ users, fileUrl });
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
