import { Fab } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";

const NewPostFab = (props: NewPostFabProps) => {
  const { onClick } = props;

  const { top, left, right, bottom } = props;

  const noPositionProps = [top, left, right, bottom].every(
    (value) => value === undefined
  );

  return (
    <React.Fragment>
      <Fab
        onClick={onClick}
        color="primary"
        size="small"
        aria-label="Create a new post"
        sx={{
          zIndex: 1,
          position: "fixed",
          top: top ? top : undefined,
          left: left ? left : undefined,
          bottom: bottom ? bottom : noPositionProps ? 32 : undefined,
          right: right ? right : noPositionProps ? 32 : undefined,
        }}
      >
        <AddIcon />
      </Fab>
    </React.Fragment>
  );
};

export default NewPostFab;

export interface BaseFabProps {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

interface NewPostFabProps extends BaseFabProps {
  onClick: () => void;
}
