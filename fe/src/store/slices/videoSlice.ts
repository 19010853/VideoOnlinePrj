import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import apiServer from "../../api/apiServer";
import type { RootState } from "..";
import type { IConfigUsingAxios } from "../../types";

// Video interface
export interface IVideo {
    _id: string;
    title?: string;
    description?: string;
    uploadedBy: {
        email: string;
    };
    isPrivate: boolean;
    thumbNail: string;
    path: string;
}

// Editable video interface
export interface IEditVideo {
    _id: string;
    title?: string;
    description?: string;
    uploadedBy: {
        email: string;
    };
    isPrivate: boolean | string;
    thumbNail: File | string;
    path: File | string;
}

// Slice state interface
export interface IVideoState {
    videos: IVideo[];
    publicVideos: IVideo[] | null;
    searchVideos: IVideo[] | null;
    isLoading: boolean;
    editVideo: IEditVideo | null;
}

// API response type
interface ISingleVideoResponse {
    success: boolean;
    message: string;
    video?: IVideo;
}

interface IVideoResponse {
    success: boolean;
    message: string;
    videos?: IVideo[];
}

interface IFetchPayload {
    configUsingToken: IConfigUsingAxios
}

// Initial state
const initialState: IVideoState = {
    videos: [],
    publicVideos: null,
    searchVideos: null,
    isLoading: false,
    editVideo: null,
};

// Async thunk to fetch public videos
export const fetchPublicVideos = createAsyncThunk<IVideo[], void, { rejectValue: string }>("video/fetchPublicVideos", async (_, thunkAPI) => {
    try {
        const { data } = await apiServer.get<IVideoResponse>("/api/v1/fetch-videos");
        if (data.success) {
            return data.videos || [];
        }
        return thunkAPI.rejectWithValue(data.message);
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || "Something went wrong";
        toast.error(errorMessage);
        return thunkAPI.rejectWithValue(errorMessage);
    }
});

//Async thunk for downloading video
export const downloadVideo = createAsyncThunk<void, { id: string }, { rejectValue: string }>("video/download", async (payload, thunkAPI) => {
    try {
        const { id } = payload;
        const state = thunkAPI.getState() as RootState;
        const queryParams = state.auth.loggedIn ? `?userId=${encodeURIComponent(state.auth.loggedIn._id)}` : "";
        const response = await apiServer.get(
            `/api/v1/download/file/${id}${queryParams}`,
            {
                responseType: "blob",
            }
        );
        const contentDisposition = response.headers['content-disposition'];
        const fileName = contentDisposition ? contentDisposition.split('filename=')[1] : 'video.mp4';
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const link = document.createElement("a");

        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error);
    }
})

//Async thunk for fetching videos for logged in user
export const fetchVideosForLoggedInUser = createAsyncThunk<IVideo[], IFetchPayload, { rejectValue: string }>("/video/fetch-user-videos", async (payload, thunkAPI) => {
    try {
        const { configUsingToken } = payload;
        const { data } = await apiServer.get<IVideoResponse>("/api/v1/aws/fetch-videos", configUsingToken);
        if (data.success) {
            return data.videos || [];
        }
        return thunkAPI.rejectWithValue(data.message);
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Something went wrong")
    }
})

// Async thunk for deleting video
export const deleteVideo = createAsyncThunk<{ id: string }, { id: string; configUsingToken: IConfigUsingAxios }, { rejectValue: string }>("/video/delete", async ({ id, configUsingToken }, thunkAPI) => {
    try {
        const { data } = await apiServer.delete<IVideoResponse>(`/api/v1/aws/delete-single/video/${id}`, configUsingToken);
        if (data.success) {
            return { id };
        }
        return thunkAPI.rejectWithValue(data.message);
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || "Something went wrong")
    }
})

// Async thunk for updating video
export const updateVideo = createAsyncThunk<IVideo, { id: string, configUsingToken: IConfigUsingAxios, updateData: Partial<IEditVideo> }, { rejectValue: string }>("video/update", async ({ id, updateData, configUsingToken }, thunkAPI) => {
    try {
        const formData = new FormData();
        if (updateData.path instanceof File) {
            formData.append("video", updateData.path);
        }
        if (updateData.thumbNail instanceof File) {
            formData.append("thumbNail", updateData.thumbNail);
        }
        if (updateData.title) formData.append("title", updateData.title);
        if (updateData.description) formData.append("description", updateData.description);
        if (updateData.isPrivate) formData.append("isPrivate", updateData.isPrivate.toString());

        const { data } = await apiServer.put<ISingleVideoResponse>(`/api/v1/aws/update-video/${id}`, formData, {
            ...configUsingToken,
            headers: {
                ...configUsingToken.headers,
                "Content-Type": "multipart/form-data",
            }
        })

        if (data.success && data.video) {
            toast.success("Video updated successfully");
            return data.video;
        }
        return thunkAPI.rejectWithValue("Failed to update video");

    } catch (error: any) {
        return thunkAPI.rejectWithValue(error);
    }
})

// Video slice
const videoSlice = createSlice({
    name: "video",
    initialState,
    reducers: {
        setEditVideo: (state, action: PayloadAction<IEditVideo | null>) => {
            state.editVideo = action.payload;
        },
        clearVideos: (state) => {
            state.publicVideos = null;
            state.videos = [];
            state.searchVideos = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPublicVideos.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchPublicVideos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.publicVideos = action.payload;
            })
            .addCase(fetchPublicVideos.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(fetchVideosForLoggedInUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchVideosForLoggedInUser.fulfilled, (state, action) => {
                state.videos = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchVideosForLoggedInUser.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(deleteVideo.fulfilled, (state, action) => {
                state.videos = state.videos?.filter((video) => video._id !== action.payload.id) || null;
            })
            .addCase(updateVideo.fulfilled, (state, action) => {
                const index = state.videos.findIndex(video => video._id === action.payload._id);
                if (index !== -1) {
                    state.videos[index] = action.payload;
                }
            })
    },
});

// Selectors
export const selectPublicVideos = (state: RootState) => state.video.publicVideos;
export const selectLoading = (state: RootState) => state.video.isLoading;
export const selectEditVideo = (state: RootState) => state.video.editVideo;
export const selectVideosForLoggedInUser = (state: RootState) => state.video.videos;

// Actions
export const { setEditVideo, clearVideos } = videoSlice.actions;

export default videoSlice.reducer;
