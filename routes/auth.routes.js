const router = require("express").Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");


router.get("/createUser", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/createUser", async(req,res,next)=>{
    //destructuring
    const {email, username, password, ...rest} = req.body;
    try{
        const salt = bcryptjs.genSaltSync(10);
        const newPassword = bcryptjs.hashSync(password, salt);

        const user = await User.create({username,password:newPassword});
        res.redirect(`/profile/${user._id}`)
    }catch(error){
        console.log("error:", error);
        res.send("El error!!!")
    }
})

router.get("/profile/:id", (req,res,next) =>{
    User.findById(req.params.id)
    .then(user=>{
        console.log("user", user);
        //return user without password
        const userWithoutPass = user.toObject()
        delete userWithoutPass.password
        //delete userWithoutPass["password"]
        //1) const {password, ...restUser} = userWithoutPass
        console.log("user", userWithoutPass);

        res.render("profile", {user:userWithoutPass})
    })
    .catch(error=>{
        console.log("error", error);
        res.send("El error!!!")
    })
})

module.exports = router;
