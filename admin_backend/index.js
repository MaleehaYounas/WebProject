const express = require("express")
const mongoose  =require("mongoose")
const app = express();
const cors = require('cors');

//const SearchRouter = require("./Routes/SearchRoutes");
const AdminRouter = require("./Routes/AdminRoutes");
const RecipientRouter = require("./Routes/RecipientRoutes");
const DonorRouter = require("./Routes/DonorRoutes");
app.use(express.json())
require("dotenv").config()
const upload = require("express-fileupload")
app.use(upload())

app.use("/uploads" , express.static("uploads"))

app.listen(3001)
app.use(cors());


//app.use("/search" ,  SearchRouter)
app.use("/admin" ,  AdminRouter)
app.use("/recipient" ,  RecipientRouter)
app.use("/donor" ,  DonorRouter)
mongoose.connect(process.env.MONGODB_STRING).then(()=>{
    console.log("Connected")
}).catch(err=>{
    console.log(err)
})
