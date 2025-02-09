# gemini-chat

### it's a chat with (Gemini AI provided by Google LLC) to communicate with user. It's included the back-end and front-end applications in one directory

### Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js and npm (or yarn):**  You can download Node.js from [https://nodejs.org/](https://nodejs.org/).  npm is included with Node.js.  Yarn can be installed separately if you prefer it.
* **Google Cloud Account:** You'll need a Google Cloud account to create a service account and access the Gemini API.

#### Before you will start the setup process make sure that you have npm and node (18.0.0+) installed on your local machine

### Setup Instructions

Follow these steps to configure the back-end application:

1. **Clone the Repository:**

   ```bash
   git clone [https://your-repository-url.git](https://your-repository-url.git)  // Replace with your repository URL
   cd your-project-directory
    ```

2. **Install all monorepo dependencies directly by paths (./front-end/ and ./back-end/) or use below command:**
    ```bash
    npm run install-all
    ```
3. **Open the path `./back-end/` and see the `.env`.Open it and add into the field of `GEMINI_API_KEY` the exact key of GEMINI API**
4. **After all dependencies setup completed you can run locally to whole app by:**
    ```bash
    npm run dev
    ```
5. **For build the app you need to run:**
    ```bash
    npm run build
    ```
   It will create a separated folder named "build" included the front-end and back-end bundle inside


## Technologies Used
* **TypeScript:** Provides static typing, which helps catch errors early and improves code quality.
* **JavaScript:** Used for dynamic behavior and DOM manipulation.
* **React:** A JavaScript library for building user interfaces, chosen for its component-based architecture and efficient rendering.
* **SCSS:** Styling mechanism which is used for simplify implementation of styling. It's an alias for css
* **npm:** Node package manager, used for managing project dependencies.
* **Axios:** A promise-based HTTP client for making API requests, chosen for its simplicity and ease of use compared to the native fetch API.

## Difficult Problems and Solutions
* **Architecture decision makings:** While coding the understanding what architecture could be used is the important decision-making for me. For example axios, react with ts, node.js or express.js, structure and folder complexity
* **Refactoring:** Code refactoring depends on situational changes
* **Conditional use of requestAnimationFrame:** Ensuring requestAnimationFrame is only used when necessary (e.g., when sending a message) required careful refactoring of the code to separate concerns and avoid unnecessary animations. This was solved by creating a separate function for processing text without animation.
* **Spending a lot of time for algorithmic solution for text to html cases** Since it is working fine with all data type (except data-table) because didn't have much time to give a solution 

## Time Spent
Overall, the task took approximately 34 working hours (approximately 2 day/48 hour), which included:
* **3 hours** for initial setup and understanding the existing codebase.
* **4 hours** for implementing and testing the text animation logic.
* **10 hours** for implementing the logic convert of text into HTML.
* **4 hours** building the application on the same environment with correct data
* **5 hours** for implementing all back-end staff included the mongodb connection
* **6 hours** for set up the monorepo and deploy the app into environment
* **1 hour** for replacing fetch with axios and testing API calls.
* **1 hour** for writing documentation and final testing.

# Project TODO List

- Refactor code to improve readability and maintainability.
- More responsible view implementation
- Use consistent naming conventions and improve variable readability.
- Design and implement more complex logic for transforming text into HTML code.
- Optimize the performance of the logic, focusing on minimizing unnecessary computations.
- Enable strict type checking throughout the codebase.
- Implement automated testing to ensure reliability of the refactored and new code.
- Implementing the unit and integration testing for both apps
- Review codebase for possible optimizations or simplifications.

> **Note:** These tasks have not been checked off or implemented yet, as the available time has not been long enough to complete them.
