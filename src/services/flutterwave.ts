export interface FlutterwavePaymentConfig {
  public_key?: string;
  tx_ref: string;
  amount: number;
  currency: 'NGN' | 'USD';
  payment_options: 'card,ussd,banktransfer';
  customer: {
    email: string;
    phone_number: string;
    name: string;
  };
  customizations: {
    title: string;
    description: string;
    logo: string;
  };
  callback: (response: any) => void;
  onclose: () => void;
}

export const processSimulatedFlutterwavePayment = async (
  amount: number,
  currency: 'NGN' | 'USD',
  customer: { name: string; email: string; phone: string },
  passName: string
): Promise<{ success: boolean; tx_ref: string; flw_ref: string; amount: number; date: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tx_ref = `RECON_TX_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const flw_ref = `FLW_${Math.floor(100000000 + Math.random() * 900000000)}`;
      resolve({
        success: true,
        tx_ref,
        flw_ref,
        amount,
        date: new Date().toISOString()
      });
    }, 1500);
  });
};
