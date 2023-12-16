const { getAllRecipients, getRecipientById, createRecipient, updateRecipientById, deleteRecipientById, Login} = require("../Controller/RecipientController")

const express = require("express");
//const { AuthenticateUser } = require("../utils");
const router2 = express.Router();

router2.get("/" ,getAllRecipients)
router2.get("/:id" ,getRecipientById)
router2.post("/create" , createRecipient)
router2.post("/login" , Login)
router2.patch("/:id" , updateRecipientById)
router2.delete("/:id" ,  deleteRecipientById)


module.exports = router2;


