type HomeIconProps = {
  className?: string;
  width?: number;
  height?: number;
};

export const HomeIcon = ({
  className = "",
  width = 15,
  height = 16,
}: HomeIconProps) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 31 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="home">
        <path
          id="Vector"
          d="M15.0986 8.11949L21.3486 13.7445V23.507H18.8486V16.007H11.3486V23.507H8.84863V13.7445L15.0986 8.11949ZM15.0986 4.75699L2.59863 16.007H6.34863V26.007H13.8486V18.507H16.3486V26.007H23.8486V16.007H27.5986L15.0986 4.75699Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
};

