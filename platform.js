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

        const questions = [
            {
                question: "What is blockchain technology primarily used for?",
                choices: ["Decentralized data management", "Gaming", "Social networking"],
                correctChoice: 0
            },
            {
                question: "Which of the following is considered the first decentralized cryptocurrency?",
                choices: ["Ethereum", "Litecoin", "Bitcoin"],
                correctChoice: 2
            },
            {
                question: "What is the primary purpose of EDU Chain?",
                choices: ["Providing decentralized education resources", "Facilitating financial transactions", "Social media networking"],
                correctChoice: 0
            },
            {
                question: "Open Campus Codex is a network designed to support what industry?",
                choices: ["Healthcare", "Education", "Retail"],
                correctChoice: 1
            },
            {
                question: "Which platform is known for organizing global hackathons and supporting Web3 innovation?",
                choices: ["GitHub", "Dorahacks", "Stack Overflow"],
                correctChoice: 1
            },
            {
                question: "Animoca Brands is primarily associated with which sector?",
                choices: ["Automobile industry", "Blockchain gaming and metaverse", "Pharmaceuticals"],
                correctChoice: 1
            },
            {
                question: "ForbesWeb3 is a platform dedicated to covering news and analysis in what area?",
                choices: ["Artificial Intelligence", "Blockchain and Web3", "Cloud Computing"],
                correctChoice: 1
            },
            {
                question: "TinyTap uses blockchain technology for what purpose?",
                choices: ["Creating and monetizing educational content", "Real estate transactions", "Online gaming"],
                correctChoice: 0
            },
            {
                question: "ApeCoin is primarily used for what within its ecosystem?",
                choices: ["Governance and rewards within decentralized applications", "Medical data storage", "Logistics management"],
                correctChoice: 0
            },
            {
                question: "RiseIn is a platform that focuses on what aspect of education?",
                choices: ["Online tutoring", "Immersive learning experiences using VR", "University applications"],
                correctChoice: 1
            },
            {
                question: "NewCampus aims to provide what type of educational experiences?",
                choices: ["Traditional classroom learning", "Immersive learning for working professionals", "Children's online courses"],
                correctChoice: 1
            },
            {
                question: "HackQuest is known for what type of activity?",
                choices: ["Blockchain coding challenges", "Stock trading", "Virtual event hosting"],
                correctChoice: 0
            },
            {
                question: "Which consensus mechanism is most commonly used in the Bitcoin blockchain?",
                choices: ["Proof of Work (PoW)", "Proof of Stake (PoS)", "Delegated Proof of Stake (DPoS)"],
                correctChoice: 0
            },
            {
                question: "What is a smart contract in the context of blockchain technology?",
                choices: ["A legal document", "A self-executing contract with the terms directly written into code", "A cryptocurrency wallet"],
                correctChoice: 1
            },
            {
                question: "Which of the following is a key benefit of using blockchain technology?",
                choices: ["Centralized control", "Transparency and immutability", "Higher transaction fees"],
                correctChoice: 1
            },
            {
                question: "What is ApeCoin's role within the ApeDAO ecosystem?",
                choices: ["Primary utility and governance token", "A decentralized cloud storage system", "A privacy coin for transactions"],
                correctChoice: 0
            },
            {
                question: "Dorahacks is known for hosting hackathons focused on which area?",
                choices: ["Web2 technology", "Web3 and decentralized applications", "Traditional software development"],
                correctChoice: 1
            },
            {
                question: "Animoca Brands has heavily invested in projects related to which emerging technology?",
                choices: ["Quantum computing", "Blockchain and NFTs", "AI and Machine Learning"],
                correctChoice: 1
            },
            {
                question: "Which platform combines traditional education methods with Web3 technologies for professional development?",
                choices: ["TinyTap", "NewCampus", "Open Campus Codex"],
                correctChoice: 1
            },
            {
                question: "What is the primary use case for the EDU token within the EDU Chain ecosystem?",
                choices: ["Governance and voting", "Purchasing educational content", "Staking and rewards"],
                correctChoice: 1
            },
            {
                question: "RiseIn aims to revolutionize education by focusing on which aspect?",
                choices: ["K-12 education", "Immersive learning experiences for adults", "Corporate training programs"],
                correctChoice: 2
            },
            {
                question: "What distinguishes ForbesWeb3 from other blockchain-related media platforms?",
                choices: ["Focus on traditional finance", "Exclusive focus on blockchain and Web3 developments", "General news coverage"],
                correctChoice: 1
            },
            {
                question: "Which blockchain feature ensures that transactions cannot be altered after being confirmed?",
                choices: ["Decentralization", "Immutability", "Scalability"],
                correctChoice: 1
            },
            {
                question: "What is the main function of a cryptocurrency wallet?",
                choices: ["Storing cryptocurrencies", "Mining new coins", "Providing blockchain education"],
                correctChoice: 0
            },
            {
                question: "Which of the following is a key characteristic of decentralized finance (DeFi)?",
                choices: ["Centralized control by banks", "Peer-to-peer financial transactions", "Fixed interest rates"],
                correctChoice: 1
            },
            {
                question: "How does Proof of Stake (PoS) differ from Proof of Work (PoW)?",
                choices: ["PoS requires mining hardware", "PoS uses validators based on stake, not computational power", "PoS is slower than PoW"],
                correctChoice: 1
            },
            {
                question: "Which of the following is an example of a non-fungible token (NFT)?",
                choices: ["Bitcoin", "A digital artwork", "A stablecoin"],
                correctChoice: 1
            },
            {
                question: "In which year was Bitcoin first introduced?",
                choices: ["2008", "2010", "2012"],
                correctChoice: 0
            },
            {
                question: "What is the primary purpose of a blockchain explorer?",
                choices: ["Create new blocks", "View and verify blockchain transactions", "Generate private keys"],
                correctChoice: 1
            },
            {
                question: "What does the term 'gas fee' refer to in the Ethereum network?",
                choices: ["A fee for storing data", "A fee paid to execute transactions and smart contracts", "A fee for creating a new wallet"],
                correctChoice: 1
            },
            {
                question: "Which blockchain network is known for its focus on NFTs and gaming?",
                choices: ["Bitcoin", "Solana", "Ethereum"],
                correctChoice: 2
            },
            {
                question: "TinyTap allows educators to do what with their educational content?",
                choices: ["Donate to schools", "Create, sell, and monetize it using blockchain", "License it for commercial use"],
                correctChoice: 1
            },
            {
                question: "What is a DAO (Decentralized Autonomous Organization)?",
                choices: ["A traditional corporation", "An organization governed by smart contracts on a blockchain", "A centralized financial institution"],
                correctChoice: 1
            },
            {
                question: "Which of the following best describes the term 'staking' in the context of blockchain?",
                choices: ["Locking up cryptocurrency to support network operations", "Using cryptocurrency for daily transactions", "Mining new coins with a GPU"],
                correctChoice: 0
            },
            {
                question: "What role does Dorahacks play in the Web3 ecosystem?",
                choices: ["Providing decentralized finance services", "Organizing hackathons to support Web3 development", "Offering blockchain-based identity solutions"],
                correctChoice: 1
            },
            {
                question: "Animoca Brands has invested in which of the following sectors?",
                choices: ["Blockchain gaming, NFTs, and the metaverse", "Healthcare technology", "Renewable energy"],
                correctChoice: 0
            },
            {
                question: "ForbesWeb3 primarily provides news and analysis on what topic?",
                choices: ["Traditional finance", "Web3, blockchain, and cryptocurrency", "Retail and e-commerce"],
                correctChoice: 1
            },
            {
                question: "NewCampus focuses on which type of educational model?",
                choices: ["Massive Open Online Courses (MOOCs)", "Immersive learning for professionals", "K-12 education"],
                correctChoice: 1
            },
            {
                question: "RiseIn is dedicated to advancing what in the educational sector?",
                choices: ["Online quizzes and tests", "Virtual and augmented reality learning experiences", "Standardized testing"],
                correctChoice: 1
            },
            {
                question: "What is the significance of a 'block' in a blockchain?",
                choices: ["It's the individual unit of data storage in the blockchain", "A block represents a user's profile", "Blocks are used for secure messaging"],
                correctChoice: 0
            },
            {
                question: "ApeCoin is associated with which popular NFT project?",
                choices: ["CryptoKitties", "Bored Ape Yacht Club", "Decentraland"],
                correctChoice: 1
            },
            {
                question: "What is the role of validators in a Proof of Stake (PoS) network?",
                choices: ["To create and verify new blocks", "To provide cloud storage", "To mine cryptocurrency using hardware"],
                correctChoice: 0
            },
            {
                question: "What is the primary benefit of using a decentralized exchange (DEX) over a centralized exchange (CEX)?",
                choices: ["Lower fees", "Greater privacy and control over funds", "Faster transaction times"],
                correctChoice: 1
            },
            {
                question: "Which blockchain network is known for its low transaction fees and fast processing times, making it popular for NFTs and gaming?",
                choices: ["Ethereum", "Solana", "Bitcoin"],
                correctChoice: 1
            },
            {
                question: "In blockchain, what is a '51% attack'?",
                choices: ["An attack where a single miner gains over 50% of the network's mining power", "An attack where more than half of the network nodes are hacked", "A security flaw in blockchain wallets"],
                correctChoice: 0
            },
            {
                question: "Which type of blockchain is typically used by businesses for internal operations and is not open to the public?",
                choices: ["Public blockchain", "Private blockchain", "Hybrid blockchain"],
                correctChoice: 1
            },
            {
                question: "What is the purpose of the ERC-20 standard on the Ethereum blockchain?",
                choices: ["It defines a standard for fungible tokens", "It secures smart contracts", "It supports NFT creation"],
                correctChoice: 0
            },
            {
                question: "Which of the following is an example of a Layer 2 scaling solution?",
                choices: ["Ethereum", "Bitcoin", "Polygon"],
                correctChoice: 2
            },
            {
                question: "What is meant by the term 'burning tokens' in the context of cryptocurrencies?",
                choices: ["Increasing the supply of tokens", "Destroying tokens to reduce supply", "Creating new tokens for distribution"],
                correctChoice: 1
            },
            {
                question: "In blockchain technology, what does 'P2P' stand for?",
                choices: ["Point-to-Point", "Peer-to-Peer", "Pay-to-Pay"],
                correctChoice: 1
            },
            {
                question: "What is a 'hard fork' in the context of blockchain?",
                choices: ["A minor software update", "A significant change that creates a new blockchain", "A consensus mechanism"],
                correctChoice: 2
            },
            {
                question: "Which programming language is most commonly used for writing smart contracts on Ethereum?",
                choices: ["Python", "Solidity", "JavaScript"],
                correctChoice: 1
            },
            {
                question: "What distinguishes a security token from a utility token?",
                choices: ["Security tokens are used for voting", "Utility tokens represent access to a product or service, while security tokens represent an investment", "Security tokens are anonymous"],
                correctChoice: 1
            },
            {
                question: "What is the role of a 'miner' in a blockchain network?",
                choices: ["To validate and confirm transactions", "To store cryptocurrency", "To create new wallets"],
                correctChoice: 0
            },
            {
                question: "Which blockchain is designed specifically for the entertainment industry, providing decentralized content distribution?",
                choices: ["TRON", "Litecoin", "Cardano"],
                correctChoice: 0
            },
            {
                question: "What is the maximum supply of Bitcoin that can ever exist?",
                choices: ["21 million", "50 million", "100 million"],
                correctChoice: 0
            },
            {
                question: "Which protocol is known as the foundational layer for decentralized finance (DeFi) applications?",
                choices: ["Bitcoin", "Ethereum", "Ripple"],
                correctChoice: 1
            },
            {
                question: "What is a 'hot wallet' in the context of cryptocurrency?",
                choices: ["A wallet that is connected to the internet", "A cold storage solution", "A wallet used for staking"],
                correctChoice: 0
            },
            {
                question: "What is the primary advantage of using a smart contract?",
                choices: ["Automatic execution of agreements without intermediaries", "Lower transaction costs", "Improved data storage"],
                correctChoice: 0
            },
            {
                question: "What does 'staking' typically involve in a Proof of Stake (PoS) blockchain?",
                choices: ["Locking up tokens to support network security and earn rewards", "Buying more cryptocurrency", "Burning tokens"],
                correctChoice: 0
            },
            {
                question: "What is an Initial Coin Offering (ICO)?",
                choices: ["A fundraising method where new cryptocurrencies are sold to investors", "A method for mining coins", "A system for creating NFTs"],
                correctChoice: 0
            },
            {
                question: "Which term refers to the ability of a blockchain to handle a growing amount of work or transactions?",
                choices: ["Security", "Scalability", "Interoperability"],
                correctChoice: 1
            },
            {
                question: "Which of the following is a popular decentralized file storage network?",
                choices: ["IPFS", "HTTP", "SMTP"],
                correctChoice: 0
            },
            {
                question: "Which platform provides blockchain-based education content creation and distribution?",
                choices: ["TinyTap", "NewCampus", "RiseIn"],
                correctChoice: 0
            },
            {
                question: "Which blockchain consensus mechanism is known for being more energy-efficient than Proof of Work (PoW)?",
                choices: ["Proof of Stake (PoS)", "Proof of Burn (PoB)", "Proof of History (PoH)"],
                correctChoice: 0
            },
            {
                question: "What does the term 'DAO' stand for?",
                choices: ["Decentralized Autonomous Organization", "Digital Asset Organization", "Distributed Application Operation"],
                correctChoice: 0
            },
            {
                question: "Which of the following is an example of a privacy coin?",
                choices: ["Monero", "Bitcoin", "Litecoin"],
                correctChoice: 0
            },
            {
                question: "What is the purpose of a blockchain explorer?",
                choices: ["To monitor network performance", "To search and view blockchain transaction data", "To mine cryptocurrencies"],
                correctChoice: 1
            },
            {
                question: "Which cryptocurrency is known for having a focus on smart contracts and decentralized applications?",
                choices: ["Bitcoin", "Ethereum", "Ripple"],
                correctChoice: 1
            },
            {
                question: "Which of the following describes 'block time'?",
                choices: ["The time it takes to generate a new block", "The time required to confirm a transaction", "The time taken to mine a cryptocurrency"],
                correctChoice: 0
            },
            {
                question: "Which of the following platforms is best known for its hackathons focusing on blockchain and Web3 innovation?",
                choices: ["Dorahacks", "GitHub", "Reddit"],
                correctChoice: 0
            },
            {
                question: "What is a 'cold wallet'?",
                choices: ["A cryptocurrency wallet that is stored offline for increased security", "A wallet used for daily transactions", "A wallet that automatically invests in tokens"],
                correctChoice: 0
            }
        ];

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

            setTimeout(() => {
                reportButton.style.backgroundColor = "black";
                checkMark.style.visibility = "hidden";
                checkMark.style.opacity = 0;
                checkMark.style.transform = "scale(0.8)";
            }, 2000);
        }