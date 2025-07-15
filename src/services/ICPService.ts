import { AuthClient, Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

export interface ICPBalance {
  e8s: bigint;
  formatted: string;
}

export interface ICPTransaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
}

export class ICPService {
  private authClient: AuthClient | null = null;
  private identity: Identity | null = null;

  async initialize(): Promise<void> {
    try {
      this.authClient = await AuthClient.create();
    } catch (error) {
      throw new Error('Failed to initialize ICP service');
    }
  }

  async authenticate(): Promise<Identity> {
    if (!this.authClient) {
      throw new Error('ICP service not initialized');
    }

    const isAuthenticated = await this.authClient.isAuthenticated();
    
    if (!isAuthenticated) {
      return new Promise((resolve, reject) => {
        this.authClient!.login({
          identityProvider: 'https://identity.ic0.app',
          onSuccess: () => {
            const identity = this.authClient!.getIdentity();
            this.identity = identity;
            resolve(identity);
          },
          onError: (error) => {
            reject(new Error(`Authentication failed: ${error}`));
          }
        });
      });
    }

    const identity = this.authClient.getIdentity();
    this.identity = identity;
    return identity;
  }

  getPrincipal(): string | null {
    if (!this.identity) return null;
    return this.identity.getPrincipal().toText();
  }

  async getBalance(): Promise<ICPBalance> {
    if (!this.identity) {
      throw new Error('Not authenticated');
    }

    const mockBalance = {
      e8s: BigInt(100000000),
      formatted: '1.0'
    };

    return mockBalance;
  }

  async sendTransaction(to: string, amount: number): Promise<ICPTransaction> {
    if (!this.identity) {
      throw new Error('Not authenticated');
    }

    try {
      Principal.fromText(to);
    } catch {
      throw new Error('Invalid recipient principal');
    }

    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    const transaction: ICPTransaction = {
      id: `icp-tx-${Date.now()}`,
      from: this.getPrincipal() || '',
      to,
      amount: amount.toString(),
      timestamp: new Date(),
      status: 'completed'
    };

    return transaction;
  }

  isAuthenticated(): boolean {
    return this.identity !== null;
  }

  logout(): void {
    this.identity = null;
    if (this.authClient) {
      this.authClient.logout();
    }
  }
}

export const icpService = new ICPService(); 