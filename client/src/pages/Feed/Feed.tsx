import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import PostEditor from "../../components/PostEditor/PostEditor";
import React, { useCallback, useEffect, useState } from "react";
import { PostData } from "./Post/Post";
import { ERoutes } from "../../utils/endpointConstants";
import axios from "axios";
import ScrollToTopFab from "../../components/FloatingActionButtons/ScrollToTopFab/ScrollToTopFab";
import NewPostFab from "../../components/FloatingActionButtons/NewPostFab/NewPostFab";
import PostsGrid from "./PostsGrid/PostsGrid";

const Feed = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const loadPosts = useCallback(async () => {
    const response = await axios.get(REQUEST_URL);
    setPosts(response.data);
    console.log(response.data);
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return (
    <React.Fragment>
      <PostsGrid options={posts} />

      <NewPostFab onClick={handleClickOpen} />
      <ScrollToTopFab />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a new post, please fill in the details below. Then writeup
            your post in the editor at the bottom.
          </DialogContentText>
          <PostEditor
            onPostSubmitted={(newPost: PostData) => {
              setPosts([...posts, newPost]);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default Feed;

const { API_BASE_URL, V1, POSTS_PREFIX } = ERoutes;
const REQUEST_URL = `${API_BASE_URL}${V1}${POSTS_PREFIX}`;
