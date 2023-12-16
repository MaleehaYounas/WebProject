const {blockUser, getAllRecipients, getAllDonors, createAdmin, Login,getDonorById, getRecipientById,getAdmin, unBlockUser, updateRecipientStatus} = require("../Controller/AdminController")

const express = require("express");
const { AuthenticateUser } = require("../utils");
const router4 = express.Router();
router4.get("/get-donor-by-id/:id" ,AuthenticateUser, getDonorById)
router4.get("/get-recipient-by-id/:id" ,AuthenticateUser, getRecipientById)
router4.put("/block-user/:id" ,AuthenticateUser, blockUser)
router4.put("/unblock-user/:id" ,AuthenticateUser, unBlockUser)
router4.put("/update-recipient-status/:id" ,AuthenticateUser, updateRecipientStatus)
router4.get("/get-all-recipients" ,AuthenticateUser, getAllRecipients)
router4.get("/get-all-donors" ,AuthenticateUser, getAllDonors)
router4.post("/create-admin",createAdmin)
router4.get("/get-admin", AuthenticateUser, getAdmin)
router4.post("/login", Login)
module.exports = router4;