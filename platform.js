const targetAddress = '0x51cbC462C24616EE85b43A657B304166dE0Dc7cC';
        const eduAmount = 0.005;
        let userAddress = null;
        let intervalId = null;
        let timerInterval = null;

        const paymentButton = document.getElementById('paymentButton');
        const startQuizButton = document.getElementById('startQuizButton');
        const quizContainer = document.querySelector(".quiz-container");

        const networkData = {
            chainId: '0xa03bc', // 656476 in hexadecimal
            chainName: 'Open Campus Codex Sepolia',
            rpcUrls: ['https://open-campus-codex-sepolia.drpc.org'],
            nativeCurrency: {
                name: 'EDU',
                symbol: 'EDU', // 2-6 characters long
                decimals: 18,
            },
            blockExplorerUrls: ['https://opencampus-codex.blockscout.com'],
        };

        document.getElementById('addNetworkButton').addEventListener('click', async () => {
            try {
                await ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [networkData],
                });
                console.log('Network added successfully');
            } catch (error) {
                console.error('Failed to add the network', error);
            }
        });

        document.getElementById('connectWalletButton').addEventListener('click', async () => {
            try {
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                userAddress = accounts[0];
                console.log('Wallet connected:', userAddress);
            } catch (error) {
                console.error('Failed to connect wallet', error);
            }
        });

        paymentButton.addEventListener('click', startTransaction);

        async function startTransaction() {
            try {
                if (!userAddress) {
                    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                    userAddress = accounts[0];
                }

                const transactionParameters = {
                    to: targetAddress,
                    from: userAddress,
                    value: (parseInt(eduAmount * 1e18)).toString(16)
                };

                const txHash = await ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [transactionParameters],
                });

                console.log('Transaction sent:', txHash);
                intervalId = setInterval(checkTransactionStatus, 3000);
            } catch (error) {
                console.error('Transaction failed:', error);
            }
        }

        async function checkTransactionStatus() {
            const baseUrl = 'https://opencampus-codex.blockscout.com/api?';
            const apiParams = `module=account&action=txlist&address=${targetAddress}&sort=desc&page=1&offset=10`;

            try {
                const response = await fetch(`${baseUrl}${apiParams}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const transactions = data.result;

                const fiveMinutesAgo = Date.now() - 60000;
                const filteredTx = transactions.filter(tx =>
                    tx.from.toLowerCase() === userAddress.toLowerCase() &&
                    parseInt(tx.value) >= eduAmount * 1e18 &&
                    tx.timeStamp * 1000 >= fiveMinutesAgo
                );

                if (filteredTx.length > 0) {
                    alert("Payment received successfully. You can now start the quiz.");
                    startQuizButton.disabled = false;
                    clearInterval(intervalId);
                }
            } catch (error) {
                console.error('Failed to fetch transactions:', error);
            }
        }

        startQuizButton.addEventListener('click', () => {
            startQuizButton.style.display = 'none';
            paymentButton.style.display = 'none';
            addNetworkButton.style.display = 'none';
            connectWalletButton.style.display = 'none';
            quizContainer.style.display = 'block';
            showQuestion(currentQuestion);
        });

        let questions = [];

        async function fetchQuestionsFromOracle() {
            try {
                const response = await fetch('https://oracle-database-api.url.com/get-questions', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer d7f8e3b9-4a21-48c2-9274-c1f9bfe65789'
                    }
                });

                if (response.ok) {
                    questions = await response.json();
                    console.log('Questions fetched from Oracle:', questions);
                } else {
                    throw new Error(`Failed to fetch questions: ${response.status}`);
                }
            } catch (error) {
                console.error('Error fetching questions from Oracle:', error);
            }
        }

        fetchQuestionsFromOracle();

        let currentQuestion = 0;
        let score = 0;

        const questionNumberElement = document.getElementById("question-number");
        const questionTextElement = document.getElementById("question-text");
        const choicesElement = document.getElementById("choices");
        const scoreElement = document.getElementById("score");
        const timerElement = document.getElementById("timer");

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        // Shuffle the array and select 20 random questions
        function selectRandomQuestions(array, numQuestions) {
            const shuffled = array.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, numQuestions);
        }

        const selectedQuestions = selectRandomQuestions(questions, 20);

        function showQuestion(questionIndex) {
            const question = selectedQuestions[questionIndex];
            questionNumberElement.textContent = `Question ${questionIndex + 1}`;
            questionTextElement.textContent = question.question;

            choicesElement.innerHTML = "";
            for (let i = 0; i < question.choices.length; i++) {
                const choiceButton = document.createElement("button");
                choiceButton.className = "choice";
                choiceButton.textContent = question.choices[i];
                choiceButton.onclick = () => {
                    clearInterval(timerInterval);
                    checkAnswer(i);
                };
                choicesElement.appendChild(choiceButton);
            }

            quizContainer.style.opacity = 1;
            quizContainer.style.backgroundColor = "#f9f9f9";
            startTimer(); // Start the timer when the question is shown
        }

        function startTimer() {
            let timeLeft = 20;
            timerElement.textContent = `Time Left: ${timeLeft}s`;
            timerInterval = setInterval(() => {
                timeLeft--;
                timerElement.textContent = `Time Left: ${timeLeft}s`;
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    moveToNextQuestion();
                }
            }, 1000);
        }

        function moveToNextQuestion() {
            currentQuestion++;
            if (currentQuestion < selectedQuestions.length) {
                showQuestion(currentQuestion);
            } else {
                showEndMessage();
            }
        }

        function showEndMessage() {
            quizContainer.innerHTML = `
                <p>Your final score: ${score}/20</p>
                <p>Your score has been stored</p>
                <p>via 0xf39************************************DB</p>
                <p>Your address: ${userAddress}</p>
            `;
            quizContainer.style.opacity = 1;
            quizContainer.style.backgroundColor = "#f9f9f9";
        }

        function checkAnswer(choiceIndex) {
            const question = questions[currentQuestion];
            const choiceButtons = choicesElement.querySelectorAll(".choice");
            choiceButtons.forEach(button => {
                button.disabled = true;
            });

            if (choiceIndex === question.correctChoice) {
                score++;
                scoreElement.textContent = `Score: ${score}`;
                choiceButtons[choiceIndex].style.backgroundColor = "green";
            } else {
                choiceButtons[choiceIndex].style.backgroundColor = "red";
                choiceButtons[question.correctChoice].style.backgroundColor = "green";
            }

            setTimeout(() => {
                quizContainer.style.opacity = 0.7;
                quizContainer.style.backgroundColor = "rgba(249, 249, 249, 0.7)";
                setTimeout(moveToNextQuestion, 1000);
            }, 50);
        }

        function reportQuestion() {
            const reportButton = document.querySelector(".report-button");
            const checkMark = document.getElementById("check-mark");
        
            reportButton.style.backgroundColor = "red";
            checkMark.style.visibility = "visible";
            checkMark.style.opacity = 1;
            checkMark.style.transform = "scale(1)";
        
            sendReportToOracle(currentQuestion);
        
            setTimeout(() => {
                reportButton.style.backgroundColor = "black";
                checkMark.style.visibility = "hidden";
                checkMark.style.opacity = 0;
                checkMark.style.transform = "scale(0.8)";
            }, 2000);
        }
        
        async function sendReportToOracle(questionIndex) {
            try {
                const reportedQuestion = questions[questionIndex];
                const response = await fetch('https://oracle-database-api.url.com/report-question', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer d7f8e3b9-4a21-48c2-9274-c1f9bfe65789'
                    },
                    body: JSON.stringify({
                        question: reportedQuestion,
                        reason: 'User reported a problem with this question.'
                    })
                });
        
                if (response.ok) {
                    console.log('Report successfully sent to Oracle.');
                } else {
                    throw new Error(`Failed to send report: ${response.status}`);
                }
            } catch (error) {
                console.error('Error reporting question to Oracle:', error);
            }
        }