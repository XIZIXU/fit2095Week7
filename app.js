const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");

const actors = require("./routers/actor");
const movies = require("./routers/movie");

const app = express();
app.listen(8080);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect("mongodb://localhost:27017/movies", function (err) {
    if (err) {
        return console.log("Connection error:", err);
    }
    console.log("Connect Successfully");
});

// Configuring Endpoints
// Actor RESTFul endpoionts
app.get("/actors", actors.getAll);
app.post("/actors", actors.createOne);
app.get("/actors/:id", actors.getOne);
app.put("/actors/:id", actors.updateOne);
app.post("/actors/:id/movies", actors.addMovie);
app.delete("/actorsAndMovies/:id", actors.deleteOneAndMovies); //task 2
app.put('/actors/:actorId/:movieId', actors.removeMovie);//task 4

// Movie RESTFul endpoints
app.get("/movies", movies.getAll);
app.post("/movies", movies.createOne);
app.get("/movies/:id", movies.getOne);
app.put("/movies/:id", movies.updateOne);
app.delete("/movies/:id", movies.deleteOne);//task 1
app.put("/movies/:movieId/:actorId", movies.removeActor);//task 3
app.post("/movies/:id/actors", movies.addActor);//task 5
app.delete("/movies", movies.deleteMovies);//task 9
