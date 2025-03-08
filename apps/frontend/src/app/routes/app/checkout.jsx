import useCartStore from "@/stores/useCartStore";
import momoLogo from "@/assets/svg/momo_square_pinkbg.svg";
import cash from "@/assets/svg/cash.svg";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Label } from "@/components/ui/label";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import LazyImage from "@/components/ui/lazy-image";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { formatDate, toUTC } from "@/utils/format-date";
import { CheckCircle } from "lucide-react";

const Checkout = () => {
  const mutation = useMutation({
    mutationFn: (newBill) => {
      return api.post("v1/users/me/bills", newBill);
    },
  });

  const { Cart, addCart } = useCartStore();
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const restaurantId = Cart[0]?.restaurantId;
  // console.log(selectedTable,selectedTime,selectedDate,selectedPayment)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get(`v1/tables/${restaurantId}/`);
        setTables(res.data.message);
        console.log("res.data.data :>> ", res.data.message);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
      }
    }
    fetchData();
  }, [restaurantId]);

  if (mutation.isSuccess) {
    const { billId, checkInTime } = mutation.data.data.data;
    // addCart([]);
    console.log("billId, checkInTime :>> ", billId, checkInTime, mutation.data);
    return (
      <div className="flex flex-col items-center justify-center">
        <Card className="w-full max-w-2xl text-center p-6 shadow-lg">
          <CardHeader>
            <CheckCircle className="text-green-500 w-16 h-16 mx-auto" />
            <CardTitle className="text-xl font-semibold mt-4">Đặt bàn thành công!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">Cảm ơn bạn đã đặt bàn tại nhà hàng chúng tôi.</p>
            <div className="bg-gray-100 p-3 rounded-md">
              <p className="font-medium">
                Mã đơn hàng: <span className="text-blue-600">{billId}</span>
              </p>
              <p>
                Thời gian nhận bàn: <span className="font-semibold">{formatDate(checkInTime)}</span>
              </p>
            </div>
            <Button className="w-full" onClick={() => (window.location.href = "/history")}>
              Đi đến lịch sử
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-col flex w-full max-w-3xl gap-4 min-h-screen mx-auto">
      <div className="w-full flex flex-col gap-1">
        {Cart.map((item, i) => (
          <Card className="flex gap-2 overflow-hidden" key={item.foodId}>
            <div className="w-28">
              <AspectRatio ratio={4 / 3} className="w-full">
                <LazyImage
                  width="100%"
                  height="100%"
                  src={item.foodImage}
                  alt={item.foodName}
                  className="object-cover  w-full h-full"
                />
              </AspectRatio>
            </div>
            <div className="flex flex-col gap-2">
              <p>{item.foodName}</p>
              <div className="flex items-center gap-2">
                <Plus />
                <p className="text-md">{item.quantity}</p>
                <Minus />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-2 h-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h5>Vui lòng chọn bàn:</h5>
          <Select defaultValue="all" onValueChange={(value) => setSelectedTable(value)}>
            <SelectTrigger className="w-[500px]">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Bàn</SelectLabel>
                {tables.map((table) => (
                  <SelectItem key={table.tableId} value={table.tableId}>
                    {table.tableName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h5>Chọn ngày nhận bàn:</h5>
            <h5>
              Chọn Ngày {""}
              <input type="date" className="border rounded 2-2" onChange={(e) => setSelectedDate(e.target.value)} />
            </h5>
            <h5>
              Thời gian {""}
              <input type="time" className="border rounded 2-2" onChange={(e) => setSelectedTime(e.target.value)} />
            </h5>
          </div>
        </div>
      </Card>

      {/* <div className="p-4 h-[500px] bg-background fixed w-[28%] right-20 top-24 transform"> */}
      <Card className="p-2 h-full flex flex-col gap-4">
        <h3>Chọn thanh toán</h3>

        <Select defaultValue="momo" onValueChange={(value) => setSelectedPayment(value)}>
          <SelectTrigger className="w-full h-fit">
            <SelectValue placeholder="chọn phương thức thanh toán" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="momo">
              <div className="flex items-center justify-center gap-2">
                <img src={momoLogo} alt="momo" className="w-10 h-10" />
                <Label>Thanh toán qua Momo</Label>
              </div>
            </SelectItem>
            <SelectItem value="cash">
              <div className="flex items-center justify-center gap-2">
                <img src={cash} alt="cash" className="w-10 h-10" />
                <Label>Thanh toán sau</Label>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="w-full mt-auto">
          <h2 className="text-xl font-bold">Tổng cộng</h2>
          <p>{Cart.reduce((acc, item) => acc + item.quantity, 0)} món</p>
          <p>{Cart.reduce((acc, item) => acc + item.quantity * item.price, 0)} ₫</p>

          <Button
            onClick={() => {
              mutation.mutate({
                restaurantId: restaurantId,
                paymentMethod: selectedPayment,
                billItems: Cart.map((item) => ({
                  foodId: item.foodId,
                  quantity: item.quantity,
                  price: item.price,
                })),
                tableId: selectedTable,
                checkInTime: toUTC(new Date(selectedDate + " " + selectedTime)),
              });
            }}
            className="w-full"
          >
            Thanh toán
          </Button>
        </div>
      </Card>
      {/* </div> */}
    </div>
  );
};
export default Checkout;
