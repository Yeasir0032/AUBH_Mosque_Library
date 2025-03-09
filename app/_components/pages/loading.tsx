import React from "react";

const LoadingSection = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <svg className="w-full h-full">
        <text
          x="50%"
          y="50%"
          dy=".35em"
          textAnchor="middle"
          className="stroke-anim text-5xl"
          strokeWidth={2}
          stroke="red"
        >
          AUBH Mosque
        </text>
      </svg>
    </div>
  );
};

export default LoadingSection;
