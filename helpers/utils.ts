export const formatPrice = (number: number, decimal: number = 0) => {
  return new Intl.NumberFormat(process.env.NEXT_PUBLIC_LOCALE, {
    style: "currency",
    currency: process.env.NEXT_PUBLIC_CURRENCY as string,
    maximumFractionDigits: decimal,
  }).format(number);
};



