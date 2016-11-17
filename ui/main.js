var submit =  document.getElementById('submit_btn');
submit.onclick=function(){
	
	//create  a request object 
	var request = new XMLHttpRequest();
	
	//Capture the resposne and store it in a variable 
	request.onreadystatechange = function(){
		if(request.readyState===XMLHttpRequest.DONE){
			//take some action 
			if (request.status===200){
				alert('Logged in successfully')
			} else if(request.status===403){
				alert('Username/Password is incorrect');
			} else if(request.status===500){
				alert('Something went wrong on the server');
			}
		}
		//Not done yet
	};
	//Make the request 
	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	console.log(username);
	console.log(password);
	request.open('POST','http://sunnyswetank.imad.hasura-app.io/login',true);
	request.setRequestHeader('Content-Type','application/json');
	request.send(JSON.stringify({username:username,password:password}));
		
};
