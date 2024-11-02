let test = {
    name: "",
    questions: []
};

// Функция для добавления нового вопроса
function addQuestion() {
    const questionId = test.questions.length;
    const questionContainer = document.createElement("div");
    questionContainer.className = "question-container";
    questionContainer.innerHTML = `
        <label>Вопрос ${questionId + 1}:</label>
        <input type="text" placeholder="Введите вопрос" class="question-text" data-id="${questionId}">
        
        <label>Тип вопроса:</label>
        <select class="question-type" data-id="${questionId}" onchange="toggleAnswerType(${questionId})">
            <option value="single">Один правильный ответ</option>
            <option value="multiple">Несколько правильных ответов</option>
            <option value="text">Ответ в текстовом поле</option>
        </select>
        
        <div class="answers" data-question-id="${questionId}">
            <label>Ответы:</label>
            <button onclick="addAnswer(${questionId})">Добавить ответ</button>
        </div>
        
        <!-- Контейнер для текстового ответа -->
        <div class="text-answer" data-question-id="${questionId}" style="display: none;">
            <label>Правильный текстовый ответ:</label>
            <input type="text" placeholder="Введите правильный ответ" class="correct-text-answer" data-question-id="${questionId}">
        </div>
    `;
    document.getElementById("test-container").appendChild(questionContainer);

    // Добавляем новый вопрос в массив
    test.questions.push({
        question: "",
        type: "single",
        answers: [],
        correctTextAnswer: ""
    });
}

// Функция для добавления варианта ответа к определенному вопросу
function addAnswer(questionId) {
    const questionType = test.questions[questionId].type;
    
    // Если тип "text", не позволять добавлять варианты ответа
    if (questionType === "text") {
        alert("Для вопросов с текстовым ответом не нужны варианты ответа.");
        return;
    }

    const answerContainer = document.createElement("div");
    answerContainer.className = "answer-container";
    answerContainer.innerHTML = `
        <input type="text" placeholder="Введите ответ" class="answer-text" data-question-id="${questionId}">
        <input type="checkbox" class="answer-correct" data-question-id="${questionId}" onclick="checkSingleAnswer(${questionId}, this)"> Правильный
    `;
    document.querySelectorAll(".question-container")[questionId]
        .querySelector(".answers")
        .appendChild(answerContainer);
}

// Функция для проверки единственного правильного ответа
function checkSingleAnswer(questionId, selectedCheckbox) {
    const questionType = test.questions[questionId].type;
    if (questionType === "single") {
        const checkboxes = document.querySelectorAll(`.answer-correct[data-question-id="${questionId}"]`);
        checkboxes.forEach(checkbox => {
            if (checkbox !== selectedCheckbox) {
                checkbox.checked = false;
            }
        });
    }
}

// Функция для обновления типа вопроса
function toggleAnswerType(questionId) {
    const typeSelect = document.querySelector(`.question-type[data-id="${questionId}"]`);
    const questionType = typeSelect.value;
    test.questions[questionId].type = questionType;

    // Показать/скрыть секции в зависимости от типа вопроса
    const answersContainer = document.querySelector(`.answers[data-question-id="${questionId}"]`);
    const textAnswerContainer = document.querySelector(`.text-answer[data-question-id="${questionId}"]`);

    if (questionType === "text") {
        answersContainer.style.display = "none";
        textAnswerContainer.style.display = "block";
    } else {
        answersContainer.style.display = "block";
        textAnswerContainer.style.display = "none";
    }
}

// Функция для сохранения теста в JSON формате
function saveTest() {
    // Сохранение названия теста
    test.name = document.getElementById("test-name").value;

    // Сбор данных из полей ввода
    document.querySelectorAll(".question-text").forEach(questionInput => {
        const questionId = questionInput.getAttribute("data-id");
        test.questions[questionId].question = questionInput.value;
    });

    document.querySelectorAll(".question-type").forEach(typeSelect => {
        const questionId = typeSelect.getAttribute("data-id");
        test.questions[questionId].type = typeSelect.value;
    });

    document.querySelectorAll(".answer-text").forEach(answerInput => {
        const questionId = answerInput.getAttribute("data-question-id");
        const answerText = answerInput.value;
        const isCorrect = answerInput.nextElementSibling.checked;
        test.questions[questionId].answers.push({
            text: answerText,
            correct: isCorrect
        });
    });

    document.querySelectorAll(".correct-text-answer").forEach(textAnswerInput => {
        const questionId = textAnswerInput.getAttribute("data-question-id");
        test.questions[questionId].correctTextAnswer = textAnswerInput.value;
    });

    // Преобразование теста в JSON формат
    const testJSON = JSON.stringify(test, null, 2);
    console.log("Сохранённый тест:", testJSON);
    
    // Создание файла JSON
    const blob = new Blob([testJSON], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "test.json";
    link.click();
}
