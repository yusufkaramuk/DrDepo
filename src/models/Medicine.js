export class Medicine {
    constructor(id, name, quantity, expiryDate, notes = "") {
        this.id = id || Date.now().toString();
        this.name = name;
        this.quantity = quantity;
        this.expiryDate = expiryDate;
        this.notes = notes;
        this.createdAt = new Date().toISOString();
    }
}
