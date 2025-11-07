import db from "./db.js";

function getAllOffers() {

    const stmt = db.prepare("SELECT * FROM offers ORDER BY id DESC").all()
    return stmt
}

function addOffer(offer) {
    const stmt = db.prepare("INSERT INTO offers (operator, title, description, price, ussd_code, image) VALUES (?, ?, ?, ?, ?, ?)");
    const info = stmt.run(offer.operator, offer.title, offer.description, offer.price, offer.ussd_code, offer.image);
    return { ...offer, id: info.lastInsertRowid };
}

function updateOffer(offer) {
  const stmt = db.prepare(`
    UPDATE offers
    SET operator = ?, title = ?, description = ?, price = ?, ussd_code = ?, image = ?
    WHERE id = ?
  `);

  const info = stmt.run(
    offer.operator,
    offer.title,
    offer.description,
    offer.price,
    offer.ussd_code,
    offer.image,
    offer.id
  );

  // ✅ Return the updated row from DB (fresh data)
  const getStmt = db.prepare("SELECT * FROM offers WHERE id = ?");
  const updatedOffer = getStmt.get(offer.id);

  return updatedOffer;
}

function deleteOffer(id) {
  const stmt = db.prepare("DELETE FROM offers WHERE id = ?");
  const info = stmt.run(id);
  return info.changes > 0; // returns true if a row was deleted
}

export { getAllOffers, addOffer, updateOffer, deleteOffer };