import React, { useState, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { getLocations } from "../api/get-locations";

const SearchLocation = ({ value, onChange, onBlur }) => {
  const [searchValue, setSearchValue] = useState(value || "");
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1); 
  const timeoutIdRef = useRef(null);

 
  const handleInputChange = useCallback(
    (e) => {
      const query = e.target.value;
      setSearchValue(query);
      setIsOpen(query.length > 0);
      setFocusedIndex(-1); 

      if (onChange) {
        onChange(null);
      }

      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }

      if (query.length > 5) {
        timeoutIdRef.current = setTimeout(async () => {
          try {
            const response = await getLocations(query);
            setData(response.locations || []);
          } catch (error) {
            console.error("Error fetching locations:", error);
          }
        }, 500);
      } else {
        setData([]);
      }
    },
    [onChange]
  );

  const handleLocationSelect = (location) => {
    setSearchValue(location.name);
    setIsOpen(false);
    if (onChange) {
      onChange(location);
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

  return (
    <div className="relative w-full" onKeyDown={handleKeyDown}>
      <Input
        placeholder="Search location"
        value={searchValue}
        onChange={handleInputChange}
        onBlur={onBlur}
        onFocus={() => setIsOpen(data.length > 0)} // Mở dropdown khi focus input
      />
      {isOpen && (
        <ul className="z-50 absolute w-full top-[calc(100%+10px)] bg-white border border-gray-300 shadow-md">
          {data.length > 0 ? (
            data.map((location, index) => (
              <li
                key={location.name}
                className={`px-2 py-1 cursor-pointer hover:bg-gray-100 ${
                  index === focusedIndex ? "bg-gray-200" : ""
                }`}
                onClick={() => handleLocationSelect(location)}
                onMouseEnter={() => setFocusedIndex(index)} 
              >
                {location.name}
              </li>
            ))
          ) : (
            <li className="px-2 py-1 text-gray-500">No locations found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchLocation;



