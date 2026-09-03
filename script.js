/*
  IMPORTANT:
  Change this URL after deploying your backend.

  Example:
  https://your-writemate-backend.onrender.com
*/

const API_URL = "https://YOUR-BACKEND-URL.onrender.com";


let selectedFont = "Caveat";

let currentAnswer = null;


/* -----------------------------
   Handwriting style selection
----------------------------- */

document.querySelectorAll(".style-option").forEach(button => {

  button.addEventListener("click", () => {

    document.querySelectorAll(".style-option")
      .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    selectedFont = button.dataset.font;

  });

});


/* -----------------------------
   Generate answer
----------------------------- */

document
  .getElementById("generateBtn")
  .addEventListener("click", generateAnswer);


async function generateAnswer() {

  const question =
    document.getElementById("question").value.trim();

  const subject =
    document.getElementById("subject").value;

  const marks =
    document.getElementById("marks").value;

  const pages =
    document.getElementById("pages").value;

  const ink =
    document.getElementById("ink").value;

  const status =
    document.getElementById("status");


  if (!question) {

    alert("Please enter a question.");

    return;
  }


  status.textContent =
    "✨ AI is preparing your answer...";


  const button =
    document.getElementById("generateBtn");

  button.disabled = true;


  try {

    const response = await fetch(
      `${API_URL}/api/generate`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          question,
          subject,
          marks,
          pages
        })
      }
    );


    if (!response.ok) {

      throw new Error("Backend error");

    }


    const data = await response.json();


    currentAnswer = {
      question,
      subject,
      marks,
      pages,
      ink,
      font: selectedFont,
      answer: data.answer
    };


    showAnswer(currentAnswer);


    status.textContent =
      "✅ Answer generated successfully!";


  } catch (error) {

    console.error(error);

    status.textContent = "";

    alert(
      "Backend is not connected yet. Please check the backend URL."
    );

  }


  button.disabled = false;

}


/* -----------------------------
   Display handwritten pages
----------------------------- */

function showAnswer(data) {

  const resultSection =
    document.getElementById("resultSection");

  const container =
    document.getElementById("pagesContainer");


  container.innerHTML = "";


  const pageCount =
    Number(data.pages);


  const text =
    data.answer;


  const chunks =
    splitAnswerIntoPages(text, pageCount);


  chunks.forEach((chunk, index) => {

    const page =
      document.createElement("div");

    page.className = "notebook";


    const writing =
      document.createElement("div");

    writing.className =
      `handwriting ${data.ink}`;


    writing.style.fontFamily =
      `"${data.font}", cursive`;


    writing.textContent =
      chunk;


    page.appendChild(writing);

    container.appendChild(page);

  });


  resultSection.classList.remove("hidden");

  window.scrollTo({
    top: resultSection.offsetTop - 20,
    behavior: "smooth"
  });

}


/* -----------------------------
   Divide answer across pages
----------------------------- */

function splitAnswerIntoPages(text, pageCount) {

  const words =
    text.split(/\s+/);


  const wordsPerPage =
    Math.ceil(words.length / pageCount);


  const pages = [];


  for (
    let i = 0;
    i < pageCount;
    i++
  ) {

    const start =
      i * wordsPerPage;

    const end =
      start + wordsPerPage;


    const pageText =
      words.slice(start, end).join(" ");


    if (pageText.trim()) {

      pages.push(pageText);

    }

  }


  return pages;

}


/* -----------------------------
   Save question
----------------------------- */

document
  .getElementById("saveBtn")
  .addEventListener("click", saveQuestion);


async function saveQuestion() {

  if (!currentAnswer) {

    alert("Generate an answer first.");

    return;

  }


  try {

    const response =
      await fetch(
        `${API_URL}/api/questions`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(currentAnswer)
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message || "Could not save"
      );

    }


    alert("✅ Question and answer saved permanently!");

  } catch (error) {

    console.error(error);

    alert(
      "Could not save. Please check your backend connection."
    );

  }

}


/* -----------------------------
   Open saved questions
----------------------------- */

document
  .getElementById("savedBtn")
  .addEventListener("click", loadSavedQuestions);


document
  .getElementById("closeSavedBtn")
  .addEventListener("click", () => {

    document
      .getElementById("savedSection")
      .classList.add("hidden");

  });


async function loadSavedQuestions() {

  const section =
    document.getElementById("savedSection");

  const list =
    document.getElementById("savedList");


  section.classList.remove("hidden");

  list.innerHTML =
    "<p>Loading saved questions...</p>";


  try {

    const response =
      await fetch(
        `${API_URL}/api/questions`
      );


    if (!response.ok) {

      throw new Error("Could not load");

    }


    const questions =
      await response.json();


    list.innerHTML = "";


    if (questions.length === 0) {

      list.innerHTML =
        "<p>No saved questions yet.</p>";

      return;

    }


    questions.forEach(item => {

      const card =
        document.createElement("div");

      card.className =
        "saved-card";


      const title =
        document.createElement("h3");

      title.textContent =
        item.question;


      const info =
        document.createElement("p");

      info.textContent =
        `${item.subject} • ${item.marks} Marks • ${item.pages} Page(s)`;


      const actions =
        document.createElement("div");

      actions.className =
        "saved-actions";


      const view =
        document.createElement("button");

      view.className =
        "view-btn";

      view.textContent =
        "View Answer";


      view.onclick =
        () => viewSavedAnswer(item);


      const del =
        document.createElement("button");

      del.className =
        "delete-btn";

      del.textContent =
        "Delete";


      del.onclick =
        () => deleteQuestion(item.id);


      actions.appendChild(view);

      actions.appendChild(del);


      card.appendChild(title);

      card.appendChild(info);

      card.appendChild(actions);


      list.appendChild(card);

    });


  } catch (error) {

    console.error(error);

    list.innerHTML =
      "<p>Could not connect to backend.</p>";

  }

}


/* -----------------------------
   View saved answer
----------------------------- */

function viewSavedAnswer(item) {

  currentAnswer = item;

  showAnswer(item);

  document
    .getElementById("savedSection")
    .classList.add("hidden");

}


/* -----------------------------
   Delete saved question
----------------------------- */

async function deleteQuestion(id) {

  const confirmDelete =
    confirm(
      "Delete this saved question?"
    );


  if (!confirmDelete) return;


  try {

    const response =
      await fetch(
        `${API_URL}/api/questions/${id}`,
        {
          method: "DELETE"
        }
      );


    if (!response.ok) {

      throw new Error("Delete failed");

    }


    alert("Question deleted.");

    loadSavedQuestions();


  } catch (error) {

    console.error(error);

    alert("Could not delete question.");

  }

}
