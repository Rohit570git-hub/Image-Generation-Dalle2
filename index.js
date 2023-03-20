const express = require('express');
const dotenv = require('dotenv').config();
const path = require('path');
const fs = require('fs');


const port = process.env.PORT||5000;

const app = express();

//Enable body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended : false}));

//Set static folder
let initialPath = path.join(__dirname, "public");
app.use(express.static(initialPath));

app.use('/openai',require('./routes/openaiRoutes'))


// app.get('/',(req,res) => {
//     res.send("Hello");
// })

app.listen(port,()=> console.log(`Server started on PORT ${port}`));