import React, { useState, useEffect, useCallback, useRef } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { getLocations } from "../api/get-locations";

const SearchLocation = () => {
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [data, setData] = useState([]);
	const [selectedLocation, setSelectedLocation] = useState(null);
	const timeoutIdRef = useRef(null); 

  console.log(selectedLocation);

	const onChange = useCallback((e) => {
		const query = e.target.value;
		setSearchValue(query);

		if (timeoutIdRef.current) {
			clearTimeout(timeoutIdRef.current);
		}

	
		if (query.length > 5) {
			timeoutIdRef.current = setTimeout(async () => {
				const response = await getLocations(query);
				setData(response.locations);
			}, 500);
		}
	}, []);

	useEffect(() => {
		if (data.length > 0 && searchValue.length > 5) {
			setIsPopoverOpen(true);
		} else {
			setIsPopoverOpen(false);
		}
	}, [data, searchValue]);

	return (
		<Popover open={isPopoverOpen}>
			<PopoverTrigger disabled>
				<Input
					placeholder="Search location"
					onChange={onChange}
					value={searchValue}
				/>
			</PopoverTrigger>

			<PopoverContent>
				<ul>
					{data.map((location) => (
						<li
							key={location.name}
							onClick={() => setSelectedLocation(location)}
						>
							{location.name}
						</li>
					))}
				</ul>
			</PopoverContent>
		</Popover>
	);
};

export default SearchLocation;
