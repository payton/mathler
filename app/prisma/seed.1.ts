import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const solutions = ['119-41']

  for (let i = 0; i < solutions.length; i++) {
    await prisma.game.upsert({
      where: { id: i + 1 },
      update: {},
      create: {
        id: i + 1,
        answer: solutions[i]
      },
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
