import db from "./db.js";

function getAllOffers() {

    const stmt = db.prepare("SELECT * FROM offers ORDER BY id DESC").all()
    return stmt
}

export { getAllOffers };