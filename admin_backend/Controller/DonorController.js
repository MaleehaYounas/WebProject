const Donor = require("../models/Donor.schema");
const Admin = require("../models/Admin.schema")
const Recipient = require("../models/Recipient.schema");
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

let Login = async (req, res) => {
    let { email, password } = req.body;
    console.log(password)
    console.log(req.body)
    try {
        let recipient = await Recipient.findOne({ email });
        let donor = await Donor.findOne({ email });
        let admin = await Admin.findOne({ email: email.trim() });

         if(recipient)
         {
            
                console.log(recipient.password)
                if (recipient.password == password) {
                    let id = recipient._id;
                    let role = recipient.role
                    let name=recipient.name
                    let profilePicture=recipient.profilePicture;
                   
                    if (recipient.isBlocked) {
                        return res.status(401).json({ "Message": "Your account is blocked." });
                    }
                    let token = await jwt.sign({ id, name, role, profilePicture},
                        process.env.SECRET_KEY,
                        { expiresIn: '24h' })
                    res.json({ recipient, "Success": true, token })
                } else {
                    res.json({ "Success": false, "Message": "Invalid password" })
    
                }
            
         }
         else if(admin)
         {
                console.log(admin.password)
                if (admin.password == password) {
                    let id = admin._id;
                    let role = admin.role;
                    let name=admin.name;
                    let profilePicture=admin.profilePicture;
                   
                    let token = await jwt.sign({ id, name, role, profilePicture},
                        process.env.SECRET_KEY,
                        { expiresIn: '24h' })
                    res.json({ admin, "Success": true, token })
                } else {
                    res.json({ "Success": false, "Message": "Invalid password" })
    
                }
            
         }
        else if(donor)
        {

            console.log(donor.password)
            if (donor.password == password) {
                let id = donor._id;
                let role = donor.role;
                let name=donor.name;
                let profilePicture=donor.profilePicture;
                   
                if (donor.isBlocked) {
                    return res.status(401).json({ "Message": "Your account is blocked." });
                }
                let token = await jwt.sign({ id, name, role, profilePicture},
                    process.env.SECRET_KEY,
                    { expiresIn: '24h' })
                res.json({ donor, "Success": true, token })
            } else {
                res.json({ "Success": false, "Message": "Invalid password" })

            }
        }
        else {
            res.json({ "Success": false, "Message": "User not Found" })

        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ "Success": false, "Message": "Error during login", err: err.message });
    }

}
module.exports = {
    getAllDonors,
    getDonorById,
    createDonor,
    updateDonorById,
    deleteDonorById,
    Login
};
