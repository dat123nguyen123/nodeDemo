var express = require('express')
var app = express();
var fs = require('fs');

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

const engines = require('consolidate');
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');

//database
//var MongoClient = require("mongodb").MongoClient;
//var url = "mongodb+srv://datnq:dat123nguyen123@cluster0.meqej.mongodb.net/test";
app.post('/doInsert',async (req,res)=>{
    let inputName = req.body.txtName;
    let inputPrice = req.body.txtPrice;
    let inputDes = req.body.txtDes
    let newProduct = {name : inputName, price:inputPrice, des :inputDes};
    let client= await MongoClient.connect(url);
    let dbo = client.db("ProductDB");
    await dbo.collection("Product").insertOne(newProduct);
    if(inputName.length < 2){
        let errorModel = {nameError: "Name can be less than 2!"
            ,quantityError:"Invalid input"};
        res.render('insert',{model:errorModel})
    }else{
        let data = inputName + ';' +inputPrice + ';' + inputDes + '\n';
        fs.appendFile(fileName,data,function(err){
            res.redirect('/');
        })
    }
})

//localhost:5000
app.get('/',function(req,res){
    let currentDate = new Date();
    res.render('index',{model:currentDate});
})
app.get('/register',function(req,res){
    res.render('register');
})

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var fileName = 'users.txt';
app.post('/doRegister',function(req,res){
    let inputName = req.body.txtName;
    let inputEmail = req.body.txtEmail;
    //check data before writing to file
    if(inputName.length <4){
        let errorModel = {nameError: "Ten phai lon hon 3 ky tu!"
            ,emailError:"email k hop le"};
        res.render('register',{model:errorModel})
    }else{
        let data = inputName + ';' +inputEmail + '\n';
            fs.appendFile(fileName,data,function(err){
            res.redirect('/');
        })
    }
})
app.get('/allUsers',function(req,res){
    let result = [];
    fs.readFile(fileName,'utf8',function(error,data){
        let allUsers = data.split("\n");
        for(i=0;i<allUsers.length;i++){
            if(allUsers[i].trim().length !=0){
                let nameX = allUsers[i].split(';')[0];
                let emailX = allUsers[i].split(';')[1]; 
                result.push({name:nameX,email:emailX})
            }
        }
        res.render('allUser',{model:result});
    })
})
app.listen(5000);