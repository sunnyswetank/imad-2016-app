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
var commentbody=('');
function c1(input1){
        for(var i=0;i<input1.length;i=i+1){
        commentbody+='<hr/>'+input1[i].commentbody;
         }
        return commentbody; 
}     


var commentbody2=c1(data);
    var htmlTemplate = `
    <?php
    $action = $_GET["action"];
    $myText = $_POST["mytext"];
    ?>
    
    <html>
        <head>

        </head>
        <body>
         
        
        <form action="?action=save" name="myform" method="post">
            <input type=text name="mytext">
            <input type="submit" value="save">
        </form>
            <div>
                <p>${commentbody2}</p>
                <p>${mytext}</p>
            </div>
        </body>
    </html>
    ` ;
    return htmlTemplate;
}



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
