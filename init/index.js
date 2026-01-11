const mongoose = require("mongoose");
const initData = require ("./data.js");
const Listing = require("../models/listing.js");
const { object } = require("joi");

const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(res => console.log("connted to DB"))
    .catch(err => console.log("err"));

async function main(){
    await mongoose.connect(mongoUrl);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "695a9c57d0de31c96d5cacfe"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};
initDB();


 
// async function init() {
//     try {
//         await mongoose.connect(mongoUrl);
//         console.log("Connected to DB");

//         await Listing.deleteMany({});
//         await Listing.insertMany(initData.data);
//         console.log("Data was initialized");

//         mongoose.connection.close(); // DB close karna optional
//     } catch (err) {
//         console.log("Error:", err);
//     }
// }

// init();
