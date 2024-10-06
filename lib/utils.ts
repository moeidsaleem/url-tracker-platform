import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// write a function that will take latitude and longitude and return the country, city, nearest landmark, and timezone
export async function getLocationInfo(latitude: number, longitude: number) {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
  const data = await response.json();
  return data;
}