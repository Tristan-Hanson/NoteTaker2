const express = require('express')
const data = require('./db/db.json')
const uuid = require('./helpers/uuid')
const path = require('path')
const fs = require('fs')

const app=express();
const PORT= process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.json())


// get requests for pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'/public/index.html'))
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

app.get('/api/notes',(req, res) => {
    res.sendFile(path.join(__dirname,'/db/db.json'))
})

//post request for adding new note
app.post('/api/notes', (req, res) => {
    const {text, title} = req.body
    if(text && title){
        const NewNote={
            title,
            text,
            id: uuid()
        }
        data.push(NewNote)
        const stringDB = JSON.stringify(data)

        fs.writeFile('./db/db.json', stringDB, (err) => {
            if(err){
                res.status(400).json({msg:'error'})
            } else{
                res.status(200).json({msg:'success'})
            }
        })
    } else{
        res.status(400).json({msg: 'error'})
    }
})

//delete request
app.delete('/api/notes/:id',(req,res)=>{

    fs.readFile(("./db/db.json"),"utf-8",function(err){
        err? console.log(err) : console.log('success')
        
        const remove=data.filter(remove=>remove.id!==req.params.id)

        fs.writeFile('./db/db.json',JSON.stringify(remove),(err)=>{
            if(err) throw(err)
            res.sendFile(path.join(__dirname,'./db/db.json'))
        })
    });      
})

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'/public/notes.html'))
})

app.listen(PORT,()=>{
    console.log(`Listening at http://localhost:${PORT}`)
})