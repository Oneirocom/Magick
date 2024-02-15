type TutorialIconProps = {
  className?: string;
  width?: number;
  height?: number;
};

export const TutorialIcon = ({
  className = "",
  width = 15,
  height = 16,
}: TutorialIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="video_library">
        <path
          id="Vector"
          d="M3.7653 6.11778H1.93197V18.9511C1.93197 19.9594 2.75697 20.7844 3.7653 20.7844H16.5986V18.9511H3.7653V6.11778ZM18.432 2.45111H7.43197C6.42364 2.45111 5.59864 3.27611 5.59864 4.28444V15.2844C5.59864 16.2928 6.42364 17.1178 7.43197 17.1178H18.432C19.4403 17.1178 20.2653 16.2928 20.2653 15.2844V4.28444C20.2653 3.27611 19.4403 2.45111 18.432 2.45111ZM18.432 15.2844H7.43197V4.28444H18.432V15.2844ZM11.0986 5.65944V13.9094L16.5986 9.78444L11.0986 5.65944Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
};

