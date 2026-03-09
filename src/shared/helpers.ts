export function requireElement<T extends HTMLElement = HTMLElement>(
  id: string,
): T {
  const el = document.getElementById(id) as T | null;
  if (!el) throw new Error(`Required element missing: ${id}`);
  return el;
}

export function calculateTargetDateStr(days: string | number): string {
  const date = new Date();
  date.setDate(
    date.getDate() + (typeof days === "string" ? parseInt(days, 10) : days),
  );

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

export function calculateDaysDifference(targetDateStr: string): number {
  const [year, month, day] = targetDateStr.split("-").map(Number) as [
    number,
    number,
    number,
  ];

  const today = new Date();
  const utcToday = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const utcTarget = Date.UTC(year, month - 1, day);

  const diffTime = utcTarget - utcToday;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
