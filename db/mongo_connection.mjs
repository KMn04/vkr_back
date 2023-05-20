import Mongoose from 'mongoose'

await Mongoose.connect('mongodb://localhost:27017/local')
    .catch(error => console.log(error));

console.log('Mongo is connected');
