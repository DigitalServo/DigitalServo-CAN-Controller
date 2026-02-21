import React from "react";
import SVGIcon from "@/svg/401.svg";

import ErrorPage from "./index";

export default function UnauthorizedError(): React.ReactElement {
  return (
    <ErrorPage
      icon={SVGIcon}
      sx={{ width: 450, height: "50vh", mt: 4 }}
      errorNumber={401}
      errorText="This page is not available for unauthorized user."
    />
  );
}
