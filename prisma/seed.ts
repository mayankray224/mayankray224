import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Nazaraana database...");

  // Clean existing confessions
  await prisma.confession.deleteMany({});

  const mockConfessions = [
    {
      content: "Scoring 180/300 in JEE Advanced mocks. Coachings are saying I won't get IIT Bombay. I am studying 14 hours a day, sleeping only 4 hours. My head hurts constantly. I just want to sleep for a week without feeling guilty.",
      approved: true,
      expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
      reactions: {
        create: [
          { emoji: "🫂", count: 24 },
          { emoji: "❤️", count: 18 },
          { emoji: "💪", count: 9 },
        ]
      }
    },
    {
      content: "This is my third drop year for NEET. All my school friends are in third year of college, posting vacation photos. I am still solving biology MCQs in the same dusty room. Feel extremely lonely today.",
      approved: true,
      expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      reactions: {
        create: [
          { emoji: "🫂", count: 48 },
          { emoji: "🙌", count: 12 },
          { emoji: "❤️", count: 32 },
        ]
      }
    },
    {
      content: "UPSC prelims results are out. Didn't make it. Again. Spent 4 years in Old Rajinder Nagar. I don't know how to look at my father's face. He is retired and still sending me money. My hands are shaking.",
      approved: true,
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      reactions: {
        create: [
          { emoji: "🫂", count: 52 },
          { emoji: "❤️", count: 29 },
          { emoji: "🙌", count: 14 },
        ]
      }
    },
    {
      content: "Class 12 Boards are starting next week. Relatives are calling every day asking about my preparation. It feels like my entire life's value is going to be written on a single piece of paper. The pressure is choking me.",
      approved: true,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      reactions: {
        create: [
          { emoji: "🫂", count: 19 },
          { emoji: "❤️", count: 15 },
        ]
      }
    }
  ];

  for (const conf of mockConfessions) {
    await prisma.confession.create({
      data: conf,
    });
  }

  console.log("Database seeded successfully! 🌱");
}

main()
  .catch((e) => {
    console.error("Seed script failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
