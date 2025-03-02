import { api } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
// import { useAddressStore } from "@/stores/useAddressStore";
import useAuthUserStore from "@/stores/useAuthUserStore";

const History = () => {
  // const {addresses} = useAddressStore();
  const { authUser } = useAuthUserStore();

  const { data, isFetching } = useQuery({
    queryKey: ["get-bills"],
    queryFn: async () => {
      const f = await api.get("/v1/users/me/bills");
      // sF(f.data)
      return f.data.data;
    },
    staleTime: 1000 * 60 * 1, // 5 minutes
  });

  console.log(data);
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
              <div className="text-md text-gray-500">Tổng: {order.items.price}đ</div>
              <div className={`text-lg font-bold ${order.status === "Đã hủy" ? "text-red-600" : "text-green-600"}`}>
                {/* {order.status} */}
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
