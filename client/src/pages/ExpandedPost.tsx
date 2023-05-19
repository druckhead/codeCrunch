import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ERoutes } from "../utils/endpointConstants";
import { PostData, dateFormat, titleToDashCase } from "./Feed/Post/Post";
import {
  Button,
  CardActions,
  Divider,
  Grid,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { RawDraftContentState, convertFromRaw } from "draft-js";
import { convertToHTML } from "draft-convert";
import { createMarkup } from "../components/PostEditor/utils/utils";

const ExpandedPost = () => {
  const [post, setPost] = useState<PostData | null>(null);
  const urlParams = useParams<"postId">();
  const id = urlParams.postId?.split("-")[0];
  const theme = useTheme();

  const convertRawToSanitizedHTML = (rawContent: RawDraftContentState) => {
    const contentState = convertFromRaw(rawContent);
    const html = convertToHTML({
      styleToHTML: (style) => {
        console.log(style);
      },
      blockToHTML: (block) => {
        if (block.type === "code") {
          return <pre />;
        }
      },
      entityToHTML: (entity, originalText) => {
        if (entity.type === "LINK") {
          return <a href={entity.data.url}>{originalText}</a>;
        }
        return originalText;
      },
    })(contentState);
    return createMarkup(html);
  };

  const fetchPost = useCallback(async (): Promise<void> => {
    const response = await axios.get(`${POST_URL}/${id}`);
    console.log(response.data);
    setPost(response.data);
  }, []);

  useEffect(() => {
    const fetchedPost = fetchPost();
    console.log(post);
  }, [fetchPost]);

  if (post) {
    const createdDateTime = dateFormat(post.created);

    return (
      <Paper elevation={5} variant="elevation" sx={{ p: 2 }}>
        <Typography variant="h3">{post.title}</Typography>
        <Divider sx={{ width: "80%" }} />
        <Typography
          dangerouslySetInnerHTML={convertRawToSanitizedHTML(post.content)}
        />
        <Grid container justifyContent="space-between" px={2} pb={2}>
          <Grid item>
            <Grid item>
              <Link to={`/profile/${post.user.username}`}>
                <Typography fontWeight={600}>
                  {`@${post.user.username}`}
                </Typography>
              </Link>
            </Grid>
            <Grid
              container
              direction="column"
              color={theme.palette.text.secondary}
            >
              <Grid item>
                <Grid container gap={0.5}>
                  <Grid item>
                    <Typography>{createdDateTime.date}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>{createdDateTime.time}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item alignSelf={"flex-end"}>
            <CardActions sx={{ p: 0 }}>
              <Button size="small">Reply</Button>
            </CardActions>
          </Grid>
        </Grid>
      </Paper>
    );
  } else {
    return null;
  }
};

export default ExpandedPost;

const { API_BASE_URL, V1, POSTS_PREFIX } = ERoutes;
const POST_URL = `${API_BASE_URL}${V1}${POSTS_PREFIX}`;
