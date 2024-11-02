let testData;

// Функция для загрузки теста
function loadTest() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Пожалуйста, выберите файл.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            testData = JSON.parse(event.target.result);
            renderTest();
        } catch (e) {
            alert("Ошибка при загрузке файла. Убедитесь, что это корректный JSON.");
        }
    };
    reader.readAsText(file);
}

// Функция для отображения теста на странице
function renderTest() {
    const container = document.getElementById("test-container");
    container.innerHTML = `<h2>${testData.name}</h2>`;
    
    testData.questions.forEach((question, index) => {
        const questionContainer = document.createElement("div");
        questionContainer.className = "question-container";
        questionContainer.innerHTML = `<p>${index + 1}. ${question.question}</p>`;
        
        if (question.type === "single") {
            question.answers.forEach((answer, i) => {
                questionContainer.innerHTML += `
                    <label>
                        <input type="radio" name="question-${index}" value="${i}">
                        ${answer.text}
                    </label><br>
                `;
            });
        } else if (question.type === "multiple") {
            question.answers.forEach((answer, i) => {
                questionContainer.innerHTML += `
                    <label>
                        <input type="checkbox" name="question-${index}" value="${i}">
                        ${answer.text}
                    </label><br>
                `;
            });
        } else if (question.type === "text") {
            questionContainer.innerHTML += `
                <label>Ответ:
                    <input type="text" name="question-${index}">
                </label><br>
            `;
        }
        
        container.appendChild(questionContainer);
    });
    
    document.getElementById("submit-button").style.display = "block";
}

// Функция для расчета результатов
function calculateResults() {
    let correctCount = 0;
    testData.questions.forEach((question, index) => {
        let userCorrect = false;
        
        if (question.type === "single") {
            const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
            if (selectedOption && question.answers[selectedOption.value].correct) {
                userCorrect = true;
            }
        } else if (question.type === "multiple") {
            const selectedOptions = document.querySelectorAll(`input[name="question-${index}"]:checked`);
            const correctOptions = question.answers.filter(a => a.correct);
            userCorrect = Array.from(selectedOptions).every(opt => question.answers[opt.value].correct) && selectedOptions.length === correctOptions.length;
        } else if (question.type === "text") {
            const userAnswer = document.querySelector(`input[name="question-${index}"]`).value.trim();
            if (userAnswer.toLowerCase() === question.correctTextAnswer.toLowerCase()) {
                userCorrect = true;
            }
        }
        
        if (userCorrect) correctCount++;
    });

    const resultContainer = document.getElementById("result");
    resultContainer.innerHTML = `<h3>Ваш результат: ${correctCount} из ${testData.questions.length}</h3>`;
}
