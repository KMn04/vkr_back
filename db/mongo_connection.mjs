import Mongoose from 'mongoose'

const mongoose = await Mongoose.connect('mongodb://localhost:27017')
    .catch(error => console.log(error));

console.log('Mongo is connected');

export default mongoose