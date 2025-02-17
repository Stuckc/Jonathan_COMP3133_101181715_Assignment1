const express = require('express');
const { createHandler } = require('graphql-http/lib/use/express');
const connectDB = require('./config/db');
const schema = require('./graphql/schema');
require('dotenv').config();
const cors = require('cors');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.all('/graphql', createHandler({ schema }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}/graphql`));

