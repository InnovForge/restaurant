import { useState } from "react";
import logo from "@/assets/react.svg";
import thongbaobocongthuong from "@/assets/images/thongbaobocongthuong.png";
import food from "@/assets/images/food.jpg";
import { Button } from "@/components/ui/button";
import { Link, NavLink } from "react-router";
import SearchLocation from "@/features/address/components/search-location";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { useMediaQuery } from "@/hooks/use-media-query";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRef } from "react";
import useOutsideClick from "@/hooks/use-outside-click";
import useAddressStore from "@/stores/useAddressStore";
import { X, Utensils, ArrowLeft, MapPin, Search, History, Menu, LogOut, User } from "lucide-react";
import Cart from "@/features/cart/components/cart";
import useAuthUserStore from "@/stores/useAuthUserStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PopoverContent, PopoverTrigger, Popover } from "@/components/ui/popover";
import { api } from "@/lib/api-client";
import { useNavigate } from "react-router";
import { Separator } from "../ui/separator";

export const DashboardLayout = ({ children }) => {
  const [value, setValue] = useState(null);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isOpenSheet, setIsOpenSheet] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { addresses, setAddress } = useAddressStore();
  const { authUser } = useAuthUserStore();
  const handleAdd = () => {
    setAddress(value);
  };

  const navItems = [
    {
      name: "Trang chủ",
      href: "/home",
      icon: Utensils,
    },
    {
      name: "Lịch sử",
      href: "/history",
      icon: History,
    },
  ];

  return (
    <div className="flex flex-col m-auto">
      <header className="flex flex-col sticky top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background py-1 z-50">
        <div className="px-2 flex flex-col gap-2 max-w-7xl m-auto w-full pb-1">
          <div className="flex justify-between items-center">
            <div className="flex w-full items-center gap-4">
              <div className="flex items-center gap-1">
                <Sheet open={isOpenSheet} onOpenChange={setIsOpenSheet}>
                  <SheetTrigger>
                    <Menu className="flex md:hidden" />
                  </SheetTrigger>
                  <SheetContent side="left">
                    <VisuallyHidden>
                      <SheetHeader>
                        <SheetTitle>Are you absolutely sure?</SheetTitle>
                        <SheetDescription>
                          This action cannot be undone. This will permanently delete your account and remove your data
                          from our servers.
                        </SheetDescription>
                      </SheetHeader>
                    </VisuallyHidden>
                    <Link to="/home" className="flex items-center gap-1 pb-3" onClick={() => setIsOpenSheet(false)}>
                      <img src={logo} className="logo react w-[30x] h-[30px]" alt="React logo" />
                    </Link>
                    <div className="flex flex-col items-start gap-2">
                      {navItems.map((item) => (
                        <Link
                          to={item.href}
                          key={item.name}
                          className="flex items-center gap-1"
                          onClick={() => setIsOpenSheet(false)}
                        >
                          <Button variant="ghost" className="pl-0">
                            {item.icon && <item.icon className="w-5 h-5" />}
                            {item.name}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>

                <Link to="/home" className="flex items-center gap-1">
                  <img src={logo} className="logo react w-[30x] h-[30px]" alt="React logo" />
                  <h1 className="text-xl font-semibold hidden md:block">CIDO</h1>
                </Link>
              </div>
              <div className="flex flex-1 gap-1">
                {isDesktop && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost">
                        <MapPin className="w-6 h-6" />
                        <p className="whitespace-nowrap overflow-hidden text-ellipsis xl:max-w-xs max-w-32">
                          {addresses[0]?.title ?? "Chọn địa chỉ"}
                        </p>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="top-1/2">
                      <DialogHeader>
                        <DialogTitle>Chọn địa chỉ chính xác</DialogTitle>
                        <DialogDescription>Để chúng tôi cung cấp dịch vụ tốt nhất cho bạn</DialogDescription>
                      </DialogHeader>
                      <SearchLocation value={value} setValue={setValue} />
                      <DialogClose asChild>
                        <Button onClick={() => handleAdd()} disabled={value === null}>
                          Xác Nhận
                        </Button>
                      </DialogClose>
                      <img src={food} alt="food" className="h-80 object-cover rounded-md" />
                    </DialogContent>
                  </Dialog>
                )}
                <div className="relative md:flex hidden w-full lg:max-w-md max-w-xs">
                  <MainSearchBar />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Cart />
              {authUser ? (
                <UserPopover />
              ) : (
                <div className="gap-1 items-center flex">
                  <Button variant="ghost" asChild>
                    <Link to="/login">Đăng nhập</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/register">Đăng kí</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="flex h-8 justify-end items-center gap-2">
            <div className="hidden md:flex gap-2 ">
              {navItems.map((item) => (
                <NavLink to={item.href} key={item.name}>
                  {({ isActive }) => (
                    <Button
                      variant="ghost"
                      className={`flex relative items-center gap-1 ${isActive ? "text-primary hover:text-primary font-bold after:content-[''] after:absolute  after:h-0.5 after:bg-primary after:bottom-0 after:transition-all after:duration-300 after:w-full after:scale-x-100" : "after:w-0"}`}
                    >
                      {item.icon && <item.icon className="w-5 h-5" />}
                      {item.name}
                    </Button>
                  )}
                </NavLink>
              ))}
            </div>
            <div className="md:hidden flex justify-between w-full gap-2 items-center">
              <Drawer>
                <DrawerTrigger>
                  <MapPin className="w-5 h-5" />
                </DrawerTrigger>
                <DrawerContent className="gap-4 p-1 flex-1">
                  <DrawerHeader>
                    <DrawerTitle>Chọn địa chỉ chính xác</DrawerTitle>
                    <DrawerDescription>Để chúng tôi cung cấp dịch vụ tốt nhất cho bạn</DrawerDescription>
                  </DrawerHeader>
                  <SearchLocation value={value} setValue={setValue} />
                  <DrawerClose asChild>
                    <Button onClick={() => handleAdd()} disabled={value === null}>
                      Xác Nhận
                    </Button>
                  </DrawerClose>
                  <img src={food} alt="food" className="h-80 object-cover rounded-md" />
                </DrawerContent>
              </Drawer>
              <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
                <DialogTrigger asChild>
                  <div className="relative flex md:hidden w-full">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Tìm kiếm món ăn, nhà hàng" className="pl-8" />
                  </div>
                </DialogTrigger>
                <VisuallyHidden>
                  <DialogTitle> search</DialogTitle>
                  <DialogDescription>test</DialogDescription>
                </VisuallyHidden>
                <DialogContent className="max-w-screen h-screen border-none sm:rounded-none rounded-none shadow-none [&>button]:hidden flex p-1">
                  <div className="flex items-center w-full gap-1 h-fit">
                    <MainSearchBar isMobile={true} setIsOpen={setIsOpenDialog} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl m-auto px-2 my-2">
        {addresses.forEach((address) => {
          <p>{address.title}</p>;
        })}
        {children}
      </main>
      <footer className="bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background p-2 border-t">
        <div className="flex justify-between items-start max-w-7xl m-auto">
          <div className="flex flex-col items-stretch h-full">
            <div className="gap-1 flex italic text-xs pb-10">
              <Link to="/privacy">Chính sách bảo mật</Link>
              <span>|</span>
              <Link to="/contact">Quy chế bảo mật</Link>
            </div>
            <img src={thongbaobocongthuong} alt="food" className="object-cover justify-self-start" width={140} />
          </div>
          <div className="flex flex-col items-center">
            <h3 className="pb-4">© 2025 CIDO</h3>
            <div className="flex gap-2">
              <div>
                <p>@ngtuonghy</p>
                <p>@name</p>
                <p>@name</p>
              </div>
              <div>
                <p>@TTV</p>
                <p>@name</p>
                <p>@name</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const MainSearchBar = ({ isMobile, setIsOpen }) => {
  const [value, setValue] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const inputChange = (e) => {
    setValue(e.target.value);
  };
  const handleFocus = () => {
    setOpen(true);
  };
  const handleBlur = () => {
    setOpen(false);
  };
  const handleLocationSelect = (item) => {
    console.log(item);
    setValue(item.name);
    setOpen(false);
  };
  const data = [
    {
      id: 1,
      name: "item 1",
    },
    {
      id: 2,
      name: "item 2",
    },
    {
      id: 4,
      name: "item 3",
    },
    {
      id: 5,
      name: "item 4",
    },
    {
      id: 6,
      name: "item 5",
    },
  ];

  useOutsideClick(containerRef, () => {
    console.log("click outside");
    setOpen(false);
  });

  const handleKeyDown = (e) => {
    console.log(e.key);
    if (data.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % data.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + data.length) % data.length);
        break;
      case "Enter":
        if (focusedIndex >= 0) {
          e.preventDefault();
          handleLocationSelect(data[focusedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-fit" onKeyDown={handleKeyDown}>
      {isMobile ? (
        <ArrowLeft onClick={() => setIsOpen(false)} className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5" />
      ) : (
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      )}
      <Input
        value={value}
        onChange={inputChange}
        onFocus={handleFocus}
        // onBlur={handleBlur}
        placeholder="Tìm kiếm món ăn, nhà hàng"
        className="px-8"
      />
      {value.length > 0 && (
        <X
          onClick={() => {
            setValue("");
            containerRef.current.focus();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 cursor-pointer"
        />
      )}
      {open && (
        <ul className="absolute w-full bg-white top-[calc(100%+4px)] text-popover-foreground bg-popover border rounded-md">
          {data.map((item, index) => (
            <li
              className={`px-2 py-2 cursor-pointer hover:bg-accent first:rounded-t-md last:rounded-b-md flex gap-1 items-center
${index === focusedIndex ? "bg-accent" : ""}`}
              key={item.id}
              onMouseEnter={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(-1)}
              onClick={() => {
                console.log(item);
                setOpen(false);
              }}
            >
              <Search className="w-4 h-4" /> {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const UserPopover = () => {
  const { authUser } = useAuthUserStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    const res = api.post("/v1/auth/logout");
    navigate(0);

    console.log("logout");
  };

  const [popoverOpen, setPopoverOpen] = useState(false);

  const items = [
    { icon: User, path: "/me", label: "Your profile" },
    { icon: Utensils, path: "/admin", label: "Admin" },
  ];

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger>
        <Avatar className="border">
          <AvatarImage src={authUser.avatarUrl} />
          <AvatarFallback>{authUser.name}</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-2">
        <div className="flex gap-2 items-center">
          <Avatar className="border">
            <AvatarImage src={authUser.avatarUrl} />
            <AvatarFallback>{authUser.name}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-bold">{authUser.name}</p>
            <p className="text-xs text-accent-foreground">{authUser.username}</p>
          </div>
        </div>
        <Separator className="my-2" />
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <Link
              to={item.path}
              key={item.label}
              className="flex gap-2 text-sm hover:bg-accent hover:text-accent-foreground p-1.5 rounded-md"
              onClick={() => setPopoverOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              <p>{item.label}</p>
            </Link>
          ))}
          <Separator />
          <div
            onClick={handleLogout}
            className="flex gap-2 text-sm hover:bg-accent hover:text-accent-foreground p-1.5 rounded-md"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
