import React from "react";

export const AnimatedLoader = ({ width, height, fill }) => {
  return (
    <div className="flex justify-center">
      <svg
        version="1.1"
        id="L9"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        enableBackground="new 0 0 0 0"
        width={`${width}px`}
        height={`${height}px`}
      >
        <path
          fill={fill}
          d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            dur="1s"
            from="0 50 50"
            to="360 50 50"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  );
};

AnimatedLoader.defaultProps = {
  width: 200,
  height: 200,
  fill: "#6851ff",
};
