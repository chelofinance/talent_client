import React from "react";
import ReactBlockies from "react-blockies";

export interface BlockiesProps {
  seed: string;
  size?: number;
  scale?: number;
  color?: string;
  bgColor?: string;
  spotColor?: string;
  className?: string;
}

const Blockies: React.FC<BlockiesProps> = ({
  seed,
  color,
  bgColor,
  spotColor,
  size = 15,
  scale = 3,
  className = "",
}) => {
  return (
    <ReactBlockies
      seed={seed}
      size={size}
      scale={scale}
      color={color}
      bgColor={bgColor}
      spotColor={spotColor}
      className={className}
    />
  );
};

export default Blockies;
