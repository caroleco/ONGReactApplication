const express = require('express');
const { celebrate, Segments, Joi} =  require('celebrate');

const routes = express.Router();
const ongController = require('./controllers/OngController');
const incidentsController = require('./controllers/IncidentController');
const profileController = require('./controllers/ProfileController');
const sessionController = require('./controllers/SessionController');

const connection = require('./database/connection');

routes.post('/session', sessionController.create);

routes.get('/ongs', ongController.index);

/*Query Route Body*/
routes.post('/ongs', celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email:Joi.string().required().email(),
        whatsapp: Joi.string().required().min(5),
        city:Joi.string().required(),
        uf:Joi.string().required().length(2),
    })
}), ongController.create);  

//routes.get('/ong-first', ongController.idDefault)

routes.get('/profile', celebrate({
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown(),
}),profileController.index);

routes.post('/incidents', celebrate({
    [Segments.BODY]: Joi.object().keys({
        title: Joi.string().required().max(10),
        description: Joi.string().required().max(200),
        value:Joi.number().required(),
    }),
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown(),
}), incidentsController.create)

routes.get('/incidents', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number(),
    })
}),incidentsController.index)

routes.delete('/incidents/:id', celebrate({
    [Segments.PARAMS]:Joi.object().keys({
        id:Joi.number().required()
    }),
}),incidentsController.delete)
module.exports = routes;