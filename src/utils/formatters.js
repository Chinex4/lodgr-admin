export const money = (value, currency = "NGN") =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const date = (value) => (value ? new Date(value).toLocaleString() : "-");

export const get = (obj, path, fallback = "-") =>
  path.split(".").reduce((acc, key) => acc?.[key], obj) ?? fallback;

export const idOf = (row) => row?.id || row?.public_id;
export const asArray = (value) => (Array.isArray(value) ? value : []);
