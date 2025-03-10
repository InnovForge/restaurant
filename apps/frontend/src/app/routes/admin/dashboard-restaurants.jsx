import { Outlet } from "react-router";
import DashboardLayout from "./components/Dashboard";
import { socket } from "@/lib/socket";
import { useTTS } from "@/hooks/use-tss";
import { useEffect } from "react";
import { useParams } from "react-router";
import noticationSound from "@/assets/audio/notification.mp3";
function playNotificationSound() {
  const audio = new Audio(noticationSound);
  audio.play();
}
export default function HomeAdmin() {
  const { restaurantId } = useParams();
  const { mutate: speak } = useTTS();

  useEffect(() => {
    if (!restaurantId) return;

    socket.on("newOrder", (orderData) => {
      console.log("📦 Đơn hàng mới:", orderData);
      playNotificationSound();
      const message = `bạn có đơn hàng mới từ bàn ${orderData.tableName}, tổng tiền ${orderData.bill.totalAmount} đồng.`;
      speak(
        { restaurantId, message },
        {
          onSuccess: (audioUrl) => {
            const audio = new Audio(audioUrl);
            // console.log("TTS URL:", audioUrl);
            audio.play().catch((err) => console.error("err playing audio:", err));
          },
          onError: (error) => {
            console.error("err TTS:", error);
          },
        },
      );
    });
    return () => {
      socket.off("newOrder");
    };
  }, [restaurantId]);

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
