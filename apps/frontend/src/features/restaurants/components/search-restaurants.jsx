import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SearchRestaurants = ({ searchTerm, setSearchTerm, setSortOption, sortOption }) => {
  return (
    <div className="flex md:flex-row flex-col justify-between md:items-center gap-3 w-full">
      <div className="relative w-full h-fit">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          // onFocus={handleFocus}
          // onBlur={handleBlur}
          placeholder="Tìm kiếm nhà hàng"
          className="px-8"
        />
      </div>
      <Select value={sortOption} onValueChange={setSortOption} defaultValue="name" className="hidden">
        <SelectTrigger className="md:max-w-[180px] w-full">
          <SelectValue placeholder="Chọn để Xếp" va />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">Xếp theo ngày tạo </SelectItem>
          <SelectItem value="name">Xếp theo tên</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SearchRestaurants;
