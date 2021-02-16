var API_KEY =localStorage.getItem("API_KEY");//global api-key modified in ajax for general use
$(document).ready(function(){
    displayName() //load first when ready
    /*===================================SIDE NAVBAR EVENT LISTENERS====================================================*/
    var $inboxTab = $('nav.nav1').children().children().eq(1).children().first();
    var clickCount = 0;  //click variable to make sure content doesn't append
    $inboxTab.on("focus",function(){
        clickCount += 1;
        if(clickCount >= 1){
            getAllProjects(colorArray);
            getActiveTasks(API_KEY);//display active tasks in DOM
            $('.dropdown.extra-options').detach().appendTo('.three-dots');
            var $projectsHeader = $('div#getallproj').prev();
            var $tasksHeader = $('div#getalltasks').prev();
            $tasksHeader.hide().show(1000);
            $projectsHeader.hide().show(1700);
            $('section#inbox h3').show(1000);
            $('section#inbox span a').attr("href","/comment-page");
            $('a.dropdown').on("click",function(){
                $('#calendar').show();
            });
        
        //document.querySelector('ul.dropdown-menu li a').setAttribute('class','dropdown-item');

        }

    })
    $inboxTab.off("focus",function(){
        
        clickCount = 0; //reset
    })
    /*==========================================INBOX TAB EVENT LISTENERS============================================*/
    $('ul.dropdown-menu.show,ul.dropdown-menu').addClass('adjust-menu');
    var $deleteIcon = document.querySelectorAll('div.accordion-body button#delete');
/*     $deleteIcon.addEventListener('focus',function(){
        alert("hello");
        // deleteProject(,API_KEY);
        // getAllProjects(colorArray);//call function again to reset the project List in DOM 
    },false);       
 */ var $editIcon = $('div.accordion-body button#update');
    $editIcon.on("click",function(e){
        e.preventDefault();
        alert('sup')
    });
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
//Function for getting the projects
function getAllProjects(colorArray){
    var content = '<div class="accordion accordion-flush" id="accordionFlushExample"></div>';
    var settings = {
        "url":"https://api.todoist.com/rest/v1/projects",
        "method":"GET",
        "headers":{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${API_KEY}`
        }
    };
    $.ajax(settings).done(function(response){
        console.log(response);
        // for (let i = 30;i<50;i++){
        //     if(i == response[4].color){
        //         $('section.main div').attr("style",`background-color:${colorArray[i]};`);
        //     }
        // }
        var color = "";
        for(let i =0;i<response.length;i++){
            if(response[i].hasOwnProperty("color")){
                color = response[i].color;
            }
            content += `<div class="accordion-item">
              <h2 class="accordion-header" id="flush-heading${i+1}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapses${i+1}" aria-expanded="false" aria-controls="flush-collapse${i+1}">
                ${response[i].name}
                </button>
              </h2>
              <div id="flush-collapses${i+1}" class="accordion-collapse collapse" aria-labelledby="flush-heading${i+1}" data-bs-parent="#accordionFlushExample">
                <div class="accordion-body projectaccordion">
                <span data-tooltip="Add comment"><button id="comment"><ion-icon name="chatbox-ellipses-outline"></ion-icon></button></span>
                <span data-tooltip="Edit"><button id="update"><ion-icon name="create-outline"></ion-icon></button></span>
                <span data-tooltip="Delete"><button id="delete"><ion-icon name="trash-outline"></ion-icon></button></span>
                </div>
              </div>
            </div>`
            // content+=`<div class = "project-item"> <span><h4>${response[i].name}</h4></span>
            // <span class = "project-color"></span></div>`;
            if(color !== ""){
                $('.project-color').css('background-color',`${colorArray[color]}`.toString());
                console.log(colorArray[color]);
            }
        }
        var projectList = document.getElementById("getallproj");
        projectList.innerHTML = content;
    })  
};
//Function for creating a project
$('button#addprojbtn').on("click",function(e){
    e.preventDefault();
    var projectName = $('input#inputProjectName').val();
    createNewProject(projectName, API_KEY);
});
function createNewProject(pName,API_KEY){ //POST method
    var projectInfo = {
        "name":pName
    }
    var settings = {
        "url":"https://api.todoist.com/rest/v1/projects",
        "method":"POST",
        "headers":{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${API_KEY}`
            //"X-Request-Id":""
        },
        "data":JSON.stringify(projectInfo)
    };
    $.ajax(settings).done(function(response){
        console.log(response);
        hideModal();
        function hideModal(){
            $("#addProj").modal('toggle');
        }
    })
}
//deleting a project
function deleteProject(deleteId,API_KEY){
    var settings = {
        "url":`https://api.todoist.com/rest/v1/projects/${deleteId}`,
        "method":"DELETE",
        "statusCode":{
            204:function(){
                alert(`Project Id:${deleteId} has been deleted!`);
            }
        },
        "headers":{
            "Authorization":`Bearer ${API_KEY}`
        }
    }
    $.ajax(settings).done(function(response){
        console.log(response);
        if(response  === undefined){
            alert(`Project ID:${deleteId} has been deleted successfully.`);
        }
    });
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
    console.log(dueDate);
    console.log(new Date(dueDate).toISOString());
});
function createNewTask(taskName,API_KEY, dueDate){
    if(dueDate === '' || dueDate === undefined){
        alert("Empty")
    }
    var taskInfo = {
        "content":taskName,
        "due_date": dueDate,
        //"due_string": "tomorrow at 12:00", 
        "due_lang": "en", 
        "priority": 4
    } 
    var settings = {
        "url":`https://api.todoist.com/rest/v1/tasks`,
        "method":"POST",
        "headers":{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${API_KEY}`
        },
        "data":JSON.stringify(taskInfo)
    }
    $.ajax(settings).done(function(response){
        console.log(response);
        alert("Success!!!")
    });
}
//get active Task
var initialdueDate ;  //to prevent overwriting from previous dueDate value 
var currentDate;        //declare variables to store values from ajax responses
var due_string;
function getActiveTasks(API_KEY){
    var tasks ='';
    var settings = {
        "url":`https://api.todoist.com/rest/v1/tasks`,
        "method":"GET",
        "headers":{
            "Authorization":`Bearer ${API_KEY}`
        }
    }
    $.ajax(settings).done(function(response){
        console.log(response);
        for(let i =0;i<response.length;i++){
            initialdueDate = new Date(response[i].due.date).getTime()
            currentDate = new Date().getTime()
            due_string = response[i].due.string

            tasks+=`<div class = "task-box">`
            tasks+=`<div class="accordion-item">
            <h2 class="accordion-header" id="flush-heading${i+1}">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${i+1}" aria-expanded="false" aria-controls="flush-collapse${i+1}">
              ${response[i].content}
              </button>
            </h2>
            <div id="flush-collapse${i+1}" class="accordion-collapse collapse" aria-labelledby="flush-heading${i+1}" data-bs-parent="#accordionFlushExample">
              <div class="accordion-body">
              <div class="dropup">
        <a href="#" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false"><span id ="due-date-string"><ion-icon name="calendar-outline"></ion-icon>${new Date (response[i].due.date).toDateString()}</span></a>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
        ${createDueDateMenu(due_string,initialdueDate,currentDate)}
        </ul>
      </div>
            </span>
              <span><a><ion-icon name="chatbox-outline"></ion-icon>Comments</a></span></span>
              <span class = "three-dots"></span></div>
              </div>
            </div>
          </div></div>`

            //tasks+=    //add the 'options' dots at the side using js later
            
        }
        
        $('div#tasks').append(tasks);
       
        $('span.dropdown button').css("opacity","1");//show hidden dropdown shape from html after shifting over
        
        var projectList = document.getElementById("getalltasks");
        projectList.innerHTML = tasks;
        
    });
    $('div.task-box').children().eq(1).children().eq(1).children('a').attr("href","#comments");

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
        <h6 class="text-center">Logging you out....Adios :)</h6>
    </div>
</div>
</section>`; //loading animation content
function logOutUser(logOutContent){
  let $mainPage =$('body#body-pd').children().first(); 
  $mainPage.remove();
  $('body').prepend(logOutContent);
  setTimeout(redirectToHome,2500);
}
function redirectToHome(){
    window.location.replace("index.html");
}
function displayName(){
    $('h4.topbannertext').last().text(`Welcome, ${localStorage.getItem('User')}!`);
}

function createDueDateMenu(dueString,initialdueDate,currentDate){
    var datesLeft = Math.ceil((initialdueDate-currentDate)/ (1000 * 3600 * 24));
    
    var menuContent = ""
    if(datesLeft>=1){    //due tasks
        menuContent+=`<li><span>${datesLeft} days left </span></li>
        <li><span>${dueString}</span></li><li><a class ="dropdown-item" href = "#picker">Reschedule</a></li>`
    }
    else if(datesLeft == 0){
        menuContent+=`<li><span>Due today</span></li>
        <li><span>${dueString}</span></li><li><a class ="dropdown-item" href = "#picker">Reschedule</a></li>`

    }
    else{  //overdue tasks
        var daysOverdue = -1 * datesLeft
        menuContent+= `<li><span>${daysOverdue} days overdue!</span></li>
        <li><span>${dueString}</span></li>`
    }
    
    return menuContent;
    
}
$('#picker').daterangepicker({
    minDate:new Date(initialdueDate),        //deadlines can only be changed after current deadline
    minYear:new Date().getFullYear(),      //task deadline cannot preceed current year
    maxYear:(new Date().getFullYear())+1,   //task deadline cannot exceed current year
    
    singleDatePicker:true,
    showDropdowns:true,
    opens:'left',
    drops:'up'
});
function createNewComment(task_id,API_KEY,commentContent){
    var commentInfo = {
        "task_id":task_id,
        "content":commentContent
    }
    var settings = {
        "url":"http://curl@/tmp/note.json",
        "raw_url":"http://curl@/tmp/note.json",
        "method":"POST",
        "headers":{
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${API_KEY}`,
        },
        "data":{
            "@/tmp/note.json":JSON.stringify(commentInfo)
        }

    }
    $.ajax(settings).done(function(response){
        console.log(response);
    });
    
}
