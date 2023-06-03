import { useState, useEffect } from "react";
import { GEO_API_URL, GEO_API_OPTIONS } from "../api/geodbCities";
import { City, Option } from "../types/types";

const useCitySuggestions = (value: string, limit = 5): [Option[], boolean] => {
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        if (value.length < 2) {
          setOptions([]);
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `${GEO_API_URL}?minPopulation=10000&limit=${limit}&namePrefix=${value}`,
          GEO_API_OPTIONS
        );

        const data = await response.json();

        if (!data.data) {
          setOptions([]);
          setIsLoading(false);
          return;
        }

        const optionsData = data.data.map(
          ({ id, city, country, latitude, longitude }: City) => ({
            id,
            city,
            country,
            latitude,
            longitude,
            label: `${city}, ${country}`,
          })
        );

        setOptions(optionsData);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchSuggestions();

    // cleanup function to cancel the fetch on unmount
    return () => {
      setIsLoading(false);
    };
  }, [value, limit]);

  return [options, isLoading];
};

export default useCitySuggestions;
