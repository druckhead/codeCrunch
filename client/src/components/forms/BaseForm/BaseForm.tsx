import React, { Children, PropsWithChildren } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button, { ButtonTypeMap } from "@mui/material/Button";

const BaseForm = (props: PropsWithChildren<BaseFormProps>) => {
  const { handleSubmit, onSubmit, submitText, buttonColor, children } = props;

  const arrayChildren = Children.toArray(children);

  return (
    <React.Fragment>
      <Grid
        container
        direction={`column`}
        gap={2}
        component={`form`}
        onSubmit={handleSubmit(onSubmit)}
        alignContent="center"
        sx={{
          width: "100%",
          "& .FormErrorText-root, .FormErrorText-root::before": {
            fontSize: "0.75rem",
            fontWeight: 600,
          },
          "& .FormErrorText-root": {
            pl: "14px",
          },
        }}
      >
        {Children.map(arrayChildren, (child, index) => {
          return (
            <React.Fragment>
              <Grid item key={index}>
                {child}
              </Grid>
            </React.Fragment>
          );
        })}
        {submitText && (
          <Grid item>
            <Button
              variant="contained"
              fullWidth
              color={buttonColor}
              type="submit"
            >
              {submitText}
            </Button>
          </Grid>
        )}
      </Grid>
    </React.Fragment>
  );
};

interface BaseFormProps {
  handleSubmit: Function;
  onSubmit: Function;
  submitText?: string;
  buttonColor?: ButtonTypeMap["props"]["color"];
}

export default BaseForm;
