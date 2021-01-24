var ques = [
    {
        question: '1. Which of the following is a server-side Java Script object?',
        options: [ 'Function ','File ','FileUpload','Date'],
        answer: 2,
    },
    {
        question: "2. Java script can be used for Storing the form's contents to a database file on the server",
        options: ['False', 'True',],
        answer: 1,
    },
    {
        question: '3. To insert a JavaScript into an HTML page, which tag is used?',
        options: ['< script=’java’>','< javascript>','< script>','< js>'],
        answer: 3,
    },
    {
        question: '4. Which of the below is used in Java script to insert special characters?',
        options: ['&', ' \\ ', '- ', '%'],
        answer: 2,
    },
    {
        question: '5. C-style block-level scoping is not supported in Java script',
        options: ['True', 'False'],
        answer: 2,        
    },


]
var score = 0;
var clicked = false;        
var correct = false;
var questions = document.getElementById('questions');
var container = document.getElementById('container');
var option = document.getElementById('option');
var radio;

// function to create radio button
function rBtn(a) {
    radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'ques';
    radio.value = a + 1;    
    radio.id = 'radio' + a;
    questions.appendChild(radio);
}
var rdid = [];      // array to store radio buttons id's
var i = 0;          //  for iterating questions in the array
function ele(i) {
    clicked = false;     // check radio button is clicked or not
    var selected = 0;    // which option is selected
    questions.style.fontWeight = 'normal';
    questions.innerHTML = "<h2>" + ques[i].question + "</h2>" + "<br/>";    // display questions 

    // now display options of each question

    for (var j = 0; j < ques[i].options.length; j++) {
        var label = document.createElement('label');
        label.innerHTML = [rBtn(j)] + "&nbsp;&nbsp;" + ques[i].options[j] + "<br/>";
        label.setAttribute('for', radio.id);
        radio.addEventListener("click", function () {
            correct = false;
            clicked = false;
        })

        //  identifying which button is clicked and compare to the correct answer

        radio.addEventListener("click", function (event) {            
            selected = event.target.value;
            if (selected == ques[i].answer) {                
                correct = true;
                clicked = true;
            }
            else if (selected == 0) {                
                clicked = false;
            }
            else {            
                clicked = true;
                correct = false;
            }
        })
        questions.appendChild(label);        
        rdid.push(document.getElementById(radio.id));
    }
}
ele(i);     // display the first question

var next = document.getElementById('next');         //  for moving to the next question use later
var head1 = document.getElementById('head');        //  for display the score at place of QUIZ
next.style.display = 'none';                        // initially next is not displayed

// for display score and the answersheet

function Result() {
    questions.style.fontWeight = 'bold';
    head1.innerHTML = '';
    head1.innerHTML = 'SCORE : ' + score;
    questions.innerHTML = "<h2>" + 'AnswerSheet' + "</h2>";

    // traverse very first array for display the correct answers of all questions

    ques.forEach(function (value, ind) {
        var corr = ques[ind].answer;                            // store the correct answers        
        var ansDiv = document.createElement('div');            //  div contain the correct ansers for styling 
        ansDiv.className = 'Answersheet';                     
        ansDiv.innerHTML = ques[ind].options[corr - 1];
        questions.innerHTML +="<br/> " + ques[ind].question + ": ";
        questions.appendChild(ansDiv);
        questions.innerHTML += "<br/>";
        
    })
}
var restart = document.getElementById('restart');       // use for restart the quiz
restart.style.display = 'none';                         // initially not displayed
var submit = document.getElementById('submit');      

// submit questions

function submitBtn() {
    var detail = document.getElementById('detail');         // div used for information of selected option wether correct or not
    detail.removeAttribute('class');                        // remove all the styling
    
    // add event for display next question

    next.addEventListener("click", function () {
        detail.style.display = 'none';

        // checking the question is last one or not

        if (i >= ques.length - 1) {
            detail.innerHTML = '';
            Result();                       // display the result in the last
                                
            next.style.display = 'none';
            restart.style.display = 'block';    // display the restart button
            return;
        }
        ele(++i);                       // display next questions
        next.style.display = 'none';
        submit.style.display = 'block';
    })
    
    // on submit diplay wether correct or not 
    submit.addEventListener("click", function () {
        detail.style.display = 'block';             
        if (correct) {
            detail.className = 'alert alert-success';
            detail.innerHTML = '';
            detail.innerHTML = 'Correct';           //display correct
            score += 1;                             
            correct = false;

            // disable the radio buttons

            rdid.forEach(function (value) {
                value.disabled = true;
            })
            submit.style.display = 'none';
            next.style.display = 'block';           // display next button
        }

        // no button selected

        else if (!clicked) {
            detail.className = 'alert alert-warning';
            detail.innerHTML = 'select an option';
        }
            // wrong answer
        else {
            detail.className = 'alert alert-danger';
            detail.innerHTML = 'wrong';             // display wrong

            // disable radio buttons

            rdid.forEach(function (value) {
                value.disabled = true;
            })

            submit.style.display = 'none';
            next.style.display = 'block';       // display next button
        }

    })

}

submitBtn();        //submit button

// restart the quiz

restart.addEventListener("click", function () {
    i = 0;                  // for display first question
    score = 0;
    ele(i);             // display first question
    restart.style.display = 'none';
    submit.style.display = 'block';     
    head1.innerHTML = 'QUIZ';       // change heading Score to Quiz
})