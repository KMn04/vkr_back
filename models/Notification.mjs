import Mongoose from 'mongoose';

const { Schema } = Mongoose;

const notificationSchema = new Schema({
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

export const Notification = Mongoose.model('notification', notificationSchema);