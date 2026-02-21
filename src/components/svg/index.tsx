import { StyledComponent } from "@emotion/styled";
import { Box, BoxProps, styled } from "@mui/material"

export interface SvgViewerProps extends BoxProps {
  svg: string,
}

const CardBox: StyledComponent<BoxProps> = styled(Box)({
  width: "480px",
  height: "320px",
  backgroundColor: "#fff",
  borderRadius: 12,
  border: "1px solid #ccc"
});

export function SvgViewer({ svg, ...props }: SvgViewerProps) {
  return (
    <CardBox {...props} display="flex" justifyContent="center">
      <div dangerouslySetInnerHTML={{ __html: svg }} />
    </CardBox>
  )
}
