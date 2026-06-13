const names = [
  'Ada Lovelace', 'Alan Turing', 'Grace Hopper', 'Claude Shannon',
  'Margaret Hamilton', 'Linus Torvalds', 'Tim Berners-Lee', 'Donald Knuth',
  'Ken Thompson', 'Dennis Ritchie', 'Barbara Liskov', 'Guido van Rossum',
];

const colors = [
  '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6',
  '#ef4444', '#14b8a6', '#06b6d4', '#6366f1', '#a855f7',
];

export function getRandomUser() {
  const name = names[Math.floor(Math.random() * names.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return { name, color };
}
