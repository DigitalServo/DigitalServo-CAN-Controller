import React from "react";
import SVGIcon from "@/svg/403.svg";

import ErrorPage from "./index";

export default function ForbiddenError(): React.ReactElement {
  return (
    <ErrorPage
      icon={SVGIcon}
      sx={{ width: 450, height: "50vh", mt: 4 }}
      errorNumber={403}
      errorText="Access to this page was denied. You don't have the authority."
    />
  );
}
