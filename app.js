const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')

require('dotenv').config();


const app = express();
const prisma = new PrismaClient();

app.use(morgan('dev'))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json({
        name: "BUS_TICKETING_API",
        stack: ["ExpressJS", "Prisma", "MySQL"],
        author: "DAVID-DARA"
    })
})

const PORT = process.env.PORT || 3030;

app.listen(PORT, async () => {
    await prisma.$connect();
    console.log(`Server is running on port ${PORT}`);
})