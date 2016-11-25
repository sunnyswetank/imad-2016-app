function loadLoginForm () {
    var loginHtml = `
        <div class="logindiv">
        <input type="text" id="username" placeholder="username" />
        <input type="password" id="password" placeholder="password" />
        <br/><br/>
          <input type="submit" class="w3-btn w3-small w3-round-xlarge w3-teal" id="register_btn" value="Register" />
          <input type="submit" class="w3-btn w3-small w3-round-xlarge w3-teal" id="login_btn" value="Login" />
        </div>
        `;
    document.getElementById('login_area').innerHTML = loginHtml;
    
    // Submit username/password to login
    var submit = document.getElementById('login_btn');
    submit.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  submit.value = 'Sucess!';
              } else if (request.status === 403) {
                  submit.value = 'Invalid credentials. Try again?';
              } else if (request.status === 500) {
                  alert('Something went wrong on the server');
                  submit.value = 'Login';
              } else {
                  alert('Something went wrong on the server');
                  submit.value = 'Login';
              }
              loadLogin();
          }  
          // Not done yet
        };
        
        // Make the request
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        console.log(username);
        console.log(password);
        request.open('POST', '/login', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
        submit.value = 'Logging in...';
        
    };
    
    var register = document.getElementById('register_btn');
    register.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  alert('User created successfully! Now click on Log In!');
                  register.value = 'Registered!';
              } else {
                  alert('Sorry, could not register the user! Make sure you have not entered blanks');
                  register.value = 'Register';
              }
          }
        };
        
        // Make the request
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        console.log(username);
        console.log(password);
        request.open('POST', '/create-user', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
        register.value = 'Registering...';
    
    };
}

function loadLoggedInUser (username) {
    var loginArea = document.getElementById('login_area');
    loginArea.innerHTML = `
        <p class="secheader"> Hello <i>${username}</i>! Why don't you drop a comment below!!</p>
        
    `;
}


function loadCommentForm () {
    var commentFormHtml = `
        <textarea id="comment_text" rows="5" cols="100" placeholder="Enter your comment here..."></textarea>
        <br/>
        <input type="submit" class="w3-btn w3-small w3-round-xlarge w3-teal" id="submit_comment" value="Submit" />
        <button id="logout_btn" class="w3-btn w3-small w3-round-xlarge w3-teal"><a href="/logout" style="text-decoration:none;">Logout</a></button>
        <br/>
        `;
    document.getElementById('comment_form').innerHTML = commentFormHtml;
    
    // Submit username/password to login
    var submit_comment = document.getElementById('submit_comment');
    submit_comment.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
                // Take some action
                if (request.status === 200) {
                    // clear the form & reload all the comments
                    document.getElementById('comment_text').value = '';
                    loadComments();    
                } else {
                    alert('Error! Could not submit comment');
                }
                submit_comment.value = 'Submit';
          }
        };
        
        // Make the request
        var comment = document.getElementById('comment_text').value;
        request.open('POST', '/submit-comment/', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({comment: comment}));  
        submit_comment.value = 'Submitting...';
        
    };
}

function loadLogin () {
    // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                loadLoggedInUser(this.responseText);
                loadCommentForm(this.responseText);
            } else {
                loadLoginForm();
            }
        }
    };
    
    request.open('GET', '/check-login', true);
    request.send(null);
}
function escapeHTML (text)
{
    var $text = document.createTextNode(text);
    var $div = document.createElement('div');
    $div.appendChild($text);
    return $div.innerHTML;
}

function loadComments () {
        // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var comments = document.getElementById('comments');
            if (request.status === 200) {
                var content = '';
                var commentsData = JSON.parse(this.responseText);
                for (var i=0; i< commentsData.length; i++) {
                     var time = new Date(commentsData[i].timestamp);
                    content += `<hr>
                    <div class="comment">
                        <div class="commenter">
                            ${commentsData[i].username} - ${time.toLocaleTimeString()} on ${time.toLocaleDateString()}<br>
                            <button id="like_btn" class="w3-btn w3-small w3-round-xlarge w3-light-grey">Like()</button>
	                     <button id="dislike_btn" class="w3-btn w3-small w3-round-xlarge w3-light-grey">Dislike()</button>
                        </div>
                        <p>${escapeHTML(commentsData[i].comment)}</p>
                        </div>`;
                }
                comments.innerHTML = content;
            } else {
                comments.innerHTML('Oops! Could not load comments!');
            }
        }
    };
    
    request.open('GET', '/get-comments', true);
    request.send(null);
}



