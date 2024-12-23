# Full Stack application with React and Django

This is a full stack student ERP system with React and Django. The frontend is built with React and the backend is built with Django. The frontend communicates with the backend via RESTful API.
# Installation

## Backend

1. Create a virtual environment

```bash
python3 -m venv venv
```

2. Activate the virtual environment based on your operating system

```bash
source venv/bin/activate # Linux
venv\Scripts\activate # Windows
```

3. Install the dependencies

```bash
cd backend
pip install -r requirements.txt
```

4. Run the Django server

```bash
python manage.py runserver
```

## Frontend
In a separate terminal, run the following commands:

1. Ensure you have Node.js installed. If not, you can download it from [here](https://nodejs.org/en/download/)

2. Install the dependencies

```bash 
cd frontend
npm install
```

3. Run the React server

```bash
npm start
```

# Features

- User authentication
- Create, Read, Delete operations for students
- Read, Update, Delete operations for courses
- Students can enroll and unenroll in courses

# Flows
1. Admin
- Login: I have created a superuser with the following credentials:
    - Username: saras
    - Password: sahil21091
- Once you login, you will be redirected to the admin dashboard where you can see the list of student enrollments.
- You can update their grades

2. Student
- Login: I have created a student with the following credentials:
    - Username: lihas
    - Password: password123
- Once you login, you will be redirected to the student dashboard where you can see the list of courses you are enrolled in, and the ones you can enroll in.
- You can drop ungraded courses and enroll in new courses.

For any queries, please reach out to me at
- Email: saraswatsahil09@gmail.com
- Phone: +91 93545 65119