# 🧑‍💼 JobSphere

**JobSphere** is a full-featured job portal enabling seamless interaction between job seekers and employers. It supports role-based access, secure authentication, automated job alerts, and an intuitive interface for posting and applying to jobs.

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-informational)

---

## ✨ Features

- 📝 Register as Job Seeker or Employer
- 🔒 JWT-based authentication
- 🗄️ Role-based access control
- 📧 Automated email notifications
- 📂 File uploads via Cloudinary
- ⚡ Fast REST APIs with Express.js
- 🛠️ Easy setup and local development

---

## 🚀 Installation

**Clone the repository:**
```bash
git clone https://github.com/yourusername/JobSphere.git
cd JobSphere

cd Backend
npm install

cd ../Frontend
npm install
```

## 📦 Dependencies and Why They’re Used

| Package              | Purpose                                                   |
|----------------------|-----------------------------------------------------------|
| **bcrypt**           | Hash passwords securely                                   |
| **bcryptjs**         | Alternate library for password hashing                    |
| **cloudinary**       | Store and manage images on a cloud CDN                    |
| **cookie-parser**    | Parse and handle cookies in requests                      |
| **cors**             | Enable cross-origin requests from frontend to backend     |
| **dotenv**           | Load environment variables from a `.env` file             |
| **express**          | Web framework to build APIs and handle routing            |
| **express-fileupload** | Middleware to handle file uploads                        |
| **job_portal**       | Local dependency containing core portal logic             |
| **jsonwebtoken**     | Generate and validate JSON Web Tokens (JWT)               |
| **mongoose**         | ODM to interact with MongoDB using models and schemas     |
| **multer**           | Middleware to handle multipart/form-data for uploads      |
| **node-cron**        | Schedule and run background tasks (e.g., auto emails)     |
| **nodemailer**       | Send emails such as job alerts or password resets         |
| **validator**        | Validate user inputs like email, password, etc.           |

## 🖼️ Screenshots

Below are key screens of **JobSphere** in action:

1️⃣ **Home Page**  
![Home](https://github.com/rohit08sen/JOB_SPHERE/blob/master/ss/Home.png)

2️⃣ **Alternate Home View**  
![Home1](https://github.com/rohit08sen/JOB_SPHERE/blob/master/ss/Home1.png)

3️⃣ **Login Page**  
![Login](https://github.com/rohit08sen/JOB_SPHERE/blob/master/ss/Login.png)

4️⃣ **Sign Up as Job Seeker**  
![Sign Up as Job Seeker](https://github.com/rohit08sen/JOB_SPHERE/blob/master/ss/signUpAsJobSeeker.png)

5️⃣ **Sign Up as Employee**  
![Sign Up as Employee](https://github.com/rohit08sen/JOB_SPHERE/blob/master/ss/signupAsEmployee.png)

6️⃣ **Jobs Listing**  
![Jobs](https://github.com/rohit08sen/JOB_SPHERE/blob/master/ss/JObs.png)

7️⃣ **Job Posting Page**  
![Job Post](https://github.com/rohit08sen/JOB_SPHERE/blob/master/ss/jobPost.png)

8️⃣ **Apply for Job**  
![Apply Job](https://github.com/rohit08sen/JOB_SPHERE/blob/master/ss/ApplyJob.png)

9️⃣ **Job Seeker Dashboard**  
![Job Seeker Dashboard](https://github.com/rohit08sen/JOB_SPHERE/blob/master/ss/jobseekerDash.png)

🔟 **Employee Dashboard**  
![Employee Dashboard](https://github.com/rohit08sen/JOB_SPHERE/blob/master/ss/EmployeeDashboard.png)

## 📚 Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **File Storage:** Cloudinary
- **Email Service:** Nodemailer

## 🛠️ Environment Variables

Create a `.env` file in your **backend** directory and add the following:

```env
PORT=4000
MONGO_URL=xxx
FRONTEND_URL=http://localhost:5173
ACCESS_TOKEN_SECRET=xxx
ACCESS_TOKEN_EXPIRY=1d
NODE_ENV=development
COOKIE_EXPIRY=1d
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
SMTP_SERVICE=gmail
SMTP_MAIL=xxx@gmail.com
SMTP_PASSWORD=xxx
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
```

## 🌐 Live Demo

Check out the live demo here:

👉 [Live Demo](https://jobsphere-cgg2.onrender.com/)

## 🙌 Contact

Feel free to connect or ask questions:

- **GitHub:** [rohit08sen](https://github.com/rohit08sen)
- **LinkedIn:** [Rohit Senapati](https://www.linkedin.com/in/rohit08sen/)
- **Email:** rohitsenapati543@gmail.com


