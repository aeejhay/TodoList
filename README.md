# 📝 Categorized To-Do List Web App

A full-stack web application built with HTML, CSS, and JavaScript, featuring user registration with email verification, login, and categorized to-do lists connected to a MySQL database.

## 🚀 Features

- 🔐 User Registration & Login  
- 📧 Email Verification (via PHPMailer)  
- 🗂️ Add & Manage Categories  
- ✅ Add Tasks to Categories  
- 🕒 Task Due Dates and Completion Status  
- 🗑️ Delete Tasks and Categories  
- 📦 SQL Database Integration  
- 🔐 Secure Password Hashing  
- 📱 Responsive Design  
- 🌙 (Optional) Dark Mode  

## 🧱 Tech Stack

- **Frontend:** HTML, CSS, JavaScript (vanilla)  
- **Backend:** PHP  
- **Database:** MySQL  
- **Email:** PHPMailer (SMTP)

## 📁 Folder Structure

project-root/
│ ├── frontend/ 
│ ├── index.html 
│ ├── dashboard.html 
│ ├── login.html 
│ ├── register.html 
│ └── styles/ 
│ └── main.css 
│ ├── backend/ 
│ ├── login.php 
│ ├── register.php
│ ├── verify_email.php
│ ├── create_task.php
│ ├── create_category.php
│ ├── fetch_tasks.php 
│ └── logout.php
│ ├── config/ 
│ └── db.php 
│ └── README.md

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/todo-list-app.git
   cd todo-list-app

2. Import the database.sql file into your MySQL server.

3. Update database credentials in config/db.php.

4. Set up SMTP in backend/verify_email.php for email verification.

5. Launch the app on your local server (e.g., XAMPP, MAMP, etc.)

✅ Future Improvements
1. Drag-and-drop task reordering

2. Task reminders via email

3. User profile management

4. Tagging system for tasks

5. Mobile app integration (React Native / Flutter)

📬 Contact
Feel free to connect with me:
👤 Adrian J

📧 [iam@adrianjandongan.me]

🌐 https://github.com/aeejhay

“Stay organized, stay productive.”
