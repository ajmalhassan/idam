export function greetingFor(now) {
  const hour = now.getHours();
  if (hour < 5 || hour >= 18) return 'good evening';
  return hour < 12 ? 'good morning' : 'good afternoon';
}
