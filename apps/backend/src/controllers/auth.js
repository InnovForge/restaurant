import bcrypt from "bcryptjs";
import userModel from "../models/user.js";
import createSesionLogin from "../utils/jwt.js";
import * as response from "../utils/response.js";
export const login = async (req, res) => {
	const { username, password } = req.body;
	const user = await userModel.getUserByUsername(username);
	if (!user) {
		return response.unauthorized(res, "Invalid username or password");
	}
	const isPasswordMatch = await bcrypt.compare(password, user.password);
	if (!isPasswordMatch) {
		return response.unauthorized(res, "Invalid username or password");
	}
	await createSesionLogin(res, user.user_id);
	return response.success(res, "Login successfully");
};
