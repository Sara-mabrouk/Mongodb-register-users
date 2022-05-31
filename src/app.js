const express=require('express')
require('dotenv').config()
const app=express()
const port=process.env.PORT 

require('./db/mongoose')

app.use(express.json())

const reporterRouter = require('./routers/reporter')
const  newRouter=require('./routers/new')
app.use(reporterRouter)
app.use(newRouter)

app.listen(port,()=>{console.log('Server is running ' + port)})
