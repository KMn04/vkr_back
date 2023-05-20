import Mongoose from 'mongoose';

const { Schema } = Mongoose;

const wikiPageSchema = new Schema({
    projectId: Number,
    title: String,
    content: String,
    editor: String,
    createdAt: {
        type: Date, 
        default: Date.now()
    },
    updatedAt: Date,
    deletedAt: Date
});
export const WikiPage = Mongoose.model('wikipage', wikiPageSchema);