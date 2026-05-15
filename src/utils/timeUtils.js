export function getCurrentDay() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
}

export function getCurrentTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

export function getClassStatus(start, end) {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);

  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (currentMinutes < startMinutes) return 'upcoming';
  if (currentMinutes >= startMinutes && currentMinutes < endMinutes) return 'now';
  return 'done';
}

export function formatTime(time) {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function getTimeProgress(start, end) {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (currentMinutes < startMinutes) return 0;
  if (currentMinutes >= endMinutes) return 100;
  return Math.round(((currentMinutes - startMinutes) / (endMinutes - startMinutes)) * 100);
}
