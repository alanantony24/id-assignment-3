var TODOIST_API_BASE = "https://api.todoist.com/api/v1";
var API_KEY = localStorage.getItem("API_KEY");//global token from localStorage

function getTodoistToken(){
    return (localStorage.getItem("API_KEY") || "").trim();
}

function normalizeTodoistListResponse(response){
    if(Array.isArray(response)) return response;
    if(response && Array.isArray(response.results)) return response.results;
    return [];
}

function withTodoistAuth(settings){
    var token = getTodoistToken();
    if(!token){
        showTodoistMessage("Connect Todoist to enable task/project sync (optional).");
        return null;
    }
    settings.headers = settings.headers || {};
    settings.headers["Authorization"] = `Bearer ${token}`;
    return settings;
}

function showTodoistMessage(message){
    var msg = `<div class="alert alert-warning mt-2" role="alert">${message}</div>`;
    $("#getallproj").html(msg);
    $("#getalltasks").html(msg);
    setTodoistFeedback(message, "error");
    refreshTodoistConnectionState();
}

function handleTodoistError(xhr){
    if(xhr && (xhr.status === 401 || xhr.status === 403)){
        showTodoistMessage("Invalid Todoist token. Please update it in Connect Todoist.");
        return;
    }
    if(xhr && xhr.status === 404){
        showTodoistMessage("Requested Todoist resource was not found.");
        return;
    }
    showTodoistMessage("Unable to reach Todoist right now. Please try again.");
}

function setTodoistFeedback(message, type){
    var css = type === "error" ? "text-danger" : "text-success";
    $("#todoist-connect-feedback").removeClass("text-danger text-success").addClass(css).text(message);
}

function initTodoistConnectionUI(){
    $("#save-todoist-token").on("click", function(){
        var token = ($("#todoist-token-input").val() || "").trim();
        if(!token){
            setTodoistFeedback("Please paste a Todoist token before saving.", "error");
            return;
        }
        localStorage.setItem("API_KEY", token);
        API_KEY = token;
        setTodoistFeedback("Todoist token saved locally.", "success");
        refreshTodoistConnectionState();
    });
    $("#remove-todoist-token").on("click", function(){
        localStorage.removeItem("API_KEY");
        API_KEY = "";
        $("#todoist-token-input").val("");
        setTodoistFeedback("Todoist token removed.", "success");
        refreshTodoistConnectionState();
        $("#getallproj, #getalltasks").empty();
    });
}

function refreshTodoistConnectionState(){
    if(getTodoistToken()){
        $("#todoist-connect-card").show();
        $("#todoist-connect-feedback").text("Todoist is connected for this browser session.");
        return;
    }
    $("#todoist-connect-card").show();
}

