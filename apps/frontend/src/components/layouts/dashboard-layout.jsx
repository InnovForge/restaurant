import { useState } from "react";
import logo from "@/assets/react.svg";
import thongbaobocongthuong from "@/assets/images/thongbaobocongthuong.png";
import food from "@/assets/images/food.jpg";
import { Button } from "@/components/ui/button";
import { Link, NavLink, useSearchParams } from "react-router";
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
import { X, Utensils, ArrowLeft, MapPin, Search, History, Menu, LogOut, User, Home } from "lucide-react";
import Cart from "@/features/cart/components/cart";
import useAuthUserStore from "@/stores/useAuthUserStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PopoverContent, PopoverTrigger, Popover } from "@/components/ui/popover";
import { api } from "@/lib/api-client";
import { useNavigate } from "react-router";
import { Separator } from "../ui/separator";
import { generateAvatarInitial } from "@/utils/generateAvatarInitial";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchSuggestions } from "@/hooks/use-search-suggestions";

export const DashboardLayout = ({ children }) => {
  const [value, setValue] = useState(null);
  const handleAressChange = (address) => {
    setValue(address);
  };
  // console.log(value);
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
      icon: Home,
    },
    {
      name: "Lịch sử",
      href: "/history",
      icon: History,
    },
  ];

  return (
    <div className="flex flex-col m-auto">
      <header
        id="header-app"
        className="flex flex-col sticky top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background py-1 z-50"
      >
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
                    <Link to="/" className="flex items-center gap-1 pb-3" onClick={() => setIsOpenSheet(false)}>
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
                          <Button variant="ghost" className="pl-0  select-none">
                            {item.icon && <item.icon className="w-5 h-5" />}
                            {item.name}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>

                <Link to="/" className="flex items-center gap-1">
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
                          {addresses[0]?.formatted ?? "Chọn địa chỉ"}
                        </p>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="top-1/2">
                      <DialogHeader>
                        <DialogTitle>Chọn địa chỉ chính xác</DialogTitle>
                        <DialogDescription>Để chúng tôi cung cấp dịch vụ tốt nhất cho bạn</DialogDescription>
                      </DialogHeader>
                      <SearchLocation value={value} onChange={handleAressChange} />
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
                      {item.icon && (
                        <item.icon className={`w-5 h-5 ${isActive ? "scale-125 duration-300" : "scale-100"}`} />
                      )}
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
                  <SearchLocation value={value} onChange={handleAressChange} />
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
          <p>{address.formatted}</p>;
        })}
        {children}
      </main>
      <footer className="bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background p-2 border-t mt-10">
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
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const { authUser } = useAuthUserStore();

  const queryClient = useQueryClient();
  const saveSearch = useMutation({
    mutationFn: (value) => api.post("/v1/search-history", { query: value }),
  });

  const removeHistory = useMutation({
    mutationFn: (value) => api.delete(`/v1/search-history/${value}`),
    onSuccess: () => {
      queryClient.invalidateQueries("search-history");
    },
  });

  const { data: suggestions, isFetching } = useSearchSuggestions(value);
  const { data: valueSearch = [] } = useQuery({
    queryKey: ["search-history", open],
    queryFn: async () => {
      const result = await api.get("/v1/search-history");
      return result.data.data || [];
    },
    enabled: open && authUser !== null,
  });

  // console.log("suggestions", suggestions);

  const filteredData = value
    ? [{ id: "custom", query: value }, ...(suggestions?.length ? suggestions : valueSearch)].slice(0, 5)
    : valueSearch.slice(0, 5);

  const inputChange = (e) => {
    setValue(e.target.value);
  };

  const handleFocus = async () => {
    setOpen(true);
  };

  const handleLocationSelect = (item) => {
    saveSearch.mutate(item.query);
    const query = new URLSearchParams({ q: item.query }).toString();
    navigate(`/result?${query}`);
    setOpen(false);
  };

  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("q");

  useEffect(() => {
    if (searchQuery) {
      setValue(searchQuery);
    }
  }, [searchQuery]);

  useOutsideClick(containerRef, () => {
    setOpen(false);
  });

  const handleKeyDown = (e) => {
    if (filteredData.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % filteredData.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + filteredData.length) % filteredData.length);
        break;
      case "Enter":
        if (focusedIndex >= 0) {
          handleLocationSelect(filteredData[focusedIndex]);
        } else if (value.trim() !== "") {
          const query = new URLSearchParams({ q: value }).toString();
          navigate(`/result?${query}`);
        }
        setOpen(false);
        setFocusedIndex(-1);
        inputRef.current?.blur();
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
        ref={inputRef}
        value={value}
        onChange={inputChange}
        onFocus={handleFocus}
        placeholder="Tìm kiếm món ăn, nhà hàng"
        className="px-8"
      />
      {value.length > 0 && (
        <X onClick={() => setValue("")} className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 cursor-pointer" />
      )}
      {open && (
        <ul className="absolute w-full bg-white top-[calc(100%+4px)] text-popover-foreground bg-popover border rounded-md">
          {filteredData.map((item, index) => (
            <li
              className={`px-2 py-1 cursor-pointer hover:bg-accent first:rounded-t-md last:rounded-b-md flex gap-1 items-center ${
                index === focusedIndex ? "bg-accent" : ""
              }`}
              key={item.id}
              onMouseEnter={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(-1)}
              onClick={() => {
                saveSearch.mutate(item.query);
                const query = new URLSearchParams({ q: item.query }).toString();
                navigate(`/result?${query}`);
                setOpen(false);
              }}
            >
              <div className="flex w-full justify-between">
                <div className="flex gap-2 items-center">
                  {item.type === "history" ? <History className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                  {item.query}
                </div>
                {item.type === "history" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeHistory.mutate(item.id);
                    }}
                  >
                    xoá
                  </Button>
                )}
              </div>
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

    // console.log("logout");
  };

  const [popoverOpen, setPopoverOpen] = useState(false);

  const items = [
    { icon: User, path: "/me", label: "Hồ sơ của bạn" },
    { icon: Utensils, path: "/d/restaurants", label: "Quản trị nhà hàng" },
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
            <AvatarFallback>{generateAvatarInitial(authUser.name)}</AvatarFallback>
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
            className="flex gap-2 text-sm hover:bg-accent hover:text-accent-foreground p-1.5 rounded-md  cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
