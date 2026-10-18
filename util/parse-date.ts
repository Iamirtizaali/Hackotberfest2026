// Older boards store `toLocaleString()` output such as "18/10/2026, 12:37:57",
// which `new Date()` can't read. Newer boards store ISO strings.
const parseDate = (value?: string): Date | null => {
  if (!value) return null;

  const direct = new Date(value);
  if (!isNaN(direct.getTime())) return direct;

  const match = value.match(
    /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})(?:,?\s*(\d{1,2}):(\d{2})(?::(\d{2}))?)?/
  );
  if (!match) return null;

  const [, day, month, year, hours = '0', minutes = '0', seconds = '0'] = match;
  const date = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);

  return isNaN(date.getTime()) ? null : date;
};

export default parseDate;
