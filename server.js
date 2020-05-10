const express= require('express');
const app = express();
const cors = require('cors')

app.use(cors());
app.get('/', (req,res)=> res.send('API running'));

const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
   console.log(`Server listening on port ${PORT}`)
});

const connectDB = require('./config/db');
connectDB();