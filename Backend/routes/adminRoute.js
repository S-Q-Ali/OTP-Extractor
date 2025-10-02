const express =require("express");
const router=express.Router();
const bcrypt=require("bcrypt");
const speakeasy=require("speakeasy");
const qrcode=require("qrcode");
const {readUsers,writeUsers,getUserByEmail} =require("../utils/userHelpers");
const logger = require("../utils/logger");
const { getClientIp } = require("../utils/helpers");

const requireAdmin=async(req,res,next)=>{
    try{
        const {adminEmail}=req.body;

        if(!adminEmail){
            return res.status(401).json({
                success:false,
                message:"Enter Valid Admin Email",
            });
        }

        const user=await getUserByEmail(adminEmail);

        if(!user||user.role!=='admin'||user.status!=='active'){
            return res.status(403).json({
                success:false,
                message:"Admin access required",
            });
        }

        req.adminUser=user;
        next();

    }catch(error){
        res.status(500).json({
            success:false,
            message:"Server error",
            error:error.message,
        });
    }
}

router.use(requireAdmin);

router.post("/users",async(req,res)=>{
    try{
        const users=await readUsers();

        const usersList = Object.values(users.users).map(user=>({
            email:user.email,
            role:user.role,
            status:user.status,
            is_verified:user.is_verified,
            created_at:user.created_at,
            last_login:user.last_login,
            updated_at:user.updated_at,
        }));

        res.json({
            success:true,
            users:usersList
        });

    }catch(error){
        res.status(500).json({
            success:false,
            message:"Failed to fetch users",
            error:error.message,
        });
    }
});

router.post("/users/add",async(req,res)=>{
    try{
        const {email,password,role='user'}=req.body;
        const users=await readUsers();

        if(users.users[email]){
            return res.status(400).json({
                success:false,
                message:"User already exists",
            });
        }

        const hashedPassword=await bcrypt.hash(password,10);
        const secret=speakeasy.generateSecret({name:`OTP-App(${email})`});
        const qrCodeDataUrl=await qrcode.toDataURL(secret.otpauth_url);

        users.users[email]={
            id:email,
            email,
            password:hashedPassword,
            secret:secret.base32,
            qrcode:qrCodeDataUrl,
            is_verified:false,
            role:role,
            status:'active',
            created_at:new Date().toISOString(),
            last_login:null,
            updated_at:new Date().toISOString(),
        };

        await writeUsers(users);

        logger.logRegister(email,"success","user_created_by_admin",{
            ip:getClientIp,
            created_by:req.adminUser.email,
            role:role,
        });

        res.json({
            success:true,
            message:"User created successfully",
            user:{
                email,
                role,
                status:'active',
                qrcode:qrCodeDataUrl,
            }
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:"Failed to create user",
            error:error.message,
        })
    }
})


module.exports=router;