const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const newsSchema =  mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true 
    },
    news:{
        type:String,
        required:true
    },
    discribtion:{
        type:String,
        required:true
    },
    tokens:[
        {
            type:String,
            required:true
        }
    ],
    avatar:{
        type:Buffer
    }
})
const News = mongoose.model('News',newsSchema )
module.exports = News
