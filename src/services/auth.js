import axios from "axios";

const AUTH_URL =
  process.env.REACT_APP_AUTH_URL ||
  "https://id.tif.uin-suska.ac.id/realms/dev/protocol/openid-connect/token";

const CLIENT_ID =
  process.env.REACT_APP_CLIENT_ID || "setoran-mobile-dev";

const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

const buildAuthParams = ({
  grantType,
  username,
  password,
  refreshToken,
  includeClientSecret
}) => {
  const params = new URLSearchParams();

  params.append("client_id", CLIENT_ID);

  if (includeClientSecret && CLIENT_SECRET) {
    params.append("client_secret", CLIENT_SECRET);
  }

  params.append("grant_type", grantType);

  if (username) params.append("username", username);
  if (password) params.append("password", password);
  if (refreshToken) params.append("refresh_token", refreshToken);

  return params;
};

const requestToken = async (params) => {
  const res = await axios.post(AUTH_URL, params.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json"
    }
  });

  localStorage.setItem("access_token", res.data.access_token);
  localStorage.setItem("refresh_token", res.data.refresh_token);

  console.log("TOKEN BARU:", res.data.access_token);

  return res.data;
};

const isInvalidClientError = (err) => {
  return (
    err.response?.status === 401 &&
    err.response?.data?.error === "invalid_client"
  );
};

export const login = async (username, password) => {
  const params = buildAuthParams({
    grantType: "password",
    username,
    password,
    includeClientSecret: Boolean(CLIENT_SECRET)
  });

  params.append("scope", "openid profile email");

  try {
    return await requestToken(params);
  } catch (err) {
    if (CLIENT_SECRET && isInvalidClientError(err)) {
      console.warn("Retry login tanpa client_secret");

      const fallbackParams = buildAuthParams({
        grantType: "password",
        username,
        password,
        includeClientSecret: false
      });

      fallbackParams.append("scope", "openid profile email");

      return await requestToken(fallbackParams);
    }

    throw err;
  }
};

export const refreshToken = async () => {
  const refresh_token = localStorage.getItem("refresh_token");

  if (!refresh_token) {
    throw new Error("Refresh token tidak tersedia");
  }

  const params = buildAuthParams({
    grantType: "refresh_token",
    refreshToken: refresh_token,
    includeClientSecret: Boolean(CLIENT_SECRET)
  });

  params.append("scope", "openid");

  try {
    return await requestToken(params);
  } catch (err) {
    if (CLIENT_SECRET && isInvalidClientError(err)) {
      console.warn("Retry refresh tanpa client_secret");

      const fallbackParams = buildAuthParams({
        grantType: "refresh_token",
        refreshToken: refresh_token,
        includeClientSecret: false
      });

      fallbackParams.append("scope", "openid");

      return await requestToken(fallbackParams);
    }

    throw err;
  }
};