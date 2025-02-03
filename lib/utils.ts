import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export type ActionError = { error: string };
export type ServerActionResponse<T> = { data: T } | ActionError;

export function isActionError(error: unknown): error is ActionError {
  return typeof error === 'object' && error !== null && "error" in error && typeof (error as ActionError).error === 'string';
}