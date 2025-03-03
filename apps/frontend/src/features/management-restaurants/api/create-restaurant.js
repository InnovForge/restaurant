import { api } from "@/lib/api-client";

export const createRestaurant = async (data) => {
  return api.post("/v1/restaurants", data);
};

export const uploadRestaurantImage = async ({ restaurantId, images }) => {
  const formData = new FormData();

  if (images.avatar) {
    formData.append("logo", images.avatar);
  }
  if (images.cover) {
    formData.append("cover", images.cover);
  }

  return api.patch(`/v1/restaurants/${restaurantId}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
