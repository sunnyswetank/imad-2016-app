var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config={
    user:'sunnyswetank',
    databse:'sunnyswetank',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:process.env.DB_PASSWORD
};
var app = express();
app.use(morgan('combined'));

function createTemplate(data){
//    for(i=0;i<data.length;i=i+1){
//        if(i===0){
    var commentbody=data[1].commentbody;
//        }else{
//        commentbody+=data[i+1].commentbody;
//            }
    
    var htmlTemplate = `
    <html>
        <head>
        </head>
        <body>
            <div>
                <p>${commentbody}</p>
            </div>
        </body>
    </html>
    ` ;
    return htmlTemplate;
}
//}


var pool = new Pool(config);
app.get('/nav6',function(req,res){
    
    pool.query('select commentbody from comments',function(err,result){
    if(err){
     res.status(500).send(err.toString());   
    } else{
     if(result.rows.length===0){
         res.status(404).send("No comments yet");
     } else{
     var articleData=result.rows;         
     res.send(createTemplate(articleData));
    //res.send(JSON.stringify(result.rows));
     }  
    }   
    });
});



app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
