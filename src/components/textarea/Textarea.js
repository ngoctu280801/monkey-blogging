import React from "react";
import { useController } from "react-hook-form";
import styled from "styled-components";

const TextareaStyles = styled.div`
  position: relative;
  width: 100%;
  textarea {
    width: 100%;
    padding: ${(props) => (props.hasIcon ? "20px 60px 20px 20px" : "20px")};
    background-color: ${(props) => props.theme.grayLight};
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2 linear;
    border: 1px solid transparent;
    resize: none;
    height: 200px;
  }
  textarea:focus {
    background-color: #fff;
    border: 1px solid ${(props) => props.theme.primary};
  }
  textarea::-webkit-input-placeholder {
    color: #84878b;
  }
  textarea::-moz-input-placeholder {
    color: #84878b;
  }
`;
const Textarea = ({ name = "", type = "text", control, ...props }) => {
  const { field } = useController({ control, name, defaultValue: "" });
  return (
    <TextareaStyles>
      <textarea id={name} type={type} {...field} {...props} />
    </TextareaStyles>
  );
};

export default Textarea;
