// import Cookies from "js-cookie";

export const setToLocalStorage = (
  data: {} | null | string | [...any],
  key: string | [...any]
): boolean => {
  if (key.length === 0 && typeof key === "string") {
    if (data) {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    }
  } else if (Array.isArray(key)) {
    key.forEach((item, index) => {
      if (Array.isArray(data)) {
        if (typeof data[index] === "object") {
          localStorage.setItem(item, JSON.stringify(data));
        }
        if (typeof data[index] === "string") {
          localStorage.setItem(item, data[index]);
        }
      }
    });
    return true;
  }
  return false;
};

export const getFromLocalStorage = (key: string): {} | null => {
  const data = localStorage.getItem(key);
  if (typeof data === "string") {
    return data;
  }
  if (data && typeof data === "object") {
    return JSON.parse(data);
  }

  return null;
};
export const removeFromLocalStorage = (key: string): boolean => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    return true;
  }
  return false;
};

export const clearLocalStorage = (): boolean => {
  localStorage.clear();
  return true;
};
