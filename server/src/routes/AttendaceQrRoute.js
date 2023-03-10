const express = require("express");
const router = express.Router();
const QRCode = require("qrcode");
const {attendandeQr} = require("../models/AttendanceQr");


router.post("/addEmp", async(req, res) => {
    
  if(await attendandeQr.findOne({"empid": req.body.empid}) == null){
    var text = await QRCode.toDataURL("https://quardify-abc.vercel.app/QRAttendance/attendance/"+ req.body.empid, { margin: 1 });
    const data = attendandeQr({
        empid: req.body.empid,
        fullname : req.body.fullname,
        birthYear: req.body.birthYear,
        bloodGroup : req.body.bloodGroup,
        position : req.body.position,
        qr : text.toString(),
        orgName : req.body.orgName,
        isInside: false,
    })
    data.save();
    res.status(200).send("New Employee Added");
  }
  else{
    res.send("Employee already exists");    
  }
})

router.get("/empAttendance/:username", async(req, res) => {
 await attendandeQr.findOne({"empid": req.params.username}).then(emp => {
    if(emp != null){
        if(emp.isInside){
            emp.outTime.push(Date.now());
            emp.isInside = false;
            emp.save();
            res.send({message: "Exit!", data: emp.fullname});
        }else{
            emp.inTime.push(Date.now());
            emp.save();
            emp.isInside = true;
            res.send({message: "You have Enter", data: emp.fullname});
        }
    }
    else{
        res.send({message: "emp not found", data: "not found"});
    }
  });
})

router.get("/getAllEmp", async (req, res) => {
    await attendandeQr.find({}).then(emp => {
      res.status(200).json({data : emp});
    })
})

module.exports = router;