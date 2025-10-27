import { Playlist } from "../models/playlist.model.js";
import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";


const createPlaylist = asyncHandler(async (req, res) => {
    try {

        const { name, description } = req.body;
        if (!name) {
            throw new ApiError(400, "Playlist name is required");
        }
        const user = await User.findById(req.user?._id);
        if (!user) {
            throw new ApiError(400, "User not found");
        }

        const playlist = await Playlist.create({
            name: name,
            description: description || "",
            owner: user._id
        })
        if (!playlist) {
            throw new ApiError(400, "Error in creating playlist");
        }

        return (
            res
                .status(201)
                .json(new ApiResponse(200, playlist, "Playlist created successfully"))
        )

    } catch (error) {
        console.log(error);
        throw new ApiError(401, error?.message || "Error in creating playlist");
    }
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    try {

        const user = await User.findById(req.user?._id);
        if (!user) {
            throw new ApiError(400, "User not found");
        }

        const userPlaylists = await Playlist.find({ owner: user._id });
        if (!userPlaylists) {
            throw new ApiError(400, "Error in getting user playlists");
        }

        return (
            res
                .status(200)
                .json(new ApiResponse(200, userPlaylists, "User playlists fetched successfully"))
        )

    } catch (error) {
        console.log(error);
        throw new ApiError(401, error?.message || "Error in getting user playlists");
    }
});

const getPlaylistById = asyncHandler(async (req, res) => {
    try {

        const { playlistId } = req.params;
        if (!isValidObjectId(playlistId)) {
            throw new ApiError(400, "Invalid playlist id");
        }
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            throw new ApiError(400, "Playlist not found");
        }

        return (
            res
                .status(200)
                .json(new ApiResponse(200, playlist, "Playlist fetched successfully"))
        )

    } catch (error) {
        console.log(error);
        throw new ApiError(401, error?.message || "Error in getting playlist");
    }
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    try {

        const { playlistId, videoId } = req.body;
        if (!isValidObjectId(playlistId)) {
            throw new ApiError(400, "Invalid playlist id");
        }
        if (!isValidObjectId(videoId)) {
            throw new ApiError(400, "Invalid video id");
        }

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            throw new ApiError(400, "Playlist not found");
        }

        const video = await Video.findById(videoId);
        if (!video) {
            throw new ApiError(400, "Video not found");
        }

        if (playlist.videos.includes(videoId)) {
            throw new ApiError(400, "Video already exists in playlist");
        }

        const updatedPlaylist = await Playlist.findByIdAndUpdate(
            playlistId,
            {
                $push: { videos: videoId }
            }, { new: true }
        );

        return (
            res
                .status(200)
                .json(new ApiResponse(200, updatedPlaylist, "Video added to playlist successfully"))
        )


    } catch (error) {
        console.log(error);
        throw new ApiError(500, error?.message || "Error in adding video to playlist");
    }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    try {

        const { playlistId, videoId } = req.params;
        if (!isValidObjectId(playlistId)) {
            throw new ApiError(400, "Invalid playlist id");
        }
        if (!isValidObjectId(videoId)) {
            throw new ApiError(400, "Invalid video id");
        }

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            throw new ApiError(400, "Playlist not found");
        }

        if (!playlist.videos.includes(videoId)) {
            throw new ApiError(400, "Video not found in playlist");
        }

        const updatedPlaylist = await Playlist.findByIdAndUpdate(
            playlistId,
            {
                $pull: { videos: videoId }
            }, { new: true }
        );

        return (
            res
                .status(200)
                .json(new ApiResponse(200, updatedPlaylist, "Video removed from playlist successfully"))
        )

    } catch (error) {
        console.log(error);
        throw new ApiError(401, error?.message || "Error in removing video from playlist");

    }
});

const deletePlaylist = asyncHandler(async (req, res) => {
    try {

        const { playlistId } = req.params;
        if (!isValidObjectId(playlistId)) {
            throw new ApiError(400, "Invalid playlist id");
        }

        const user = await User.findById(req.user?._id);
        if (!user) {
            throw new ApiError(400, "User not found");
        }

        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            throw new ApiError(400, "Playlist not found");
        }

        if (playlist.owner.toString() !== user._id.toString()) {
            throw new ApiError(401, "User Unauthorized to delete this playlist");
        }

        const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId, { new: true });
        if (!deletedPlaylist) {
            throw new ApiError(400, "Error in deleting playlist");
        }

        return (
            res
                .status(200)
                .json(new ApiResponse(200, deletedPlaylist, "Playlist deleted successfully"))
        )

    } catch (error) {
        console.log(error);
        throw new ApiError(401, error?.message || "Error in deleting playlist");

    }
});

const updatePlaylist = asyncHandler(async (req, res) => {
    try {
        const { playlistId } = req.params;
        const { name, description } = req.body
        if (!isValidObjectId(playlistId)) {
            throw new ApiError(400, "Invalid playlist id");
        }

        if (!name) {
            throw new ApiError(400, "name is required")
        }
        if (!description) {
            throw new ApiError(400, "description is required")
        }

        const user = await User.findById(req.user?._id);
        if (!user) {
            throw new ApiError(400, "User not found");
        }
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            throw new ApiError(400, "Playlist not found");
        }
        if (playlist.owner.toString() !== user._id.toString()) {
            throw new ApiError(401, "User Unauthorized to update this playlist");
        }

        const updatedPlaylist = await Playlist.findByIdAndUpdate(
            playlistId,
            {
                $set: {
                    name: name,
                    description: description
                }
            }, {
            new: true
        }
        )

        if (!updatedPlaylist) {
            throw new ApiError(400, "Error while updating playlist")
        }

        //returning res
        return (
            res
                .status(200)
                .json(new ApiResponse(200, updatedPlaylist, "Playlist name and description updated successfully "))
        )


    } catch (error) {
        console.log(error);
        throw new ApiError(401, error?.message || "Error in updating playlist");

    }
});


export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}