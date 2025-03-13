
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency with the specified locale and currency
 * @param amount - The amount to format
 * @param locale - The locale to use for formatting, defaults to 'en-US'
 * @param currency - The currency to use, defaults to 'USD'
 * @returns A formatted currency string
 */
export function formatCurrency(
  amount: number,
  locale: string = "en-US",
  currency: string = "USD"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
