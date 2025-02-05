import jwt from "jsonwebtoken";
export function createAccessJwt(userId) {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: "20s",
  });
}

export function createRefreshJwt(userId) {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: "365d",
  });
}

export default async function createSesionLogin(
	res,
	userId,
) {
  const accessToken = createAccessJwt(userId);
  const refreshToken = createRefreshJwt(userId);

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: false,
		path: "/",
		samSite: "strict",
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: false,
		path: "/refreshToken",
		samSite: "strict",
	});
	res.cookie("userId", userId, {
		httpOnly: false,
		secure: false,
		path: "/",
		samSite: "strict",
	});
}
