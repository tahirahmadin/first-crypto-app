export interface ICPLedger {
  account_balance: (args: { account: Uint8Array }) => Promise<{ e8s: bigint }>;
  transfer: (args: {
    to: any;
    amount: { e8s: bigint };
    memo: bigint;
    fee: { e8s: bigint };
    from_subaccount: any[];
    created_at_time: any[];
  }) => Promise<{ Ok: bigint } | { Err: any }>;
  get_transactions: (args: {
    account: Uint8Array;
    start: bigint;
    length: bigint;
  }) => Promise<{ transactions: any[] }>;
}

export const idlFactory: any; 