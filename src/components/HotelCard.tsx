
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface HotelCardProps {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  imageUrl: string;
  amenities: string[];
  featured?: boolean;
}

const HotelCard = ({
  id,
  name,
  location,
  price,
  rating,
  imageUrl,
  amenities,
  featured = false,
}: HotelCardProps) => {
  return (
    <Link to={`/hotels/${id}`} className="block group">
      <div className="overflow-hidden bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <div className="relative w-full overflow-hidden h-48">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          {featured && (
            <Badge className="absolute top-2 right-2" variant="secondary">
              مميز
            </Badge>
          )}
          <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded-md text-sm font-medium">
            {price.toLocaleString()} ر.س / ليلة
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <MapPin className="w-4 h-4 ml-1" />
            {location}
          </div>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 mr-1">{rating.toFixed(1)}</span>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1">
            {amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{amenities.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
