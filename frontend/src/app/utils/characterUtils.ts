export const safeRole = (role: string | undefined | null): string =>
    (role || '').toLowerCase();
  