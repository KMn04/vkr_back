import express from 'express';
import cors from 'cors';
import sequelize from './db/postgre_connection.mjs';
import { checkJWTMiddleware } from './middlewares/checkJWTMiddleware.mjs';
import register from './routes/register.mjs';
import auth from './routes/auth.mjs';
import projects from './routes/projects.mjs';
import tasks from './routes/tasks.mjs';
import users from './routes/users.mjs';

export const app = express();
const port = 3000

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Скоро тут будет главная страница с заманухой')
})

app.use("/register", register);
app.use("/login", auth);
app.use("/projects", checkJWTMiddleware);
app.use("/projects", projects);
app.use("/tasks", checkJWTMiddleware);
app.use("/tasks", tasks);
app.use("/profile", checkJWTMiddleware);
app.use("/profile", users);

sequelize.sync().then(() => {
  app.listen(port, function(){
    console.log("Сервер ожидает подключения...");
  });
})