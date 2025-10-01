import db from "./db.js";

function getAllTransactions() {

    const stmt = db.prepare("SELECT * FROM transactions").all()
    return stmt
}

function addTransaction(transaction) {
    const {operator, phone, amount, status} = transaction;

    try {
        const stmt = db.prepare("INSERT INTO transactions (operator, phone, amount, status) VALUES (?, ?, ?, ?)")
        const result = stmt.run(operator, phone, amount, status);
        
        return result.changes 
        
        
    } catch (err) {
        console.error("Error adding transaction:", err);
    } 
}

export { getAllTransactions,
         addTransaction
};