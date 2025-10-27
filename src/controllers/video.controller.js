import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const publishVideo = asyncHandler(async (req, res) => {

    // 1 - get title and description
    // 2 - get video and thumbnail
    // 3 - upload on cloudinary
    // 4 - upload on mongo
    // 5 -return res

    try {
        const { title, description } = req.body;
        console.log("title: ", title);
        if (!title) {
            throw new ApiError(400, "Title is required");
        }

        const videoLocalPath = req.files?.videoFile[0]?.path;
        if (!videoLocalPath) {
            throw new ApiError(400, "Video file is required");
        }

        const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
        if (!thumbnailLocalPath) {
            throw new ApiError(400, "Thumbnail is required");
        }

        const videoFile = await uploadOnCloudinary(videoLocalPath);
        if (!videoFile) {
            throw new ApiError(500, "Failed to upload video");
        }

        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
        if (!thumbnail) {
            throw new ApiError(500, "Failed to upload thumbnail");
        }

        const user = await User.findById(req.user?._id);

        const video = await Video.create({
            title: title,
            description: description || "",
            videoUrl: videoFile.secure_url,
            thumbnail: thumbnail.url,
            owner: user._id,
            duration: videoFile.duration
        })

        if (!video) {
            throw new ApiError(500, "Failed to upload video");
        }

        return (
            res
                .status(201)
                .json(new ApiResponse(200, video, "Video uploaded successfully"))
        )

    } catch (error) {
        throw new ApiError(500, "Something went wrong while publishing video")
    }
});


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType } = req.query;

    const user = await User.find({
        refreshToken: req.cookies.refreshToken,
    });

    const pageNumber = parseInt(page);
    const limitOfComments = parseInt(limit);

    if (!user) {
        throw new ApiError(400, "User is required.");
    }

    const skip = (pageNumber - 1) * limitOfComments;
    const pageSize = limitOfComments;

    const videos = await Video.aggregatePaginate(
        Video.aggregate([
            {
                $match: {
                    $or: [
                        { title: { $regex: query, $options: 'i' } },
                        { description: { $regex: query, $options: 'i' } }
                    ],
                    isPublished: true,
                    owner: user._id
                }
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "video",
                    as: "likes",
                }
            },
            {
                $addFields: {
                    likes: { $size: "$likes" }
                }
            },
            {
                $project: {
                    "_id": 1,
                    "videoFile": 1,
                    "thumbnail": 1,
                    "title": 1,
                    "description": 1,
                    "duration": 1,
                    "views": 1,
                    "isPublished": 1,
                    "owner": 1,
                    "createdAt": 1,
                    "updatedAt": 1,
                    "likes": 1
                }
            },
            { $sort: { [sortBy]: sortType === 'asc' ? 1 : -1 } },
            { $skip: skip },
            { $limit: pageSize }
        ])
    );

    if (videos.length === 0) {
        return res.status(200).json(new ApiResponse(200, "No videos available."));
    }

    // Return the videos
    res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"));
});


const getVideoById = asyncHandler(async (req, res) => {
    try {

        const { videoId } = req.params;
        if (!videoId) {
            throw new ApiError(400, "Video ID cannot be fetched from params");
        }

        const video = await Video.findById(videoId);
        if (!video) {
            throw new ApiError(404, "Video not found");
        }

        return (
            res
                .status(200)
                .json(new ApiResponse(200, video, "Video fetched successfully"))
        )


    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching video")
    }
});


const updateVideoDetails = asyncHandler(async (req, res) => {
    try {

        const { videoId } = req.params;
        if (!videoId) {
            throw new ApiError(400, "Video ID cannot be fetched from params");
        }

        const video = await Video.findById(videoId);
        if (!video) {
            throw new ApiError(404, "Video not found for the given ID");
        }

        const user = await User.findById(req.user?._id);
        if (!user) {
            throw new ApiError(400, "User not found.");
        }

        if (video.owner.toString() !== user._id.toString()) {
            throw new ApiError(401, "You are not authorized to update this video");
        }

        const { title, description } = req.body;
        if (!title) {
            throw new ApiError(400, "Title is required");
        }
        if (!description) {
            throw new ApiError(400, "Description is required");
        }

        const newthumbnailLocalPath = req.files?.thumbnail[0]?.path;
        if (!newthumbnailLocalPath) {
            throw new ApiError(400, "Thumbnail is required");
        }
        const newThumbnail = await uploadOnCloudinary(newthumbnailLocalPath);
        if (!newThumbnail) {
            throw new ApiError(500, "Failed to upload thumbnail");
        }

        video.thumbnail = newThumbnail.url;
        video.title = title;
        video.description = description;
        await video.save();

        return (
            res
                .status(200)
                .json(new ApiResponse(200, video, "Video updated successfully"))
        )


    } catch (error) {
        throw new ApiError(500, "Something went wrong while updating video")
    }

});


const deleteVideo = asyncHandler(async (req, res) => {
    try {

        const { videoId } = req.params;
        if (!videoId) {
            throw new ApiError(400, "Video ID cannot be fetched from params");
        }

        const video = await Video.findById(videoId);
        if (!video) {
            throw new ApiError(404, "Video not found for the given ID");
        }

        const user = await User.findById(req.user?._id);
        if (!user) {
            throw new ApiError(400, "User not found.");
        }

        if (video.owner.toString() !== user._id.toString()) {
            throw new ApiError(401, "You are not authorized to delete this video");
        }

        await Video.findByIdAndDelete(videoId);
        return (
            res
                .status(200)
                .json(new ApiResponse(200, {}, "Video deleted successfully"))
        )

    } catch (error) {
        throw new ApiError(500, "Something went wrong while deleting video")
    }
});


const togglePublishStatus = asyncHandler(async (req, res) => {
    try {

        const { videoId } = req.params;
        if (!videoId) {
            throw new ApiError(400, "Video ID cannot be fetched from params");
        }

        const video = await Video.findById(videoId);
        if (!video) {
            throw new ApiError(404, "Video not found for the given ID");
        }

        video.isPublished = !video.isPublished;
        await video.save({ validateBeforeSave: false });

        return (
            res
                .status(200)
                .json(new ApiResponse(200, video, "Publish status toggled successfully"))
        )

    } catch (error) {
        throw new ApiError(500, "Something went wrong while toggling publish status")
    }
});

export {
    publishVideo,
    getAllVideos,
    getVideoById,
    updateVideoDetails,
    deleteVideo,
    togglePublishStatus
}