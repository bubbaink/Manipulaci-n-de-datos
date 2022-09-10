const db = require('../database/models');
const sequelize = db.sequelize;
const moment = require('moment');

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        db.Genre.findAll()
            .then(genre => {
                return res.render('moviesAdd', {genre})
            })
            .catch(error => console.log(error))
    },
    create: function (req, res) {
        db.Movie.create({
            title : req.body.title,
            rating : req.body.rating,
            awards : req.body.awards,
            release_date : req.body.release_date,
            length : req.body.length,
            genre_id : req.body.genre
        })
            .then(movie => {
                res.redirect('/Movies')
            })
            .catch(error => console.log(error))
    },
    edit: function (req, res) {
        let movie = db.Movie.findByPk(req.params.id)
        let genre = db.Genre.findAll()
        Promise.all([genre, movie])
            .then(([Genres, Movie]) => {
                return res.render('moviesEdit', 
                {
                    Movie,
                    Genres,
                    fecha : moment(Movie.release_date).format('YYYY-MM-DD')
                })
            })
            .catch(error => console.log(error))
    },
    update: function (req,res) {
         db.Movie.update(
            {
            title : req.body.title.trim(),
            rating : req.body.rating,
            awards : req.body.awards,
            release_date : req.body.release_date,
            length : req.body.length
            },
            {
                where : {
                    id : req.params.id
                }
            }   
        )
            .then(movie => {
                return res.redirect('/movies')
            })
            .catch(error => console.log(error)) 
    },
    delete: function (req, res) {
        db.Movie.findByPk(req.params.id)
            .then(Movie => {
                return res.render('moviesDelete', {Movie})
            })
            .catch(error => console.log(error))
    },
    destroy: function (req, res) {
        db.Movie.destroy(
            {
                where: {
                    id : req.params.id
                }
            }
        )
            .then(movie => {
                return res.redirect('/movies')
            })
            .catch(error => console.log(error))
    }
}

module.exports = moviesController;