var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config={
    user:'sunnyswetank',
    databse:'sunnyswetank',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));

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
         <html>
         <head>
         </head>
         <body>
           <div id="comments">
                 <center>People have been talking</center>
               </div>
         <div>
                 <p>${commentbody2}</p>
             </div>
              <script type="text/javascript" src="/ui/comment.js"></script>
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

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/comment.js', function (req, res) {
   res.sendFile(path.join(__dirname, 'ui', 'comment.js'));
});

function hash (input, salt) {
    // How do we create a hash?
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}


app.get('/hash/:input', function(req, res) {
   var hashedString = hash(req.params.input, 'this-is-some-random-string');
   res.send(hashedString);
});

app.post('/create-user', function (req, res) {
   // username, password
   // {"username": "tanmai", "password": "password"}
   // JSON
   var username = req.body.username;
   var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password, salt);
   var username_length=username.length;
   var password_length=password.length;
   if(username_length>0 && password_length>0){
   pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send('User successfully created: ' + username);
      }
   });
   } else {
      
   }
   
   
});

app.post('/login', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   
   pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(403).send('username/password is invalid');
          } else {
              // Match the password
              var dbString = result.rows[0].password;
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(password, salt); // Creating a hash based on the password submitted and the original salt
              if (hashedPassword === dbString) {
                
                // Set the session
                req.session.auth = {userId: result.rows[0].id};
                // set cookie with a session id
                // internally, on the server side, it maps the session id to an object
                // { auth: {userId }}
                
                res.send('credentials correct!');
                
              } else {
                res.status(403).send('username/password is invalid');
              }
          }
      }
   });
});

app.get('/check-login', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].username);    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});

app.get('/logout', function (req, res) {
   delete req.session.auth;
   res.send('<html><body>Logged out!<br/><br/><a href="/">Back to home</a></body></html>');
});

var pool = new Pool(config);

app.get('/get-comments', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT comment.*,"user".username from comment,"user" where comment.user_id="user".id and comment.comment_length>0 order by comment.timestamp DESC', function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.get('/get-oldest', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT comment.*,"user".username from comment,"user" where comment.user_id="user".id and comment.comment_length>0 order by comment.timestamp', function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.get('/get-latest', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT comment.*,"user".username from comment,"user" where comment.user_id="user".id and comment.comment_length>0 order by comment.timestamp desc', function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.get('/get-longest', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT comment.*,"user".username from comment,"user" where comment.user_id="user".id and comment.comment_length>0 order by comment.comment_length desc', function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.post('/submit-comment', function (req, res) {
   // Check if the user is logged in
    if (req.session && req.session.auth && req.session.auth.userId) {
                    // Now insert the right comment for this article
                    pool.query(
                        "INSERT INTO comment (comment,  user_id, comment_length) VALUES ($1, $2, $3)",
                        [req.body.comment, req.session.auth.userId,req.body.comment.length],
                        function (err, result) {
                            if (err) {
                                res.status(500).send(err.toString());
                            } else {
                                res.status(200).send('Comment inserted!');
                            }
                            
                        });
    } else {
        res.status(403).send('Only logged in users can comment');
    }
});

app.post('/submit-like', function (req, res) {
   // Check if the user is logged in
    if (req.session && req.session.auth && req.session.auth.userId) {
                    // Now insert the right comment for this article
                    pool.query(
                        "INSERT INTO likes (user_id,likes) VALUES ($1, $2)",
                        [req.session.auth.userId,1],
                        function (err, result) {
                            if (err) {
                                res.status(500).send(err.toString());
                            } else {
                                res.status(200).send('Comment liked!');
                            }
                            
                        });
    } else {
        res.status(403).send('Only logged in users can like');
    }
});
	

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});