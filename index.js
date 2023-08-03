const express = require("express");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const connectDb = require("./configs/dbconnection");

connectDb();

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/users',require(`./routes/routes`));
// app.get('/',(req,res) => {
//     res.status(200).json({message:"success"});
// })


app.listen(port,() => {
    console.log("Server is running on port 3000");
});
