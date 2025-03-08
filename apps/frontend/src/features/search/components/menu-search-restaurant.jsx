import { useState } from "react";
import { Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router";
const MenuSearchRestaurant = () => {
  const maxDistance = 100;
  const [searchParams, setSearchParams] = useSearchParams();
  const [distance, setDistance] = useState(searchParams.get("distance") || 10);

  const handleInputChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 1;
    if (value < 1) value = 1;
    if (value > maxDistance) value = maxDistance;
    setDistance(value);
  };

  const applyFilter = () => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("distance", distance.toString());
      return newParams;
    });
  };

  return (
    <div className="flex-col h-[calc(100vh-80px)] overflow-y-auto sticky top-[100px] z-10 bg-background pt-2 pb-1 mb-8 overflow-hidden md:flex hidden mr-6 w-[220px] justify-start gap-3 items-center">
      <div className="flex flex-row gap-2 w-full">
        <Filter />
        <p className="text-start">Lọc tìm kiếm</p>
      </div>

      <div className="w-full">
        <h4 className="text-start text-lg font-bold">Khoảng cách</h4>

        <Slider
          value={[distance]}
          onValueChange={(value) => setDistance(value[0])}
          min={1}
          max={maxDistance}
          step={1}
          className="mt-2"
        />

        <div className="flex items-center gap-2 mt-2">
          <Input
            type="number"
            value={distance}
            onChange={handleInputChange}
            min={1}
            max={maxDistance}
            step={1}
            className="w-16 text-center"
          />
          <span className="text-sm text-gray-500">km</span>
        </div>

        <Button onClick={applyFilter} className="mt-2 w-full">
          Áp dụng
        </Button>

        <p className="text-sm text-gray-500 mt-2">
          Phạm vi tìm: <strong>{searchParams.get("distance") || 10} km</strong>
        </p>
      </div>
    </div>
  );
};

export default MenuSearchRestaurant;
