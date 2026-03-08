import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function joinUrl(base: string, path?: string) {
  return base.replace(/\/+$/, '') + '/' + path?.replace(/^\/+/, '');
}
