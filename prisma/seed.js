const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding...");
  
  // Hash password for login: test@example.com / password123
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Clear existing data
  await prisma.dailyChallenge.deleteMany().catch(() => {});
  await prisma.vocabulary.deleteMany().catch(() => {});
  await prisma.correction.deleteMany().catch(() => {});
  await prisma.practiceSession.deleteMany().catch(() => {});
  await prisma.progress.deleteMany().catch(() => {});
  await prisma.user.deleteMany().catch(() => {});

  // Create test user
  const user = await prisma.user.create({
    data: {
      name: "John Learner",
      email: "test@example.com",
      password: hashedPassword,
      streak: 5,
      xp: 340,
      lastActiveDate: new Date(),
    },
  });

  // Create vocabulary words for test user
  await prisma.vocabulary.createMany({
    data: [
      {
        userId: user.id,
        word: "Eloquent",
        banglaMeaning: "বাগ্মী / প্রাঞ্জল ও অর্থপূর্ণ অভিব্যক্তি প্রকাশে সক্ষম",
        pronunciation: "eh-luh-kwent",
        exampleSentence: "She made an eloquent speech in favor of the proposal.",
        learned: true,
      },
      {
        userId: user.id,
        word: "Pragmatic",
        banglaMeaning: "ব্যবহারিক / বাস্তবমুখী",
        pronunciation: "prag-mat-ik",
        exampleSentence: "We need to take a pragmatic approach to this problem.",
        learned: false,
      },
      {
        userId: user.id,
        word: "Resilient",
        banglaMeaning: "সহনশীল / স্থিতিস্থাপক",
        pronunciation: "ri-zil-yent",
        exampleSentence: "The community was highly resilient in face of the disaster.",
        learned: false,
      },
    ],
  });

  // Create daily challenges for today
  const todayStr = new Date().toISOString().split("T")[0];
  
  await prisma.dailyChallenge.create({
    data: {
      date: todayStr,
      topic: "Describe Your Favorite Technology",
      prompt: "Write 3-5 sentences about a technological tool you use every day. Why is it important to you, and how has it changed your life?",
      type: "IELTS",
      difficulty: "INTERMEDIATE",
    },
  });

  // Create progress record for today
  await prisma.progress.create({
    data: {
      userId: user.id,
      date: todayStr,
      lessonsCompleted: 1,
      vocabularyCount: 3,
      currentStreak: 5,
      xpEarned: 50,
    },
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
