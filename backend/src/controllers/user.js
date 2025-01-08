import userModel from "../models/user.js";

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
	// try {
		const users = await userModel.getAllUsers();
		return res.status(200).json({ users });
	// } catch (error) {
	// 	return res.status(500).json({ error: error.message });
	// }
};
