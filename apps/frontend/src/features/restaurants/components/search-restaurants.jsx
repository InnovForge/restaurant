import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SearchRestaurants = () => {
  return (
    <div className="flex flex-row justify-between items-center gap-3 w-full">
      <div className="relative w-full h-fit">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          // value={value}
          // onChange={inputChange}
          // onFocus={handleFocus}
          // onBlur={handleBlur}
          placeholder="Tìm kiếm nhà hàng"
          className="px-8"
        />
      </div>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Chọn để Xếp" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Xếp theo tên</SelectItem>
          {/* <SelectItem value="system">Xếp theo </SelectItem> */}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchRestaurants;
