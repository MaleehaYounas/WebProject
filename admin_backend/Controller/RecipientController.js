const Recipient = require("../models/Recipient.schema");
const jwt = require("jsonwebtoken");

let getAllRecipients = async (req, res) => {
    try {
        let recipients = await Recipient.find({});
        res.status(200).json(recipients);
    } catch (err) {
        res.status(500).json({ "Message": "Error", err: err });
    }
};

let getRecipientById = async (req, res) => {
    let id = req.params.id;
    try {
        let recipient = await Recipient.findOne({ _id: id });
        if (recipient) {
            res.status(200).json(recipient);
        } else {
            res.status(404).json({ "Message": "Recipient not found" });
        }
    } catch (err) {
        res.status(500).json({ "Message": "Error", err: err });
    }
};

let createRecipient = async (req, res) => {
    let data = req.body;
    let { profilePicture, documents } = req.files;

    let profilePicturePath = Date.now().toString() + profilePicture.name;
    let documentsPaths = [];

    try {
        profilePicture.mv("./uploads/" + profilePicturePath);

        // Check if documents field is present in the uploaded files
        if (documents) {
            documentsPaths = documents.map(doc => ({
                path: Date.now().toString() + doc.name
            }));

            documents.forEach((doc, index) => {
                doc.mv("./uploads/" + documentsPaths[index].path);
            });
        }

        let newRecipient = await Recipient.create({
            name: data.name,
            email: data.email,
            password: data.password,
            cnic: data.cnic,
            occupation: data.occupation,
            income: data.income,
            needs: data.needs,
            phone: data.phone,
            address: data.address,
            religion: data.religion,
            profilePicture: profilePicturePath,
            documents: documentsPaths
        });

        res.status(201).json(newRecipient);
    } catch (err) {
        res.status(500).json({ "Message": "There was some error", err });
    }
};

let updateRecipientById = async (req, res) => {
    let id = req.params.id;
    let data = req.body;

    try {
        let recipient = await Recipient.findByIdAndUpdate(id, data);
        if (recipient) {
            res.status(200).json(recipient);
        } else {
            res.status(404).json({ "Message": "Recipient not found" });
        }
    } catch (err) {
        res.status(500).json({ "Message": "Error", err: err });
    }
};

let deleteRecipientById = async (req, res) => {
    let id = req.params.id;
    try {
        let recipient = await Recipient.findByIdAndDelete(id);
        if (recipient) {
            res.status(200).json(recipient);
        } else {
            res.status(404).json({ "Message": "Recipient not found" });
        }
    } catch (err) {
        res.status(500).json({ "Message": "Error", err: err });
    }
};

module.exports = {
    getAllRecipients,
    getRecipientById,
    createRecipient,
    updateRecipientById,
    deleteRecipientById
};
