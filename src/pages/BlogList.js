import React from "react";
import { Button } from "../components/button";
import Heading from "../components/layout/Heading";
import PostItem from "../module/post/PostItem";
import PropTypes from "prop-types";

const BlogList = ({
  title = "",
  handleSetFilter = () => {},
  posts = [],
  handleLoadmorePost = () => {},
  total = 0,
}) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <Heading>{title}</Heading>
        <input
          placeholder="Search a post..."
          className="py-4 px-5 mb-5 border border-gray-300 outline-none rounded-lg"
          onChange={handleSetFilter}
        ></input>
      </div>
      <div className="grid-layout grid-layout--primary">
        {posts.map((item) => (
          <PostItem key={item.id} data={item}></PostItem>
        ))}
      </div>
      {posts.length < total && (
        <Button onClick={handleLoadmorePost} className="mx-auto mt-10 ">
          Load more
        </Button>
      )}
    </>
  );
};
BlogList.propTypes = {
  title: PropTypes.string.isRequired,
  handleLoadmorePost: PropTypes.func,
  handleSetFilter: PropTypes.func,
  posts: PropTypes.array,
  total: PropTypes.number,
};

export default BlogList;
