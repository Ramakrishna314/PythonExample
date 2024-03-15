# PythonExample
This repository contains a Python application that implements a simple chatbot using Flask. The chatbot is designed to respond to user input with pre-defined responses based on recognized intents.
## Folder Structure
### static : contains static files used in the application, including `styles.css` and `script.js`.
   ### assets:Contains images used in the application, including `projectimage` and `messagerIcon1`.
### templates: Contains HTML templates used to render web pages, including `index.html`.
### chatbot.py: Contains the Python code for the chatbot application.
### index.html: Another HTML file located at the root level.
## Usage
### Running the chatbot locally
To run the chatbot application locally:
1. Make sure you have python installed in your system.
2. Install the required Python packages by running:
   `pip install flask spacy fuzzywuzzy`.
   `python -m spacy download en_core_web_sm`
   This will install Flask, spaCy, and fuzzywuzzy packages and download the English language model for spaCy.
<p>3.Clone the repository to your local machine:</p>
 `git clone https://github.com/Ramakrishna314/PythonExample.git`.
4.Navigate to the project directory:
  `cd PythonExample`
5.Run the following command to start the Flask server:
   `python chatbot.py`
6.Open a web browser and go to `http://127.0.0.1:5000` to access the chatbot interface.

## Pulling Changes from the Repository.
To pull the latest changes from the repository:
1.Navigate to the directory where you cloned the repository.
2.Run the following command to fetch and merge the latest changes:
 `git pull origin master`

## Features 
1. Greet users with random greetings.
2. Respond to specific questions with pre-defined answers.
3. Recognize user intents based on input.
4. Provide information about courses and admission.


