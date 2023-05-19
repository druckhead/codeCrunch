import { KeyboardArrowUp } from "@mui/icons-material";
import { Box, Fab, Zoom, useScrollTrigger } from "@mui/material";
import { useCallback } from "react";
import { BaseFabProps } from "../NewPostFab/NewPostFab";

const ScrollToTopFab = (props: BaseFabProps) => {
  // Use `window` instead of `body` as `document` will be `undefined` when the
  // hooks first runs. By default, useScrollTrigger will attach itself to `window`.
  const trigger = useScrollTrigger({
    // Number of pixels needed to scroll to toggle `trigger` to `true`.
    target: window,
    disableHysteresis: true,
    threshold: 100,
  });

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { top, left, right, bottom } = props;

  const noPositionProps = [top, left, right, bottom].every(
    (value) => value === undefined
  );

  return (
    <Zoom in={trigger}>
      <Box
        role="presentation"
        // Place the button in the bottom right corner.
        sx={{
          position: "fixed",
          top: top ? top : undefined,
          left: left ? left : undefined,
          bottom: {
            xs: bottom ? bottom : noPositionProps ? 80 : undefined,
            sm: bottom ? bottom : noPositionProps ? 32 : undefined,
          },
          right: {
            xs: right ? right : noPositionProps ? 32 : undefined,
            sm: right ? right : noPositionProps ? 80 : undefined,
          },
          zIndex: 1,
        }}
      >
        <Fab
          onClick={scrollToTop}
          color="warning"
          size="small"
          aria-label="Scroll back to top"
        >
          <KeyboardArrowUp fontSize="medium" />
        </Fab>
      </Box>
    </Zoom>
  );
};

export default ScrollToTopFab;
