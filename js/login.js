

$(document).ready(function(){
    $('input#create-user-button').on('click',function(e){
        e.preventDefault();
        var $newUsername = $('form.sign-up-form').children().first().children('input#newUsername').val();
        var $newPassword = $('form.sign-up-form').children().eq(1).children('input#newPassword').val();
      
        userSignUp($newUsername,$newPassword);
    });

    $loginBtn = $('form.login-form').children().eq(2).children('input#login-button');
    $loginBtn.on("click",function(e){
        e.preventDefault();
        let $loginUsername = $('form.login-form').children().first().children('input:text#username').val();
        let $loginPassword = $('form.login-form').children().eq(1).children('input:password#password').val();
        userLogin($loginUsername, $loginPassword);
    });
});
function userSignUp(newUsername,newPassword){
    var userdata={
        "username":newUsername,
        "password":newPassword
    }   
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://ordinouserrecords-4526.restdb.io/rest/ordino-user-records",
        "method": "POST",
        "headers": {
          "content-type": "application/json",
          "x-apikey": "YOUR_RESTDB_API_KEY",
          "cache-control": "no-cache"
        },
        "data":JSON.stringify(userdata)
      }
      
      $.ajax(settings).done(function (response) {
              });
}

function userLogin($loginUsername,$loginPassword){
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://ordinouserrecords-4526.restdb.io/rest/ordino-user-records",
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "x-apikey": "YOUR_RESTDB_API_KEY",
          "cache-control": "no-cache"
        }
    }
    let loadContent = `

    <div class ="row justify-content-center align-self-center">
    <div class = "col-xs-10 col-md-4">
        <lottie-player src="https://assets1.lottiefiles.com/datafiles/bEYvzB8QfV3EM9a/data.json"  background="transparent" speed="1"  style="width: 300px; height: 300px;"  loop autoplay></lottie-player>
    </div>
    </div>
    <div class ="row justify-content-center align-self-center">
    <div class = "col-xs-10 col-md-4">
    Please Wait . . .
    </div>
</div>`; //loading animation content
 
    $.ajax(settings).done(function(response){
        let userFound = 0;
        for(var i = 0;i<response.length;i++){
            let user = response[i];
            if(user.username ===$loginUsername  && user.password===$loginPassword){
                
                userFound += 1; //value becomes zero after user is found
                localStorage.setItem("User",user.username);
                // Todoist token is connected later in main app (optional).
                $('section.row').remove()            //clear login page for loading animation,whilst retaining script tags
                $('section').prepend(loadContent);      
                setTimeout(redirectToMain,2500);  //load up main interface
                
                break;              
            }
            else if(userFound !== 1 && i === response.length - 1) {      //to avoid for loop repitition for each un-matching record
                alert("username or password is incorrect!Please check again!");
            }    

        }
    })
};

function redirectToMain(){
    window.location.replace("main.html");
}