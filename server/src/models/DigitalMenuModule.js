const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const items = new Schema({
    itemName: String,
    itemPrice: Number,
})

const user = new Schema({
    email: String,
    password: String,
    brandName: String,
    username:String,
    qr: String,
    items:[
        {
            type: Schema.ObjectId,
            ref: "DigitalMenu_Items",
        }
    ],
    scannedQr: [Date]

})


const digitalMenuItems = mongoose.model('DigitalMenu_Items', items);
const digitalMenuUser = mongoose.model("DigitalMenu_Users", user);

module.exports = {digitalMenuItems, digitalMenuUser};


