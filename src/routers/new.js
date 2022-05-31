const express = require('express')
const router = express.Router()
const auth = require('../middelware/auth')
const multer= require('multer')
const News = require('../modles/news')

router.post('/news',async(req,res)=>{
    try{
        const news = new News(req.body)
        const token = await news.generateToken()
        await news.save()
        res.status(200).send({news,token})
    }
    catch(e){
        res.status(400).send(e.message)
    }
})
router.get('/news/:id',auth,(req,res)=>{

    const _id = req.params.id
    News.findById(_id).then((news)=>{
        if(!news){
    return res.status(404).send('Unable to find news')
        }
        res.status(200).send(news)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})


router.delete('/news',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const news = await News.findByIdAndDelete(_id)
        if(!news){
        return res.status(404).send('Unable to find news')
        }
        news}
    catch(e){
        res.status(500).send(e)
    }

    })
    


const uploads=multer({
    limits:{
        fileSize:100000,
    },

        filefilter(req,file,cb){
            if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
                return cb(new error('please upload image'))
            }
            cb(null,false)
        }

    
})

router.post('/news/avatar',auth,uploads.single('avatar'),async(req,res)=>{
    try{
        req.news.avatar=req.file.buffer
        await req.news.save()
        res.send()
    }
    catch(e){
        res.send(e.message)
    }
})

module.exports = router