function loadOldest () {
        // Check if the user is already logged in
    var submit = document.getElementById('oldest');
    submit.onclick = function () {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var comments = document.getElementById('comments');
            if (request.status === 200) {
                var content = '';
                var commentsData = JSON.parse(this.responseText);
                for (var i=0; i< commentsData.length; i++) {
                    var time = new Date(commentsData[i].timestamp);
                    content += `<hr>
                    <div class="comment">
                        <div class="commenter">
                            ${commentsData[i].username} - ${time.toLocaleTimeString()} on ${time.toLocaleDateString()} <br>
                            <button id="like_btn" class="w3-btn w3-small w3-round-xlarge w3-light-grey">Like()</button>
	                     <button id="dislike_btn" class="w3-btn w3-small w3-round-xlarge w3-light-grey">Dislike()</button>
                        </div>
                        <p>${escapeHTML(commentsData[i].comment)}</p>
                    </div>`;
                }
                comments.innerHTML = content;
            } else {
                comments.innerHTML('Oops! Could not load comments!');
            }
        }
    };
    request.open('GET', '/get-oldest', true);
    request.send(null);
    };
}

function loadLatest () {
        // Check if the user is already logged in
    var submit = document.getElementById('latest');
    submit.onclick = function () {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var comments = document.getElementById('comments');
            if (request.status === 200) {
                var content = '';
                var commentsData = JSON.parse(this.responseText);
                for (var i=0; i< commentsData.length; i++) {
                    var time = new Date(commentsData[i].timestamp);
                    content += `<hr>
                    <div class="comment">
                        <div class="commenter">
                            ${commentsData[i].username} - ${time.toLocaleTimeString()} on ${time.toLocaleDateString()} <br>
                            <button id="like_btn" class="w3-btn w3-small w3-round-xlarge w3-light-grey">Like()</button>
	                     <button id="dislike_btn" class="w3-btn w3-small w3-round-xlarge w3-light-grey">Dislike()</button>
                        </div>
                        <p>${escapeHTML(commentsData[i].comment)}</p>
                    </div>`;
                }
                comments.innerHTML = content;
            } else {
                comments.innerHTML('Oops! Could not load comments!');
            }
        }
    };
    request.open('GET', '/get-latest', true);
    request.send(null);
    };
}

function loadLongest () {
        // Check if the user is already logged in
    var submit = document.getElementById('longest');
    submit.onclick = function () {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var comments = document.getElementById('comments');
            if (request.status === 200) {
                var content = '';
                var commentsData = JSON.parse(this.responseText);
                for (var i=0; i< commentsData.length; i++) {
                    var time = new Date(commentsData[i].timestamp);
                    content += `<hr>
                    <div class="comment">
                        <div class="commenter">
                            ${commentsData[i].username} - ${time.toLocaleTimeString()} on ${time.toLocaleDateString()} <br>
                            <button id="like_btn" class="w3-btn w3-small w3-round-xlarge w3-light-grey">Like()</button>
	                     <button id="dislike_btn" class="w3-btn w3-small w3-round-xlarge w3-light-grey">Dislike()</button>
                        </div>
                        <p>${escapeHTML(commentsData[i].comment)}</p>
                    </div>`;
                }
                comments.innerHTML = content;
            } else {
                comments.innerHTML('Oops! Could not load comments!');
            }
        }
    };
    request.open('GET', '/get-longest', true);
    request.send(null);
    };
}


// The first thing to do is to check if the user is logged in!
loadLogin();
loadComments();
loadOldest();
loadLatest();
loadLongest();

    
