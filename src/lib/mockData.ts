export interface Leader {
  id: string;
  name: string;
  handle: string;
  campus: string;
  winRate: number;
  maxDrawdown: number;
  skinInGame: number;
  totalTrades: number;
}

export interface SyndicateItem {
  id: string;
  title: string;
  catalyst: string;
  assetSymbol: string;
  ticker: string;
  assetName: string;
  direction: "LONG" | "SHORT";
  leverage: number;
  entryPrice: number;
  stopLossPrice: number;
  targetPrice: number;
  targetReturnPct: number;
  returnTarget: number;
  circuitBreakerPct: number;
  stopLoss: number;
  minPledge: number;
  poolCap: number;
  currentPooled: number;
  pooledAmount: number;
  participants: number;
  status: string;
  leader: Leader;
  lead: Leader;
  positions?: any[];
  pledges?: any[];
}

export const DEFAULT_MOCK_SYNDICATES: SyndicateItem[] = [
  {
    id: "syn_nvda_q3",
    title: "NVDA Q3 Earnings Breakout",
    catalyst: "Earnings momentum + Blackwell ultra-datacenter chip ramp. Historical earnings move ±9.4%.",
    assetSymbol: "NVDA",
    ticker: "NVDA",
    assetName: "NVIDIA Corp",
    direction: "LONG",
    leverage: 10,
    entryPrice: 128.50,
    stopLossPrice: 127.21,
    targetPrice: 151.63,
    targetReturnPct: 35,
    returnTarget: 35,
    circuitBreakerPct: -10,
    stopLoss: -10,
    minPledge: 50,
    poolCap: 50000,
    currentPooled: 38400,
    pooledAmount: 38400,
    participants: 384,
    status: "ACTIVE",
    leader: {
      id: "lead_guru",
      name: "Dr. AIT FinTech Society",
      handle: "drait_guru",
      campus: "Dr. AIT Bangalore",
      winRate: 78,
      maxDrawdown: 6.5,
      skinInGame: 5000,
      totalTrades: 42,
    },
    lead: {
      id: "lead_guru",
      name: "Dr. AIT FinTech Society",
      handle: "drait_guru",
      campus: "Dr. AIT Bangalore",
      winRate: 78,
      maxDrawdown: 6.5,
      skinInGame: 5000,
      totalTrades: 42,
    },
    positions: [
      {
        id: "pos_nvda_active",
        status: "ACTIVE",
        currentPrice: 130.86,
        unrealizedPnlPct: 18.4,
      },
    ],
  },
  {
    id: "syn_tsla_robotaxi",
    title: "TSLA Robotaxi Milestone",
    catalyst: "Autonomous ride-hailing regulatory filing in California + FSD v13 rollout.",
    assetSymbol: "TSLA",
    ticker: "TSLA",
    assetName: "Tesla Inc",
    direction: "LONG",
    leverage: 10,
    entryPrice: 245.20,
    stopLossPrice: 242.75,
    targetPrice: 294.24,
    targetReturnPct: 40,
    returnTarget: 40,
    circuitBreakerPct: -10,
    stopLoss: -10,
    minPledge: 50,
    poolCap: 75000,
    currentPooled: 52000,
    pooledAmount: 52000,
    participants: 412,
    status: "ACTIVE",
    leader: {
      id: "lead_drait_lead",
      name: "Namith DR",
      handle: "drait_lead",
      campus: "Dr. AIT Bangalore (Computer Science)",
      winRate: 71,
      maxDrawdown: 8.2,
      skinInGame: 7500,
      totalTrades: 39,
    },
    lead: {
      id: "lead_drait_lead",
      name: "Namith DR",
      handle: "drait_lead",
      campus: "Dr. AIT Bangalore (Computer Science)",
      winRate: 71,
      maxDrawdown: 8.2,
      skinInGame: 7500,
      totalTrades: 39,
    },
    positions: [
      {
        id: "pos_tsla_active",
        status: "ACTIVE",
        currentPrice: 247.65,
        unrealizedPnlPct: 10.0,
      },
    ],
  },
  {
    id: "syn_aapl_supply",
    title: "AAPL Supply Chain Cycle",
    catalyst: "Foxconn India production boost + Apple Intelligence Siri rollout cycle.",
    assetSymbol: "AAPL",
    ticker: "AAPL",
    assetName: "Apple Inc",
    direction: "LONG",
    leverage: 8,
    entryPrice: 228.40,
    stopLossPrice: 225.55,
    targetPrice: 251.24,
    targetReturnPct: 24,
    returnTarget: 24,
    circuitBreakerPct: -10,
    stopLoss: -10,
    minPledge: 50,
    poolCap: 40000,
    currentPooled: 29500,
    pooledAmount: 29500,
    participants: 215,
    status: "ACTIVE",
    leader: {
      id: "lead_alumni_quant",
      name: "Mallikarjun Gorkal",
      handle: "alumni_quant",
      campus: "Dr. AIT Alumni (Algorithmic Trading)",
      winRate: 83,
      maxDrawdown: 4.8,
      skinInGame: 10000,
      totalTrades: 58,
    },
    lead: {
      id: "lead_alumni_quant",
      name: "Mallikarjun Gorkal",
      handle: "alumni_quant",
      campus: "Dr. AIT Alumni (Algorithmic Trading)",
      winRate: 83,
      maxDrawdown: 4.8,
      skinInGame: 10000,
      totalTrades: 58,
    },
    positions: [
      {
        id: "pos_aapl_active",
        status: "ACTIVE",
        currentPrice: 230.10,
        unrealizedPnlPct: 5.95,
      },
    ],
  },
];

