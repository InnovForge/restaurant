import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router";
import { PopoverClose } from "@radix-ui/react-popover";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import useCartStore from "@/stores/useCartStore";
import { Frown } from "lucide-react";
const Cart = () => {
  const { Cart, addCart, removeCart } = useCartStore();
  console.log(Cart);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center justify-center gap-1 p-1 mr-3 rounded-md hover:bg-accent hover:text-accent-foregroundrounded-md cursor-pointer">
          <ShoppingCart className="w-6 h-6" />
          <span>{Cart.length || 0}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[400px] h-fit flex flex-col">
        <header className="pb-4 border-b">
          <h3 className="text-lg font-medium leading-none">Giỏ đồ ăn</h3>
        </header>

        <ScrollArea className="h-[450px] w-full py-2 relative">
          {/* NOTE: Replace this with your cart items*/}
          {Cart.length > 0 ? (
            Cart.map((item, i) => (
              <div key={i}>
                <PopoverClose asChild>
                  <Link to="/restaurant/McDonald">
                    <h4 className="mb-4 font-semibold leading-none">{item.restaurantName}</h4>
                  </Link>
                </PopoverClose>
                <div className="flex w-full items-center">
                  <div className="pr-2 flex-col">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 text-foreground"
                      onClick={() => addCart(item)}
                    >
                      <Plus />
                    </Button>
                    <p className="text-center">{item.quantity}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 text-foreground"
                      onClick={() => removeCart(item.foodId)}
                    >
                      <Minus />
                    </Button>
                  </div>
                  <div className="flex items-start">
                    <div className="w-[90px] pr-2 flex-shrink-0">
                      <AspectRatio ratio={5 / 4}>
                        <img src={item.foodImage} className="object-cover w-full h-full rounded-sm" />
                      </AspectRatio>
                    </div>
                    <div className="flex items-start">
                      <div className="flex flex-col w-full">
                        {/* <p className="pr-7 font-semibold text-xs break-all line-clamp-3">
                    Combo Thịnh Vượng - Burger Gà Teriyaki
                  </p> */}
                        <p className="text-xs">{item.foodName}</p>
                      </div>
                      <div className="font-semibold text-sm text-nowrap text-center pr-3">{item.price}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
              <div className="flex flex-col items-center gap-2">
                <Frown className="w-20 h-20" />
                <h3 className="text-lg font-medium ">Không có món nào trong giỏ hàng</h3>
              </div>
            </div>
          )}

          {/* NOTE:  end! */}
        </ScrollArea>

        {Cart.length > 0 && (
          <footer className="flex-col flex gap-1">
            <div className="flex justify-between py-3">
              <span className="font-semibold">Tổng cộng</span>
              <span className="font-semibold">
                {Cart.reduce((total, item) => {
                  const price = parseFloat(item.price) || 0; // Chuyển price thành số, nếu lỗi thì mặc định là 0
                  const quantity = item.quantity || 1; // Nếu quantity bị undefined, mặc định là 1
                  return total + price * quantity;
                }, 0).toLocaleString()}{" "}
                ₫
              </span>
            </div>

            <PopoverClose asChild>
              <Link to="/checkout">
                <Button className="w-full">Xem lại đơn hàng</Button>
              </Link>
            </PopoverClose>
          </footer>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Cart;
