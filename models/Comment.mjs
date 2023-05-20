import Mongoose from 'mongoose';

const { Schema } = Mongoose;

const commentSchema = new Schema({
    commentId: Mongoose.ObjectId,
    taskId: Number,
    info: {
        author: String,
        text: String,
        createdAt: Date,
        updatedAt: Date,
        deletedAt: Date
    },
    pageId: Mongoose.ObjectId
});

export const Comment = Mongoose.model('comment', commentSchema);