var userPoints = 0;
$(document).ready(function(){
    $('.toast').toast('show');  //initialise bootstrap toast
    getUserPoints();            //initialise user points from local demo storage
    userPoints = localStorage.getItem("APPoints") || 0;
    displayName() //load first when ready
    initTodoistConnectionUI();
    refreshTodoistConnectionState();
        /*===================================SIDE NAVBAR EVENT LISTENERS====================================================*/
    var $inboxTab = $('nav.nav1').children().children().eq(1).children().first();
    var clickCount = 0;  //click variable to make sure content doesn't append
    $inboxTab.on("focus",function(){
        clickCount += 1;
        if(clickCount == 1){
            getAllProjects(colorArray);
            getActiveTasks(API_KEY);//display active tasks in DOM            $('section#inbox h3').show(1000);
            $('section#inbox span a').attr("href","/comment-page");
            $('.dropdown.extra-options').detach().appendTo('.three-dots');
            var accordionLength = document.querySelectorAll('.accordion-item');
        }
    })
    $inboxTab.off("focus",function(){ clickCount = 0; })
    var $leaderBoardTab = $('nav.nav1').children().children().eq(1).children().eq(3);
    $leaderBoardTab.on('click',function(){
        var clickCount = 1;
        if(clickCount == 1){
            getAllGameRecords();
            clickCount += 1;  //--> 2 prevent repeated appending of content
        }
    });
    /*==========================================INBOX TAB EVENT LISTENERS============================================*/
    var $deleteIcons = document.querySelectorAll('div.accordion-body button#delete');
    $deleteIcons.forEach(function(btn){
        btn.addEventListener('focus', function(){
            // placeholder for delete interaction
        }, false);
    });
    var $editIcon = $('div.accordion-body button#update');
    $editIcon.on("click",function(e){
        e.preventDefault();
        alert('sup')
    });
    var $editIcon = $('div.accordion-body button#update');
    $editIcon.on("click",function(e){ e.preventDefault(); });
    $('a:contains("View Comments")').on('click',function(){         //when user clicks on view comments
        var selectedTaskName = $('[aria-expanded=true]').text().trim()
                $('h5.taskNameinModal').text(selectedTaskName);
    
    });
    $('a:contains("Add Comments")').on('click',function(){          //when user clicks on add comments
        var selectedTaskName = $('[aria-expanded=true]').text().trim()
                $('h5#tasknameaddcomments').text(selectedTaskName);
    });//api doesn't work
});
/*===================================SIDE NAVBAR & AJAX FUNCTIONS====================================================*/
var colorArray = 
    {
        30:"#b8256f",
        31:"#db4035",
        32:"#ff9933",
        33:"#fad000",
        34:"#afb83b",           
        35:"#7ecc49",
        36:"#299438",
        37:"#6accbc",
        38:"#158fad",
        39:"#14aaf5",
        40:"#96c3eb",
        41:"#4073ff",
        42:"#884dff",
        43:"#af38eb",
        44:"#eb96eb",
        45:"#e05194",
        46:"#ff8d85",
        47:"#808080",
        48:"#b8b8b8",
        49:"#ccac93"
    }
var pList =[]   //stored from API responses
var taskList = []
//Function for getting the projects
function getAllProjects(colorArray){
    var content = '<div class="accordion accordion-flush" id="accordionFlushExample"></div>';
    var settings = withTodoistAuth({
        "url":`${TODOIST_API_BASE}/projects`,
        "method":"GET",
        "headers":{"Content-Type":"application/json"}
    });
    if(!settings){ return; }
    $.ajax(settings).done(function(response){
        var projects = normalizeTodoistListResponse(response);
        pList = projects;
        for(let i =0;i<projects.length;i++){
            content += `<div class="accordion-item">
              <h2 class="accordion-header" id="flush-heading${i+1}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapses${i+1}" aria-expanded="false" aria-controls="flush-collapse${i+1}">
                ${projects[i].name}
                </button>
              </h2>
              <div id="flush-collapses${i+1}" class="accordion-collapse collapse" aria-labelledby="flush-heading${i+1}" data-bs-parent="#accordionFlushExample">
                <div class="accordion-body">
                <span data-tooltip="Add comment"><button id="comment"><ion-icon name="chatbox-ellipses-outline"></ion-icon></button></span>
                <span data-tooltip="Edit"><button id="update"><ion-icon name="create-outline"></ion-icon></button></span>
                <span data-tooltip="Delete"><button id="delete"><ion-icon name="trash-outline"></ion-icon></button></span>
                </div>
              </div>
            </div>`
        }
        document.getElementById("getallproj").innerHTML = content;
    }).fail(handleTodoistError);
};
//Function for creating a project
$('button#addprojbtn').on("click",function(e){
    e.preventDefault();
    var projectName = $('input#inputProjectName').val();
    createNewProject(projectName, API_KEY);
});
function createNewProject(pName,API_KEY){ //POST method
    var projectInfo = {"name":pName};
    var settings = withTodoistAuth({
        "url":`${TODOIST_API_BASE}/projects`,
        "method":"POST",
        "headers":{"Content-Type":"application/json"},
        "data":JSON.stringify(projectInfo)
    });
    if(!settings){ return; }
    $.ajax(settings).done(function(){
        $("#addProj").modal('toggle');
    }).fail(handleTodoistError)
}
//deleting a project
function deleteProject(deleteId,API_KEY){
    var settings = withTodoistAuth({
        "url":`${TODOIST_API_BASE}/projects/${String(deleteId)}`,
        "method":"DELETE",
        "statusCode":{204:function(){ alert(`Project Id:${deleteId} has been deleted!`);} },
        "headers":{}
    });
    if(!settings){ return; }
    $.ajax(settings).done(function(response){
        if(response  === undefined){
            userDelProjects += 1;
            updatePoints(API_KEY);
        }
    }).fail(handleTodoistError);
}
//creating a task
$('button#addtask').on("click",function(e){
    e.preventDefault();
    var taskName = $('input#inputTaskName').val();
    createNewTask(taskName, API_KEY, dueDate);
});
var dueDate = ''
$('input#task_datetime').on('blur',function(){
    dueDate = $('input#task_datetime').val()
        });
