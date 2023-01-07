// Select Elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
// let repButton = document.querySelector(".repbutton");
// let quitterButton = document.querySelector(".quitterbutton");


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
 
      // Create Bullets + Set Questions Count
      createBullets(qCpt);

      // Add Question Data
      addQuestionData(questionsObject[currentIndex], qCpt);

      // Start CountDown
      countdown(10, qCpt);

      // Click On Submit
      submitButton.onclick = () => {
        
        let i = currentIndex;
        // Get Right Answer
        let theRightAnswer = questionsObject[currentIndex].right_answer;

        // Increase Index
        currentIndex++;

        // Check The Answer
    
        checkAnswer(questionsObject,theRightAnswer,i);

        // Remove Previous Question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";

        // Add Question Data
        addQuestionData(questionsObject[currentIndex], qCpt);

        // Handle Bullets Class
        handleBullets();

        // Start CountDown
        clearInterval(countdownInterval);
        countdown(10, qCpt);

        // Show Results
        showResults(qCpt);
        showAnswers(questionsObject , qCpt , currentIndex);
        
      };
     
    //   quitterButton.onclick = () => {
    //   showAnswers(questionsObject);
    // }
    }
    
  };

  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
  // showAnswers(qCpt);
}

getQuestions();


function createBullets(num) {
  countSpan.innerHTML = num;

  // Create Spans
  for (let i = 0; i < num; i++) {
    // Create Bullet
    let theBullet = document.createElement("span");

    // Check If Its First Span
    if (i === 0) {
      theBullet.className = "on";
    }

    // Append Bullets To Main Bullet Container
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // Create H2 Question Title
    let questionTitle = document.createElement("h2");

    // Create Question Text
    let questionText = document.createTextNode(obj["title"]);

    // Append Text To H2
    questionTitle.appendChild(questionText);

    // Append The H2 To The Quiz Area
    quizArea.appendChild(questionTitle);

    // Create The Answers
    for (let i = 1; i <= 4; i++) {
      // Create Main Answer Div
      let mainDiv = document.createElement("div");

      // Add Class To Main Div
      mainDiv.className = "answer";

      // Create Radio Input
      let radioInput = document.createElement("input");

      // Add Type + Name + Id + Data-Attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      // Make First Option Selected
      if (i === 1) {
        radioInput.checked = true;
      }

      // Create Label
      let theLabel = document.createElement("label");

      // Add For Attribute
      theLabel.htmlFor = `answer_${i}`;

      // Create Label Text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);

      // Add The Text To Label
      theLabel.appendChild(theLabelText);

      // Add Input + Label To Main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // Append All Divs To Answers Area
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
      // rep.reponses[currentIndex].rAnswer=rAnswer;
      // rep.reponses[currentIndex].question=questionsObject[currentIndex].title;
      
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
      theResults = `<span class="bien">Bien joué , Vous avez répondu juste a la majorité des questions ! </span>, ${rightAnswers}/${cpt}`;
    } else if (rightAnswers === cpt) {
      theResults = `<span class="parfait">Parfait</span> , Vous avez répondu correctement a toutes les questions !`;
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

  

    // resultsContainer.innerHTML +='<div class="buttons"> <button class="repbutton">Mes réponses </button> <button class="quitterbutton"> Rejouer </button></div>' ;
  
    
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
   for (let i = 0; i <= questionsObject.length; i++) {
  resultsContainer.innerHTML+= "<br>"+"<strong>Question</strong> " + i +" : "+questionsObject[i].title +  "<br>";
  resultsContainer.innerHTML+= "<span> La réponse correcte : </span>"+ questionsObject[i].right_answer + "<br>";

  if(rep.reponses[i].status == "faux") {
    res = '<span class="wrong">' +" fausse" + '</span><i class="fa fa-remove c-wrong"></i>';
} else {
  res = '<span class="correct">' +" juste" + '</span><i class="fa fa-check c-correct"></i>';
}
  resultsContainer.innerHTML+= "<span>votre réponse est :  </span>"+ rep.reponses[i].repChoisi +' '+res+ "<br>";
}
    
  }
 
}

