// Selectionner les elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bulle");
let bulletsSpanContainer = document.querySelector(".bulle .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");



let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

// sauvgarder les réponses de l'utilisateur et le status de sa réponse (vrai/faux)
var rep = { "reponses" : [
	{
		"status": "faux",
    "repChoisi" : "",
	},
	{
		"status": "faux",
    "repChoisi" : "",
	},
	{
		"status": "faux",
    "repChoisi" : "",
	},
	{
		"status": "faux",
    "repChoisi" : "",
	},
	{
		"status": "faux",
    "repChoisi" : "",
	},
	{
		"status": "faux",
    "repChoisi" : "",
	},
	{
		"status": "faux",
    "repChoisi" : "",
	},
	{
		"status": "faux",
    "repChoisi" : "",
	},
	{
		"status": "faux",
    "repChoisi" : "",
	},
	{
		"status": "faux",
    "repChoisi" : "",
	},

	]
}
// fonction pour ramener les données avec ajax
function getQuestions() {

  var myRequest;

  if (window.XMLHttpRequest) {//navigateurs récents
    myRequest= new XMLHttpRequest();
    } else {
    // code for IE6, IE5
    myRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = myRequest.responseXML;
      var answs = questionsObject.getElementsByTagName("row"); 
      let qCpt = answs.length;
   

 // fonction pour crée les bulles verts en haut qui indiquent le nb de questions 
      creeBulles(qCpt);
  // ajouter une questions avec ses réponses
      addQuestionData(answs[currentIndex], qCpt);

      // compteur à rebout 30s
      countdown(30, qCpt);
//bouton soumettre
      submitButton.onclick = () => {
        
        let i = currentIndex;
        // récuperer la réponse correcte depuis le fichier xml
        let theRightAnswer = answs[currentIndex].getElementsByTagName("right_answer")[0].childNodes[0].nodeValue;
        //incrémenter l'index
        currentIndex++;
//checker si la réponses est juste ou fausse en la comparant avec la réponse juste qu'on a récuperer
        checkAnswer(theRightAnswer,i);

// vider la page pour mettre la prochaine question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
// mettre la prochaine question
        addQuestionData(answs[currentIndex], qCpt);
//mettre a jour l'indexation des bulles vert
        handleBullets();
// mettre a jour le compteur pour la nouvelle question
        clearInterval(countdownInterval);
        countdown(30, qCpt);
//afficher le résultat
        showResults(qCpt);
//afficher les réponses de l'utilisateur pour chaque question avec la réponse correcte et l'etat de sa réponses (correcte ou fausse)
        showAnswers(answs , qCpt , currentIndex);
        
      };
     
    }
    
  };

  myRequest.open("GET", "html_questions.xml", true);
  myRequest.send();

}

getQuestions();

 // fonction pour crée les bulles verts en haut qui indiquent le nb de questions 
function creeBulles(num) {
  // countSpan.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");

    if (i === 0) {
      theBullet.className = "on";
    }

    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(answs, count) {
  if (currentIndex < count) {
     // Creer le titre de la question en H2 
    let questionTitle = document.createElement("h2");
    //creer le  texte de la question
    let questionText = document.createTextNode(answs.getElementsByTagName("title")[0].childNodes[0].nodeValue);
    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);

    for (let i = 1; i <= 4; i++) {
// creer une div pour les reponses
      let mainDiv = document.createElement("div");

  // Ajouter une class a la Div
      mainDiv.className = "answer";

// creer un radio input
      let radioInput = document.createElement("input");
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = answs.getElementsByTagName(`answer_${i}`)[0].childNodes[0].nodeValue;
// selectionner la premiere option
      if (i === 1) {
        radioInput.checked = true;
      }

// creer un label 
      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer_${i}`;
      let theLabelText = document.createTextNode(answs.getElementsByTagName(`answer_${i}`)[0].childNodes[0].nodeValue);
      theLabel.appendChild(theLabelText);
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);
      answersArea.appendChild(mainDiv);
    }
  }
}


function checkAnswer(rAnswer,currentIndex) {
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
  let bulletsSpans = document.querySelectorAll(".bulle .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}


// fonction pour afficher les resultats et le score
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

// fonction pour le compte a rebouts
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



function showAnswers(qO , cpt , currentIndex) {

  if (currentIndex === cpt) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();
    let j ;
   for (let i = 0; i <= qO.length; i++) {
    // console.log(qO);
    // le j c'est pour afficher le numéro le la question qui commence à 1
    j=i+1;
    // récuperer le titre de la question
    let qi=qO[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
    // récuperer la bonne réponse
    let ra=qO[i].getElementsByTagName("right_answer")[0].childNodes[0].nodeValue;

// les afficher 
  resultsContainer.innerHTML+= "<br>"+"<strong>Question</strong> " + j +" : "+ qi +  "<br>";
  resultsContainer.innerHTML+= "<span> La réponse correcte : </span>"+ ra + "<br>";

// afficher une croix rouge si la réponse était fausse sinon un check en vert 
  if(rep.reponses[i].status == "faux") {
    res = '<span class="wrong">'  + '</span><i class="fa fa-remove c-wrong" style="font-size:30px"></i>';
} else {
  res = '<span class="correct">'  + '</span><i class="fa fa-check c-correct" style="font-size:30px"></i>';
}
  resultsContainer.innerHTML+= "<span>votre réponse est :  </span>"+ rep.reponses[i].repChoisi +' '+res+ "<br>";
}
    
  }
 
}

