import { useState, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { getGeocode, getReverseGeocode } from "../api/get-locations";
import { LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SyncLoader } from "react-spinners";
import { CircleX } from "lucide-react";
import useAddressStore from "@/stores/useAddressStore";

const SearchLocation = ({ value, setValue }) => {
  const { addresses } = useAddressStore();
  const [searchValue, setSearchValue] = useState(addresses[0]?.title ?? "");
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isfetching, setIsFetching] = useState(false);
  const inputRef = useRef(null);
  const timeoutIdRef = useRef(null);

  const handleInputChange = useCallback(
    (e) => {
      const query = e.target.value;
      setSearchValue(query);
      setIsOpen(query.length > 0);
      setFocusedIndex(-1);

      if (setValue) {
        setValue(null);
      }

      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }

      if (query.length > 5) {
        setIsFetching(true);
        timeoutIdRef.current = setTimeout(async () => {
          try {
            const response = await getGeocode(query);
            setData(response.data || []);
            setIsFetching(false);
          } catch (error) {
            setIsFetching(false);
            console.error("Error fetching locations:", error);
          }
        }, 500);
      } else {
        setIsFetching(false);
        setData([]);
      }
    },
    [setValue],
  );

  const handleLocationSelect = (location) => {
    setSearchValue(location.title);
    console.log(location);
    setIsOpen(false);
    if (setValue) {
      setValue(location);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen || data.length === 0) return;

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

  const handleCurrentGeocode = async () => {
    setIsFetching(true);
    const res = await getReverseGeocode();
    setSearchValue(res.data[0].title);
    setValue(res.data[0]);
    setIsFetching(false);
  };

  return (
    <div className="bg-background relative" onKeyDown={handleKeyDown}>
      <div className="relative">
        <Input
          ref={inputRef}
          placeholder="127, Đường Hoàng Minh Thảo"
          variant="outline"
          size="default"
          value={searchValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(data.length > 0)}
          className="pr-9"
        />
        {isfetching ? (
          <div className="absolute top-1/2 right-[2px] -translate-y-1/2">
            <SyncLoader size={4} className="p-2" />
          </div>
        ) : (
          <div className="absolute top-1/2 right-[2px] -translate-y-1/2">
            {searchValue === "" ? (
              <Button type="button" variant="ghost" onClick={handleCurrentGeocode}>
                <span>Vị trí hiện tại</span> <LocateFixed color="blue" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchValue("");
                  setData([]);
                  setValue(null);
                  inputRef.current.focus();
                }}
              >
                <CircleX />
              </Button>
            )}
          </div>
        )}
      </div>
      {isOpen && data.length !== 0 && (
        <ul className="w-full rounded-md absolute z-10 top-[calc(100%+10px)] text-popover-foreground bg-popover border">
          {data.length > 0
            ? data.map((location, index) => (
                <li
                  key={location.title}
                  className={`px-2 py-2 cursor-pointer hover:bg-accent ${index === focusedIndex ? "bg-accent" : ""}`}
                  onClick={() => handleLocationSelect(location)}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  {location.title}
                </li>
              ))
            : null}
        </ul>
      )}
    </div>
  );
};

export default SearchLocation;
