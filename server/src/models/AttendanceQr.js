const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const attendanceQrData = new Schema({
    empid: String,
    fullname : String,
    birthYear: String,
    bloodGroup : String,
    position : String,
    orgName : String,
    qr : String,
    inTime: [Date],
    outTime: [Date],
    isInside: Boolean
})


const attendandeQr = mongoose.model("AttendanceUsers", attendanceQrData);

module.exports = {attendandeQr};


