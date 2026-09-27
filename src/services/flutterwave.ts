/**
 * Flutterwave Client-Side Service & Gateway Handler
 * Connects securely to backend server-side API endpoints (/api/flutterwave/*)
 */

export interface InitializePaymentParams {
  tx_ref?: string;
  amount: number;
  currency?: string;
  email: string;
  name: string;
  phone: string;
  passType: string;
  redirect_url?: string;
  metadata?: Record<string, any>;
}

export interface InitializePaymentResponse {
  success: boolean;
  status: string;
  mode: string;
  tx_ref: string;
  payment_link?: string | null;
  message?: string;
  data?: any;
  error?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  verified: boolean;
  status: string;
  mode?: string;
  data?: {
    id?: number | string;
    tx_ref: string;
    flw_ref?: string;
    amount: number;
    currency: string;
    charged_amount?: number;
    status: string;
    payment_type?: string;
    created_at?: string;
    customer?: {
      id?: number;
      name: string;
      phone_number?: string;
      email: string;
    };
    meta?: Record<string, any>;
  };
  error?: string;
}

export interface FlutterwaveTransaction {
  tx_ref: string;
  amount: number;
  currency: string;
  customer?: {
    email: string;
    name: string;
    phone: string;
  };
  email?: string;
  name?: string;
  passType?: string;
  status: 'pending' | 'successful' | 'failed' | string;
  payment_link?: string;
  flw_ref?: string;
  transaction_id?: number | string;
  payment_type?: string;
  created_at: string;
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, any>;
}

export interface FlutterwaveConfigResponse {
  success: boolean;
  isConfigured: boolean;
  status?: string;
  hasSecretKey?: boolean;
  hasValidSecretKey?: boolean;
  secretKeyMasked?: string;
  hasEncryptionKey?: boolean;
  encryptionKeyMasked?: string;
  hasWebhookSecret?: boolean;
  mode: 'live' | 'test' | 'sandbox';
  publicKey: string | null;
  fullPublicKey: string | null;
  hasPublicKey?: boolean;
  currency: string;
  merchantTitle?: string;
  businessEmail?: string;
  settlementAccount?: string;
  gateway: string;
  security?: {
    pciCompliant: boolean;
    serverSideVerification: boolean;
    zeroSecretExposure: boolean;
    webhookSignatureVerification: boolean;
  };
  acceptedMethods: string[];
}

/**
 * Validates if a Flutterwave Public Key has a valid production or test format
 * and is not a mock/dummy/placeholder string.
 */
export function isValidFlutterwavePublicKey(key?: string | null): boolean {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  if (!trimmed.startsWith('FLWPUBK_TEST-') && !trimmed.startsWith('FLWPUBK-')) return false;
  if (
    trimmed.includes('xxxxxxxx') || 
    trimmed.includes('placeholder') || 
    trimmed.includes('your_') || 
    trimmed.includes('demo_key') ||
    trimmed.endsWith('-X') ||
    trimmed.includes('2809-X') ||
    trimmed.length < 28
  ) {
    return false;
  }
  return true;
}

/**
 * Validates if a Flutterwave Secret Key has a valid format
 */
export function isValidFlutterwaveSecretKey(key?: string | null): boolean {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  if (!trimmed.startsWith('FLWSECK_TEST-') && !trimmed.startsWith('FLWSECK-')) return false;
  if (
    trimmed.includes('xxxxxxxx') || 
    trimmed.includes('placeholder') || 
    trimmed.includes('your_') || 
    trimmed.includes('demo_key') ||
    trimmed.endsWith('-X') ||
    trimmed.includes('4fevt-X') ||
    trimmed.includes('269vt-X') ||
    trimmed.length < 28
  ) {
    return false;
  }
  return true;
}

/**
 * Validates if a Flutterwave 3DES Encryption Key has a valid format
 */
export function isValidFlutterwaveEncryptionKey(key?: string | null): boolean {
  if (!key || typeof key !== 'string') return false;
  const trimmed = key.trim();
  if (
    trimmed.includes('xxxxxxxx') || 
    trimmed.includes('placeholder') || 
    trimmed.includes('your_')
  ) {
    return false;
  }
  return trimmed.length >= 12;
}

/**
 * Test connectivity with Flutterwave backend router & remote servers
 */
export async function testFlutterwaveConnection(): Promise<{
  success: boolean;
  hasValidSecretKey?: boolean;
  hasValidPublicKey?: boolean;
  remoteApiOk?: boolean;
  remoteMessage?: string;
  mode?: string;
}> {
  try {
    const res = await fetch('/api/flutterwave/test-connection', { method: 'POST' });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      remoteMessage: `Connection test failed: ${err.message}`
    };
  }
}

