require('dotenv').config()
const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const { graphqlHTTP } = require('express-graphql');
const schema  = require('./schema/schema')
const { CheckOut } = require('./controllers/CheckOut')
const app = express();
app.use(express.json());
//app.use(helmet());
//app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(cors());

const PORT = process.env.PORT || 4000 ;

app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/', require("./routes/root"))
app.use("/checkout", require("./routes/Check_out"))

app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      graphiql: process.env.NODE_ENV === 'development',
    })
  );
  
app.use("/auth", require("./routes/AuthRoutes"))




//console.log(require('crypto').randomBytes(200).toString('base64'))
app.listen(PORT, () => console.log(`💻Server running on ${PORT}🔥🔥🚀🚀`))
