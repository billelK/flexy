import db from "./db.js";
// import {transactionSchema } from "./validation.ts";

function getAllTransactions() {

    const stmt = db.prepare("SELECT * FROM transactions").all()
    return stmt
}

async function  mockRecharge (transaction) {
  console.log("⚡ Mock recharge request:", transaction);

  // Simulate delay (2s)
  await new Promise((res) => setTimeout(res, 20000));

  // Random success or fail
  const isSuccess = Math.random() > 0.3; // 70% chance success
  const status = isSuccess ? "Completed" : "Failed";

  return {
    ...transaction,
    status,
    created_at: new Date().toISOString(),
  }
}

function addTransaction(data) {
  // Validate before inserting
  // const parsed = transactionSchema.safeParse(data);
  // if (!parsed.success) {
  //   throw new Error("Validation failed: " + JSON.stringify(parsed.error.errors));
  // }

  // Now safe to insert into DB
  const stmt = db.prepare(
    "INSERT INTO transactions (operator, phone, amount, status) VALUES (?, ?, ?, ?)"
  );
  return stmt.run(data.operator, data.phone, data.amount, data.status);
}


export { getAllTransactions,
         addTransaction,
         mockRecharge
};