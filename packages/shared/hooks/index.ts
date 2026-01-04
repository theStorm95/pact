// Shared React hooks
// Export hooks here

export const useExample = () => {
  const value = "example";
  const setValue = (newValue: string) => console.log("setValue:", newValue);
  return { value, setValue };
};
