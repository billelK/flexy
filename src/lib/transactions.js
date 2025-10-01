import db from "./db.js";

function getAllTransactions() {

    const stmt = db.prepare("SELECT * FROM transactions ORDER BY id DESC").all()
    return stmt
}

async function  mockRecharge (transaction) {
  await new Promise((res) => setTimeout(res, 10000));

  // Random success or fail
  const isSuccess = Math.random() > 0.5;
  const status = isSuccess ? "Completed" : "Failed";

  return {
    ...transaction,
    status,
    created_at: new Date().toISOString(),
  }
}

function addTransaction(data) {
  const stmt = db.prepare(
    "INSERT INTO transactions (operator, phone, amount, status) VALUES (?, ?, ?, ?)"
  );
  return stmt.run(data.operator, data.phone, data.amount, data.status);
}


export { getAllTransactions,
         addTransaction,
         mockRecharge
};