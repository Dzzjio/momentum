interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: unknown;
  headers?: Record<string, string>;
}

export const fetchApi = async <T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> => {
  const { method = "GET", data, headers } = options;

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json() as Promise<T>;
};