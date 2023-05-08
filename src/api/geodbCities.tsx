const GEO_API_KEY = process.env.VITE_RAPID_API_KEY || "";

export const GEO_API_OPTIONS: RequestInit = {
  method: "GET",
  headers: new Headers({
    "X-RapidAPI-Key": GEO_API_KEY,
    "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
  }),
};

export const GEO_API_URL = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities";
