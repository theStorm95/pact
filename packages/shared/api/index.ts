// Shared API client code
// Export API functions here

export const apiBaseUrl =
  (import.meta.env?.VITE_API_BASE_URL as string | undefined) ||
  "http://localhost:3000";
