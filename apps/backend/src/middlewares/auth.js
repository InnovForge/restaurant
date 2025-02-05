import jwt from "jsonwebtoken";

const authenticateJWT = (req, res, next) => {
	const token = req.cookies?.accessToken; // Lấy token từ header
	console.log(req.cookies);
	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, user) => {
		if (err) {
			return res.status(403).json({ message: "Forbidden" });
		}
		req.user = user; // Gán user vào request
		next(); // Chuyển tiếp đến middleware tiếp theo
	});
};

export { authenticateJWT };
