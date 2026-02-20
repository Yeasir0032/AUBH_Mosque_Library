/**
 * Converts a date string in "DD-MM-YYYY" format to a JavaScript Date object.
 *
 * @param dateString - The date string to convert (e.g., "31-12-2023").
 * @returns A Date object if the input is valid, or null if invalid.
 */
export function convertDDMMYYYYToDate(dateString: string) {
  // Split the string into day, month, and year parts
  const parts = dateString.split("-");

  // Ensure all three parts (day, month, year) are present
  if (parts.length !== 3) {
    return null;
  }

  // Parse the parts into integers
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Months in JS Date are 0-indexed
  const day = parseInt(parts[2], 10);

  // Check if any of the parsed parts are not valid numbers
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return null;
  }

  // Create a new Date object using the parsed parts
  const date = new Date(year, month, day);

  // Validate the resulting Date object (e.g. handles things like "32-01-2023")
  if (isNaN(date.getTime())) {
    return null; // Invalid date
  }

  return date;
}

/**
 * Calculates a return date 14 days after the specified borrow date.
 *
 * @param borrowDate - The date the item was borrowed, in "DD-MM-YYYY" format.
 * @returns A string representing the return date in "YYYY-MM-DD" format, or an empty string if input is invalid.
 */
export function getReturnDate(borrowDate: string): string {
  // First convert the input string to a Date object
  const date = convertDDMMYYYYToDate(borrowDate);
  if (!date) return "";
  
  // Calculate the new date by adding 14 days (in milliseconds)
  const newDate = new Date(date.getTime() + 14 * 24 * 60 * 60 * 1000);
  
  // Extract and format the year, month, and day for the return string
  const newYear = newDate.getFullYear();
  const newMonth = String(newDate.getMonth() + 1).padStart(2, "0"); // Pad single-digit months with a leading zero
  const newDay = String(newDate.getDate()).padStart(2, "0"); // Pad single-digit days with a leading zero

  // Return the date in YYYY-MM-DD format
  return `${newYear}-${newMonth}-${newDay}`;
}
