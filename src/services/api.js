import axios from "axios";
import { refreshToken } from "./auth";

const API = axios.create({
  baseURL: "/api/setoran-dev/v1"
});

const KC_URL =
  process.env.REACT_APP_KC_URL ||
  "https://id.tif.uin-suska.ac.id";

const KC_USERINFO_URL = `${KC_URL}/realms/dev/protocol/openid-connect/userinfo`;

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;

    if (err.response?.status === 401 && originalConfig && !originalConfig._retry) {
      originalConfig._retry = true;
      console.log("TOKEN EXPIRED → REFRESH");

      try {
        const data = await refreshToken();
        localStorage.setItem("access_token", data.access_token);
        originalConfig.headers.Authorization = `Bearer ${data.access_token}`;

        return API(originalConfig);
      } catch (e) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export const getUserInfo = async () => {
  let token = localStorage.getItem("access_token");

  try {
    return await axios.get(KC_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (err) {
    if (err.response?.status === 401) {
      const data = await refreshToken();
      localStorage.setItem("access_token", data.access_token);
      token = data.access_token;

      return await axios.get(KC_USERINFO_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    throw err;
  }
};

export const getPaSaya = () =>
  API.get("/dosen/pa-saya");

export const getDetailMahasiswa = (nim) =>
  API.get(`/mahasiswa/setoran/${nim}`);

export const simpanSetoran = (nim, data) => {
  if (nim && typeof nim === "object" && data === undefined) {
    data = nim;
    nim = data.nim;
  }

  const payload = data.data_setoran
    ? data
    : {
      data_setoran: [
        {
          id_komponen_setoran:
            data.id_komponen_setoran ?? data.surah_id ?? data.id ?? "",
          nama_komponen_setoran:
            data.nama_komponen_setoran ?? data.nama ?? ""
        }
      ],
      ...(data.tanggal ? { tgl_setoran: data.tanggal } : {})
    };

  return API.post(`/mahasiswa/setoran/${nim}`, payload);
};

export const batalSetoran = (nim, dataSetoran = []) =>
  API.delete(`/mahasiswa/setoran/${nim}`, {
    data: {
      data_setoran: Array.isArray(dataSetoran) ? dataSetoran : []
    }
  });

export default API;