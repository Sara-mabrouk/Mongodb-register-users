const express = require('express')
const router = express.Router()
const auth = require('../middelware/auth')
const multer= require('multer')
const Reporter = require('../modles/reporter')

router.post('/reporter',async(req,res)=>{
    try{
        const reporter = new Reporter(req.body)
        const token = await reporter.generateToken()
        await reporter.save()
        res.status(200).send({reporter,token})
    }
    catch(e){
        res.status(400).send(e.message)
    }
})


// log in
router.post('/login',async(req,res)=>{
    try{
        const reporter = await Reporter.findByCredentials(req.body.email,req.body.password)
        const token  = await reporter.generateToken()
        res.status(200).send({reporter,token})
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

// logout

router.delete('/logout',auth,async(req,res)=>{
    try{
        console.log(req.reporter)
        req.reporter.tokens = req.reporter.tokens.filter((el)=>{
            
            return el !== req.token
        })
        await req.reporter.save()
        res.send()
    }
    catch(e){
        res.status(500).send(e)
    }

})


///////////////////////////////////////////
router.delete('/logoutAll',auth,async(req,res)=>{
    try{
        req.reporter.tokens = []
        await req.reporter.save()
        res.send()
    }
    catch(e){
        res.status(500).send(e)
    }
})
// get all 
router.get('/reporter',auth,(req,res)=>{
    Reporter.find({}).then((reporter)=>{
        res.status(200).send(reporter)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})
// get by id

router.get('/roporter/:id',auth,(req,res)=>{
    // console.log(req.params)
    const _id = req.params.id
    Reporter.findById(_id).then((reporter)=>{
        if(!reporter){
        return res.status(404).send('Unable to find reporter')
        }
        res.status(200).send(reporter)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})


router.patch('/reporter',auth,async(req,res)=>{
    try{
        //array
        const updates = Object.keys(req.body)
        // console.log(updates)
        const _id = req.params.id
        const reporter = await Reporter.findById(_id)
        if(!reporter){
            return res.status(404).send('No reporter is found')
        }
        
        updates.forEach((update)=>(reporter[update]=req.body[update]))
        await reporter.save()

        res.status(200).send(reporter)
    }
    catch(error){
        res.status(400).send(error)
    }
})

router.delete('/reporter/:id',auth,async(req,res)=>{
try{
    const _id = req.params.id
    const reporter = await Reporter.findByIdAndDelete(_id)
    if(!reporter){
    return res.status(404).send('Unable to find reporter')
    }
    reporter}
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
router.post('/profil/avatar',auth,uploads.single('avatar'),async(req,res)=>{
    try{
        req.reporter.avatar=req.file.buffer
        await req.reporter.save()
        res.send()
    }
    catch(e){
        res.send(e.message)
    }
})
module.exports = router
