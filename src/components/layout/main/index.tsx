import { styled } from "@mui/material/styles";
import { HEADER_HEIGHT, SIDEBAR_WIDTH, MAIN_PADDING_TOP, MAIN_PADDING_BOTTOM } from "@/components/layout/globalSetting";

export default styled("main") (({theme}) => ({
  paddingTop: HEADER_HEIGHT + MAIN_PADDING_TOP,
  [theme.breakpoints.up("xs")]: {
    paddingLeft: 0
  },
  [theme.breakpoints.up("sm")]: {
    paddingLeft: SIDEBAR_WIDTH
  },
  paddingRight: 0,
  paddingBottom: MAIN_PADDING_BOTTOM,
}))
