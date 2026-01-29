const express = require('express')
const morgan = require('morgan')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const Food = require('./models/food.js')
require('dotenv').config()


const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
    console.log(`connected to MongoDB ${mongoose.connection.name}`)
})

app.get('/', async (req, res) => {
    res.render('index.ejs')
})

app.get('/foods', async (req, res) => {
    const allFoods = await Food.find()
    res.render('foods/index.ejs', { foods: allFoods })
})

app.get('/foods/new', (req, res) => {
    res.render('foods/new.ejs')
})

app.get('/foods/:foodId', async (req, res) => {
    const foundFood = await Food.findById(req.params.foodId)
    res.render('foods/show.ejs', { food: foundFood })
})

app.delete('/foods/:foodId', async (req, res) => {
    await Food.findByIdAndDelete(req.params.foodId)
    res.redirect('/foods')
})

app.put('/foods/:foodId', async (req, res) => {
    req.body.isReadyToEat = req.body.isReadyToEat === 'on'
    await Food.findByIdAndUpdate(req.params.foodId, req.body)
    res.redirect(`/foods/${req.params.foodId}`)
})

app.post('/foods', async (req, res) => {
    req.body.isReadyToEat = req.body.isReadyToEat === 'on'
    await Food.create(req.body)
    res.redirect('/foods')
})

app.get('/foods/:foodId/edit', async (req, res) => {
    const foundFood = await Food.findById(req.params.foodId)
    res.render('foods/edit.ejs', { food: foundFood })
})

app.listen(3000, () => {
    console.log('listening on port 3000')
})
