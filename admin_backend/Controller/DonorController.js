const Donor = require("../models/Donor.schema");
const jwt = require("jsonwebtoken");

let getAllDonors = async (req, res) => {
    try {
        let donors = await Donor.find({});
        res.status(200).json(donors);
    } catch (err) {
        res.status(500).json({ "Message": "Error", err: err });
    }
};

let getDonorById = async (req, res) => {
    let id = req.params.id;
    try {
        let donor = await Donor.findOne({ _id: id });
        if (donor) {
            res.status(200).json(donor);
        } else {
            res.status  (404).json({ "Message": "Donor not found" });
        }
    } catch (err) {
        res.status(500).json({ "Message": "Error", err: err });
    }
};

let createDonor = async (req, res) => {
    let data = req.body;
    let { profilePicture } = req.files;

    let profilePicturePath = Date.now().toString() + profilePicture.name;

    try {
        profilePicture.mv("./uploads/" + profilePicturePath);

        let newDonor = await Donor.create({
            name: data.name,
            email: data.email,
            password: data.password,
            phone: data.phone,
            address: data.address,
            occupation: data.occupation,
            religion: data.religion,
            profilePicture: profilePicturePath,
            isBlocked: false,
            donationHistory: []
        });

        res.status(201).json(newDonor);
    } catch (err) {
        res.status(500).json({ "Message": "There was some error", err });
    }
};

let updateDonorById = async (req, res) => {
    let id = req.params.id;
    let data = req.body;

    try {
        let donor = await Donor.findByIdAndUpdate(id, data);
        if (donor) {
            res.status(200).json(donor);
        } else {
            res.status(404).json({ "Message": "Donor not found" });
        }
    } catch (err) {
        res.status(500).json({ "Message": "Error", err: err });
    }
};

let deleteDonorById = async (req, res) => {
    let id = req.params.id;
    try {
        let donor = await Donor.findByIdAndDelete(id);
        if (donor) {
            res.status(200).json(donor);
        } else {
            res.status(404).json({ "Message": "Donor not found" });
        }
    } catch (err) {
        res.status(500).json({ "Message": "Error", err: err });
    }
};

module.exports = {
    getAllDonors,
    getDonorById,
    createDonor,
    updateDonorById,
    deleteDonorById
};
