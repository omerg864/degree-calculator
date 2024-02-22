# Degree Average Calculator

This Degree Average Calculator is a web application developed using React, Express, and MongoDB. It offers users the ability to calculate their degree average based on their grades for each course. Additionally, it provides features such as simulation for upcoming grades and a summary for every year and semester, as well as an overall summary.

## Features

-   **Grade Calculation:** Users can input their grades for each course and calculate their degree average.
-   **Simulation:** Users can simulate upcoming grades to see how they would affect their overall degree average.
-   **Year and Semester Summary:** The application provides a summary of grades for each year and semester.
-   **Overall Summary:** Users can view an overall summary of their degree progress.

## Technologies Used

-   **React:** Frontend user interface is built using React, providing a dynamic and interactive experience.
-   **Express:** Backend server is built with Express, handling API requests and database operations.
-   **MongoDB:** MongoDB is used as the database to store user grades and degree information.
-   **PWA Support:** The application supports Progressive Web App (PWA).

## Getting Started

1. **Clone the Repository:**

    ```
    git clone https://github.com/omerg864/degree-calculator
    ```

2. **Install Dependencies:**

    ```
    cd degree-calculator
    cd client
    npm install
    cd ..
    cd server
    npm install
    ```

3. **Set Up Environment Variables:**

    - Create a `.env` file in the server directory.
    - Define environment variables such as MongoDB connection URI and any other necessary configurations.

4. **Start the Development Server:**

    ```
    cd client
    npm start
    cd server
    npm start
    ```

5. **Accessing the Application:**
    - Once the server is running, you can access the application at `http://localhost:3000` in your web browser.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature/new-feature`).
6. Create a new Pull Request.
