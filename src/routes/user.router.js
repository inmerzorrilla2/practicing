const { getAll, Create, getOne, remove, Update, login, logged } = require('../controllers/user.controllers');
const express = require('express');
const  {verifyJWT} = require('../utils/verifyJWT');

const routerUser = express.Router();



routerUser.route('/')
    .get(verifyJWT, getAll)
    .post(Create);

routerUser.route('/login')
    .post(login)

routerUser.route('/me')
    .get(verifyJWT, logged)
   

routerUser.route('/:id')
    .get(getOne)
    .delete(remove)
    .put(Update);

module.exports = routerUser;