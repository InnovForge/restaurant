import { useState } from "react";

const History = () => {
  const [orders] = useState([
    {
      id: 1,
      food: "Pizza Pepperoni",

      price: 150000,
      date: "2025-02-15",
      status: "Đã dùng tại nhà hàng",
      restaurant: "Pizza Hut",
    },
    {
      id: 2,
      food: "Bún Bò Huế",

      price: 60000,
      date: "2025-02-14",
      status: "Đã dùng tại nhà hàng",
      restaurant: "Bún Bò 3A",
    },
    {
      id: 3,
      food: "Gà Rán",

      price: 45000,
      date: "2025-02-13",
      status: "Đã hủy",
      restaurant: "Chicken Big",
    },
  ]);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Lịch sử đặt đồ ăn</h2>
      <ul className="space-y-6">
        {orders.map((order) => (
          <li key={order.id} className="p-6 border rounded-lg flex items-center gap-6 shadow-md">
            <img src={order.image} alt={order.food} className="w-24 h-24 rounded-md object-cover" />
            <div className="flex-1">
              <div className="font-semibold text-xl">{order.food}</div>
              <div className="text-md text-gray-500">{order.restaurant}</div>
              <div className="text-md text-gray-500">Ngày đặt: {order.date}</div>
              <div className="text-md text-gray-500">Tổng: {order.price.toLocaleString()}đ</div>
              <div className={`text-lg font-bold ${order.status === "Đã hủy" ? "text-red-600" : "text-green-600"}`}>
                {order.status}
              </div>
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
    </div>
  );
};

export default History;
