export function formatDate(date: Date | undefined): string {
  if (!date) return "Not specified";

  // const year = date.getFullYear();
  // const month = date.getMonth() + 1;
  // const day = date.getDate();

  date.setHours(3, 0, 0, 0); // 03:00:00.000

  return date.toString();

  // return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
}
