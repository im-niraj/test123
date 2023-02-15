import { config } from 'dotenv'
import express from 'express'
import { connect as mongoConnect } from 'mongoose'
import home from './routes/DigitalRoute';
import cors from 'cors'

import Todo from 'models/Todo'

config()

mongoConnect(process.env.MONGO_URI)
	.then(() => console.log('db connected'))
	.catch(err => console.log(err))

const app = express()

// To parse request body
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// To handle cors error
app.use(cors())

app.get('/hello', (_, res) => res.send('Hello from Cules Coding'))

mongoose.connect(process.env.MONGODB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(res => {
    console.log("DB Connected");
}).catch(err => {
    console.log("Unable to connect with DB");
});

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/home", home);

// app.post('/addTodo', async (req, res) => {
// 	const { body } = req

// 	const newTodo = new Todo(body)
// 	const savedtodo = await newTodo.save()

// 	return res.send(savedtodo)
// })

// app.delete('/deleteTodo', async (req, res) => {
// 	const {
// 		body: { todoId },
// 	} = req

// 	const response = await Todo.findByIdAndDelete(todoId)
// 	return res.send(response)
// })

// app.get('/getAllTodos', async (_, res) => {
// 	const response = await Todo.find({})
// 	return res.send(response)
// })

const port = process.env.PORT || 8000

app.listen(port, () => console.log(`Server is running on ${port}`))
