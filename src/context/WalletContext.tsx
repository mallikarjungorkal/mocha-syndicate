"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Transaction {
  id: string;
  type: "DEPOSIT" | "WITHDRAWAL" | "PLEDGE" | "REFUND" | "PAYOUT";
  amount: number;
  description: string;
  utr: string;
  timestamp: string;
  status: "SUCCESS" | "LOCKED" | "PROCESSING";
  method?: string;
}

interface WalletContextType {
  availableBalance: number;
  escrowLocked: number;
  totalNetWorth: number;
  transactions: Transaction[];
  isWalletOpen: boolean;
  setIsWalletOpen: (open: boolean) => void;
  deposit: (amount: number, provider: string, customUpi?: string) => Promise<boolean>;
  withdraw: (amount: number, upiOrBank: string) => Promise<{ success: boolean; message: string }>;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-init-1",
    type: "DEPOSIT",
    amount: 500,
    description: "UPI Ingress - Successful",
    utr: "UPI/948201/GPAY",
    timestamp: "10 mins ago",
    status: "SUCCESS",
    method: "GPay",
  },
  {
    id: "tx-init-2",
    type: "PLEDGE",
    amount: -100,
    description: "Escrow Pledge - NVDA Syndicate",
    utr: "UPI/389271/AXIS",
    timestamp: "2 hours ago",
    status: "LOCKED",
    method: "Escrow Vault",
  },
  {
    id: "tx-init-3",
    type: "REFUND",
    amount: 90,
    description: "Circuit Breaker Refund - TSLA 90% Capital Preserved",
    utr: "UPI/MOCHA/789102/SHIELD",
    timestamp: "Yesterday",
    status: "SUCCESS",
    method: "Automated Webhook",
  },
];

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [availableBalance, setAvailableBalance] = useState<number>(1500.0);
  const [escrowLocked, setEscrowLocked] = useState<number>(100.0);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isWalletOpen, setIsWalletOpen] = useState<boolean>(false);

  // Load persisted state if available
  useEffect(() => {
    try {
      const savedBalance = localStorage.getItem("mocha_wallet_balance");
      const savedTxs = localStorage.getItem("mocha_wallet_txs");
      if (savedBalance !== null) {
        setAvailableBalance(parseFloat(savedBalance));
      }
      if (savedTxs !== null) {
        setTransactions(JSON.parse(savedTxs));
      }
    } catch {
      // Ignore storage errors in private browsing / SSR
    }
  }, []);

  const saveToStorage = (newBal: number, newTxs: Transaction[]) => {
    try {
      localStorage.setItem("mocha_wallet_balance", newBal.toString());
      localStorage.setItem("mocha_wallet_txs", JSON.stringify(newTxs));
    } catch {
      // Ignore
    }
  };

  const deposit = async (amount: number, provider: string, customUpi?: string): Promise<boolean> => {
    // Generate mock UTR
    const randomUtr = `UPI/${Math.floor(100000 + Math.random() * 900000)}/${provider.toUpperCase().slice(0, 4)}`;
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const newBalance = availableBalance + amount;
    const newTx: Transaction = {
      id: `tx-dep-${Date.now()}`,
      type: "DEPOSIT",
      amount,
      description: `UPI Ingress (${provider}${customUpi ? ` · ${customUpi}` : ""}) - Successful`,
      utr: randomUtr,
      timestamp: "Just now",
      status: "SUCCESS",
      method: provider,
    };

    const updatedTxs = [newTx, ...transactions];
    setAvailableBalance(newBalance);
    setTransactions(updatedTxs);
    saveToStorage(newBalance, updatedTxs);
    return true;
  };

  const withdraw = async (amount: number, upiOrBank: string): Promise<{ success: boolean; message: string }> => {
    if (amount <= 0) {
      return { success: false, message: "Please enter a valid amount greater than ₹0." };
    }
    if (amount > availableBalance) {
      return { success: false, message: `Insufficient balance. Available cash is ₹${availableBalance.toFixed(2)}.` };
    }

    const randomUtr = `IMPS/${Math.floor(200000 + Math.random() * 800000)}/MOCHA`;

    // Simulate instant payout network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newBalance = availableBalance - amount;
    const newTx: Transaction = {
      id: `tx-wth-${Date.now()}`,
      type: "WITHDRAWAL",
      amount: -amount,
      description: `Instant Payout to ${upiOrBank}`,
      utr: randomUtr,
      timestamp: "Just now",
      status: "SUCCESS",
      method: "IMPS/UPI Instant",
    };

    const updatedTxs = [newTx, ...transactions];
    setAvailableBalance(newBalance);
    setTransactions(updatedTxs);
    saveToStorage(newBalance, updatedTxs);

    return { success: true, message: `₹${amount.toFixed(2)} transferred to ${upiOrBank} successfully.` };
  };

  const totalNetWorth = availableBalance + escrowLocked;

  return (
    <WalletContext.Provider
      value={{
        availableBalance,
        escrowLocked,
        totalNetWorth,
        transactions,
        isWalletOpen,
        setIsWalletOpen,
        deposit,
        withdraw,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
