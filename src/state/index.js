import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  searchQuery: "",
  searchStoreQuery: "",
  stores: {},
  businessReg:{},
  reviewAccept: { terms: '' },
  currentLocation: {},
  signup: {},
  TODO: [],
  doneTODO: [],
  togglecompliance:false,
  togglereg:false,
  buildings:{}
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSearchStoreQuery: (state, action) => {
      state.searchStoreQuery = action.payload;
    },
    setStores: (state,action) => {
      state.stores = action.payload
    },
    setBusinessReg: (state,action) => {
      state.businessReg = {
        ...state.businessReg, ...action.payload
      }
    },
    updateReviewAccept: (state, action) => {
      state.userData.reviewAccept = {
        ...state.userData.reviewAccept,
        ...action.payload,
      };
    },
    setCurrentLocation: (state,action) => {
      state.currentLocation = action.payload
    },
    setSignup: (state, action) => {
      state.signup = action.payload;
    },
    setTODO: (state,action) => {
      return {
        ...state,
        TODO: [...state.TODO,action.payload]
      }
    },
    setDoneTODO: (state, action) => {
      return {
        ...state,
        TODO: action.payload.updatedTODO,
        doneTODO: action.payload.updatedDoneTODO
      };
    },
         
    toggleCompliance: (state,action) => {
      state.togglecompliance = action.payload
    },
    toggleReg: (state,action) => {
      state.togglereg = action.payload
    },
    setBuildings: (state,action) => {
      state.buildings = action.payload
    }
  },
});

export const {
  setSignup,
  setCurrentLocation,
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setPosts,
  setPost,
  setSearchQuery,
  setSearchStoreQuery,
  setStores,
  setBusinessReg,
  updateReviewAccept,
  setTODO,
  setDoneTODO,
  toggleCompliance,
  toggleReg,
  setBuildings
} = authSlice.actions;
export default authSlice.reducer;
