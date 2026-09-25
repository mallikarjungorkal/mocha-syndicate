import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning existing database...");
  await prisma.settlement.deleteMany();
  await prisma.position.deleteMany();
  await prisma.pledge.deleteMany();
  await prisma.syndicate.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding Dr. AIT campus users...");
  const namith = await prisma.user.create({
    data: {
      id: "user_namith",
      name: "Namith DR",
      handle: "drait_lead",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=namith",
      upiId: "namith@okaxis",
      campus: "Dr. AIT Bangalore (Computer Science)",
      isLeader: true,
      winRate: 78.4,
      maxDrawdown: 6.2,
      skinInGame: 5000.0,
    },
  });

  const mallikarjun = await prisma.user.create({
    data: {
      id: "user_mallu",
      name: "Mallikarjun",
      handle: "drait_quant",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=mallu",
      upiId: "mallu@icici",
      campus: "Dr. AIT Alumni (Algorithmic Trading)",
      isLeader: true,
      winRate: 81.2,
      maxDrawdown: 5.1,
      skinInGame: 10000.0,
    },
  });

  const pruthvi = await prisma.user.create({
    data: {
      id: "user_pruthvi",
      name: "Pruthvi Prakash Rao",
      handle: "macro_pruthvi",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=pruthvi",
      upiId: "pruthvi@oksbi",
      campus: "Dr. AIT FinTech Society",
      isLeader: true,
      winRate: 74.5,
      maxDrawdown: 7.4,
      skinInGame: 3500.0,
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      id: "user_demo",
      name: "Priyanka Sutar",
      handle: "priyanka_s",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=priyanka",
      upiId: "priyanka@oksbi",
      campus: "Dr. AIT Bangalore - Hostel Block 1",
      isLeader: false,
    },
  });

  console.log("Seeding syndicates...");
  const nvdaSyndicate = await prisma.syndicate.create({
    data: {
      id: "synd_nvda_q3",
      title: "Nvidia Q3 Earnings Breakout",
      catalyst: "NVDA Q3 Earnings & Blackwell GPU Demand Surge",
      assetSymbol: "NVDA",
      assetName: "NVIDIA Corporation",
      direction: "LONG",
      leverage: 10,
      entryPrice: 140.0,
      targetPrice: 142.52, // +1.8% underlying * 10x = +18% ROI
      stopLossPrice: 138.6, // -1.0% underlying * 10x = -10% Stop Loss
      circuitBreakerPct: -10.0,
      targetReturnPct: 18.0,
      minPledge: 50.0,
      leaderPledge: 5000.0,
      poolCap: 50000.0,
      currentPooled: 38400.0,
      status: "OPEN",
      leaderId: namith.id,
    },
  });

  const tslaSyndicate = await prisma.syndicate.create({
    data: {
      id: "synd_tsla_robotaxi",
      title: "Tesla Robotaxi Momentum Swing",
      catalyst: "Autonomous Fleet Regulatory Approval Milestone",
      assetSymbol: "TSLA",
      assetName: "Tesla, Inc.",
      direction: "LONG",
      leverage: 5,
      entryPrice: 220.0,
      targetPrice: 226.6, // +3.0% underlying * 5x = +15% ROI
      stopLossPrice: 215.6, // -2.0% underlying * 5x = -10% Stop Loss
      circuitBreakerPct: -10.0,
      targetReturnPct: 15.0,
      minPledge: 100.0,
      leaderPledge: 10000.0,
      poolCap: 75000.0,
      currentPooled: 62000.0,
      status: "OPEN",
      leaderId: mallikarjun.id,
    },
  });

  const aaplSyndicate = await prisma.syndicate.create({
    data: {
      id: "synd_aapl_ai",
      title: "Apple AI Hardware Supercycle",
      catalyst: "M4 Ultra Silicon Launch & Device Upgrades",
      assetSymbol: "AAPL",
      assetName: "Apple Inc.",
      direction: "LONG",
      leverage: 5,
      entryPrice: 230.0,
      targetPrice: 235.52, // +2.4% underlying * 5x = +12% ROI
      stopLossPrice: 225.4, // -2.0% underlying * 5x = -10% Stop Loss
      circuitBreakerPct: -10.0,
      targetReturnPct: 12.0,
      minPledge: 50.0,
      leaderPledge: 3500.0,
      poolCap: 30000.0,
      currentPooled: 14500.0,
      status: "OPEN",
      leaderId: pruthvi.id,
    },
  });

  console.log("Database seeded successfully with Dr. AIT campus profiles!");
  console.log(`- Created ${await prisma.user.count()} users`);
  console.log(`- Created ${await prisma.syndicate.count()} syndicates`);
}

main()
  .catch((e) => {
    console.error("Error seeding DB:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
