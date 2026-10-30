const MESES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export function getMonthYear(date = new Date()): { month: string; year: number } {
  const month = String(date.getMonth() + 1);
  const year = date.getFullYear();
  return { month, year };
}

export function getLastMonthYear(date = new Date()): { month: string; year: number } {
  let monthNumber = date.getMonth(); // 0-indexed: 0 = January -> last month is December of previous year
  let year = date.getFullYear();
  if (monthNumber === 0) {
    monthNumber = 12;
    year -= 1;
  }
  return { month: String(monthNumber), year };
}

export function getSpanishMonthName(date = new Date()): string {
  return MESES_ES[date.getMonth()];
}
