// --- ÁREA DE PERSONALIZAÇÃO ---
const questions = [
    {
        question: "Qual destino da nossa primeira viagem juntos?",
        options: ["Ubatuba", "Campos do Jordão", "Rio de Janeiro", "Alagoas"],
        correctAnswer: 0 
    },
    {
        question: "Onde eu te pedi em namoro?",
        options: ["Hotel", "Churrasco de Domingo", "Estação de Trem"],
        correctAnswer: 2
    },
    {
        question: "Qual dessas Hamburgerias fomos juntos?",
        options: ["La Borratxeria", "C6 Burguer", "Charada Burger"],
        correctAnswer: 1
    },
    {
        question: "Qual desses programas de final de semana falamos que iremos fazer novamente?",
        options: ["Parque Ibirapuera", "Cinema", "Teatro", "Andar Patinete"],
        correctAnswer: 3
    },
    {
        question: "Onde foi nosso primeiro beijo?",
        options: ["Cinema", "Parque Vila Lobos", "Shopping Morumbi", "Parque Ibirapuera"],
        correctAnswer: 0
    },
    {
        question: "Para onde foi nossa primeira viagem internacional?",
        options: ["San Andreas", "Bariloche", "Punta Cana", "Cancún"],
        correctAnswer: 3
    }
];

// --- FIM DA ÁREA DE PERSONALIZAÇÃO ---

// Variáveis do Jogo
let currentQuestionIndex = 0;
let currentPrize = 0;
let nextStepFunction = null; // Armazena a próxima ação do jogo

// Elementos do HTML (DOM)
const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const revealScreen = document.getElementById('reveal-screen');
const finalSurpriseScreen = document.getElementById('final-surprise-screen');
const birthdayScreen = document.getElementById('birthday-screen');
const feedbackModal = document.getElementById('feedback-modal');
const questionNumber = document.getElementById('question-number');
const prizeAmount = document.getElementById('prize-amount');
const progressBar = document.getElementById('progress-bar');
const questionText = document.getElementById('question-text');
const answersContainer = document.getElementById('answers-container');
const backgroundMusic = document.getElementById('background-music');
const musicToggle = document.getElementById('music-toggle');

// --- LÓGICA DA MÚSICA ---
musicToggle.addEventListener('click', () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        musicToggle.textContent = '🔊';
        musicToggle.classList.add('playing');
    } else {
        backgroundMusic.pause();
        musicToggle.textContent = '🔇';
        musicToggle.classList.remove('playing');
    }
});


// Inicia o Jogo
function startGame() {
    startScreen.classList.add('hidden');
    questionScreen.classList.remove('hidden');
    backgroundMusic.play().catch(() => {});
    musicToggle.textContent = '🔊';
    musicToggle.classList.add('playing');
    displayQuestion();
}

// Mostra a pergunta atual na tela
function displayQuestion() {
    const questionData = questions[currentQuestionIndex];
    questionScreen.classList.remove('high-stakes');
    
    if (currentQuestionIndex === questions.length - 1) {
        questionScreen.classList.add('high-stakes');
        questionText.innerHTML = "Atenção, Princesa!<br>Se errar essa, o prêmio volta a zero... 😱<br><br>" + questionData.question;
    } else {
        questionText.textContent = questionData.question;
    }

    questionNumber.textContent = `Pergunta ${currentQuestionIndex + 1} de ${questions.length}`;
    answersContainer.innerHTML = '';

    questionData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('answer-btn');
        button.onclick = () => checkAnswer(index, button);
        answersContainer.appendChild(button);
    });
    
    updateProgress();
}

