export function brandAvatar(name: string) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase().replace(/[^A-Z]/g, '') || 'LE';
  const colors = [['#e8eddd', '#536b43'], ['#eee5d7', '#89724e'], ['#e2ebea', '#4f7672'], ['#f0e5dd', '#956a51']];
  const [background, foreground] = colors[name.length % colors.length];
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect width="160" height="160" rx="36" fill="${background}"/><circle cx="132" cy="22" r="44" fill="${foreground}" opacity=".07"/><text x="80" y="86" dominant-baseline="middle" text-anchor="middle" font-family="Arial,sans-serif" font-size="49" font-weight="500" fill="${foreground}">${initials}</text></svg>`)}`;
}
