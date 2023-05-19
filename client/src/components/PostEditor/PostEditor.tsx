import React, { useCallback, useEffect, useState } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { convertToHTML } from "draft-convert";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import editorStyles from "./PostEditor.module.css";
import { Box, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { ERoutes } from "../../utils/endpointConstants";
import { postTypes } from "../../data/postTypeList";
import { languages } from "../../data/programmingLanguages";
import { seniorities } from "../../data/seniorityList";
import { countries } from "../../data/countriesList";
import { useUser } from "../../context/UserContext";
import BaseForm from "../forms/BaseForm/BaseForm";
import ControlledAutoComplete from "../Inputs/ControlledAutoComplete/ControlledAutoComplete";
import ControlledSelect from "../ControlledSelect";
import ControlledTextField from "../Inputs/ControlledTextField/ControlledTextField";
import { PostData } from "../../pages/Feed/Post/Post";
import { createMarkup } from "./utils/utils";

interface PostEditorProps {
  onPostSubmitted: (newPost: PostData) => void;
}

function PostEditor(props: PostEditorProps) {
  const [companyOptions, setCompanyOptions] = useState<readonly string[]>([]);
  const [jobOptions, setJobOptions] = useState<readonly string[]>([]);
  const user = useUser();
  const [convertedContent, setConvertedContent] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostForm>({
    defaultValues: defaultPost,
    criteriaMode: "all",
    mode: "all",
  });
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const { onPostSubmitted } = props;

  useEffect(() => {
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
    })(editorState.getCurrentContent());
    setConvertedContent(html);
  }, [editorState]);

  const createPost = useCallback(async (data: PostForm) => {
    const { API_BASE_URL, V1, POSTS_PREFIX } = ERoutes;
    const REQUEST_URL = `${API_BASE_URL}${V1}${POSTS_PREFIX}`;

    const config = {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    };
    const response = await axios.post(REQUEST_URL, data, config);
    console.log(response);
    onPostSubmitted(response.data);
  }, []);

  const onSubmit: SubmitHandler<PostForm> = (data) => {
    data.content = { ...convertToRaw(editorState.getCurrentContent()) };
    console.log(data);
    createPost(data);
  };

  console.log(convertedContent);

  return (
    <React.Fragment>
      <BaseForm
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        submitText="POST"
      >
        <ControlledAutoComplete
          name="company"
          control={control}
          rules={{ required: "This field is required" }}
          errors={errors}
          label="Company"
          freeSolo={true}
          fieldOptions={companyOptions}
          setOptions={setCompanyOptions}
          fieldId="company-input-id"
          fieldName="company"
          setValue={setValue}
          helperText="Enter or choose a company"
        />
        <ControlledAutoComplete
          name="country"
          control={control}
          rules={{ required: "This field is required" }}
          errors={errors}
          label="Country"
          freeSolo={false}
          fieldOptions={countries}
          setOptions={setCompanyOptions}
          fieldId="country-input-id"
          fieldName="country"
          setValue={setValue}
          helperText="Enter or choose a country"
        />
        <ControlledAutoComplete
          name="job"
          control={control}
          rules={{ required: "This field is required" }}
          errors={errors}
          label="Job"
          freeSolo={true}
          fieldOptions={jobOptions}
          setOptions={setJobOptions}
          fieldId="job-input-id"
          fieldName="job"
          setValue={setValue}
          helperText="Enter or choose a job title"
        />
        <ControlledAutoComplete
          name="post_type"
          control={control}
          rules={{ required: "This field is required" }}
          errors={errors}
          label="Post Type"
          freeSolo={false}
          fieldOptions={postTypes}
          fieldId="post-type-input-id"
          fieldName="post_type"
          setValue={setValue}
          helperText="Choose a post type"
        />
        <ControlledAutoComplete
          name="seniority"
          control={control}
          rules={{ required: "This field is required" }}
          errors={errors}
          label="Seniority"
          freeSolo={false}
          fieldOptions={seniorities}
          fieldId="seniority-input-id"
          fieldName="seniority"
          setValue={setValue}
          helperText="Enter or choose a programming seniority"
        />
        <ControlledAutoComplete
          name="language"
          control={control}
          rules={{ required: "This field is required" }}
          errors={errors}
          label="Language"
          freeSolo={false}
          fieldOptions={languages}
          fieldId="language-input-id"
          fieldName="language"
          setValue={setValue}
          helperText="Enter or choose a programming language"
        />
        <ControlledTextField
          name="years_experience"
          control={control}
          type="text"
          rules={{
            required: "This field is required",
            pattern: {
              value: /^\d+$/,
              message: "Only Positive numbers are accepted",
            },
          }}
          errors={errors}
          id="years-experience-input-id"
          label="Years Experience"
          helperText="Enter your experience in years"
          inputProps={{ inputMode: "numeric" }}
        />
        <ControlledTextField
          name="title"
          control={control}
          type="text"
          errors={errors}
          id="title-input-id"
          label="Post Title"
          helperText="Enter a title for your post"
          rules={{
            maxLength: {
              value: 64,
              message:
                "Please keep the title short and concise. (Up to Sixty-Four characters)",
            },
          }}
        />
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          wrapperClassName={editorStyles.wrapperClass}
          editorClassName={editorStyles.editorClass}
          toolbarClassName={editorStyles.toolbarClass}
          toolbar={{
            options: ["inline", "blockType"],
          }}
          hashtag={{
            separator: " ",
            trigger: "#",
          }}
          mention={{
            separator: " ",
            trigger: "@",
            suggestions: [
              { text: "JavaScript", value: "javascript", url: "js" },
              { text: "Golang", value: "golang", url: "go" },
            ],
          }}
        />
      </BaseForm>
      <Box display="flex" flexDirection="column" gap={2} mb={4}>
        <Box>
          <Typography textAlign="center">Preview</Typography>
          <Box className={`${editorStyles.preview}`}>
            <Typography
              dangerouslySetInnerHTML={createMarkup(convertedContent)}
            />
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
}

export default PostEditor;

export interface PostForm {
  company: string;
  country: string;
  post_type: string;
  job: string;
  seniority: string;
  language: string;
  years_experience: string;
  content: object;
  title: string;
}

const defaultPost: PostForm = {
  company: "",
  country: "",
  post_type: "",
  job: "",
  seniority: "",
  language: "",
  years_experience: "",
  content: {},
  title: "",
};

export interface Company {
  id: number;
  name: string;
}
