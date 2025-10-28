# Flixify Backend

A robust, production-ready backend for a video hosting platform similar to YouTube. Built with modern web technologies and following industry best practices for authentication, file handling, and API design.

## Features

- **User Authentication**: JWT-based authentication with access/refresh tokens
- **Comprehensive Input Validation**: Email format, password strength, username format validation with sanitization
- **Video Management**: Upload, stream, update, and delete videos with Cloudinary integration
- **Social Features**: Comments, likes, subscriptions, and playlists
- **Tweet System**: Twitter-like functionality for user engagement
- **Dashboard Analytics**: Channel statistics and video management
- **File Upload**: Secure file handling with Multer middleware
- **Security**: Password hashing with bcrypt, CORS protection, XSS prevention, SQL injection protection
- **Database**: MongoDB with Mongoose ODM and aggregation pipelines

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Security**: bcrypt for password hashing
- **File Upload**: Multer
- **Validation**: express-validator for input validation and sanitization
- **Development**: Nodemon for hot reloading

## Project Structure

```
src/
├── controllers/     # Route handlers and business logic
├── models/         # MongoDB schemas and models
├── routes/         # API route definitions
├── middleware/     # Authentication and file upload middleware
├── utils/          # Helper functions and utilities
└── db/            # Database connection configuration
```




## API Reference

#### For Users

#### Base URL: `/api/v1/users`

| Endpoint               | Method | Description                                |
| :--------------------- | :----- | :----------------------------------------- |
| `/register`            | `POST` | Registers a new user.                      |
| `/login`               | `POST` | Logs in a user.                            |
| `/logout`              | `POST` | Logs out a user.                           |
| `/change-password`     | `POST` | Changes the password for the user.         |
| `/refresh-token`       | `POST` | Generates a new refresh token for the user.|
| `/current-user`        | `GET`  | Gets the current user.                     |
| `/watch-history`       | `GET`  | Gets the watch history of the current user.|
| `/channel/:username`   | `GET`  | Returns the user's channel profile.        |
| `/avatar`              | `PATCH`| Updates the avatar of the user.            |
| `/cover-image`         | `PATCH`| Updates the cover image of the user.       |
| `/update-account-details` | `PATCH`| Updates the account details of the user.   |


### For Videos

#### Base URL: `/api/v1/videos`

| Endpoint                           | Method   | Description                                       |
| :--------------------------------- | :------- | :------------------------------------------------ |
| `/publish-video`                   | `POST`   | Uploads a new video.                             |
| `/update-video/:videoId`           | `POST`   | Updates video details (title, description, and thumbnail) for the specified video ID. |
| `/toggle-publish-status/:videoId`  | `POST`   | Toggles the publish status of a video.           |
| `/get-all-videos`                  | `GET`    | Fetches all videos of the user.                  |
| `/:videoId`                        | `GET`    | Fetches the video by video ID.                   |
| `/delete-video/:videoId`           | `DELETE` | Deletes the video specified by the video ID.     |


### For Tweets

#### Base URL: `/api/v1/tweets`

| Endpoint              | Method   | Description                            |
| :-------------------- | :------- | :------------------------------------- |
| `/`                   | `POST`   | Creates a new tweet.                   |
| `/user/:userId`       | `GET`    | Retrieves tweets for a specific user. |
| `/:tweetId`           | `GET`    | Retrieves the tweet by tweet ID.       |
| `/:tweetId`           | `DELETE` | Deletes the tweet specified by the tweet ID. |


#### Base URL: `/api/v1/playlist`

| Endpoint                          | Method   | Description                                          |
| :-------------------------------- | :------- | :--------------------------------------------------- |
| `/:playlistId`                    | `GET`    | Fetches the playlist by playlist ID.                 |
| `/:playlistId`                    | `PATCH`  | Updates the playlist specified by the playlist ID.   |
| `/:playlistId`                    | `DELETE` | Deletes the playlist specified by the playlist ID.   |
| `/add/:videoId/:playlistId`       | `PATCH`  | Adds a video to the playlist specified by video ID and playlist ID. |
| `/remove/:videoId/:playlistId`    | `PATCH`  | Removes a video from the playlist specified by video ID and playlist ID. |
| `/user/:userId`                   | `GET`    | Retrieves playlists for a specific user.             |


