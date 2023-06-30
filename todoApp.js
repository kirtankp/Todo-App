const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const fs = require("fs");
const path = require("path");
const port = process.env.PORT || 3000;

function findIndex(arr, id) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) return i;
    }
    return -1;
}

function removeAtIndex(arr, index) {
    let newArray = [];
    for (let i = 0; i < arr.length; i++) {
        if (i !== index) newArray.push(arr[i]);
    }
    return newArray;
}

//endpoint 1
app.get('/todos/', (req, res) => {
    fs.readFile('./todos.json', 'utf-8', (error, data) => {
        if (error) {
            res.status(404).send('file not found');
        } else {
            res.json(JSON.parse(data));
        }
    })
});

//endpoint2
app.get('/todos/:id', (req, res) => {
    fs.readFile("./todos.json", "utf8", (error, data) => {
        if (error) {
            res.status(404).send('file not found');
        } else {
            const todos = JSON.parse(data);
            const todoIndex = findIndex(todos, parseInt(req.params.id));
            if (todoIndex === -1) {
                res.status(404).send('id not found');
            } else {
                res.json(todos[todoIndex]);
            }
        }
    });
});

//endpoint3
app.post('/todos/', (req, res) => {
    const todo = {
        id: Math.floor(Math.random() * 1000000), // unique random id
        title: req.body.title,
        description: req.body.description
    };
    fs.readFile("./todos.json", "utf8", (error, data) => {
        if (error) {
            res.status(404).send('file not found');
        } else {
            const todos = JSON.parse(data);
            todos.push(todo);
            fs.writeFile("./todos.json", JSON.stringify(todos), (error) => {
                if (error) {
                    res.status(404).send('file not found');
                } else {
                    res.status(201).json(todo);
                }
            });
        }
    });
});

//endpoint4
app.put('/todos/:id', (req, res) => {
    fs.readFile("./todos.json", "utf8", (error, data) => {
        if (error) {
            res.status(404).send('file not found');
        } else {
            const todos = JSON.parse(data);
            const todoIndex = findIndex(todos, parseInt(req.params.id));
            if (todoIndex === -1) {
                res.status(404).send('id not found');
            } else {
                const updatedTodo = {
                    id: todos[todoIndex].id,
                    title: req.body.title,
                    description: req.body.description
                };
                todos[todoIndex] = updatedTodo;
                fs.writeFile("./todos.json", JSON.stringify(todos), (error) => {
                    if (error) {
                        res.status(404).send('file not found');
                    } else {
                        res.status(200).json(updatedTodo);
                    }
                });
            }
        }
    });
});

//endpoint5
app.delete('/todos/:id', (req, res) => {
    fs.readFile("./todos.json", "utf8", (error, data) => {
        if (error) {
            throw err;
        } else {
            var todos = JSON.parse(data);
            const todoIndex = findIndex(todos, parseInt(req.params.id));
            if (todoIndex === -1) {
                res.status(404).send('id not found');
            } else {
                todos = removeAtIndex(todos, todoIndex);
                fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
                    if (err) {
                        res.status(404).send('file not found');
                    } else {
                        res.status(200).send('Todo Deleted');
                    }
                });
            }
        }
    });
});

app.use("/", express.static(path.resolve(__dirname, "./frontend")));

app.use((req, res) => {
    res.status(404).send('Route not found');
})

app.listen(port, () => {
    console.log(`App is running on Port ${port}`);
});