"use client";

import Image from "next/image";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const [debouncedValue] = useDebounce(search, 500);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (debouncedValue) router.push(`/discover?search=${debouncedValue}`);
    else if (!debouncedValue && pathname === "/discover")
      router.push("/discover");
  }, [router, pathname, debouncedValue]);

  return (
    <div className="relative mt-8 block">
      <Input
        className="input-class py-6 pl-12 focus-visible:ring-orange-1 focus-visible:ring-offset-orange-1"
        placeholder="Search for podcasts"
        value={search}
        onChange={handleSearch}
        onLoad={() => setSearch("")}
      />
      <Image
        src={"/icons/search.svg"}
        alt="search"
        width={20}
        height={20}
        className="absolute left-4 top-3.5"
      />
    </div>
  );
};

export default SearchBar;
