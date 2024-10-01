// Create a promise that rejects after 5 seconds
export function fetchTimeout(
  url: string,
  options: RequestInit,
): Promise<Response> {
  return Promise.race<Response>([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 5000),
    ),
  ]);
}
