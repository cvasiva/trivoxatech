import { useState, useEffect } from "react";
import { api } from "../utils/api";

/**
 * Fetches page data from the backend API.
 * Falls back to the provided static JSON if the API is unavailable.
 */
export default function usePageData(key, staticData) {
  const [data, setData] = useState(staticData);

  useEffect(() => {
    api.getData(key)
      .then((d) => { if (d) setData(d); })
      .catch(() => {}); // silently fall back to static JSON
  }, [key]);

  return data;
}
