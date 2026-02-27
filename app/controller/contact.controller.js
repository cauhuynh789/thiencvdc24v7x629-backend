const ContactService = require("../services/contact.service");
const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");

// ✅ GET /api/contacts
exports.findAll = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const documents = await contactService.find({});
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, error.message)
        );
    }
};

// ✅ GET /api/contacts/:id
exports.findOne = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);

        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }

        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, error.message)
        );
    }
};

// ✅ PUT /api/contacts/:id
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(
            req.params.id,
            req.body
        );

        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }

        return res.send({ message: "Contact was updated successfully" });
    } catch (error) {
        return next(
            new ApiError(500, error.message)
        );
    }
};

// ✅ DELETE /api/contacts/:id
exports.delete = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);

        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }

        return res.send({ message: "Contact was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, error.message)
        );
    }
};

// ✅ DELETE /api/contacts
exports.deleteAll = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const deletedCount = await contactService.deleteAll();

        return res.send({
            message: `${deletedCount} contacts were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, error.message)
        );
    }
};

// ✅ GET /api/contacts/favorite
exports.findAllFavorite = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const documents = await contactService.find({ favorite: true });

        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, error.message)
        );
    }
};
// Create and Save a new Contact
exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }

    try {
        if (!MongoDB.client) {
            return next(new ApiError(500, "Database connection not established"));
        }
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        return res.send(document);
    } catch (error) {
        console.error("Create contact error:", error);
        return next(
            new ApiError(500, "An error occurred while creating the contact")
        );
    }
};