export const inPost = (title, filter) => {
  if (title.toLowerCase().includes(filter.toLowerCase())) {
    return true;
  }
  return false;
};
export const getIndexOfLastItem = (allPost, item) => {
  for (let i = 0; i < allPost.length; i++) {
    const post = allPost[i];
    if (post.id === item.id) {
      return i;
    }
  }
  return -1;
};