function createNewTask(taskName,API_KEY, dueDate){
    if(dueDate === '' || dueDate === undefined){ alert("Please select a due date"); return; }
    var taskInfo = {"content":taskName,"due_date": dueDate,"due_lang": "en","priority": 4};
    var settings = withTodoistAuth({
        "url":`${TODOIST_API_BASE}/tasks`,"method":"POST",
        "headers":{"Content-Type":"application/json"},"data":JSON.stringify(taskInfo)
    });
    if(!settings){ return; }
    $.ajax(settings).done(function(){ $("#addTask").modal('toggle'); }).fail(handleTodoistError);
}
//get active Task
function getActiveTasks(API_KEY){
    var tasks ='';
    var settings = withTodoistAuth({"url":`${TODOIST_API_BASE}/tasks`,"method":"GET","headers":{}});
    if(!settings){ return; }
    $.ajax(settings).done(function(response){
        var results = normalizeTodoistListResponse(response);
        taskList = results;
        for(let i =0;i<results.length;i++){
            var dueDateText = (results[i].due && results[i].due.date) ? new Date(results[i].due.date).toDateString() : 'No due date';
            tasks+=`<div class="accordion-item"><h2 class="accordion-header" id="flush-heading${i+1}"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${i+1}" aria-expanded="false" aria-controls="flush-collapse${i+1}">${results[i].content}</button></h2><div id="flush-collapse${i+1}" class="accordion-collapse collapse" aria-labelledby="flush-heading${i+1}" data-bs-parent="#accordionFlushExample"><div class="accordion-body"><span style="padding-right: 20px;"><a data-bs-toggle="modal" data-bs-target="#calendarModal"><ion-icon name="calendar-outline"></ion-icon>${dueDateText}</a></span><span style="padding-right: 20px;"><a data-bs-toggle="modal" data-bs-target="#commentmodal"><ion-icon name="chatbox-outline"></ion-icon>Add Comments</a></span></span><span><a data-bs-toggle="modal" data-bs-target="#viewcomments"><ion-icon name="eye-outline"></ion-icon>View Comments</a></span></span><span><div class="form-check"><br><input onclick="displayToast()" class="form-check-input" type="checkbox" value="" id="defaultCheck1"><label class="form-check-label" for="defaultCheck1">Complete Task</label></div></span></div></div></div>`;
            tasks+='<span class = "three-dots"></span></div>';
            document.getElementById("getalltasks").innerHTML = tasks;
        }
    }).fail(handleTodoistError);
    var d = $("[aria-expanded=true]").parent().next().children().children().first().children().text();
    $('.accordion-body').children('span').first().on('focus',function(){});
    $('#calendarModal h6.duedate').text(d);
}
function reopenTask(reOpenId){
    var settings = withTodoistAuth({"url":`${TODOIST_API_BASE}/tasks/${String(reOpenId)}/reopen`,"method":"POST","headers":{}});
    if(!settings){ return; }
    $.ajax(settings).done(function(){}).fail(handleTodoistError);
}
//Side Anvigation and Banner
const showMenu = (toggleId, navbarId, bodyId)=>{
    const toggle = document.getElementById(toggleId),
    navbar = document.getElementById(navbarId),
    bodypadding = document.getElementById(bodyId);
    if(toggle && navbar){
        toggle.addEventListener('click', ()=>{
            navbar.classList.toggle('expander')
            bodypadding.classList.toggle('body-pd')
        })
    }
}
//Giving blue colour to active link
showMenu('nav-toggle', 'navbar', 'body-pd')
const linkcolor = document.querySelectorAll('.nav__link');
function colorLink(){
    linkcolor.forEach(l => l.classList.remove('active'))
    this.classList.add('active')
}
linkcolor.forEach(l => l.addEventListener('click', colorLink))
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
})
//Log OUt
var logOutContent = `<section>
<div class="container">
    <div class="row align-items-center justify-content-center">
        <lottie-player src="https://assets9.lottiefiles.com/packages/lf20_0fwl68.json"  background="transparent"  speed="1"  style="width: 300px; height: 300px;"  loop  autoplay></lottie-player>
        <h6 class="text-center">Logging you out......Adios :)</h6>
    </div>
</div>
</section>`; //loading animation content
function logOutUser(logOutContent){
  let $mainPage =$('body#body-pd').children().first(); 
  $mainPage.remove();
  $('body').prepend(logOutContent);
  setTimeout(redirectToHome,2500);
  localStorage.removeItem("User");
  localStorage.removeItem("ORDINO_CURRENT_USER");
  localStorage.removeItem("APPoints"); // keep Todoist token separate unless user disconnects manually.
}
function redirectToHome(){
    window.location.replace("index.html");
}
function displayName(){
    $('h4.topbannertext').last().text(`Welcome, ${localStorage.getItem('User')}!`);
}
//Reschedule calendar javascript 
$('#picker').daterangepicker({
    //minDate:new Date(initialdueDate),           
    minYear:new Date().getFullYear(),                                                    
    maxYear:(new Date().getFullYear())+1,   
    changeMonth: true,
    ranges: {
        'Today': [moment(), moment()],
        'Next 7 Days': [moment().add(7, 'days'), moment()],
        'Next 30 Days': [moment().add(30, 'days'), moment()],
    },
    singleDatePicker:true,
    showDropdowns:true,
    opens:'left',
    drops:'down'
});                                                
// Calendar for usual Add task features
// $('#task_datetime').daterangepicker({
//     //minDate:new Date(initialdueDate),           
//     minYear:new Date().getFullYear(),                                                    
//     maxYear:(new Date().getFullYear())+1,   
//     changeMonth: true,
//     ranges: {
//         'Today': [moment(), moment()],
//         'Next 7 Days': [moment().add(7, 'days'), moment()],
//         'Next 30 Days': [moment().add(30, 'days'), moment()],
//     },
//     singleDatePicker:true,
//     showDropdowns:true,
//     opens:'left',
//     drops:'down'
// });
var reschedulebutton = document.getElementById("reschedulebtn");
reschedulebutton.addEventListener('click', function(){
    var rescheduleDate  =  $('input#picker').val();
    rescheduleDate = new Date(rescheduleDate).toISOString(); // convert to ISO format
    rescheduleCount += 1;
    updatePoints(API_KEY); //update local points store
})    
$("#picker").hide();
function showCalendar(){
    $("#picker").show(1000);
}
function hideSection(){
    $('#inbox h4').hide();
    $("#getallproj").hide();
    $("#getalltasks").hide();
}
function showSection(){
    var $projectsHeader = $('div#getallproj').prev();
    var $tasksHeader = $('div#getalltasks').prev();
    $tasksHeader.hide().show(1700);
    $projectsHeader.hide().show(1000);
    $("#getallproj").hide().show(1500);
    $("#getalltasks").hide().show(2000);
}
function hideLeaderBoard(){
    $('#leaderboard').hide();
}
var pointsList =[]//declare array to be used for sequential leaderboard display
function showLeaderBoard(){
    sortUserPoints(pointsList);
    $('#leaderboard').show(1000);
}
function hideStore(){
    $('#store').hide(1000);
}
function showStore(){
    $('#store').show(1000);
    $('div.user-points h5').text(`APPoints:${localStorage.getItem("APPoints") || 0}`);
}
function getUserPoints(){
    var currentUser = JSON.parse(localStorage.getItem("ORDINO_CURRENT_USER") || "null");
    if(!currentUser){ return; }
    var pointsByUser = JSON.parse(localStorage.getItem("ORDINO_POINTS") || "{}");
    var points = pointsByUser[currentUser.username] || 0;
    localStorage.setItem("APPoints", points);
}
//code gotten from W3Schools
//Get the button
var mybutton = document.getElementById("topBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function TopFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
/*=====================================JAVASCRIPT FOR THE GAMIFICATION FEATURES======================================================== */
// TIERS points
var tier1 = 10000;
var tier2 = 6000;
var tier3 = 2000;
//Users details initialised -->updated as &when actions occur
var userCreatedProjects = 0;
var userDelProjects = 0;
var rescheduleCount = 0;
var userCreatedTasks = 0;
var userDelTasks = 0;
var userCompTasks = 0;
var userTier = 0;
//APPoints variable stored in local demo storage
// basic points
var createTask = 30;
var deleteTask = -10;
var rescheduleTask = -100;
var completedTask = 80;

var createProject = 400;
var delProject = -200;

var startingDate = new Date('17/02/2021'); //will be done on a certain date to start points system 

var currentDate = new Date() ;

var timeDiff= currentDate.getTime() - startingDate.getTime();

var dayDiff = timeDiff / (1000 * 3600 * 24);

if (dayDiff == 90)
{
	//reset points system
	dayDiff = 0;
	startingDate = new Date();
	//reset all users' APPoints to 0
}
//adding points for creating task
var count = 0;
var addtaskbtn = document.getElementById("addtask");
addtaskbtn.addEventListener('click', function(){
    count = count + 1;
    if(count == 1){
        userCreatedTasks+=1; //update userCreatedTasks
        updatePoints(API_KEY); //update local points store
    }
})
//creating project
var count = 0;
var addprojbtn = document.getElementById("addprojbtn");
addprojbtn.addEventListener('click', function(){
    count = count + 1;
    if(count == 1){
        userCreatedProjects+=1; //updated userCreatedProjects
        updatePoints(API_KEY); //update local points store
    }
})
//we have tested all the vairable but for some reason it does not work. We honestly dont know why.
function deleteProj(pList, API_KEY){
    var pname = $("[class= accordion-button]").text().trim();
        for(var i = 0; i < pList.length; i++){
                        if(pList[i].name  == pname){
            alert("Successfull deletion");
            deleteProject(pList[i].id, API_KEY);
                        break;
        }
    }
}
//main sort function gotten from w3schools
function sortUserPoints(pointsList){
    pointsList.length = 0;
    var pointsByUser = JSON.parse(localStorage.getItem("ORDINO_POINTS") || "{}");
    Object.keys(pointsByUser).forEach(function(username){
        pointsList.push({ username: username, APPoints: pointsByUser[username] });
    });
    pointsList.sort(function(a,b){ return b.APPoints - a.APPoints; });
}
function getAllGameRecords(){
    var tableContent = "";
    for(let i=0;i<pointsList.length;i++){
        let rec = pointsList[i];
        tableContent += `<tr><th scope="row">${i+1}</th><td>${rec.username}</td><td>${rec.APPoints}</td><td>Local Demo</td></tr>`;
    }
    if(!tableContent){
        tableContent = '<tr><td colspan="4">No local leaderboard data yet.</td></tr>';
    }
    $('#leaderboard table').children('tbody').html(tableContent);
}
function updatePoints(API_KEY){
    userPoints = (userCompTasks * completedTask) + (userCreatedTasks * createTask) + (userDelTasks * deleteTask) + (rescheduleCount * rescheduleTask) + (userCreatedProjects * createProject) + (userDelProjects * delProject);
    if (userPoints >= tier3 && userPoints < tier2){ userTier = 3; }
    else if (userPoints>=tier2 && userPoints < tier1){ userTier = 2; }
    else if (userPoints >= tier1){ userTier = 1; }
    else { userTier = 0; }

    var currentUser = JSON.parse(localStorage.getItem("ORDINO_CURRENT_USER") || "null");
    if(!currentUser){ return; }
    var pointsByUser = JSON.parse(localStorage.getItem("ORDINO_POINTS") || "{}");
    pointsByUser[currentUser.username] = userPoints;
    localStorage.setItem("ORDINO_POINTS", JSON.stringify(pointsByUser));
    localStorage.setItem("APPoints", userPoints);
}
//js to cycle through the different month rewards

if (currentDate.getMonth() >= 1 && currentDate.getMonth() <= 3){                     //cycle 1
    hideCycle2();
    hideCycle3();
}
else if(currentDate.getMonth() >= 5 && currentDate.getMonth() <= 7){                //cycle 2
    hideCycle1();
    hideCycle3();
}
else if (currentDate.getMonth() >=9 && currentDate.getMonth()<=11){                  //cycle 3
    hideCycle1();
    hideCycle2();
}
else{
    //break months no quests or rewards i.e April,August,December
}
function hideCycle1(){
    $('div#store').children('.row').eq(1).css("display","none");
    $('div#store').children('.row').eq(2).css("display","none");
}
function hideCycle2(){
    $('div#store').children('.row').eq(2).css("display","none");
    $('div#store').children('.row').eq(3).css("display","none");

}
function hideCycle3(){
    $('div#store').children('.row').eq(4).css("display","none");
    $('div#store').children('.row').eq(5).css("display","none");
}
function displayAwardTips(){
    $('.toast-body button').hide(900);
    var tips = '<ol><li>You have to gain more points by completing more tasks.</li><li>Aim for a higher tier</li><li>Less is More,do lesser tasks each day.</li><li>Remember,consistency is key!</li><li>Lastly,Earn your reward!</li></ol>'
    $('div.toast-body').append(tips);
}
for(var i = 0; i < $('.cardbg').length; i++){
    $('.user-points').next().next().children().eq(i).on('click', function(){
        $(this).hide(1000);
        $(this).children().eq(0).css('display','block');
        $(this).children().eq(4).addClass("d-grid gap-2 col-6 mx-auto");
        $(this).show(1000);
    })
}
prizeList = {
    "Cable Car Voucher":{"price":8000},
    "FairPrice Voucher $35":{"price":4500},
    "Bubble Tea Voucher ($5)":{"price":900},
    "Jewel lounge Entry For 1":{"price":8000},
    "Pastamania Voucher":{"price":3000},
    "McDonalds Coupon ($7)":{"price":1000},
    "Singapore Zoo tickets for 2":{"price":7000},
    "Andes By Astons Voucher($20)":{"price":2500},
    "7-11 Voucher($5)":{"price":800}
    }
    var voucherName = "";
    function voucherRedemption(voucherName,prizeList,userPoints,selector){
        voucherName = selector;
        for(let i in prizeList){
            if(i == voucherName){
                var voucherCost = prizeList[i].price;
                if(userPoints >= voucherCost){
                    userPoints -= voucherCost;
                    setSectionMessage("#store", "Voucher redemption successful (demo).", "success");
                }
                else{
                    //display alert toast
                    $(".toast-container").show(500);
                }
            }
        }
    
    }
function closeTask(closingTaskId){
    var settings = withTodoistAuth({
        "url": `${TODOIST_API_BASE}/tasks/${String(closingTaskId)}/close`,
        "method":"POST",
        "statusCode":{204:function(){ alert(`Task Id :${closingTaskId} has been successfully closed!`);}},
        "headers":{}
    })
    if(!settings){ return; }
    $.ajax(settings).done(function(){}).fail(handleTodoistError);
}
function displayToast(){
    var toast = document.getElementById("toastcompleted")
    toast.style.display = "block";
}
