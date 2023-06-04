import Mongoose from 'mongoose';

const { Schema } = Mongoose;

const notificationSchema = new Schema({
    type: Number, // определяет тип сущности и триггеры
    id: Number, // ид сущности
    receiverId: Number, // ид получателя
    receiver: String, //фамилия и имя адресата
    email: String, // почта адресата
    name: String, // то, что будет в названии письма
    text: String // текст письма
});

export const Notification = Mongoose.model('notification', notificationSchema);