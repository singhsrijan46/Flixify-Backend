import { Like } from "../models/like.model.js"
import { Video } from "../models/video.model.js"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleVideoLike = asyncHandler(async (req, res) => {
    try {

        const { videoId } = req.params
        if (!videoId) {
            throw new ApiError(400, "Video not found")
        }
        const user = await User.findById(req.user?._id);
        if (!user) {
            throw new ApiError(400, "User not found")
        }

        const video = await Video.findById(videoId)
        if (!video) {
            throw new ApiError(400, "Video not found")
        }

        const exsitingLike = await Like.findOne({ video: videoId, likedBy: user._id })

        if (exsitingLike) {
            await Like.findByIdAndDelete(exsitingLike._id)
            return (
                res
                    .status(200)
                    .json(
                        new ApiResponse(200, {}, "Like removed successfully")
                    )
            )
        } else {
            const newLike = await Like.create({ video: videoId, likedBy: user._id });
            return (
                res
                    .status(200)
                    .json(
                        new ApiResponse(200, newLike, "Like added successfully")
                    )
            )
        }

    } catch (error) {
        console.log(error)
        throw new ApiError(401, error?.message || "Error in vedio like toggle")
    }
})


const toggleCommentLike = asyncHandler(async (req, res) => {
    try {

        const { commentId } = req.params
        if (!commentId) {
            throw new ApiError(400, "Comment not found")
        }
        const user = await User.findById(req.user?._id);
        if (!user) {
            throw new ApiError(400, "User not found")
        }

        const comment = await Comment.findById(commentId)
        if (!comment) {
            throw new ApiError(400, "Comment not found")
        }

        const exsitingLike = await Like.findOne({ comment: commentId, likedBy: user._id })

        if (exsitingLike) {
            await Like.findByIdAndDelete(exsitingLike._id)
            return (
                res
                    .status(200)
                    .json(
                        new ApiResponse(200, {}, "Like removed successfully")
                    )
            )
        } else {
            const newLike = await Like.create({ comment: commentId, likedBy: user._id });
            return (
                res
                    .status(200)
                    .json(
                        new ApiResponse(200, newLike, "Like added successfully")
                    )
            )
        }

    } catch (error) {
        console.log(error)
        throw new ApiError(401, error?.message || "Error in comment like toggle")
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    try {

        const { tweetId } = req.params
        if (!tweetId) {
            throw new ApiError(400, "Tweet not found")
        }
        const user = await User.findById(req.user?._id);
        if (!user) {
            throw new ApiError(400, "User not found")
        }

        const tweet = await Tweet.findById(tweetId)
        if (!tweet) {
            throw new ApiError(400, "Tweet not found")
        }

        const exsitingLike = await Like.findOne({ tweet: tweetId, likedBy: user._id })

        if (exsitingLike) {
            await Like.findByIdAndDelete(exsitingLike._id)
            return (
                res
                    .status(200)
                    .json(
                        new ApiResponse(200, {}, "Like removed successfully")
                    )
            )
        } else {
            const newLike = await Like.create({ tweet: tweetId, likedBy: user._id });
            return (
                res
                    .status(200)
                    .json(
                        new ApiResponse(200, newLike, "Like added successfully")
                    )
            )
        }

    } catch (error) {
        console.log(error)
        throw new ApiError(401, error?.message || "Error in tweet like toggle.")

    }
})


const getLikedVideos = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(req.user?._id);
        if (!user) {
            throw new ApiError(400, "User not found")
        }
        // Find all likes by the user
        const likes = await Like.find({
            likedBy: user._id,
            video: { $exists: true }
        }).populate('video');

        if (!likes || likes.length === 0) {
            return res.status(200).json(new ApiResponse(200, "No liked videos available"));
        }

        // Extract video details from the likes
        const likedVideos = likes.map(like => like.video);

        return (
            res
                .status(200)
                .json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"))
        );

    } catch (error) {
        console.log(error)
        throw new ApiError(401, error?.message || "Something went wrong while getting liked videos.")

    }
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}