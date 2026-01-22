import { adToBs } from "@sbmdkl/nepali-date-converter";

// Helper function to convert Latin numerals to Devanagari numerals
export const toDevanagariNumerals = (str: string): string => {
  const latinToDevanagari: { [key: string]: string } = {
    "0": "०",
    "1": "१",
    "2": "२",
    "3": "३",
    "4": "४",
    "5": "५",
    "6": "६",
    "7": "७",
    "8": "८",
    "9": "९",
  };
  return str.replace(/[0-9]/g, (digit) => latinToDevanagari[digit] || digit);
};

// Helper function to convert Devanagari numerals to Latin numerals
export const toLatinNumerals = (str: string): string => {
  const devanagariToLatin: { [key: string]: string } = {
    "०": "0",
    "१": "1",
    "२": "2",
    "३": "3",
    "४": "4",
    "५": "5",
    "६": "6",
    "७": "7",
    "८": "8",
    "९": "9",
  };
  return str.replace(
    /[०१२३४५६७८९]/g,
    (digit) => devanagariToLatin[digit] || digit,
  );
};

export const convertAdToBs = (dateStr: string): string => {
  if (!dateStr) return "";
  try {
    const bsDate = adToBs(dateStr);
    return toDevanagariNumerals(bsDate);
  } catch (error) {
    console.error("Error converting date to BS:", error);
    return "";
  }
};

export const formatNepaliDate = (dateStr: string): string => {
  if (!dateStr) return "";

  // Handle potential time components or different formats
  // If it's already in Nepali format (unlikely for raw DB data but possible in UI state), return as is
  if (/[०-९]/.test(dateStr)) return dateStr;

  return convertAdToBs(dateStr.split(" ")[0].split("T")[0]);
};
