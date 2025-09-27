import db from "./db.js";

function getAllTransactions() {

    const data = db.prepare("SELECT * FROM transactions").all()
    return data
}

export { getAllTransactions };