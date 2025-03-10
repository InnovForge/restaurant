import { api } from "@/lib/api-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUserStore from "@/stores/useAuthUserStore";
import { useState } from "react";

const History = () => {
  const { authUser } = useAuthUserStore();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data } = useQuery({
    queryKey: ["get-bills"],
    queryFn: async () => {
      const res = await api.get("/v1/users/me/bills");
      return res.data.data;
    },
    staleTime: 1000 * 60 * 1,
  });

  const submitReview = useMutation({
    mutationFn: async () => {
      const res = await api.post("/v1/users/me/reviews", {
        billId: selectedOrder.billId,
        rating,
        comment,
      });
      return res.data;
    },
    onSuccess: (data) => {
      alert("Đánh giá thành công!");
      queryClient.setQueryData(["get-bills"], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((order) =>
          order.billId === selectedOrder.billId ? { ...order, review: { rating, comment } } : order,
        );
      });
      setSelectedOrder((prev) => ({ ...prev, review: { rating, comment } }));
      setRating(0);
      setComment("");
    },
  });

  const handleRatingClick = (index) => {
    setRating(index + 1);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Lịch sử đặt đồ ăn</h2>
      <ul className="space-y-6">
        {data?.map((order) => (
          <li key={order.billId} className="p-6 border rounded-lg flex items-center gap-6 shadow-md">
            <img src={order.restaurant.logoUrl} alt="" className="w-24 h-24 rounded-md object-cover" />
            <div className="flex-1">
              <div className="font-semibold text-xl">{order.items[0].foodName}</div>
              <div className="text-md text-gray-500">{order.restaurant.name}</div>
              <div className="text-md text-gray-500">Ngày đặt: {order.createdAt}</div>
              <div className="text-md text-gray-500">
                Tổng:{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(order.items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0))}
              </div>
              <div className={`text-lg font-bold ${order.status === "Đã hủy" ? "text-red-600" : "text-green-600"}`}>
                {order.status}
              </div>
              <button
                className="mt-3 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                onClick={() => setSelectedOrder(order)}
              >
                Xem chi tiết
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Chi tiết đơn hàng</h3>
            <ul className="space-y-2">
              {selectedOrder.items.map((item, index) => (
                <li key={index} className="flex items-center gap-4 border-b pb-2">
                  <img src={item.imageUrl} alt={item.foodName} className="w-16 h-16 object-cover rounded-md" />
                  <div className="flex-1">
                    <div className="font-semibold">{item.foodName}</div>
                    <div className="text-gray-500">Số lượng: {item.quantity}</div>
                    <div className="text-gray-500">Giá: {item.price}đ</div>
                  </div>
                </li>
              ))}
            </ul>
            {selectedOrder.review && (
              <div className="mt-4">
                <h3 className="text-lg font-bold mb-2">Lịch sử đánh giá</h3>
                <div className="text-yellow-400 text-2xl">
                  {"★".repeat(selectedOrder.review.rating) + "☆".repeat(5 - selectedOrder.review.rating)}
                </div>
                <p className="text-gray-600">{selectedOrder.review.comment}</p>
              </div>
            )}
            <div className="mt-4">
              <h3 className="text-lg font-bold mb-2">Đánh giá món ăn</h3>
              <div className="flex gap-2 text-yellow-400 text-2xl cursor-pointer">
                {[...Array(5)].map((_, index) => (
                  <span key={index} onClick={() => handleRatingClick(index)}>
                    {index < rating ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <textarea
                className="w-full mt-2 p-2 border rounded-md"
                rows="3"
                placeholder="Nhập nhận xét của bạn..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <button
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => submitReview.mutate()}
              >
                Gửi đánh giá
              </button>
            </div>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => setSelectedOrder(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
