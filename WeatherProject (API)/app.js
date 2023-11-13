
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');



const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){

    res.sendFile(__dirname + '/index.html');
});


app.post("/",function(req, res){

    const query =req.body.cityName;
    const apiKey = "6b9407cc1dad236d6405cfe267f41b79";
    const unit = "imperial";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&units="+unit+"&appid="+apiKey;

    https.get(url,function(response){
    console.log(response.statusCode);


    response.on("data",function(data){
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp
        const weatherDescription = weatherData.weather[0].description
        const icon = weatherData.weather[0].icon
        const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        res.write("<h1> The Tempereture in " + query + " is "+ temp +" degree</h1>");
        res.write(" the weather is currently "+weatherDescription+" .</p>");
        res.write("<img src=" + imageURL +">");
        res.send();
    })
})
});





app.listen(3000,function(){
    console.log('good work');
})
