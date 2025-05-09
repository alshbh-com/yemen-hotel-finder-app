
import { useState } from "react";
import { Search, Calendar, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ location, checkIn, checkOut, guests });
    // Implement search functionality here
  };

  return (
    <form onSubmit={handleSearch} className="w-full mx-auto bg-white rounded-lg shadow-md p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <Input
            type="text"
            placeholder="إلى أين تريد الذهاب؟"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-3 pr-10 h-12"
            dir="rtl"
          />
        </div>
        
        <div className="relative">
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <Input
            type="date"
            placeholder="تاريخ الوصول"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="pl-3 pr-10 h-12"
          />
        </div>
        
        <div className="relative">
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <Input
            type="date"
            placeholder="تاريخ المغادرة"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="pl-3 pr-10 h-12"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              type="number"
              placeholder="عدد الضيوف"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="pl-3 pr-10 h-12"
              min="1"
            />
          </div>
          
          <Button type="submit" className="h-12 px-6">
            <Search className="w-4 h-4 ml-2" />
            بحث
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
