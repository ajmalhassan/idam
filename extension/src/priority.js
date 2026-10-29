export function localDay(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}
export function normalizePriority(value) {
  if (
    !value ||
    typeof value.date !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value.date) ||
    typeof value.text !== 'string'
  )
    return null;
  const date = new Date(value.date + 'T12:00:00Z');
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value.date)
    return null;
  return { date: value.date, text: value.text.trim().slice(0, 200), done: value.done === true };
}
export function priorityForDay(records, date) {
  const current = records.find((record) => record.date === date) || null;
  const previous = records
    .filter((record) => record.date < date)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  return { current, carry: !current && previous?.text && !previous.done ? previous : null };
}
