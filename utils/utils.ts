export function convertDDMMYYYYToDate(dateString: string) {
  // Split the string into day, month, and year parts
  const parts = dateString.split("-");

  if (parts.length !== 3) {
    return null;
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed
  const day = parseInt(parts[2], 10);

  // Check if the parts are valid numbers
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return null;
  }

  // Create a new Date object
  const date = new Date(year, month, day);

  // Check if the Date object is valid (handles invalid date combinations)
  if (isNaN(date.getTime())) {
    return null; // Or throw an error: throw new Error("Invalid date");
  }

  return date;
}
export function getReturnDate(borrowDate: string): string {
  const date = convertDDMMYYYYToDate(borrowDate);
  if (!date) return "";
  const newDate = new Date(date.getTime() + 14 * 24 * 60 * 60 * 1000);
  const newYear = newDate.getFullYear();
  const newMonth = String(newDate.getMonth() + 1).padStart(2, "0"); // Pad with leading zero if needed
  const newDay = String(newDate.getDate()).padStart(2, "0");

  return `${newYear}-${newMonth}-${newDay}`;
}
