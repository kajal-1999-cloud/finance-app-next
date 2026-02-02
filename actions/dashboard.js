"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeTransaction = (obj) => {
  const serialized = { ...obj };
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }
  if (obj.balance && typeof obj.balance.toNumber === "function") {
    serialized.balance = obj.balance.toNumber();
  }
  return serialized;
};

export async function createAccount(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    console.log("userid", userId);
    const user = await db.user.findUnique({
      where: { clerkUSerId: userId },
    });

    if (!user) {
      throw new Error("user not found");
    }
    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      throw new Error("Invalid Balance Amount");
    }
    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });
    const shouldDefault = existingAccounts.length == 0 ? true : data.iseDefault;

    if (shouldDefault) {
      await db.account.updateMany({
        where: { userId: user.id, iseDefault: true },
        data: { iseDefault: false },
      });
    }

    const account = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        iseDefault: shouldDefault,
      },
    });

    const serializeAccount = serializeTransaction(account);

    revalidatePath("/dashboard");
    return { success: true, data: serializeAccount };
  } catch (err) {
    console.log("error dashboard actions", err.message);
    throw new Error(err.message);
  }
}

export async function getUserAccounts(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUSerId: userId },
  });

  if (!user) {
    throw new Error("user not found");
  }

  const accounts = await db.account.findMany({
    where: { userId: user.id },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          transactions: true,
        },
      },
    },
  });

  const serializedAccount = accounts.map(serializeTransaction);

  return serializedAccount;
}

export async function getDashboardData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUSerId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get all user transactions
  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  return transactions.map(serializeTransaction);
}