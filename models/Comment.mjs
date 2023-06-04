import Mongoose from 'mongoose';

const { Schema } = Mongoose;

const commentSchema = new Schema({
    taskId: Number,
    author: String,
    text: String,
    createdAt: {type: Date, default: Date.now()},
    pageId: Mongoose.ObjectId
});

export const Comment = Mongoose.model('comment', commentSchema);
