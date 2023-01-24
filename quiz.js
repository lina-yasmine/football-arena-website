// Select Elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");



let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;


var rep = { "reponses" : [
	{
		"id" : 1,
		"status": "faux",
    "repChoisi" : "",
	},
	{
		"id" : 2,
		"status": "faux",
    "repChoisi" : "",
	},
	{
		"id" : 3,
		"status": "faux",
    "repChoisi" : "",
	},
	{
		"id" : 4,
		"status": "faux",
    "repChoisi" : "",
	},
	{
		"id" : 5,
		"status": "faux",
    "repChoisi" : "",
	},
	{
		"id" : 6,
		"status": "faux",
    "repChoisi" : "",
	},
	{
		"id" : 7,
		"status": "faux",
    "repChoisi" : "",
	},
	{
		"id" : 8,
		"status": "faux",
    "repChoisi" : "",
	},
	{
		"id" : 9,
		"status": "faux",
    "repChoisi" : "",
	},
	{
		"id" : 10,
		"status": "faux",
    "repChoisi" : "",
	},

	]
}

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCpt = questionsObject.length;
 
      createBullets(qCpt);

      addQuestionData(questionsObject[currentIndex], qCpt);
      countdown(30, qCpt);

      submitButton.onclick = () => {
        
        let i = currentIndex;
        let theRightAnswer = questionsObject[currentIndex].right_answer;
        currentIndex++;
        checkAnswer(questionsObject,theRightAnswer,i);

        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        addQuestionData(questionsObject[currentIndex], qCpt);
        handleBullets();

        clearInterval(countdownInterval);
        countdown(30, qCpt);

        showResults(qCpt);
        showAnswers(questionsObject , qCpt , currentIndex);
        
      };
     
    }
    
  };

  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();

}

getQuestions();


function createBullets(num) {
  countSpan.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");

    if (i === 0) {
      theBullet.className = "on";
    }

    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    let questionTitle = document.createElement("h2");
    let questionText = document.createTextNode(obj["title"]);
    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);

    for (let i = 1; i <= 4; i++) {

      let mainDiv = document.createElement("div");


      mainDiv.className = "answer";


      let radioInput = document.createElement("input");

      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      if (i === 1) {
        radioInput.checked = true;
      }


      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer_${i}`;
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      theLabel.appendChild(theLabelText);
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(questionsObject,rAnswer,currentIndex) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;
   
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
      console.log("le i",i)
      rep.reponses[currentIndex].repChoisi=answers[i].dataset.answer;
      
    }
  }

  if (rAnswer === theChoosenAnswer) {
   rep.reponses[currentIndex].status= "correct";
   rightAnswers++;
  } 
 
  console.log("index",currentIndex);
  
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(cpt) {
  let theResults;
  if (currentIndex === cpt) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();
let titre ;
titre = `<h1> <p>Resultats</p> <h2>`;
    if (rightAnswers > cpt / 2 && rightAnswers < cpt) {
      theResults = `<span class="bien">Bien joué , Vous avez répondu correctement à la majorité des questions !<br>Votre score : </span> ${rightAnswers}/${cpt}`;
    } else if (rightAnswers === cpt) {
      theResults = `<span class="parfait">Parfait</span> , Vous avez répondu correctement a toutes les questions ! <br> Votre score : ${rightAnswers}/${cpt}`;
    } else {
      theResults = `<span class="mauvais">Mauvais score , Vous avez eu </span> : ${rightAnswers}/${cpt}`;
    }
  for (let i = 0; i <= 10; i++) {
        console.log(rep.reponses[i]);
      }
    resultsContainer.innerHTML = titre + theResults;
    resultsContainer.style.padding = "20px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.margin = "20px";
    resultsContainer.style.marginTop = "0px";


  
    
  }
}

function countdown(duree, cpt) {
  if (currentIndex < cpt) {
    let min, sec;
    countdownInterval = setInterval(function () {
      min = parseInt(duree / 60);
      sec = parseInt(duree % 60);

      min = min < 10 ? `0${min}` : min;
      sec = sec < 10 ? `0${sec}` : sec;

      countdownElement.innerHTML = `${min}:${sec}`;

      if (--duree < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}



function showAnswers(questionsObject , cpt , currentIndex) {

  if (currentIndex === cpt) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();
    let j ;
   for (let i = 0; i <= questionsObject.length; i++) {
    j=i+1;
  resultsContainer.innerHTML+= "<br>"+"<strong>Question</strong> " + j +" : "+questionsObject[i].title +  "<br>";
  resultsContainer.innerHTML+= "<span> La réponse correcte : </span>"+ questionsObject[i].right_answer + "<br>";

  if(rep.reponses[i].status == "faux") {
    res = '<span class="wrong">'  + '</span><i class="fa fa-remove c-wrong" style="font-size:30px"></i>';
} else {
  res = '<span class="correct">'  + '</span><i class="fa fa-check c-correct" style="font-size:30px"></i>';
}
  resultsContainer.innerHTML+= "<span>votre réponse est :  </span>"+ rep.reponses[i].repChoisi +' '+res+ "<br>";
}
    
  }
 
}
