const API_URL = import.meta.env.VITE_API_URL;

export const apiRequest = async (path, options = {}) => {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};