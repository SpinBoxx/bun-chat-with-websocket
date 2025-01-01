import type { User } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient()

export const createUser = async (username: string): Promise<User | null> => {
  const userWithUsernameExists = await db.user.findFirst({
    where: {
      name: username
    }
  });

  if(userWithUsernameExists){
    return null
  }

  return await db.user.create({
    data: {
      name: username
    }
  })
}
