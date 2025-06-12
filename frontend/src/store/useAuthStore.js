import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      // Set user first, then connect
      const user = res.data;
      set({ authUser: { ...user, profilePicture: user.profilePicture } }, false, "setAuthUser");
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      const user = res.data;
      set({ authUser: { ...user, profilePicture: user.profilePicture } }, false, "signupUser");
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/signin", data);
      const user = res.data;
      set({ authUser: { ...user, profilePicture: user.profilePicture } }, false, "signinUser");
      toast.success("Signed in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signin failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/signout");
      set({ authUser: null }, false, "signoutUser");
      get().disconnectSocket();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signout failed");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      const user = res.data;
      set({ authUser: { ...user, profilePicture: user.profilePicture } }, false, "updateProfile");
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
    
  },
  

  connectSocket: () => {
    const { authUser, socket } = get();
  
    // Wait until userId is truly available
    if (!authUser || !authUser._id || socket?.connected) return;
  
    const socketInstance = io(BASE_URL, {
      query: { userId: authUser._id },
      withCredentials: true,
    });
  
    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);
    });
  
    socketInstance.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  
    set({ socket: socketInstance });
  }, 

  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
