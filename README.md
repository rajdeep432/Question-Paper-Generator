# Question-Paper-Generator
Question Paper Generator
**Instructions to Run the Question Paper Generator Application**

1. **Install Dependencies**:
   - Make sure you have Node.js installed on your system.
   - Open a terminal in the directory where your script is located.
   - Run the following command to install required packages:
     ```
     npm install express express-validator i18n
     ```

2. **Run the Server**:
   - Execute your script to start the server.
   - If your script is named `app.js`, run:
     ```
     node app.js
     ```
   - The server will start on http://localhost:3000.

3. **Test the API Endpoint**:
   - Use an API testing tool like Postman or `curl`.
   - Send a POST request to http://localhost:3000/generate-question-paper.
   - Include the required parameters in the request body (e.g., `totalMarks` and `difficultyDistribution`).
     Example Request (using curl):
     ```
     curl -X POST -H "Content-Type: application/json" -d '{"totalMarks": 100, "difficultyDistribution": {"Easy": 20, "Medium": 50, "Hard": 30}}' http://localhost:3000/generate-question-paper
     ```
   - Adjust the request parameters based on your needs.

4. **Review the Output**:
   - The server will respond with a JSON object containing the generated question paper.
   - Check the console logs for any additional information.

5. **Shutdown the Server**:
   - When done testing, stop the server by pressing `Ctrl+C` in the terminal where the server is running.

Note: This is a basic setup. For production, consider using process managers, setting up a reverse proxy, and deploying behind a web server like Nginx or Apache.
