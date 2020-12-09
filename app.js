const express = require('express');
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
require("dotenv").config();

//connect to mongoDB
const username = process.env.DB_USER;
const password = process.env.DB_PASS;
mongoose.connect(`mongodb+srv://${username}:${password}@my-todo.yeqry.mongodb.net/todos?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

//define schema and create model
const todoSchema = new mongoose.Schema({
    content: String
});
const Todo = mongoose.model("Todo", todoSchema);
const initialtodo = [
    { content: "Clean the room" },
    { content: "Find my cat" },
    { content: "Go see the doctor" }
]

const app = express();

app.use(express.static("./public"));
app.use(bodyparser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');


app.get("/", (req, res) => {
    Todo.find({}, (err, results) => {
        if (!err) {
            if (results.length === 0) {
                Todo.insertMany(initialtodo, (err, result) => {
                    if (!err) {
                        console.log("initialize to do list");
                        res.redirect("/");
                    };
                })
            }
            else {
                res.render("index.ejs", { toDoList: results });
            }
        };
    });
})


app.post("/", (req, res) => {
    const todo = new Todo({ content: req.body.nextevent });
    todo.save();
    res.redirect("/");
})

app.post("/delete", (req, res) => {

    Todo.findOneAndDelete({ _id: req.body.todo }, (err, result) => {
        if (!err) {
            res.redirect("/");
        }
    });
})


let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, () => {
    console.log("server's on port " + port);
});