// In-memory cache for configuration to avoid redundant network roundtrips
let cachedConfig: FlutterwaveConfigResponse | null = null;
let configPromise: Promise<FlutterwaveConfigResponse> | null = null;
let scriptPromise: Promise<boolean> | null = null;

/**
 * Fetch public gateway configuration status from the backend (cached with 0ms repeat latency)
 */
export async function getFlutterwaveConfig(forceRefresh = false): Promise<FlutterwaveConfigResponse> {
  if (!forceRefresh && cachedConfig) {
    return cachedConfig;
  }
  if (!forceRefresh && configPromise) {
    return configPromise;
  }

  configPromise = (async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch('/api/flutterwave/config', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Failed to fetch Flutterwave config: ${res.statusText}`);
      }
      const data = await res.json();
      cachedConfig = {
        ...data,
        hasSecretKey: Boolean(data.isConfigured),
        hasWebhookSecret: Boolean(data.isConfigured),
        status: data.isConfigured ? 'Live Active' : 'Sandbox Ready'
      };
      return cachedConfig;
    } catch (error: any) {
      console.warn('[Flutterwave Config Fetch Error]', error.message);
      return {
        success: false,
        isConfigured: false,
        hasSecretKey: false,
        hasWebhookSecret: false,
        status: 'Fallback Mode',
        mode: 'sandbox',
        publicKey: null,
        fullPublicKey: null,
        currency: 'NGN',
        gateway: 'Flutterwave',
        acceptedMethods: ['card', 'account', 'banktransfer', 'ussd', 'qr']
      };
    } finally {
      configPromise = null;
    }
  })();

  return configPromise;
}

/**
 * Pre-warm Flutterwave checkout infrastructure (both JS SDK and configuration in parallel)
 */
export function preloadFlutterwaveCheckout(): void {
  try {
    loadFlutterwaveScript();
    getFlutterwaveConfig();
  } catch {
    // Ignore in background
  }
}

/**
 * Initialize a secure payment session via backend Flutterwave API with fast timeout protection
 */
export async function initializeFlutterwavePayment(
  params: InitializePaymentParams
): Promise<InitializePaymentResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch('/api/flutterwave/initialize', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...params,
        currency: params.currency || 'NGN',
        customizations: {
          title: `RECON Expo 2026 - ${params.passType.toUpperCase()} Pass`,
          description: "8th Real Estate & Construction Expo 2026, Shehu Musa Yar'Adua Centre, Abuja",
          logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80'
        }
      }),
    });
    clearTimeout(timeoutId);

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error('[Initialize Flutterwave Payment Error]', error.message);
    return {
      success: false,
      status: 'error',
      mode: 'fallback',
      tx_ref: `RECON26-FAST-${Date.now()}`,
      error: error.message || 'Network error connecting to payment gateway.'
    };
  }
}

/**
 * Settle / Complete payment via backend router (for Card, Transfer, USSD, NQR & Inline Modal)
 */
export async function completeFlutterwavePayment(params: {
  tx_ref: string;
  flw_ref?: string;
  amount?: number;
  currency?: string;
  email?: string;
  name?: string;
  phone?: string;
  passType?: string;
  payment_type?: string;
  metadata?: any;
}): Promise<VerifyPaymentResponse> {
  try {
    const res = await fetch('/api/flutterwave/complete-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error('[Complete Flutterwave Payment Error]', error.message);
    return {
      success: false,
      verified: false,
      status: 'failed',
      error: error.message || 'Failed to complete payment transaction.'
    };
  }
}

/**
 * Verify payment status with the backend Flutterwave transaction validator
 */
export async function verifyFlutterwavePayment(
  tx_ref: string
): Promise<VerifyPaymentResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(`/api/flutterwave/verify/${encodeURIComponent(tx_ref)}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.error('[Verify Flutterwave Payment Error]', error.message);
    return {
      success: false,
      verified: false,
      status: 'failed',
      error: error.message || 'Failed to verify transaction with backend.'
    };
  }
}

/**
 * Update Flutterwave settings dynamically from Admin Dashboard
 */
export async function updateFlutterwaveConfig(settings: {
  publicKey?: string;
  secretKey?: string;
  encryptionKey?: string;
  webhookHash?: string;
  currency?: string;
  merchantTitle?: string;
  businessEmail?: string;
  settlementAccount?: string;
  testMode?: boolean;
}): Promise<{ success: boolean; message: string; config?: any; error?: string }> {
  try {
    const res = await fetch('/api/flutterwave/config/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message, message: 'Failed to update gateway configuration.' };
  }
}

/**
 * Generate a custom invoice / payment link from Admin
 */
export async function createCustomInvoiceLink(params: {
  title: string;
  description?: string;
  amount: number;
  currency?: string;
  recipientEmail: string;
  recipientName?: string;
  passType?: string;
}): Promise<{ success: boolean; tx_ref?: string; invoiceTitle?: string; amount?: number; currency?: string; payment_link?: string; error?: string }> {
  try {
    const res = await fetch('/api/flutterwave/create-custom-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Admin manually mark transaction as verified
 */
export async function markTransactionVerified(tx_ref: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/flutterwave/transactions/${encodeURIComponent(tx_ref)}/mark-verified`, {
      method: 'POST'
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Admin delete transaction
 */
export async function deleteBackendTransaction(tx_ref: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/flutterwave/transactions/${encodeURIComponent(tx_ref)}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Dynamically load Flutterwave Inline Checkout v3 Script if not already available (Memoized with instant resolve)
 */
export function loadFlutterwaveScript(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return Promise.resolve(false);
  }
  if ((window as any).FlutterwaveCheckout) {
    return Promise.resolve(true);
  }
  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise<boolean>((resolve) => {
    if ((window as any).FlutterwaveCheckout) {
      resolve(true);
      return;
    }
    const existingScript = document.querySelector('script[src*="checkout.flutterwave.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
      if ((window as any).FlutterwaveCheckout) resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      scriptPromise = null;
      resolve(false);
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

/**
 * Open official Flutterwave Inline modal popup if script loaded and public key is genuinely valid
 */
export async function openFlutterwaveInlineCheckout(options: {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency?: string;
  payment_options?: string;
  customer: {
    email: string;
    phone_number?: string;
    name: string;
  };
  customizations?: {
    title?: string;
    description?: string;
    logo?: string;
  };
  callback: (response: any) => void;
  onclose: () => void;
}): Promise<{ opened: boolean; reason?: 'invalid_public_key' | 'script_load_failed' | 'opened' | 'error' }> {
  // CRITICAL GUARD: Prevent Flutterwave's "Invalid public key passed" fatal error dialog
  if (!isValidFlutterwavePublicKey(options.public_key)) {
    console.warn('[Flutterwave] Inline popup bypassed because public key is missing or dummy placeholder:', options.public_key);
    return { opened: false, reason: 'invalid_public_key' };
  }

  const isLoaded = await loadFlutterwaveScript();
  if (!isLoaded || typeof window === 'undefined' || !(window as any).FlutterwaveCheckout) {
    return { opened: false, reason: 'script_load_failed' };
  }

  try {
    (window as any).FlutterwaveCheckout({
      public_key: options.public_key,
      tx_ref: options.tx_ref,
      amount: options.amount,
      currency: options.currency || 'NGN',
      payment_options: options.payment_options || 'card,banktransfer,ussd,account,qr,mobilemoney',
      customer: options.customer,
      customizations: options.customizations || {
        title: 'RECON Expo 2026',
        description: "8th Real Estate & Construction Expo 2026, Shehu Musa Yar'Adua Centre, Abuja",
        logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80'
      },
      callback: (data: any) => {
        options.callback(data);
      },
      onclose: () => {
        options.onclose();
      }
    });
    return { opened: true, reason: 'opened' };
  } catch (e) {
    console.warn('[Flutterwave Inline Checkout Error]', e);
    return { opened: false, reason: 'error' };
  }
}

/**
 * Fetch server-side transaction logs for admin audit
 */
export async function getFlutterwaveTransactions(): Promise<FlutterwaveTransaction[]> {
  try {
    const res = await fetch('/api/flutterwave/transactions');
    if (!res.ok) return [];
    const data = await res.json();
    const list = data.transactions || [];
    return list.map((item: any) => ({
      tx_ref: item.tx_ref,
      amount: item.amount,
      currency: item.currency || 'NGN',
      email: item.customer?.email || item.email || '',
      name: item.customer?.name || item.name || '',
      passType: item.passType || 'elite',
      status: item.status || 'successful',
      payment_type: item.payment_type || 'card / transfer',
      flw_ref: item.flw_ref,
      created_at: item.createdAt || item.created_at || new Date().toISOString()
    }));
  } catch {
    return [];
  }
}

export const getBackendTransactions = getFlutterwaveTransactions;