// Verifica a resposta selecionada
function checkAnswer(selectedIndex, clickedButton) {
    const questionData = questions[currentQuestionIndex];
    const allButtons = answersContainer.querySelectorAll('.answer-btn');
    allButtons.forEach(btn => btn.classList.add('disabled'));

    const isCorrect = selectedIndex === questionData.correctAnswer;
    const isFinalQuestion = currentQuestionIndex === questions.length - 1;

    if (isCorrect) {
        clickedButton.classList.add('correct');
        if (!isFinalQuestion) currentPrize += 50;
    } else {
        clickedButton.classList.add('wrong');
        allButtons[questionData.correctAnswer].classList.add('correct');
    }

    updatePrizeDisplay();

    // Define qual será a próxima ação após o feedback
    if (isFinalQuestion) {
        if (isCorrect) {
            nextStepFunction = () => showRevealScreen(true);
        } else {
            nextStepFunction = () => showGameOverAndReveal();
        }
    } else {
        nextStepFunction = () => nextQuestion();
    }
    
    showFeedbackModal(isCorrect, isFinalQuestion);
}

// Mostra o pop-up de feedback
function showFeedbackModal(isCorrect, isFinalQuestion) {
    const modalContent = feedbackModal.querySelector('.modal-content');
    const modalIcon = document.getElementById('modal-icon');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');

    modalContent.className = 'modal-content';

    if (isCorrect) {
        modalContent.classList.add('correct-feedback');
        modalIcon.textContent = '💖';
        modalTitle.textContent = 'Resposta Certa!';
        modalMessage.textContent = isFinalQuestion ? 'UAU! Você acertou a mais difícil!' : 'Você acertou em cheio, princesinha! +R$ 50,00 na sua jornada!';
        launchConfetti(0.25, { spread: 26, startVelocity: 55 });
    } else {
        modalContent.classList.add('incorrect-feedback');
        modalIcon.textContent = '❌';
        modalTitle.textContent = 'Ops... não foi dessa vez.';
        modalMessage.textContent = isFinalQuestion ? 'Ah, que pena! Mas não se preocupe...' : 'Você deixou de ganhar R$ 50,00, mas o importante é continuar!';
    }

    feedbackModal.classList.remove('hidden');

    // Após um tempo, esconde o modal e executa a próxima ação
    setTimeout(() => {
        feedbackModal.classList.add('hidden');
        if (nextStepFunction) {
            nextStepFunction();
        }
    }, 2800);
}

// Avança para a próxima pergunta
function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
}

// Lida com a sequência de "Game Over" para o suspense
function showGameOverAndReveal() {
    questionScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    setTimeout(() => {
        gameOverScreen.classList.add('hidden');
        showRevealScreen(false);
    }, 10000);
}

// Funções de atualização de tela
function updateProgress() {
    const progressPercent = ((currentQuestionIndex) / questions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
}
function updatePrizeDisplay() {
    prizeAmount.textContent = currentPrize.toFixed(2);
}

// Funções para mostrar as telas finais
function showRevealScreen(wasCorrect) {
    revealScreen.classList.remove('hidden');
    launchConfetti();
    
    const subtitle = document.getElementById('reveal-subtitle');
    const title = document.getElementById('reveal-title');
    const message = document.getElementById('reveal-message');

    if (wasCorrect) {
        subtitle.textContent = "VOCÊ CONSEGUIU!";
        title.textContent = "Parabéns, minha princesinha!";
        message.textContent = "Você acertou a pergunta final e provou que conhece cada detalhe da nossa história. Esse prêmio é todo seu!";
    } else {
        subtitle.textContent = "Ah... mas você achou mesmo que...?";
        title.textContent = "BRINCADEIRINHA!";
        message.textContent = "Não existe resposta errada no nosso amor!E claro que foi uma pegadinha kkkkk, Você ganhou TUDO de qualquer jeito, porque você merece o mundo. Esse prêmio é seu!";
    }
}

function showFinalSurprise() {
    revealScreen.classList.add('hidden');
    finalSurpriseScreen.classList.remove('hidden');
}

function showBirthdayMessage() {
    finalSurpriseScreen.classList.add('hidden');
    birthdayScreen.classList.remove('hidden');
}

// Função para disparar os confetes
function launchConfetti(...args) {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });
    myConfetti(...args);
}

// Garante que o prêmio comece em R$ 0.00 na tela
updatePrizeDisplay();