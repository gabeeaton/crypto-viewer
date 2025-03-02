"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [cryptoData, setCryptoData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 5,
            page: 1,
          },
        }
      );
      const data = result.data;
      setCryptoData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredData = cryptoData.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchQuery) ||
      crypto.symbol.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="bg-black min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="w-full max-w-4xl flex flex-col gap-4 items-center">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            className="text-white hover:border-white focus:outline-none focus:ring-2 focus:ring-white text-sm p-2"
            type="text"
            placeholder="Search by name or symbol"
            value={searchQuery}
            onChange={handleSearch}
          />
          <Button className="bg-white text-black hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-white p-2 text-sm">
            <Search />
          </Button>
        </div>

        <div>
          <Button
            className="hover:bg-gray-300 bg-white text-black p-2 text-sm"
            onClick={fetchData}
          >
            <Refresh />
          </Button>
        </div>

        <div className="w-full overflow-hidden">
          <Table className="text-white w-full text-sm sm:text-base">
            <TableCaption className="text-white text-sm sm:text-base">
              Latest prices of 5 cryptocurrencies.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[25%]">Name</TableHead>
                <TableHead className="w-[25%]">Current Price</TableHead>
                <TableHead className="w-[25%]">Price Change (24hr)</TableHead>
                <TableHead className="w-[25%] text-right">Market Cap</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={4}>
                      <div className="animate-pulse flex space-x-4">
                        <div className="flex-1 space-y-2 py-2">
                          <div className="h-4 bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredData.length > 0 ? (
                filteredData.map((crypto) => (
                  <TableRow key={crypto.id}>
                    <TableCell className="font-medium flex items-center space-x-2">
                      <img src={crypto.image} alt={crypto.name} className="h-6" />
                      <span>{crypto.symbol.toUpperCase()}</span>
                    </TableCell>
                    <TableCell>${crypto.current_price.toLocaleString()}</TableCell>
                    <TableCell>
                      <span
                        className={
                          crypto.price_change_24h >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {crypto.price_change_24h.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">${crypto.market_cap.toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}

function Search() {
  return (
    <div>
      <img className="h-4" src="/search.png" alt="Search Icon" />
    </div>
  );
}

function Refresh() {
  return (
    <div>
      <img className="h-4" src="/refresh.png" alt="Refresh Icon" />
    </div>
  );
}