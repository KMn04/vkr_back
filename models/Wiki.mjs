import mongoose from "../db/mongo_connection.mjs";
import Mongoose from 'mongoose';

const { Schema } = Mongoose;

const wikiPageSchema = new Schema({
    notificationId: Mongoose.ObjectId,
    subject: {
        id: Number, // ид сущности
        type: String, // тип сущности
        own: Boolean // 1 - только свои, 0 - все
    },
    letter: {
        email: String, // почта адресата
        name: String, // то, что будет в названии письма
        text: String // текст письма
    }
});

export const WikiPage = Mongoose.model('wikipage', wikiPageSchema);