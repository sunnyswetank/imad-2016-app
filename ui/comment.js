function loadCommentForm () {
    var commentFormHtml = `
        <textarea id="comment_text" class="pvalid" placeholder="Enter your comment here..."></textarea>
        <br/>
        <input type="submit" id="submit" value="Submit" />
        <br/>
        `;
    document.getElementById('comment_form').innerHTML = commentFormHtml;
    

}


function loadLogin () {
    // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                loadCommentForm(this.responseText);
                
            }
        }
    };
    
    request.open('GET', '/check-login', true);
    request.send(null);
}



loadLogin();

