import React from "react";
import styled from "styled-components";

const PostMetaStyles = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.gray6B};
  .dot {
    display: inline-block;
    width: 4px;
    height: 4px;
    background-color: currentColor;
    border-radius: 100rem;
  }
  @media screen and (max-width: 1023.98px) {
    font-size: 10px;
    gap: 6px;
  }
`;
const PostMeta = ({
  className = "",
  date = "Mar 23",
  author = "Andiez Le",
}) => {
  return (
    <PostMetaStyles className={className}>
      <span className="time">{date}</span>
      <span className="dot"></span>
      <span className="author">{author}</span>
    </PostMetaStyles>
  );
};

export default PostMeta;
