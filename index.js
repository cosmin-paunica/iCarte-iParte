const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')


app.use(cors())

app.use(express.static(path.join(__dirname, 'client/build')))

app.get('/', (req,res) => {
	res.json({"response":"API HOME RESPONSE"})
})

app.get('/api', (req,res) => {
	res.json({"response":"API CALL RESPONSE"})
})

app.get('*',(req,res)=>{
	res.sendFile(path.join(__dirname+'/client/build/index.html'))
})
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {console.log(`App listening on port ${PORT}`)})