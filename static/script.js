
document.addEventListener('DOMContentLoaded', function() {
    var chatBox = document.getElementById('chatMessages');
    var userInput = document.getElementById('userMessage');
    var sendButton = document.getElementById('send-button');
    var messengerIcon = document.querySelector('.messenger-icon');
    var chatboxContainer = document.querySelector('.chatbox-container');
    var closeButton = document.querySelector('.close-button');
    var refreshButton = document.querySelector('.refresh-button');
    closeButton.addEventListener('click', closeChatbox);
    function closeChatbox() {
        chatBox.innerHTML = '';
        chatboxContainer.style.display = 'none';
    }
    refreshButton.addEventListener('click', function() {
        chatBox.innerHTML = ''; // Clear chat history
        sendGreetingMessage();
    });
     // Add click event listener to the messengerIcon
     messengerIcon.addEventListener('click', function() {
        // Toggle visibility of the chatbox container
        if (chatboxContainer.style.display === 'none' || !chatboxContainer.style.display) {
            chatboxContainer.style.display = 'block';
            // Focus on the user input box
            userInput.focus();
            sendGreetingMessage();
        } else {
            chatboxContainer.style.display = 'none';
        }
    });

    sendButton.addEventListener('click', sendMessage);

    function sendMessage() {
        var message = userInput.value.trim();
        if (message === '') return;

        displayUserMessage('You: ' + message, 'black');

        fetch('/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => {
            // Check if response is empty
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response from server:', data); // Debugging statement
            if (data && data.response) {
                
                if(data.intent === 'register') {
                    fetchBotResponse('Register');
                }
                else if (data.intent === 'login' ){
                    displayMessage('Bot: '+ data.response, 'black');
                    displaySuboptions(['Student', 'Teacher']);
                }
                else{
                    displayMessage('Bot: ' +data.response, 'black');
                }
              
            } else {
                console.error('Invalid response from server:', data); // Debugging statement
            }
            // Generate greeting response and options
           
            if (data && data.intent === 'greeting'){
                setTimeout(function() {
                    displayOptions();
                },500);
            }
            
        });
        
        userInput.value = '';
    }
    function sendGreetingMessage() {
        fetch('/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: 'greeting' })
        })
        .then(response => {
            // Check if response is empty
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response from server:', data); // Debugging statement
            if (data && data.response) {
                // Display bot's response if it exists
                setTimeout(function() {
                displayMessage('Bot: ' + data.response, 'black');
                 // Generate options
                displayOptions();
            },500);
            } else {
                console.error('Invalid response from server:', data); // Debugging statement
            }
           
        });
    }
    function displayOptions() {
        displayOptionWithSuboptions('Login', ['Student', 'Teacher']);
        displayOption('Register');
        displayOption('FAQs');
        displayOption('ContactUs');
        displayOption('AboutUs');
    }
    
    function displayOptionWithSuboptions(optionText, suboptions) {
        var optionContainer = document.createElement('div');
        optionContainer.classList.add('option-container');
    
        var optionElement = document.createElement('div');
        optionElement.textContent = optionText;
        optionElement.classList.add('option');
    
        optionElement.addEventListener('click', function() {
            // Clear chat box before displaying suboptions
           
            displayUserMessage('You: ' + optionText);
            displayMessage('Bot: Are you a?', 'black');
            displaySuboptions(suboptions);
        });
    
        optionElement.addEventListener('mouseover', function() {
            optionElement.style.backgroundColor = 'orange';
            optionElement.style.color = 'white';
        });
    
        optionElement.addEventListener('mouseout', function() {
            optionElement.style.backgroundColor = 'white';
            optionElement.style.color = 'orange';
        });
    
        optionContainer.appendChild(optionElement);
        chatBox.appendChild(optionContainer);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    function displaySuboptions(suboptions) {
        var suboptionsContainer = document.createElement('div');
        suboptionsContainer.classList.add('suboptions-container');
        
        // Create a container for the suboptions row
        var suboptionsRow = document.createElement('div');
        suboptionsRow.classList.add('suboptions-row');
    
        suboptions.forEach(function(suboption) {
            var suboptionElement = document.createElement('div');
            suboptionElement.textContent = suboption;
            suboptionElement.classList.add('suboption');
            suboptionElement.classList.add('option');
    
            suboptionElement.addEventListener('click', function() {
                displayUserMessage('You: ' + suboption);
                if (suboption.toLowerCase() === 'student') {
                    fetchBotResponse('Student');
                } else if (suboption.toLowerCase() === 'teacher') {
                    fetchBotResponse('Teacher');
                }
            });
    
            suboptionElement.addEventListener('mouseover', function() {
                suboptionElement.style.backgroundColor = 'orange';
                suboptionElement.style.color = 'white';
            });
    
            suboptionElement.addEventListener('mouseout', function() {
                suboptionElement.style.backgroundColor = 'white';
                suboptionElement.style.color = 'orange';
            });
    
            // Append each suboption to the suboptions row
            suboptionsRow.appendChild(suboptionElement);
        });
    
        // Append the suboptions row to the suboptions container
        suboptionsContainer.appendChild(suboptionsRow);
    
        // Append the suboptions container to the chat box
        chatBox.appendChild(suboptionsContainer);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    
    

    function displayMessage(message, color, isBotMessage = true ) {
        var messageElement = document.createElement('p');
        messageElement.textContent = message;
        messageElement.style.color = color;
        if (isBotMessage) {
            messageElement.classList.add('bot-message'); // Add bot message class
        } else {
            messageElement.classList.add('user-message'); // Add user message class
        }
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    function displayUserMessage(message) {
        var messageElement = document.createElement('p');
        messageElement.textContent = message;
        messageElement.classList.add('user-message'); // Add user message class
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    function displayBotMessage(message, showFeedback = true) {
        var botMessageContainer = document.createElement('div');
        var messageElement = document.createElement('p');
        messageElement.innerHTML = message;
        botMessageContainer.appendChild(messageElement);
        messageElement.classList.add('bot-message');
        
        if (showFeedback) {
            // Create feedback options container
            var feedbackContainer = document.createElement('div');
            feedbackContainer.classList.add('feedback-container');
           
        
            // Create feedback message
            var feedbackMessage = document.createElement('p');
            feedbackMessage.textContent = "Was I able to answer your question?";
            feedbackContainer.appendChild(feedbackMessage);
        
            // Create like button
            var likeButton = document.createElement('button');
            likeButton.textContent = "👍";
            likeButton.classList.add('feedback-button');
            likeButton.addEventListener('click', function() {
                displayUserMessage('You: 👍');
                setTimeout(function() {
                    fetchFeedbackResponse('like');
                }, 500);
            });
            feedbackContainer.appendChild(likeButton);
        
            // Create dislike button
            var dislikeButton = document.createElement('button');
            dislikeButton.textContent = "👎";
            dislikeButton.classList.add('feedback-button');
            dislikeButton.addEventListener('click', function() {
                displayUserMessage('You: 👎');
                setTimeout(function() {
                    fetchFeedbackResponse('dislike');
                }, 500);
            });
            feedbackContainer.appendChild(dislikeButton);
        
            // Append feedback options container to the bot message container
            botMessageContainer.appendChild(feedbackContainer);
        }
        
        // Append bot message container to the chat box
        chatBox.appendChild(botMessageContainer);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    
    function displayOption(optionText) {
        var optionContainer = document.createElement('div');
        optionContainer.classList.add('option-container');
    
        var optionElement = document.createElement('div');
        optionElement.textContent = optionText;
        optionElement.classList.add('option');
        
        optionElement.addEventListener('click', function() {
            // Display user message
            displayUserMessage('You: ' + optionText);
            // Fetch bot response
           setTimeout(function() {
            fetchBotResponse(optionText);
           },500);
        });
    
    
        optionElement.addEventListener('mouseover', function() {
            optionElement.style.backgroundColor = 'orange';
            optionElement.style.color = 'white';
        });
    
        optionElement.addEventListener('mouseout', function() {
            optionElement.style.backgroundColor = 'white';
            optionElement.style.color = 'orange';
        });
    
        optionContainer.appendChild(optionElement);
        chatBox.appendChild(optionContainer);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    function fetchBotResponse(optionText) {
        // You can customize this function to fetch appropriate responses based on selected option
        var botResponse = '';
        var loginLink = '';
        var registerLink = '';
        var faqlink = '';
        var contactUsResponse = '';
        var aboutUsLink = '';
        if (optionText.toLowerCase() === 'student') {
            botResponse = "Here is the Login Link of Student: ";
            loginLink = "<a href='https://ymv51yk1e8.execute-api.ap-south-1.amazonaws.com/login'>Student login</a>";
        } else if (optionText.toLowerCase() === 'teacher') {
            botResponse = "Here is the Login Link of Teacher: ";
            loginLink = "<a href='https://ymv51yk1e8.execute-api.ap-south-1.amazonaws.com/teacher'>Teacher login</a>";
        } else if (optionText.toLowerCase() === 'register'){
            botResponse = "Here is the register link of a teacher: ";
            registerLink = "<a href='https://ymv51yk1e8.execute-api.ap-south-1.amazonaws.com/registration'>Teacher Register</a>"
        } else if (optionText.toLowerCase() === 'faqs') {
            botResponse = "Here is the FAQ Link: ";
            faqlink = "<a href='https://atlstage.unisolve.org/faq.html'>FAQs</a>";
        } else if (optionText.toLowerCase() === 'contactus') {
            contactUsResponse = "For admission inquiries, please visit our website or contact our admissions office.";
        } else if (optionText.toLowerCase() === 'aboutus') {
            botResponse = "Click Here to see the video aboutus";
            aboutUsLink = "<a href='https://youtu.be/HufI5CnhkfU'>AboutUs</a>"
        }
        // Display bot response
        displayBotMessage('Bot: ' + botResponse + ' ' + loginLink + ' ' +registerLink + ' ' + faqlink + ' ' + contactUsResponse + ' '+  aboutUsLink , 'black');
       
    
    }
    function fetchFeedbackResponse(feedback) {
        if (feedback === 'like') {
            displayBotMessage('Bot: Thanks for your feedback. Is there anything else that I can help you with?', false);
            displayOptionsAfterFeedback();
        } else if (feedback === 'dislike') {
            displayBotMessage('Bot: I\'m sorry to hear that. Thank you for visiting the chatbot.', false);
        }
    }
    function displayOptionsAfterFeedback() {
        // Display options for "Yes" and "No"
        var optionContainer = document.createElement('div');
        optionContainer.classList.add('option-container');
    
        // Option for "Yes"
        var yesOptionElement = document.createElement('div');
        yesOptionElement.textContent = 'Yes';
        yesOptionElement.classList.add('option');
        yesOptionElement.addEventListener('click', function() {
            displayUserMessage('You: Yes');
            sendGreetingMessage();
        });
        // Add event listener for hover effect
        yesOptionElement.addEventListener('mouseenter', function() {
            yesOptionElement.style.backgroundColor = 'orange';
            yesOptionElement.style.color = 'white';
        });
        // Remove hover effect when mouse leaves
        yesOptionElement.addEventListener('mouseleave', function() {
            yesOptionElement.style.backgroundColor = 'white';
            yesOptionElement.style.color = 'orange';
        });
        optionContainer.appendChild(yesOptionElement);
    
        // Option for "No"
        var noOptionElement = document.createElement('div');
        noOptionElement.textContent = 'No';
        noOptionElement.classList.add('option');
        noOptionElement.addEventListener('click', function() {
            displayUserMessage('You: No');
            setTimeout(function() {
                displayBotMessage('Bot: Thanks for visiting the chatbot. Feel free to ask questions.', false);
            }, 500);
        });
        // Add event listener for hover effect
        noOptionElement.addEventListener('mouseenter', function() {
            noOptionElement.style.backgroundColor = 'orange';
            noOptionElement.style.color = 'white';
        });
        // Remove hover effect when mouse leaves
        noOptionElement.addEventListener('mouseleave', function() {
            noOptionElement.style.backgroundColor = 'white';
            noOptionElement.style.color = 'orange';
        });
        optionContainer.appendChild(noOptionElement);
    
        // Append options container to the chat box
        chatBox.appendChild(optionContainer);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
   
    
});
