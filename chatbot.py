from flask import Flask, render_template, request,send_from_directory, jsonify
import spacy
import random
from fuzzywuzzy import fuzz
import string

app = Flask(__name__, static_url_path='/static', static_folder='static')
nlp = spacy.load("en_core_web_sm") 

# Greeting patterns
greeting_patterns = ["hello", "hi", "hii", "hey", "howdy"]

# Define responses for greetings
greeting_responses = [
    
    "Hello there! How can I help you today?",
    "Hi! Nice to meet you. What can I do for you?",
    "Hey! How can I assist you?",
    "Welcome to the chatbot! I'm here to assist you."
]

# Define a list of questions and their corresponding answers
question_answers = {
    "Who can participate in the ATL Marathon?": "Students from both ATL and Non-ATL schools are eligible to participate. Non-ATL schools can collaborate with ATL schools to form teams."
}

# Function to answer questions based on pre-defined answers
def answer_question(question):
    # Process the question using spaCy
    question_doc = nlp(question)
    
    # Initialize variables to store the best match and its similarity score
    best_match = None
    best_similarity = 0
    
    # Iterate over the predefined questions and find the best match
    for key_question, answer in question_answers.items():
        similarity = fuzz.partial_ratio(question.lower(), key_question.lower())
        if similarity > best_similarity:
            best_similarity = similarity
            best_match = answer
            
     # If a match with sufficient similarity is found, return the corresponding answer
    if best_similarity > 80:  # Adjust the similarity threshold as needed
        return best_match        
    
    # If no matching question is found, return a default response
    return "I'm sorry, I don't have an answer to that question."

# Example usage
question = "Who can participate in the ATL Marathon?"
answer = answer_question(question)
print(answer)

# Options for the "Course" intent
course_info_responses = [
    "Our institution offers a variety of courses. What specific information do you need?",
    "We have a wide range of courses available. Could you please specify what you're interested in?"
]
# Options for the "Admission" intent
admission_info_response = "For admission inquiries, please visit our website or contact our admissions office."

# Function to recognize the intent of the user input
def recognize_intent(user_input):
     # Remove punctuation from the user input
    user_input_cleaned = user_input.translate(str.maketrans('', '', string.punctuation))
    doc = nlp(user_input.lower())
    
    # Check if the user input contains a greeting
    for token in doc:
        if token.text in greeting_patterns:
            return "greeting"
    
    # Check if the user input indicates a login intent
    if any(token.text.lower() == "login" for token in doc):
        return "login"
    # Check if the user input indicates a specific role for login
    if any(token.text.lower() == "student" for token in doc):
        return "student_login"
    if any(token.text.lower() == "teacher" for token in doc):
        return "teacher_login"
    
    if any(token.text.lower() == "register" for token in doc):
        return "register"
    
    # Check if the user input indicates a request for course information
    if any(token.text.lower() in ("courses", "program") for token in doc):
        return "course_info"
    
    # Check if the user input indicates a request for admission information
    if any(token.text.lower() in ("admission", "apply", "requirements", "contactus") for token in doc):
        return "admission_info"
    
    if '?' in user_input:
        return "question"
    
    # Default intent
    return "unknown"

# Function to generate response based on recognized intent
def generate_response(intent, user_input):
    if intent == "greeting":
        return random.choice(greeting_responses), intent
    
    if intent == "login":
         return "Are you a ?", intent
        # Check if the user input indicates a specific role for login
        
     
    
    if intent == "course_info":
        return random.choice(course_info_responses),intent
    
    if intent == "admission_info":
        return admission_info_response, intent
    
    # If the intent is unknown
    return "I'm sorry, I didn't understand that. Can you please rephrase your word?", intent

# Routes
@app.route('/favicon.ico')
def favicon():
    return '', 404

def index():
    return send_from_directory('.', 'index.html')


@app.route('/send-message', methods=['POST'])
def send_message():
    if request.method == 'POST':
        data = request.json
        user_input = data['message']
        
        
        if user_input.lower() == 'greeting':
            response = random.choice(greeting_responses)
            intent = 'greeting'
        else:
            intent = recognize_intent(user_input)
            if intent == "question":
                response = answer_question(user_input)
            else:
                response, _ = generate_response(intent, user_input)

         
        return jsonify({'response': response, 'intent' : intent})
    
    return jsonify({'error': 'Method Not Allowed'}), 405

if __name__ == "__main__":
     app.run(host='3.26.190.181', port=5000)
@app.route('/tawkto-webhook', methods=['POST'])
def tawkto_webhook():
    if request.method == 'POST':
        data = request.json
        # Handle Tawk.to webhook event
        # You can access data like sender, message, etc. from the request payload
        # Process the received message and generate a response
        response = process_message(data['message'])
        # Send the response back to Tawk.to
        return jsonify({'response': response})
    return jsonify({'error': 'Method Not Allowed'}), 405

def process_message(message):
    # Process the message and generate a response
    # You can use your existing chatbot logic here
    return "Response from chatbot"
