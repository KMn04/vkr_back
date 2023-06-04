import Mongoose from 'mongoose'

const { Schema } = Mongoose
 
const imageSchema = new Schema({
    name: String,
    taskId: Number,
    img:
    {
        name: String,
        data: Buffer,
        contentType: String
    }
});
 
export const ImageModel = Mongoose.model('Image', imageSchema);