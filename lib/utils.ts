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

export function handleBrowserUserInfoToReadable(userAgent: string) {
// text manipulation to get browser, os, device, and language
const browser = userAgent.split(' ')[0];
const os = userAgent.split(' ')[1];
const device = userAgent.split(' ')[2];
const language = userAgent.split(' ')[3];
return { browser, os, device, language };

}

