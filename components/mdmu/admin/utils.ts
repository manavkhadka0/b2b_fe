export const formatBoolean = (
  value: boolean | string | null | undefined
) => {
  if (value === null || value === undefined) return "N/A";
  // Handle string "true"/"false" from form or boolean from API
  if (typeof value === "string") {
    return value === "true" ? "Yes" : "No";
  }
  return value ? "Yes" : "No";
};

