import jwt from "jsonwebtoken";

function createAccessJwt(userId) {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: "15m",
  });
}

function createRefreshJwt(userId) {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: "365d",
  });
}

export function createNewAccessToken(res, userId) {
  const accessToken = createAccessJwt(userId);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    path: "/",
    samSite: "strict",
  });
}

export function createSesionLogin(res, userId) {
  const accessToken = createAccessJwt(userId);
  const refreshToken = createRefreshJwt(userId);

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "strict",
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      path: "/api/v1/auth/refreshToken",
      sameSite: "strict",
    });
}
