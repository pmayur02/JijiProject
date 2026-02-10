require("dotenv").config();
const express = require("express");
const router = require("./Router/router")
const swaggerUi = require("swagger-ui-express");
const path = require("path")
const fs = require("fs")


const app = express();

const PORT = process.env.PORT || 8000;
app.use(express.json())
app.use("/",router);

app.get("/health-check",(req,res)=>{
    res.json({message:"OK"});
})

const swaggerPath = path.join(__dirname,"/utilities/swagger.json");
const swaggerDocument = JSON.parse(
    fs.readFileSync(swaggerPath,"utf-8")
)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});




app.listen(PORT,()=>{
    console.log(`running on ${PORT}`);
})