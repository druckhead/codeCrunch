const BASE_API_URL = "http://127.0.0.1";
const BASE_API_PORT = ":8000/";
const BASE_API_ENDPOINT = "api/";
const BASE_API_VERSION = "v1/";
const FULL_API_ENDPOINT = BASE_API_URL + BASE_API_PORT + BASE_API_ENDPOINT;

const TOKEN = "token/";
const USERS = "users";
const JOBS = "jobs";
const COMPANIES = "companies";
const POSTS = "posts";
const POSTSOLUTIONS = "postsolutions";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: FULL_API_ENDPOINT + TOKEN + "login/",
    REFRESH: FULL_API_ENDPOINT + TOKEN + "refresh/",
    VERIFY: FULL_API_ENDPOINT + TOKEN + "verify/",
    LOGOUT: FULL_API_ENDPOINT + TOKEN + "blacklist/",
  },
  USERS: {
    REGISTER: FULL_API_ENDPOINT + BASE_API_VERSION + USERS,
  },
};
