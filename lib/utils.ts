import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import moment from 'moment-timezone';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export type ActionError = { error: string };
export type ServerActionResponse<T> = { data: T } | ActionError;

export function isActionError(error: unknown): error is ActionError {
  return typeof error === 'object' && error !== null && "error" in error && typeof (error as ActionError).error === 'string';
}



export const getTimeZones = () => {
  const timeZones = moment.tz.names().map((tz) => {
    const [continent, city] = tz.split('/');
    return {
      country: continent.replace('_', ' '),
      city: city ? city.replace('_', ' ') : '',
      timeZone: tz,
    };
  });

  return timeZones;
};

