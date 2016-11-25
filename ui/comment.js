function loadLike(){
window.onload= function() {
   
    // Submit username/password to login
    var like_btn = document.getElementById('like_btn');
    like_btn.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
                // Take some action
                if (request.status === 200) {
                    // clear the form & reload all the comments
                     var counter=1;
                } else {
                    alert('Error! Could not like comment');
                }
                like_btn.value = 'Liked';
          }
        };
        
        // Make the request
        var like_btn = document.getElementById('like_btn').value;
        var likes=counter;
        console.log(counter);
        request.open('POST', '/submit-like', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({likes: likes}));  
        like_btn.value = 'Liked';
        
    };
	};
}

loadLike();