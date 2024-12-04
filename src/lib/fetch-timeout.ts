// Create a promise that rejects after 10 seconds
export function fetchTimeout(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  return Promise.race<Response>([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout fetching data")), 10000),
    ),
  ]);
}
