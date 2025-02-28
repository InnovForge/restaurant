import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router";
import { PopoverClose } from "@radix-ui/react-popover";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import useCartStore from "@/stores/useCartStore";

const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);

const Cart = () => {
  const { Cart, addCart } = useCartStore();
  // const cart = [
  //   {
  //     id: "product-1",
  //     name: "Áo thun",
  //     price: 200000,
  //     quantity: 2,
  //   },
  //   {
  //     id: "product-2",
  //     name: "Quần jeans",
  //     price: 500000,
  //     quantity: 1,
  //   },
  // ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center justify-center gap-1 p-1 mr-3 rounded-md hover:bg-accent hover:text-accent-foregroundrounded-md cursor-pointer">
          <ShoppingCart className="w-6 h-6" />
          <span>{Cart.length || 0}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[440px] h-fit flex flex-col">
        <header className="pb-4 border-b">
          <h3 className="text-lg font-medium leading-none">Giỏ đồ ăn</h3>
        </header>

        <ScrollArea className="h-[450px] w-full py-2">
          {/* NOTE: Replace this with your cart items*/}
          {Cart.length > 0 &&
            Cart.map((item, i) => (
              <div key={i}>
                <PopoverClose asChild>
                  <Link to="/restaurant/McDonald">
                    <h4 className="mb-4 font-semibold leading-none">McDonald’s - 2 Tháng 9</h4>
                  </Link>
                </PopoverClose>
                <div className="flex w-full items-center">
                  <div className="pr-2 flex-col">
                    <Button variant="ghost" size="icon" className="w-6 h-6 text-foreground">
                      <Plus />
                    </Button>
                    <p className="text-center">5</p>
                    <Button variant="ghost" size="icon" className="w-6 h-6 text-foreground">
                      <Minus />
                    </Button>
                  </div>
                  <div className="flex items-start">
                    <div className="w-[90px] pr-2 flex-shrink-0">
                      <AspectRatio ratio={5 / 4}>
                        <img src={item.imageUrl} className="object-cover w-full h-full rounded-sm" />
                      </AspectRatio>
                    </div>
                    <div className="flex items-start">
                      <div className="flex flex-col w-full">
                        {/* <p className="pr-7 font-semibold text-xs break-all line-clamp-3">
                    Combo Thịnh Vượng - Burger Gà Teriyaki
                  </p> */}
                        <p className="text-xs">{item.name}</p>
                      </div>
                      <div className="font-semibold text-sm text-nowrap text-center pr-3">{item.price}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          {/* NOTE:  end!*/}
        </ScrollArea>

        <footer className="flex-col flex gap-1">
          <div className="flex justify-between py-3">
            <span className="font-semibold">Tổng cộng</span>
            <span className="font-semibold">1000 ₫</span>
          </div>
          <PopoverClose asChild>
            <Link to="/checkout">
              <Button className="w-full">Xem lại đơn hàng</Button>
            </Link>
          </PopoverClose>
        </footer>
      </PopoverContent>
    </Popover>
  );
};

export default Cart;
