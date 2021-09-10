const mongoose = require("mongoose");

const Actor = require("../models/actor");
const Movie = require("../models/movie");

module.exports = {
    getAll: function (req, res) { //Task 7
        Actor.find()
            .populate("movies")
            .exec(function (err, actors) {
                if (err) {
                    return res.json(err);
                } else {
                    res.json(actors);
                }
            });
    },

    createOne: function (req, res) {
        let newActorDetails = req.body;
        newActorDetails._id = new mongoose.Types.ObjectId();

        let actor = new Actor(newActorDetails);
        actor.save(function (err) {
            console.log("Done");
            res.json(actor);
        });
    },

    getOne: function (req, res) {
        Actor.findOne({ _id: req.params.id })
            .populate("movies")
            .exec(function (err, actor) {
                if (err) return res.json(err);
                if (!actor) return res.json();
                res.json(actor);
            });
    },

    updateOne: function (req, res) {
        Actor.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                res.json(actor);
            }
        );
    },

    deleteOneAndMovies: function (req, res) {
        Actor.findOneAndRemove({ _id: req.params.id }, function (err, actor) {
            if (err) return res.status(400).json(err);//Find the actor by its ID

            if (req.body.deleteMovies === true) {
                Movie.deleteMany({ _id: actor.movies }, function (err, movies) {
                    if (err) return res.status(400).json(err);
                    res.json();
                });//Remove all its movies
            } else {
                res.json();
            }
        });
    },

    addMovie: function (req, res) {
        Actor.findOne({ _id: req.params.id }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();

            Movie.findOne({ _id: req.body.id }, function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();

                actor.movies.push(movie._id);
                actor.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(actor);
                });
            });
        });
    },

    //Remove a movie from the list of movies of an actor
    removeMovie: function (req, res) {
        const { actorId, movieId } = req.params;
        Actor.updateOne(
            { _id: actorId },//first is actor ID
            {
                $pullAll: {
                    movies: [movieId],
                },//remove all elements in movie id array
            },
            function (err, actor) {
                if (err) return res.status(400).json(err);
                res.json();
            }
        );
    },

    //
};
