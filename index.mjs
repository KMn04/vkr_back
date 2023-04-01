import express from 'express';
import cors from 'cors';
import comments from './routes/comments.mjs';
const app = express();
const port = 3000

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/comments", comments);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})