const express=require("express");
const router=express.Router();

const secretRoute=require("../controllers/modules/getSecretController.js");

router.post("/get-secret", secretRoute);

module.exports=router;