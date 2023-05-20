import Mongoose from 'mongoose';

const { Schema } = Mongoose;

const wikiPageSchema = new Schema({
    wikiPageId: Mongoose.ObjectId,
    content: String,
    editor: String,
    updatedAt: Date,
    isDeleted: Date
});
export const WikiPage = Mongoose.model('wikipage', wikiPageSchema);