export const DEFAULT_MOCK_USER = {
  id: "user_demo",
  name: "Priyanka S.",
  handle: "priyanka_s",
  campus: "Dr. AIT Bangalore - Hostel Block 1",
  upiId: "priyanka@okhdfcbank",
  balance: 1500.00,
  walletBalance: 1500.00,
};

export const DEFAULT_MOCK_ACTIVE_POSITION = {
  id: "pos_nvda_active",
  syndicateId: "syn_nvda_q3",
  status: "ACTIVE",
  currentPrice: 130.86,
  unrealizedPnlPct: 18.4,
  pledgeAmount: 100.0,
  notionalAmount: 1000.0,
  syndicate: DEFAULT_MOCK_SYNDICATES[0],
  pnl: {
    unrealizedPnlInr: 18.40,
    positionReturnPct: 18.40,
    currentValueInr: 118.40,
    isStopLossTriggered: false,
    isTargetHit: false,
  },
  latestPledge: {
    id: "pld_demo_active",
    amount: 100.0,
    upiUtr: "UPI/984712/AXIS",
    escrowStatus: "LOCKED",
    createdAt: new Date().toISOString(),
  },
};

export const DEFAULT_MOCK_SETTLEMENT = {
  id: "stl_tsla_cb",
  positionId: "pos_tsla_settled",
  userId: "user_demo",
  initialPledge: 100.0,
  grossPayout: 90.0,
  leaderFee: 0.0,
  protocolFee: 0.0,
  netPayout: 90.0,
  upiRefundUtr: "UPI/DRAIT/789102/SHIELD",
  settlementTimeSec: 3.8,
  createdAt: new Date("2026-09-25T14:30:00Z").toISOString(),
  position: {
    id: "pos_tsla_settled",
    syndicateId: "syn_tsla_robotaxi",
    status: "SETTLED",
    exitReason: "CIRCUIT_BREAKER",
    entryPrice: 245.20,
    exitPrice: 242.75,
    currentPrice: 242.75,
    unrealizedPnlPct: -10.0,
    syndicate: DEFAULT_MOCK_SYNDICATES[1],
  },
};

export const DEFAULT_MOCK_PORTFOLIO = {
  user: DEFAULT_MOCK_USER,
  activePledges: [
    {
      id: "pos_nvda_active",
      syndicateId: "syn_nvda_q3",
      pledgeAmount: 100.0,
      notionalAmount: 1000.0,
      entryPrice: 128.50,
      currentPrice: 130.86,
      pnl: 18.40,
      pnlPct: 18.40,
      leverage: 10,
      status: "ACTIVE",
      title: "NVDA Q3 Earnings Breakout",
      syndicate: DEFAULT_MOCK_SYNDICATES[0],
    },
  ],
  settlements: [DEFAULT_MOCK_SETTLEMENT],
  metrics: {
    totalPledged: 200.00,
    totalPayout: 208.40,
    netPnl: 8.40,
    capitalSaved: 90.00,
    tradesCount: 2,
  },
};

export function getFallbackSyndicate(id: string): SyndicateItem {
  const found = DEFAULT_MOCK_SYNDICATES.find((s) => s.id === id);
  if (found) return found;
  return DEFAULT_MOCK_SYNDICATES[0];
}

export function getFallbackPosition(id: string) {
  if (id === "pos_tsla_settled") {
    return {
      ...DEFAULT_MOCK_ACTIVE_POSITION,
      id: "pos_tsla_settled",
      syndicateId: "syn_tsla_robotaxi",
      status: "SETTLED",
      syndicate: DEFAULT_MOCK_SYNDICATES[1],
    };
  }
  return DEFAULT_MOCK_ACTIVE_POSITION;
}

export function getFallbackSettlement(id: string) {
  return DEFAULT_MOCK_SETTLEMENT;
}
