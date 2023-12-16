const Recipient = require("../models/Recipient.schema");
const Donor = require("../models/Donor.schema");
const Admin = require("../models/Admin.schema")
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
    getAllRecipients,
    getRecipientById,
    createRecipient,
    updateRecipientById,
    deleteRecipientById,
    Login
};
