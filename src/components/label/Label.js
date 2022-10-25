import React, { memo } from "react";
import styled from "styled-components";

const LabelStyles = styled.label`
  color: ${(props) => props.theme.grayDark};
  cursor: pointer;
  font-weight: 600;
`;
const Label = memo(({ htmlFor = "", children, ...props }) => {
  return (
    <LabelStyles htmlFor={htmlFor} {...props}>
      {children}
    </LabelStyles>
  );
});

export default Label;
