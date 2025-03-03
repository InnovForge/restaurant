import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import useAuthUserStore from "@/stores/useAuthUserStore";
import { useState } from "react";

const History = () => {
  const { authUser } = useAuthUserStore();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data, isFetching } = useQuery({
    queryKey: ["get-bills"],
    queryFn: async () => {
      const f = await api.get("/v1/users/me/bills");
      return f.data.data;
    },
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  console.log(data);

  // Hàm nhóm các món ăn trùng nhau
  const groupItems = (items) => {
    const grouped = {};
    items.forEach((item) => {
      const price = parseFloat(item.price); // Chuyển price từ string thành số
      if (grouped[item.foodId]) {
        grouped[item.foodId].quantity += item.quantity; // Cộng số lượng
        grouped[item.foodId].totalPrice += price * item.quantity; // Cộng tổng tiền
      } else {
        grouped[item.foodId] = {
          ...item,
          quantity: item.quantity,
          price: price, // Chuyển về dạng số
          totalPrice: price * item.quantity,
        };
      }
    });
    return Object.values(grouped);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Lịch sử đặt đồ ăn</h2>
      <ul className="space-y-6">
        {data?.map((order) => (
          <li key={order.billId} className="p-6 border rounded-lg flex items-center gap-6 shadow-md">
            <img src={order.restaurant.logoUrl} alt="" className="w-24 h-24 rounded-md object-cover" />
            <div className="flex-1">
              <div className="font-semibold text-xl">{order.items.foodName}</div>
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

              {/* Nút Đánh giá */}
              {/* <div className="mt-3">
                <button className="px-6 py-2 bg-blue-500 text-white text-lg rounded hover:bg-blue-600">Đánh giá</button>
              </div> */}
              <button
                className="mt-3 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
                onClick={() => setSelectedOrder(order)}
              >
                Xem chi tiết
              </button>
              {order.status === "Đã dùng tại nhà hàng" && (
                <div className="mt-3 flex items-center gap-2">
                  <button className="px-6 py-2 bg-blue-500 text-white text-lg rounded hover:bg-blue-600">
                    Đánh giá
                  </button>
                  <div className="flex gap-1 text-yellow-400">
                    {[...Array(5)].map((_, index) => (
                      <span key={index} className="text-2xl">
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      {/* Modal hiển thị chi tiết món ăn */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4">Chi tiết đơn hàng</h3>
            <ul className="space-y-2">
              {groupItems(selectedOrder.items).map((item, index) => (
                <li key={index} className="flex items-center gap-4 border-b pb-2">
                  <img src={item.imageUrl} alt={item.foodName} className="w-16 h-16 object-cover rounded-md" />
                  <div className="flex-1">
                    <div className="font-semibold">{item.foodName}</div>
                    <div className="text-gray-500">Số lượng: {item.quantity}</div>
                    <div className="text-gray-500">Giá: {item.price}đ</div>
                    <div className="text-gray-700 font-semibold">
                      Tổng:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.totalPrice.toFixed(2))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
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
