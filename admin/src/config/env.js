export const ENV = {
  PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
};

if (!ENV.PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
