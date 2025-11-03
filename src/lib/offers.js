import db from "./db.js";

function getAllOffers() {

    const stmt = db.prepare("SELECT * FROM offers ORDER BY id DESC").all()
    return stmt
}

function addOffer(offer) {
    const stmt = db.prepare("INSERT INTO offers (operator, title, description, price, ussd_code, image) VALUES (?, ?, ?, ?, ?, ?)");
    const info = stmt.run(offer.operator, offer.title, offer.description, offer.price, offer.ussd, offer.image);
    return { ...offer, id: info.lastInsertRowid };
}

export { getAllOffers, addOffer };