export type AuthMode = 'login' | 'signup';

/** Open the sign-in dialog (rendered once by the layout). Resolves when it closes. */
export function openAuth(mode: AuthMode = 'login', reason?: string): void {
  window.dispatchEvent(new CustomEvent('auth:open', { detail: { mode, reason } }));
}
