export const DEMO_ENABLED = import.meta.env.VITE_ENABLE_DEMO === 'true';
export function sessionValue(key: string) {
  return localStorage.getItem(key) || sessionStorage.getItem(key);
}
export function isDemoSession() {
  return DEMO_ENABLED && !!sessionValue('lankaease_token')?.startsWith('demo-token-');
}
export function demoStorageKey(kind: string) {
  const token = sessionValue('lankaease_token') || 'anonymous';
  return `lankaease_demo_${token}_${kind}`;
}
export function safeRedirect(value: string | null) {
  return value && value.startsWith('/') && !value.startsWith('//') && !value.includes('\\') ? value : null;
}

export function localToday() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
