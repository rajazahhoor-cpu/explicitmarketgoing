import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatNumber(num: number, digits: number = 2) {
  return num.toFixed(digits);
}

export function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString();
}

export function generateId() {
  // Generate a proper UUID v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Simulation helpers
export function randomPriceChange(
currentPrice: number,
volatility: number = 0.0001)
{
  const change = currentPrice * volatility * (Math.random() - 0.5);
  return currentPrice + change;
}