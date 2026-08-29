export type ConsentCategories = {
  necessaires: true;
  mesure: boolean;
  marketing: boolean;
};

export type ConsentRecord = ConsentCategories & { date: string; version: number };

export const CONSENT_KEY = "maan.cookie-consent";
export const CONSENT_VERSION = 1;
export const CONSENT_EVENT = "maan:cookie-consent";

export function readConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(choice: { mesure: boolean; marketing: boolean }) {
  if (typeof window === "undefined") return;
  const record: ConsentRecord = {
    necessaires: true,
    mesure: choice.mesure,
    marketing: choice.marketing,
    date: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  window.localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: record }));
}

export function clearConsent() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CONSENT_KEY);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
}

export function openConsentPreferences() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(`${CONSENT_EVENT}:open`));
}
