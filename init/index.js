const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/Listing.js');

const mongoURL = 'mongodb://127.0.0.1:27017/letfslust';

// async function main(){
//     await mongoose.connect(mongoURL);
// }

main()
   .then(()=>{
    console.log('connected to DB');
   })
   .catch((error)=>{
    console.log(error);
   })

async function main(){
    await mongoose.connect(mongoURL);
}

const initDB = async()=>{
    // await Listing.syncIndexes()
    await Listing.deleteMany({}); // after cleaning the data base, by
    // deleting the existing data and re-inserting the data
    initData.data = initData.data.map((obj)=>({...obj, owner:"657be10c2fd00da08e531eeb"}));
    await Listing.insertMany(initData.data);
    console.log('Data was initialized');

}

initDB();