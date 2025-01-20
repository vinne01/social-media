# Social Media Application

This is a simple social media platform built using **Node.js**, **Express.js**, and **EJS**. It allows users to register, log in, create posts with images, and interact with other users through likes. The application provides a basic but functional social networking experience, where users can share content and engage with each other.

-![ **APNASOCIALMEDIA:**](https://ik.imagekit.io/vinaymry/Screenshot%202025-01-20%20163619.png?updatedAt=1737371246192)
## Features

-![ **User Registration:**](https://ik.imagekit.io/vinaymry/Screenshot%202025-01-20%20161030.png?updatedAt=1737370337336)
-![**User Login :**](https://ik.imagekit.io/vinaymry/Screenshot%202025-01-20%20160626.png?updatedAt=1737370339069)
  - New users can sign up by providing a unique **username**, **email address**, and **password**.
  - Registered users can log in using their **email** and **password**.

  -![**Post Creation:**](https://ik.imagekit.io/vinaymry/Screenshot%202025-01-20%20161123.png?updatedAt=1737370339075)
  - Users can create posts with text and upload images from their devices.
  - Posts are stored in the database and linked to the user's profile.

-![ **Interacting with Posts:**](https://ik.imagekit.io/vinaymry/Screenshot%202025-01-20%20160952.png?updatedAt=1737370338546)
  - Users can like posts made by others. This allows users to engage with the content they find interesting.
  - Users can view posts created by others and their own posts on their profile page.

-![  **User Profile:**](https://ik.imagekit.io/vinaymry/Screenshot%202025-01-20%20160927.png?updatedAt=1737370337986)
  - Each user has a profile page displaying their posts and the total number of likes on each post.
  - Clicking on a username will redirect to that user's profile to view their posts.

-![ **Dynamic User Interface:**](https://ik.imagekit.io/vinaymry/Screenshot%202025-01-20%20161123.png?updatedAt=1737370339075)
  - The application uses **EJS** templates to render dynamic content such as posts, images, and usernames.

## Technologies Used

- **Node.js:** For the server-side environment.
- **Express.js:** To build the web server and handle HTTP routes.
- **EJS:** For rendering dynamic HTML pages.
- **MongoDB** (or another database): For storing user data, posts, and likes.
- **Multer** (or another file upload package): To handle image uploads.
- **Cloudinary** (optional): For storing images and providing URL-based access.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/social-media-app.git
    ```

2. Navigate to the project directory:
    ```bash
    cd social-media-app
    ```

3. Install the required dependencies:
    ```bash
    npm install
    ```

4. Create a `.env` file and add your environment variables (for example, database connection string, secret key, etc.).

5. Run the application:
    ```bash
    npm start
    ```

Your application should now be running on `http://localhost:3000`.

## File Upload Handling

For handling file uploads (such as images), we use **Multer** for server-side file handling, and you can upload images to a storage service like **Cloudinary** for easier access via URLs.

### Example Code to Handle Image Uploads

1. **Install Multer and Cloudinary (optional):**
    ```bash
    npm install multer cloudinary
    ```

2. **Set up Multer for image uploads:**
    ```javascript
    const multer = require('multer');
    const path = require('path');

    // Configure multer storage settings
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/'); // Save uploaded images to 'uploads' folder
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname)); // Add a unique filename
        }
    });

    // Create multer upload middleware
    const upload = multer({ storage: storage });

    // Example route for uploading an image
    app.post('/upload', upload.single('image'), (req, res) => {
        if (req.file) {
            // Image successfully uploaded
            res.send({ imageUrl: '/uploads/' + req.file.filename });
        } else {
            res.status(400).send('No image uploaded.');
        }
    });
    ```

3. **Display Images Using URL (in EJS Templates):**
    - After uploading an image, you can store the URL (e.g., `imageUrl`) in your database and use it to render images dynamically.

    ```html
    <!-- In your EJS template (for posts display) -->
    <div class="post">
        <p>{{post.text}}</p>
        <img src="{{post.imageUrl}}" alt="Post Image">
    </div>
    ```

4. **Using Cloudinary for Image Upload (Optional):**
    - If you're using Cloudinary to store images and access them via URLs, you can configure Cloudinary as follows:

    ```javascript
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
        cloud_name: 'your_cloud_name',
        api_key: 'your_api_key',
        api_secret: 'your_api_secret'
    });

    app.post('/upload', upload.single('image'), (req, res) => {
        cloudinary.uploader.upload(req.file.path, (error, result) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.send({ imageUrl: result.secure_url }); // Cloudinary image URL
            }
        });
    });
    ```

    - In your EJS template, render the image as:

    ```html
    <div class="post">
        <p>{{post.text}}</p>
        <img src="{{post.imageUrl}}" alt="Post Image">
    </div>
    ```

## Future Improvements

- **Comments System:** Add a comment feature for users to engage with posts.
- **Real-time Notifications:** Notify users when they receive likes or comments on their posts.
- **Password Hashing:** Implement bcrypt or another method for securely hashing user passwords.
- **User Authentication:** Add user sessions and JWT-based authentication for added security.

---

This is a general structure to help you get started, and you can adjust the details as per your requirements.

