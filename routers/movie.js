const mongoose = require("mongoose");

const Actor = require("../models/actor");
const Movie = require("../models/movie");

module.exports = {
    getAll: function (req, res) {
        const { year1, year2 } = req.query; //Task 6
        var query = {};
        if (year1 && year2) {
            query = {
                year: {
                    $gte: parseInt(year2),
                    $lte: parseInt(year1),
                },
            };
        }

        Movie.find(query)
            .populate("actors") // Task 8
            .exec(function (err, movies) {
                if (err) return res.status(400).json(err);
                res.json(movies);
            });
    },

    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();

        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);
            res.json(movie);
        });
    },

    getOne: function (req, res) {
        Movie.findOne({
            _id: req.params.id,
        })
            .populate("actors")
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
            });
    },

    updateOne: function (req, res) {
        Movie.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();

                res.json(movie);
            }
        );
    },

    deleteOne: function (req, res) {
        Movie.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        }); //Delete a movie 
    },
 
    removeActor: function (req, res) {//find the moive id in movie, then
        const { actorId, movieId } = req.params;
        Movie.updateOne(
            { _id: movieId },
            {
                $pullAll: {
                    actors: [actorId], //remove all elements in actor id array
                },
            },
            function (err, movie) {
                if (err) return res.status(400).json(err);

                res.json();
            }
        );
    },

    
    addActor: function (req, res) {
        Movie.findOne({ _id: req.params.id }, function (err, movie) {//find the movie
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();

            Actor.findOne({ _id: req.body.id }, function (err, actor) {//find the actor
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();

                movie.actors.push(actor._id);//push actor id

                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                });
            });
        });
    },


    deleteMovies: function (req, res) {
        const { year1, year2 } = req.body;
        Movie.deleteMany(
            {
                year: {
                    $gte: year1,
                    $lte: year2,
                },
            },
            function (err, movies) {
                if (err) return res.status(400).json(err);
                res.json();
            }
        );
    },
};
