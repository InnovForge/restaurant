import ListRestaurantSearch from "@/features/search/components/list-restaurant-search";
import MenuSearchRestaurant from "@/features/search/components/menu-search-restaurant";

// const { addresses } = useAddressStore();
const Search = () => {
  // setSearchParams({ q: 'test' })
  return (
    <div className="min-h-screen flex-row flex w-full">
      <MenuSearchRestaurant />
      <ListRestaurantSearch />
    </div>
  );
};

export default Search;
