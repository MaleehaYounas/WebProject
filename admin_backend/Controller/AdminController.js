const Donor = require("../models/Donor.schema")
const Recipient = require("../models/Recipient.schema")
const Admin = require("../models/Admin.schema")
const jwt = require("jsonwebtoken")
const blockUser = async (req, res) => {
    try {
        // Check if the user is  'admin'
        if ( req.role === "admin") {
            const { id } = req.params;

            // Check if the user exists
            const donor = await Donor.findById(id);
            const recipient = await Recipient.findById(id);
            if (donor) {
                donor.isBlocked = true;
                await donor.save();
                res.status(200).json({ "Message": "Donor blocked" });
            }
            else if(recipient)
            {
                recipient.isBlocked = true;
                await recipient.save();
                res.status(200).json({ "Message": "Recipient blocked" });
            }
   
           
           
        } else {
            res.status(403).json({ "Message": "You are not authorized for this action" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ "Message": "Server error" });
    }
};

const unBlockUser = async (req, res) => {
    try {
        // Check if the user is  'admin'
        if ( req.role === "admin") {
            const { id } = req.params;

            // Check if the user exists
            const donor = await Donor.findById(id);
            const recipient = await Recipient.findById(id);
            if (donor) {
                donor.isBlocked = false;
                await donor.save();
                res.status(200).json({ "Message": "Donor blocked" });
            }
            else if(recipient)
            {
                recipient.isBlocked = false;
                await recipient.save();
                res.status(200).json({ "Message": "Recipient blocked" });
            }
   
           
           
        } else {
            res.status(403).json({ "Message": "You are not authorized for this action" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ "Message": "Server error" });
    }
};


const updateRecipientStatus = async (req, res) => {
    try {
        // Check if the user is  'admin'
        if ( req.role === "admin") {
            const { id } = req.params;

            // Check if the user exists
            const recipient = await Recipient.findById(id);
           if( recipient.isNeedFulfilled == false)
            {
                recipient.isNeedFulfilled = true;
                await recipient.save();
                res.status(200).json({ "Message": "Recipient need fulfilled" });
            }
           else if(recipient.isNeedFulfilled == true)
           {
            recipient.isNeedFulfilled = false;
                await recipient.save();
                res.status(200).json({ "Message": "Recipient need not fulfilled" });
           }
           
        } else {
            res.status(403).json({ "Message": "You are not authorized for this action" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ "Message": "Server error" });
    }
};

const getAllRecipients = async (req, res) => {
    try {
        
        if (req.role == "admin") {
            // Find all recipients in the system
            const recipients = await Recipient.find();
            res.status(200).json(recipients);
        } else {
            res.status(403).json({ "Message": "You are not authorized for this action" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ "Message": "Server error" });
    }
};

const getAllDonors = async (req, res) => {
    try {
        
        if (req.role == "admin") {
            // Find all donors in the system
            const donors = await Donor.find();
            res.status(200).json(donors);
        } else {
            res.status(403).json({ "Message": "You are not authorized for this action" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ "Message": "Server error" });
    }
};
const getAdmin = async (req, res) => {
    try {
        
        if (req.role == "admin") {
            
            const admin = await Admin.find();
            res.status(200).json(admin);
        } else {
            res.status(403).json({ "Message": "You are not authorized for this action" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ "Message": "Server error" });
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
let createAdmin = (req, res) => {
    let data = req.body;
    console.log(req.files)
    let { profilePicture } = req.files;
    console.log(profilePicture)

    let path = Date.now().toString() + profilePicture.name;
    profilePicture.mv("./uploads/" + path)
    Admin.create({
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone,
        role: data.role,
        cnic: data.cnic,
        profilePicture: path
    }).then(data => {
        res.status(201).json(data)
    }).catch(err => {
        res.status(500).json({ "Message": "There was Some Error" })
    })
}


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
module.exports= {blockUser, getAllRecipients, getAllDonors, createAdmin, Login, getDonorById, getRecipientById, getAdmin, unBlockUser, updateRecipientStatus};

