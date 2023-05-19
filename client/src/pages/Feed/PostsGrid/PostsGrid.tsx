import { Grid, Typography } from "@mui/material";
import React from "react";
import Post, { PostData } from "../Post/Post";

const PostsGrid = (props: PostsGridProps) => {
  const { options } = props;

  if (options.length > 0) {
    return (
      <React.Fragment>
        <Grid container gap={2} justifyContent="center" alignItems="center">
          {options.map((post) => (
            <Grid item key={post.id}>
              <Post {...post} />
            </Grid>
          ))}
        </Grid>
      </React.Fragment>
    );
  } else {
    return <NoPosts />;
  }
};

const NoPosts = () => {
  return (
    <React.Fragment>
      <Typography textAlign="center" fontSize="2em" fontWeight="600">
        No posts yet!
      </Typography>
    </React.Fragment>
  );
};

export default PostsGrid;

interface PostsGridProps {
  options: PostData[];
}
