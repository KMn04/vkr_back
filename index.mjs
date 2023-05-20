import express from 'express';
import cors from 'cors';
import sequelize from './db/postgre_connection.mjs';
import register from "./routes/register.mjs";
import auth from './routes/auth.mjs';
import { checkJWTMiddleware } from './middlewares/checkJWTMiddleware.mjs';
import projects from './routes/projects.mjs';
import tasks from './routes/tasks.mjs';
import users from './routes/users.mjs';
import currencies from "./routes/currencies.mjs";
import projectStatuses from "./routes/projectStatuses.mjs";
import roles from "./routes/roles.mjs";
import taskPriorities from "./routes/taskPriorities.mjs";
import taskStatuses from "./routes/taskStatuses.mjs";
import taskTypes from "./routes/taskTypes.mjs";
import comments from './routes/comments.mjs'
import './db/mongo_connection.mjs'


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
app.use("/project_statuses", projectStatuses);
app.use("/roles", roles);
app.use("/currencies", currencies);
app.use("/tasks", checkJWTMiddleware);
app.use("/tasks", tasks);
app.use("/task_types", taskTypes);
app.use("/task_statuses", taskStatuses);
app.use("/task_priorities", taskPriorities);
app.use("/profile", checkJWTMiddleware);
app.use("/profile", users);
app.use("/comments", comments)


sequelize.sync().then(() => {
  app.listen(port, function(){
    console.log("Сервер ожидает подключения...");
  });
})