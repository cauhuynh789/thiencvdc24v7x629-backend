const { ObjectId } = require("mongodb");

class ContactService {
    constructor(client) {
        this.Contact = client.db().collection("contacts");
    }

    extractConactData(payload) {
        const contact = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            favorite: payload.favorite || false,
        };

        Object.keys(contact).forEach(
            (key) => contact[key] === undefined && delete contact[key]
        );

        return contact;
    }

    // ✅ CREATE
    async create(payload) {
        const contact = this.extractConactData(payload);
        const result = await this.Contact.insertOne(contact);
        return result;
    }

    // ✅ FIND ALL
    async find(filter) {
        const cursor = await this.Contact.find(filter);
        return await cursor.toArray();
    }

    // ✅ FIND BY ID
    async findById(id) {
        return await this.Contact.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    // ✅ UPDATE BY ID
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractConactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    // ✅ DELETE BY ID
    async delete(id) {
        const result = await this.Contact.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    // ✅ DELETE ALL
    async deleteAll() {
        const result = await this.Contact.deleteMany({});
        return result.deletedCount;
    }

    // ✅ FIND FAVORITES
    async findFavorite() {
        return await this.find({ favorite: true });
    }
}

module.exports = ContactService;