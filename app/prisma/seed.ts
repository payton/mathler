import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const solutions = ['119-41','21/7+9','90/9+7','18+6-3','24*2-9','112-47','27*3-9','28-3+7','95/5+8','132-59']

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
