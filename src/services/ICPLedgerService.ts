import { Actor, HttpAgent } from '@dfinity/agent';
import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory as ledgerIdlFactory } from '../declarations/ledger';

export interface ICPTransferParams {
  to: string;
  amount: bigint; // in e8s (1 ICP = 100,000,000 e8s)
  memo?: bigint;
}

export interface ICPAccountBalance {
  e8s: bigint;
  formatted: string;
}

export interface ICPTransactionResult {
  blockHeight: bigint;
  transactionId: string;
  status: 'success' | 'failed';
}

export class ICPLedgerService {
  private agent: HttpAgent | null = null;
  private ledgerActor: any = null;
  private readonly LEDGER_CANISTER_ID = 'ryjl3-tyaaa-aaaaa-aaaba-cai'; // Mainnet ICP Ledger

  async initialize(identity: Identity): Promise<void> {
    this.agent = new HttpAgent({
      identity,
      host: 'https://ic0.app'
    });

    // Create actor for ICP ledger
    this.ledgerActor = Actor.createActor(ledgerIdlFactory, {
      agent: this.agent,
      canisterId: this.LEDGER_CANISTER_ID
    });
  }

  async getBalance(principal: string): Promise<ICPAccountBalance> {
    if (!this.ledgerActor) {
      throw new Error('Ledger service not initialized');
    }

    try {
      const accountIdentifier = this.getAccountIdentifier(principal);
      const balance = await this.ledgerActor.account_balance({
        account: accountIdentifier
      });

      const e8s = balance.e8s;
      const formatted = this.formatICP(e8s);

      return {
        e8s,
        formatted
      };
    } catch (error) {
      console.error('Error getting balance:', error);
      throw new Error('Failed to get balance');
    }
  }

  async transfer(params: ICPTransferParams): Promise<ICPTransactionResult> {
    if (!this.ledgerActor) {
      throw new Error('Ledger service not initialized');
    }

    try {
      // Validate recipient principal
      const toPrincipal = Principal.fromText(params.to);
      
      // Create transfer parameters
      const transferArgs = {
        to: toPrincipal,
        amount: { e8s: params.amount },
        memo: params.memo || BigInt(0),
        fee: { e8s: BigInt(10000) }, // Standard ICP transfer fee
        from_subaccount: [],
        created_at_time: []
      };

      const result = await this.ledgerActor.transfer(transferArgs);
      
      if ('Ok' in result) {
        return {
          blockHeight: result.Ok,
          transactionId: `icp-tx-${result.Ok}`,
          status: 'success'
        };
      } else {
        throw new Error(`Transfer failed: ${JSON.stringify(result.Err)}`);
      }
    } catch (error) {
      console.error('Transfer error:', error);
      throw new Error('Transfer failed');
    }
  }

  async getTransactionHistory(principal: string, start: number = 0, length: number = 10): Promise<any[]> {
    if (!this.ledgerActor) {
      throw new Error('Ledger service not initialized');
    }

    try {
      const accountIdentifier = this.getAccountIdentifier(principal);
      const transactions = await this.ledgerActor.get_transactions({
        account: accountIdentifier,
        start: BigInt(start),
        length: BigInt(length)
      });

      return transactions.transactions || [];
    } catch (error) {
      console.error('Error getting transaction history:', error);
      return [];
    }
  }

  private getAccountIdentifier(principal: string): Uint8Array {
    // Convert principal to account identifier
    const principalObj = Principal.fromText(principal);
    return principalObj.toUint8Array();
  }

  private formatICP(e8s: bigint): string {
    const icp = Number(e8s) / 100000000;
    return icp.toFixed(8);
  }

  // Helper method to convert ICP to e8s
  icpToE8s(icp: number): bigint {
    return BigInt(Math.floor(icp * 100000000));
  }

  // Helper method to convert e8s to ICP
  e8sToIcp(e8s: bigint): number {
    return Number(e8s) / 100000000;
  }
}

export const icpLedgerService = new ICPLedgerService(); 