const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema ({
  name: String,
  description: String,
  order: Boolean,  
})

const Food = mongoose.model('Food', foodSchema)

module.exports = Food
