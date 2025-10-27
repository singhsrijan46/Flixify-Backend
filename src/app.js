import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import responseTimeLogger from './middleware/responseTime.middleware.js'
import { ApiError } from './utils/ApiError.js';

const app = express();

app.use(cors())
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())
app.use(responseTimeLogger)



//routes import
import userRouter from './routes/user.routes.js'
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"




//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)

// Global error handler middleware
app.use((err, req, res, next) => {
    // If it's already an ApiError, use its properties
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            data: null,
            errors: err.errors || []
        });
    }
    
    // For unexpected errors, return a generic error response
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        data: null,
        errors: []
    });
});

export { app } 