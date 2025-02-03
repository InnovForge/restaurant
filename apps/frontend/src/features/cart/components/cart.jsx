import React from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";
import { PopoverClose } from "@radix-ui/react-popover";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Plus, Minus, ShoppingCart } from "lucide-react";

const tags = Array.from({ length: 50 }).map(
	(_, i, a) => `v1.2.0-beta.${a.length - i}`,
);

const Cart = () => {
	const cart = [
		{
			id: "product-1",
			name: "Áo thun",
			price: 200000,
			quantity: 2,
		},
		{
			id: "product-2",
			name: "Quần jeans",
			price: 500000,
			quantity: 1,
		},
	];

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon" className="gap-1">
					<ShoppingCart />
					<span>1</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[440px] h-fit flex flex-col">
				<header className="pb-4 border-b">
					<h3 className="text-lg font-medium leading-none">Giỏ đồ ăn</h3>
				</header>
				<ScrollArea className="h-[450px] w-full py-2">
					<PopoverClose asChild>
						<Link to="/restaurant/McDonald">
							<h4 className="mb-4 font-semibold leading-none">
								McDonald’s - 2 Tháng 9
							</h4>
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
									<img
										src="https://th.bing.com/th/id/R.0f6e3e1a3be694277bb55f97413184cb?rik=FWiarVBsSUPCsw&pid=ImgRaw&r=0"
										className="object-cover w-full h-full rounded-sm"
									/>
								</AspectRatio>
							</div>
							<div className="flex items-start">
								<div className="flex flex-col w-full">
									<p className="pr-7 font-semibold text-xs break-all line-clamp-3">
										Combo Thịnh Vượng - Burger Gà Teriyaki
									</p>
									<p className="text-xs">ga</p>
								</div>
								<div className="font-semibold text-sm text-nowrap text-center pr-3">
									1000 ₫
								</div>
							</div>
						</div>
					</div>

					<div className="p-4">
						<h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
						{tags.map((tag) => (
							<>
								<div key={tag} className="text-sm">
									{tag}
								</div>
								<Separator className="my-2" />
							</>
						))}
					</div>
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
