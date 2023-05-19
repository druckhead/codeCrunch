import React from "react";
import { RawDraftContentState, convertFromRaw } from "draft-js";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { User, useUser } from "../../../context/UserContext";
import { convertToHTML } from "draft-convert";
import { Link } from "react-router-dom";
import { createMarkup } from "../../../components/PostEditor/utils/utils";

const Post = (props: PostData) => {
  const theme = useTheme();
  const currUser = useUser();

  const createdDateTime = dateFormat(props.created);

  return (
    <React.Fragment>
      <Card
        sx={{
          minWidth: 355,
          borderRadius: 5,
          boxShadow: 4,
          ":hover": {
            boxShadow: 12,
          },
        }}
        variant="outlined"
      >
        <CardHeader title={props.title} />
        <Divider sx={{ width: "90%", mx: "auto" }} />
        <Grid
          container
          direction="column"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Grid item>
            <CardContent>
              <Grid container direction="column" gap={2}>
                <Grid item>
                  <Typography
                    fontWeight={500}
                    color={theme.palette.text.secondary}
                  >
                    {props.language}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography>
                    {`${props.content.blocks[0].text.substring(0, 40)}...`}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Grid>
          <Grid container justifyContent="space-between" px={2} pb={2}>
            <Grid item>
              <Grid item>
                <Link
                  to={`/profile/${props.user.username ?? currUser.username}`}
                >
                  <Typography fontWeight={600}>
                    {`@${props.user.username ?? currUser.username}`}
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
                <Button size="small">
                  <Link
                    to={`/posts/${props.id}-${titleToDashCase(props.title)}`}
                  >
                    Learn More
                  </Link>
                </Button>
              </CardActions>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </React.Fragment>
  );
};

export default Post;

export type Seniority = "TR" | "JR" | "MD" | "SR";
export type PostType = "Question" | "Assignment" | "HR";

export interface PostData {
  company_job: CompanyJob;
  content: RawDraftContentState;
  created: string;
  id: number;
  language: string;
  modified: string;
  post_type: PostType;
  seniority: Seniority;
  user: User;
  votes: number[];
  years_experience: number;
  title: string;
}

export interface Job {
  id: number;
  title: string;
  companies: number[];
}

export interface Company {
  id: number;
  name: string;
}

export interface CompanyJob {
  id: number;
  company: Company;
  job: Job;
}

interface DateTime {
  date: string;
  time: string;
}

export const dateFormat = (dateString: string): DateTime => {
  const dateTime: Date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions | undefined = {
    // weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const userLocale =
    navigator.languages && navigator.languages.length
      ? navigator.languages[0]
      : navigator.language;

  console.log(navigator.languages);

  console.log(userLocale);

  const date = dateTime.toLocaleDateString(userLocale, options);
  const time = dateTime.toLocaleTimeString(userLocale);

  return { date, time };
};

export const titleToDashCase = (postTitle: string): string => {
  return postTitle.toLowerCase().replaceAll(" ", "-");
};
