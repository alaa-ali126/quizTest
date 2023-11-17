let quizCount = document.querySelector(".count span");
let bullets = document.querySelector(".bullets .spans");
let bulletsArea = document.querySelector(".bullets");
let questionArea = document.querySelector(".question-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit");
let result = document.querySelector(".results");
let countdown = document.querySelector(".countdown");

let qcount;
let currentIndex = 0;
let rihgt = 0;
let intervalValue;

function getJSONData() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let jsonData = JSON.parse(this.responseText);
      qcount = jsonData.length;

      createBullets(jsonData);

      createQ(jsonData[currentIndex]);

      countDown(60);

      submitButton.onclick = () => {
        let rightAnswer = jsonData[currentIndex].right_answer;

        currentIndex++;

        checkTheRightAnswer(rightAnswer);

        quizCount.innerHTML = `${currentIndex}/${qcount}`;

        questionArea.innerHTML = "";
        answersArea.innerHTML = "";

        createQ(jsonData[currentIndex]);

        handleBullets();

        clearInterval(intervalValue);

        countDown(60);

        showResults();
      };
    }
  };

  myRequest.open("Get", "quiz.json", true);
  myRequest.send();
}

getJSONData();

function createBullets() {
  quizCount.innerHTML = `${qcount}`;
  for (let i = 0; i < qcount; i++) {
    let bulletsSpans = document.createElement("span");
    if (i == 0) {
      bulletsSpans.className = "on";
    }
    bullets.appendChild(bulletsSpans);
  }
}

function createQ(questions) {
  if (currentIndex < qcount) {
    let questionH2 = document.createElement("h2");
    let questionText = document.createTextNode(questions["title"]);
    questionH2.appendChild(questionText);
    questionArea.appendChild(questionH2);
    for (let i = 1; i <= 4; i++) {
      let answer = document.createElement("div");
      answer.className = "answer";
      let input = document.createElement("input");
      input.type = "radio";
      input.name = "question";
      input.id = `answer_${i}`;
      input.dataset.answer = questions[`answer_${i}`];

      if (i == 1) {
        input.checked = true;
      }

      let lable = document.createElement("label");
      let labelText = document.createTextNode(questions[`answer_${i}`]);
      lable.appendChild(labelText);
      lable.htmlFor = input.id;

      answer.appendChild(input);
      answer.appendChild(lable);
      answersArea.appendChild(answer);
    }
  }
}

function handleBullets() {
  let spans = document.querySelectorAll(".spans span");
  let arrayOfSpans = Array.from(spans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex == index) {
      span.className = "on";
    }
  });
}

function checkTheRightAnswer(rAnswer) {
  let answers = document.getElementsByName("question");
  let choosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer == choosenAnswer) {
    rihgt++;
  }
}

function showResults() {
  let theResults;
  if (currentIndex == qcount) {
    questionArea.remove();
    answersArea.remove();
    submitButton.remove();
    bulletsArea.remove();

    if (rihgt == qcount) {
      theResults = `<span class="perfect">perfect</span> your right answer is ${rihgt} from ${qcount}`;
    } else if (rihgt > qcount / 2 && rihgt < qcount) {
      theResults = `<span class="good">good</span> your right answer is ${rihgt} from ${qcount}`;
    } else {
      theResults = `<span class="bad">bad</span> your right answer is ${rihgt} from ${qcount}`;
    }

    result.innerHTML = theResults;
  }
}

function countDown(duration) {
  if (currentIndex < qcount) {
    intervalValue = setInterval(() => {
      let minutes, seconds;
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countdown.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(intervalValue);
        submitButton.click();
      }

    }, 1000);
  }
}
