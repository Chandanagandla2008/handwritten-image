let selectedMarks = 5;


/* -----------------------------
   MARK SELECTION
----------------------------- */

function selectMarks(marks) {

    selectedMarks = marks;

    document
        .querySelectorAll(".marks button")
        .forEach(button => {
            button.classList.remove("selected");
        });

    document
        .getElementById("mark" + marks)
        .classList.add("selected");
}


/* -----------------------------
   GENERATE
----------------------------- */

function generateAnswer() {

    const question =
        document.getElementById("question")
        .value
        .trim();

    const subject =
        document.getElementById("subject").value;

    const pageCount =
        parseInt(
            document.getElementById("pageCount").value
        );

    const writingStyle =
        document.getElementById("writingStyle").value;

    const inkColor =
        document.getElementById("inkColor").value;

    const addDiagram =
        document.getElementById("addDiagram").checked;


    if (!question) {

        alert("Please enter a question or topic.");

        return;
    }


    /*
       Demo answer.

       Later this function can be connected
       to a real AI backend.
    */

    let answer =
        createAnswer(
            question,
            selectedMarks,
            subject,
            addDiagram
        );


    displayAnswer(
        question,
        answer,
        pageCount,
        writingStyle,
        inkColor
    );
}


/* -----------------------------
   ANSWER GENERATOR
----------------------------- */

function createAnswer(
    question,
    marks,
    subject,
    addDiagram
) {

    let answer = "";


    if (marks === 2) {

        answer =
`Definition:

${question} is an important concept in ${subject}.

It mainly explains the basic idea and purpose of the topic.`;

    }


    else if (marks === 5) {

        answer =
`Introduction:

${question}

${question} is an important topic in ${subject}. It can be understood by studying its basic meaning and important features.

Main Points:

• It explains the fundamental concept clearly.
• It has important characteristics and uses.
• It is useful in practical applications.
• Understanding this topic helps in studying advanced concepts.

Conclusion:

Thus, ${question} is an important concept in ${subject}.`;

    }


    else if (marks === 10) {

        answer =
`Introduction:

${question}

${question} is an important topic in ${subject}. A clear understanding of this concept is useful for both theoretical and practical applications.

1. Basic Concept:

The basic idea of this topic can be understood by studying its definition, principles and important characteristics.

2. Important Points:

• It has several important characteristics.
• It can be studied systematically.
• It is useful in practical applications.
• It helps in understanding related concepts.

3. Explanation:

The topic works according to certain basic principles. These principles help us understand the concept step-by-step.

4. Applications:

It can be applied in different practical situations depending on the subject.

5. Advantages:

• Improves conceptual understanding.
• Useful for solving problems.
• Has practical importance.
• Helps in further learning.

Conclusion:

Therefore, ${question} is an important topic in ${subject} and its basic principles should be understood clearly.`;

    }


    else {

        answer =
`Introduction:

${question}

${question} is a detailed and important topic in ${subject}. A proper understanding of this topic is useful for theoretical knowledge as well as practical applications.

1. Definition and Basic Concept:

The fundamental idea of this topic can be understood by studying its definition, principles and important characteristics.

2. Detailed Explanation:

The concept can be explained systematically by considering its main principles and working process. Each part contributes to understanding the complete topic.

3. Important Features:

• It has several important characteristics.
• It can be studied in a systematic manner.
• It has useful practical applications.
• It helps in understanding advanced concepts.

4. Working / Process:

The topic follows certain principles and steps. Understanding these steps makes the concept easier to remember and apply.

5. Applications:

The concept can be used in different academic and real-world situations.

6. Advantages:

• Improves conceptual understanding.
• Useful for practical applications.
• Helps in solving related problems.
• Provides a strong foundation for advanced topics.

7. Important Points:

The major points should be remembered clearly and presented in a systematic manner in examinations.

Conclusion:

Thus, ${question} is an important topic in ${subject}. Understanding its definition, principles, features and applications helps students write a complete examination answer.`;

    }


    if (addDiagram) {

        answer +=
`

[Simple diagram / flowchart can be added here when an AI backend is connected.]`;

    }


    return answer;
}


/* -----------------------------
   DISPLAY MULTIPLE PAGES
----------------------------- */

function displayAnswer(
    question,
    answer,
    pageCount,
    writingStyle,
    inkColor
) {

    const container =
        document.getElementById("paperContainer");

    const pageInfo =
        document.getElementById("pageInfo");


    container.innerHTML = "";


    pageInfo.textContent =
        `${pageCount} page${pageCount > 1 ? "s" : ""} • ${selectedMarks} marks`;


    /*
       Split answer into words
       and distribute across pages.
    */

    const words =
        answer.split(/\s+/);

    const wordsPerPage =
        Math.ceil(
            words.length / pageCount
        );


    for (let i = 0; i < pageCount; i++) {

        const start =
            i * wordsPerPage;

        const end =
            start + wordsPerPage;

        const pageText =
            words
                .slice(start, end)
                .join(" ");


        const paper =
            document.createElement("div");

        paper.className =
            "paper";


        if (inkColor === "black") {

            paper.classList.add("ink-black");

        }


        paper.innerHTML = `

            <div class="hand-title">
                ${escapeHTML(question)}
            </div>

            <div class="handwriting handwriting-${writingStyle}">
                ${escapeHTML(pageText)}
            </div>

            <div class="page-number">
                Page ${i + 1} of ${pageCount}
            </div>

        `;


        container.appendChild(paper);
    }
}


/* -----------------------------
   SECURITY
----------------------------- */

function escapeHTML(text) {

    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* -----------------------------
   DEFAULT
----------------------------- */

selectMarks(5);
