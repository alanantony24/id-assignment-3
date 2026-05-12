$(document).ready(function(){
    $('input#create-user-button').on('click',function(e){
        e.preventDefault();
        var username = $('input#newUsername').val().trim();
        var email = $('input#newEmail').val().trim().toLowerCase();
        var password = $('input#newPassword').val();
        userSignUp(username, email, password);
    });

    $('input#login-button').on("click",function(e){
        e.preventDefault();
        var usernameOrEmail = $('input#username').val().trim();
        var password = $('input#password').val();
        userLogin(usernameOrEmail, password);
    });
});

function getLocalUsers(){
    try { return JSON.parse(localStorage.getItem('ORDINO_USERS') || '[]'); }
    catch(e){ return []; }
}

function saveLocalUsers(users){
    localStorage.setItem('ORDINO_USERS', JSON.stringify(users));
}

function showAuthMessage(message, type){
    var css = type === 'error' ? 'alert-danger' : 'alert-success';
    var msg = `<div class="alert ${css} mt-3" role="alert">${message}</div>`;
    $('.login-register-wrapper .alert').remove();
    $('.login-register-wrapper').prepend(msg);
}

function userSignUp(username,email,password){
    if(!username || !email || !password){
        showAuthMessage('Please fill in username, email, and password.', 'error');
        return;
    }
    var users = getLocalUsers();
    var duplicate = users.find(u => u.username.toLowerCase()===username.toLowerCase() || u.email===email);
    if(duplicate){
        showAuthMessage('Username or email already exists in this browser.', 'error');
        return;
    }
    users.push({ username, email, password, createdAt: new Date().toISOString() });
    saveLocalUsers(users);
    showAuthMessage('Sign up successful. You can now log in.', 'success');
    $('form.sign-up-form')[0].reset();
}

function userLogin(usernameOrEmail,password){
    var users = getLocalUsers();
    var match = users.find(u => (u.username===usernameOrEmail || u.email===usernameOrEmail.toLowerCase()) && u.password===password);
    if(!match){
        showAuthMessage('Invalid username/email or password.', 'error');
        return;
    }
    localStorage.setItem('User', match.username);
    localStorage.setItem('ORDINO_CURRENT_USER', JSON.stringify({ username: match.username, email: match.email }));
    window.location.replace('main.html');
}
