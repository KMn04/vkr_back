import express from 'express';
import cors from 'cors';
import comments from './routes/comments.mjs';
import users from './routes/users.mjs';
import sequelize from './db/postgre_connection.mjs';

const app = express();
const port = 3000

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/comments", comments);
app.use("/users", users)

await sequelize.sync()

app.listen(port, function(){
  console.log("Сервер ожидает подключения...");
});