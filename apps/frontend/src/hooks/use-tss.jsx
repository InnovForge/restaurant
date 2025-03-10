import { api } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

async function textToSpeech({ restaurantId, message: text }) {
  const response = await api.post(`v1/restaurants/${restaurantId}/tss`, { text }, { responseType: "arraybuffer" });
  const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
  const audioUrl = URL.createObjectURL(audioBlob);
  return audioUrl;
}

export function useTTS() {
  return useMutation({
    mutationFn: textToSpeech,
  });
}
