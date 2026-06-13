import { useEffect, useState } from "react";
import { api, errorMessage, unwrap } from "../lib/api";
import { asArray } from "../utils/formatters";

export function useApiList(endpoint, params = {}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const key = JSON.stringify(params);

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      setRows(asArray(unwrap(await api.get(endpoint, { params }))));
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [endpoint, key]); // eslint-disable-line react-hooks/exhaustive-deps

  return { rows, loading, error, reload: load };
}
