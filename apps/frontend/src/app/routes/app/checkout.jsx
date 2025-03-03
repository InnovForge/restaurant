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

import { Card } from "@/components/ui/card";

import { Label } from "@/components/ui/label";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import LazyImage from "@/components/ui/lazy-image";
import { Plus } from "lucide-react";
import { Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SearchLocation from "@/features/address/components/search-location";
import { useState } from "react";

const Checkout = () => {
  const { Cart, addCart } = useCartStore();
  const [value, setValue] = useState("TEST");
  console.log(value);
  return (
    <div className="flex-col flex w-full max-w-3xl gap-4 min-h-screen mx-auto">
      <SearchLocation value={value} onChange={setValue} />
      <div className="w-full flex flex-col gap-1">
        {Cart.map((item, i) => (
          <Card className="flex gap-2 overflow-hidden" key={i}>
            <div className="w-28">
              <AspectRatio ratio={4 / 3}>
                <LazyImage
                  width="100%"
                  height="100%"
                  src={item.foodImage}
                  alt={item.foodName}
                  className="object-cover rounded-xl"
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
      <Card className="p-2 h-full flex flex-col">
        <div className="flex items-center justify-between">
          <h5>Vui lòng chọn bàn:</h5>
          <Select>
            <SelectTrigger className="w-[500px]">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Bàn</SelectLabel>
                <SelectItem value="ban1">Bàn 1</SelectItem>
                <SelectItem value="ban2">Bàn 2</SelectItem>
                <SelectItem value="ban3">Bàn 3</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h5>Chọn ngày nhận bàn:</h5>
            <h5>
              Chọn Ngày
              <input type="date" className="border rounded 2-2" />
            </h5>
            <h5>
              Thời gian
              <input type="time" className="border rounded 2-2" />
            </h5>
          </div>
        </div>
      </Card>

      {/* <div className="p-4 h-[500px] bg-background fixed w-[28%] right-20 top-24 transform"> */}
      <Card className="p-2 h-full flex flex-col">
        <h3>Chọn thanh toán</h3>

        <Select defaultValue="momo">
          <SelectTrigger className="w-full h-fit">
            <SelectValue placeholder="payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="momo">
              <div className="flex items-center justify-center gap-2">
                <img src={momoLogo} alt="momo" className="w-10 h-10" />
                <Label>Thanh toán qua Momo</Label>
              </div>
            </SelectItem>
            <SelectItem value="later">
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

          <Button className="w-full">Thanh toán</Button>
        </div>
      </Card>
      {/* </div> */}
    </div>
  );
};
export default Checkout;
