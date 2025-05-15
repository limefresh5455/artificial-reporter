import { useState, useEffect } from "react";
import axios from "axios";
import { MapPin } from "lucide-react";
import { getCompaniesLocations } from "@/lib/sanity"

interface LocationInputProps {
    onSelect: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({
    onSelect,
    placeholder = "Location",
    className = "",
}) => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<any>([]);
    const [isFocused, setIsFocused] = useState(false);

    // useEffect(() => {
    //     const fetchSuggestions = async () => {
    //         if (!query) {
    //             setSuggestions([]);
    //             return;
    //         }

    //         const result = await getCompaniesLocations(query);
    //         console.log(result)
    //         // try {

    //         //     const res = await axios.get("https://nominatim.openstreetmap.org/search", {
    //         //         params: {
    //         //             format: "json",
    //         //             q: query,
    //         //             addressdetails: 1,
    //         //             limit: 5,
    //         //         },
    //         //     });

    //         //     // Find the best matching result
    //         //     const bestMatch = res.data.find((item: any) => {
    //         //         const { address } = item;
    //         //         const city = address.city || address.town || address.village || address.hamlet || "";
    //         //         const state = address.state || "";
    //         //         const country = address.country || "";
    //         //         const queryLower = query.toLowerCase().trim();

    //         //         // Check if query matches city, state, or country
    //         //         return (
    //         //             city.toLowerCase() === queryLower ||
    //         //             state.toLowerCase() === queryLower ||
    //         //             country.toLowerCase() === queryLower
    //         //         );
    //         //     });

    //         //     // If a match is found, format it; otherwise, return an empty array or handle as needed
    //         //     const results = bestMatch
    //         //         ? [
    //         //             {
    //         //                 display: `${bestMatch.address.city || bestMatch.address.town || bestMatch.address.village || bestMatch.address.hamlet || ""}${bestMatch.address.state ? ", " + bestMatch.address.state : ""
    //         //                     }${bestMatch.address.country ? ", " + bestMatch.address.country : ""}`,
    //         //                 fullData: bestMatch,
    //         //             },
    //         //         ]
    //         //         : [];

    //         //     setSuggestions(results);
    //         // } catch (error) {
    //         //     console.error("Location API Error:", error);
    //         //     setSuggestions([]); // Optional: clear suggestions on error
    //         // }
    //     };

    //     const delayDebounce = setTimeout(fetchSuggestions, 300);
    //     return () => clearTimeout(delayDebounce);
    // }, [query]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!query) {
                setSuggestions([]);
                return;
            }

            const result = await getCompaniesLocations(query);
            console.log(result);

            const filteredSuggestions = result
                .map((item: any) => {
                    const queryLower = query.toLowerCase();

                    if (item.locationCity?.toLowerCase().includes(queryLower)) {
                        return item.locationCity;
                    }

                    if (item.locationState?.toLowerCase().includes(queryLower)) {
                        return item.locationState;
                    }

                    if (item.locationCountry?.toLowerCase().includes(queryLower)) {
                        return item.locationCountry;
                    }

                    return null;
                })
                .filter(Boolean); // Remove nulls

            // Remove duplicates
            const uniqueSuggestions = [...new Set(filteredSuggestions)];

            setSuggestions(uniqueSuggestions);
        };

        const delayDebounce = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(delayDebounce);
    }, [query]);


    const handleSelect = (place: any) => {
        setQuery(place);
        setSuggestions([]);
        onSelect(place);
    };

    return (
        <div className={`relative ${className}`}>
            <MapPin size={20} />
            <input
                type="text"
                value={query}
                placeholder={placeholder}
                className="w-full pl-8 pr-4 py-2 focus:outline-none "
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 100)}
            />

            {isFocused && suggestions.length > 0 && (
                <ul className="absolute z-10 top-full left-0 right-0 bg-white shadow-md max-h-60 overflow-auto rounded border border-gray-200">
                    {suggestions.map((place: any, index: any) => (
                        <li
                            key={index}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                            onClick={() => handleSelect(place)}
                        >
                            {place}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LocationInput;
