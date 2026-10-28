const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://smart-leger-server.onrender.com/api";

interface RequestOptions
  extends RequestInit {
  body?: BodyInit | null;
}

const inFlightGetRequests = new Map<string, Promise<unknown>>();

async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const method = (options.method || "GET").toUpperCase();
  const requestKey =
    method === "GET" && !options.signal
      ? JSON.stringify([
          `${API_URL}${endpoint}`,
          method,
          [...new Headers(options.headers).entries()],
          options.credentials || "include",
        ])
      : null;

  if (requestKey) {
    const existingRequest = inFlightGetRequests.get(requestKey);
    if (existingRequest) return existingRequest as Promise<T>;
  }

  const request = (async () => {
    let response: Response;

    try {
      response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        credentials: "include",
      });
    } catch {
      throw new Error(
        "Unable to connect to the server. Please try again."
      );
    }

    const responseText = await response.text();
    let data: { message?: string } & T;

    try {
      data = responseText ? JSON.parse(responseText) : ({} as { message?: string } & T);
    } catch {
      throw new Error("The server returned an invalid response.");
    }

    if (!response.ok) {
      const error = new Error(data.message || "Something went wrong") as Error & {
        status?: number;
      };
      error.status = response.status;
      throw error;
    }

    return data;
  })();

  if (requestKey) inFlightGetRequests.set(requestKey, request);

  try {
    return await request;
  } finally {
    if (requestKey && inFlightGetRequests.get(requestKey) === request) {
      inFlightGetRequests.delete(requestKey);
    }
  }
}

export default apiRequest;