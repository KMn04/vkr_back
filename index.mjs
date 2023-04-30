import express from 'express';
import cors from 'cors';
import comments from './routes/comments.mjs';
import users from './routes/users.mjs';
import projects from './routes/projects.mjs';
import register from './routes/register.mjs';
import tasks from './routes/tasks.mjs';
import sequelize from './db/postgre_connection.mjs';
import { checkJWTMiddleware } from './middlewares/checkJWTMiddleware.mjs';

const app = express();
const port = 3000

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/projects", checkJWTMiddleware);
app.use("/projects", projects);
app.use("/tasks", checkJWTMiddleware);
app.use("/tasks", tasks);
app.use("/comments", checkJWTMiddleware);
app.use("/comments", comments);
app.use("/users", checkJWTMiddleware);
app.use("/users", users);
app.use("/register", register);

sequelize.sync().then(() => {
  app.listen(port, function(){
    console.log("Сервер ожидает подключения...");
  });
})