const express = require("express");
const router = express.Router();
const QRCode = require("qrcode");
const DigitalMenuModel = require("../models/DigitalMenuModule");

router.get("/", async (req, res, next) => {
  return res.status(200).json({
    title: "Express Testing",
    message: "The app is working properly!",
  });
});

router.post("/adduser", async(req, res) => {
  if(await DigitalMenuModel.digitalMenuUser.findOne({"email": req.body.email}) == null){
    var text = await QRCode.toDataURL("https://quardify-abc.vercel.app/DigitalMenu/menu/"+ req.body.username, { margin: 1 });
    const data = DigitalMenuModel.digitalMenuUser({
        email:req.body.email,
        password: req.body.password,
        brandName: req.body.brandName,
        username: req.body.username,
        qr: text.toString(),
    })
    data.save();
    res.status(200).send("New account created");
  }
  else{
    res.send("User already exists");    
  }
})

router.post("/addItem/:username", async(req, res) => {
 await DigitalMenuModel.digitalMenuUser.findOne({"username": req.params.username}).then(user => {
  DigitalMenuModel.digitalMenuItems.findOne({"itemName": req.body.itemName}).exec((err, item) => {
    if(item == null){
      const data = DigitalMenuModel.digitalMenuItems({
        itemName: req.body.itemName,
        itemPrice: req.body.itemPrice,
      })
      user.items.push(data);
      user.save();
      data.save();
      res.send("Item added successfully");
    }else{
       res.send("Item already exists");
    }
  });
  })
})

router.post("/login", async (req, res) => {
  let x = await DigitalMenuModel.digitalMenuUser.findOne({"email": req.body.email});
  if(x != null){
    if(x.password == req.body.password){
      res.status(200).send({message: "login successful", username : x.username});
    }
    else{
      res.status(403).send("login failed, Invalid password");
    }
  }else{
    res.status(404).send("Please enter valid email address");
  }
})

router.get("/getAllUser", async (req, res) => {
    await DigitalMenuModel.digitalMenuUser.find({}).then(user => {
      res.status(200).json({data : user});
    })
})
 

router.get("/getqr/:username", async (req, res) => {
  await DigitalMenuModel.digitalMenuUser.findOne({"username": req.params.username}).populate("items").then(user => {
    user.scannedQr.push(Date.now());
    user.save();
    res.status(200).json({brand: user.brandName, data : user.items});
  })
})


module.exports = router;