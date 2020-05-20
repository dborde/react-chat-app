import React from "react";

import Skeleton from "react-skeleton-loader";

const LoaderSkeleton = ({ count = 1, height = "3rem" }) => (
  <Skeleton
    borderRadius={0}
    width="100%"
    widthRandomness={0}
    color="#d8d8d8"
    height={height}
    count={count}
  />
);

export default LoaderSkeleton;
