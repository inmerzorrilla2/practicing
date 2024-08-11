const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const getAll = catchError(async (req, res) => {
    const result = await User.findAll()
    console.log(result)
    return res.json(result);
});

const Create = catchError(async(req, res)=>{
    const {password} = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await User.create({...req.body, password: hashedPassword})
    return res.status(201).json(result)
})

const getOne = catchError(async(req, res)=>{
    const {id} = req.params
    const result = await User.findByPk(id)
    if(!result) return res.sendStatus(404)
        return res.json(result)
})

const remove = catchError(async(req, res) =>{
    const {id} = req.params
    const result = await User.destroy({where: {id}})
    if(!result) return res.sendStatus(404)
        return res.json(result)
})

const Update = catchError(async(req, res)=>{
    const {id} = req.params

    delete req.body.email
    delete req.body.password

    const result = await User.update(req.body, {where: {id}, returning: true})
    if (result[0] === 0) return res.sendStatus(404)
        return res.json(result[1][0])
})

const login = catchError(async(req, res) =>{
    const {email, password} = req.body
    const user = await User.findOne({where: {email}})
    console.log(user)
    if(!user) return res.status(401).json({"message": "Invalid credentials"})

    const isValid = await bcrypt.compare(password, user.password)
    if(!isValid) return res.status(401).json({"message": "Invaild credentials"})
    
    const token = jwt.sign(
        {user},
        process.env.SECRET_TOKEN,
        {expiresIn: '1d'}
    )
    return res.status(201).json({user, token})
})
 const logged = catchError((req, res) =>{
    console.log(req.user)
    return res.json(req.user)
 })


module.exports = {
    getAll,
    Create,
    getOne,
    remove,
    Update, 
    login,
    logged

};