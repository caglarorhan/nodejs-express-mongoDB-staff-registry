const helmet = require('helmet'); //Help secure Express apps with various HTTP headers
const morgan = require('morgan'); //production da kullanma, develop ozelligi - her requesti loglar (istersen kaydet)
const Joi = require('joi');
const config = require('config'); // NODE_ENV degiskenindeki isme gore config/ icindeki ayni isimli dosya icerigini (json) obje olarak dondurur
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(helmet());

// configuration
console.log('Application Name:'+config.get('name'))
console.log('Mail server:'+config.get('mail.host'))
console.log('Mail server:'+config.get('mail.password')) // production ortaminda elle cli uzerinden girilmeli set app_password=56789


console.log(`Node Env: ${process.env.NODE_ENV}`); // defult is undefined
console.log(`app : ${app.get('env')}`) // default is development

if(app.get('env')==='development'){
    app.use(morgan('tiny'));//farkli formatlardan birisi secilebilir
    console.log('Morgan enabled');
}



const courses = [
    {id:1, name:'Course 1'},
    {id:2, name:'Course 2'},
    {id:3, name:'Course 3'},
]

app.get('/', (req, res)=> {
    res.send('Hello world!!!');
});

app.get('/api/courses', (req, res)=> {
    res.send(courses);
});

// /api/course/
app.get('/api/courses/:id', (req,res)=> {
    const foundCourse = courses.find(course=> course.id === parseInt(req.params.id));
      if(!foundCourse){
          res.status(404).send('Given id not found!')
      }else{
          res.send(foundCourse);
      }

})

//raw parameters
// /api/posts/:year/:month
// app.get('/api/posts/:year/:month', (req,res)=> {
//     res.send(req.params);
// })


// //Query parameters
// // /api/posts/:year/:month?sortBy=name
// app.get('/api/posts/:year/:month', (req,res)=> {
//     //res.send(req.params);
//     res.send(req.query);
// })





app.post('/api/courses', (req,res)=>{

    const {error} = validateCourse(req.body);
    if(error){
        res.status(404).send(error.details[0].message);
        return;
    }

    const course = {
        id: courses.length+1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
})





app.put('/api/courses/:id', (req,res)=>{
    //look up the course
    //if course not existing return 404
    const foundCourse = courses.find(course=> course.id === parseInt(req.params.id));
    if(!foundCourse){
        res.status(404).send('Given id not found!')
    }else{
        //validate
        // if not valid, return 400 -Bad request
        const {error} = validateCourse(req.body);
        if(error){
            res.status(404).send(error.details[0].message);
            return;
        }else{
            //Update course
            foundCourse.name = req.body.name;
            //return the update course
            res.send(foundCourse)
        }
    }
})


app.delete('/api/courses/:id', (req, res)=>{
    //look up the course
    //if course not existing return 404
    const foundCourse = courses.find(course=> course.id === parseInt(req.params.id));
    if(!foundCourse){
        res.status(404).send('Given id not found!')
    }else{
        const index = courses.indexOf(req.params.id);
        const targetCourse = courses[index];
        res.send(foundCourse);
    }
})





function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(course, schema)
}







// PORT
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening port ${port}`));