#### Base URL: `/api/v1/comments`

| Endpoint              | Method   | Description                              |
| :-------------------- | :------- | :--------------------------------------- |
| `/:videoId`           | `GET`    | Retrieves comments for a specific video. |
| `/:videoId`           | `POST`   | Comments on a specific video.            |
| `/c/:commentId`       | `PATCH`  | Updates a comment specified by the comment ID. |
| `/c/:commentId`       | `DELETE` | Deletes a comment specified by the comment ID. |


#### Base URL: `/api/v1/likes`

| Endpoint                        | Method | Description                                          |
| :------------------------------ | :----- | :--------------------------------------------------- |
| `/toggle/v/:videoId`            | `POST` | Toggles the like status for a specific video.       |
| `/toggle/c/:commentId`          | `POST` | Toggles the like status for a specific comment.     |
| `/toggle/t/:tweetId`            | `POST` | Toggles the like status for a specific tweet.       |
| `/videos`                       | `GET`  | Retrieves the liked videos of the logged-in user.   |


#### Base URL: `/api/v1/subscriptions`

| Endpoint                  | Method | Description                                            |
| :------------------------ | :----- | :----------------------------------------------------- |
| `/c/:channelId`           | `GET`  | Retrieves subscribers for a specific channel.         |
| `/c/:channelId`           | `POST` | Toggles subscription status for a specific channel.   |
| `/u/:subscriberId`        | `GET`  | Retrieves subscribed channels for a specific user.    |


#### Base URL: `/api/v1/dashboard`

| Endpoint      | Method | Description                                |
| :------------ | :----- | :----------------------------------------- |
| `/stats`      | `GET`  | Retrieves channel statistics (logged in). |
| `/videos`     | `GET`  | Retrieves channel videos (logged in).     |


## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account for file storage

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AdityaKrSingh26/Flixify-Backend.git
   cd Flixify-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   CORS_ORIGIN=*
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d
   
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the development server**
   ```bash
   npm run server:dev
   ```

5. **For production**
   ```bash
   npm start
   ```

The server will start on `http://localhost:8000`

## Input Validation & Security

### User Registration Validation
- **Email**: Valid format, max 100 characters, normalized
- **Password**: 8-128 characters, must contain uppercase, lowercase, number, and special character
- **Username**: 3-30 characters, alphanumeric + underscores only, cannot start/end with underscore
- **Full Name**: 2-50 characters, letters and spaces only
- **Sanitization**: All inputs are sanitized to prevent XSS and injection attacks

### Validation Features
- Comprehensive input validation using express-validator
- Real-time validation error messages
- Input sanitization and normalization
- Password strength requirements
- Email format validation
- Username format restrictions
- SQL injection prevention
- XSS attack prevention

For detailed validation documentation, see [API_VALIDATION_DOCUMENTATION.md](./API_VALIDATION_DOCUMENTATION.md)

## Contributing

We welcome contributions! Please follow these guidelines:

### Quick Setup
1. **Fork & Clone**: Fork the repo and clone your fork
2. **Branch**: Create a feature branch (`git checkout -b feature/amazing-feature`)
3. **Install**: Run `npm install` and set up your `.env` file
4. **Code**: Make your changes following our standards

### Code Standards
- Use ES6+ syntax and modules
- Follow existing naming conventions (camelCase for variables/functions)
- Add JSDoc comments for functions
- Handle errors properly with try-catch blocks
- Use async/await over promises

### Submission Process
1. **Test**: Ensure your changes work locally
2. **Commit**: Use descriptive commit messages
3. **Push**: Push to your fork (`git push origin feature/amazing-feature`)
4. **PR**: Open a Pull Request with a clear description and Raise your PR on DEV branch.

### Guidelines
- Keep PRs focused and small
- Update documentation if needed
- Follow the existing code style
- Test your changes thoroughly
