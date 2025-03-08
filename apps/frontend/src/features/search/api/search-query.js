import { api } from "@/lib/api-client";

export const fetchRestaurants = async (p) => {
  const params = new URLSearchParams();
  Object.keys(p).forEach((key) => {
    p[key] !== undefined && params.append(key, p[key]);
  });

  const response = await api.get("/v1/search", { params });
  return response.data;
};
