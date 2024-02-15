type InteractionIconProps = {
  className?: string;
  width?: number;
  height?: number;
};

export const InteractionIcon = ({
  className = '',
  width = 15,
  height = 16,
}: InteractionIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 31 31"
      className={className}
      fill="none"
    >
      <path
        d="M25.0986 3H5.09863C3.72363 3 2.59863 4.125 2.59863 5.5V28L7.59863 23H25.0986C26.4736 23 27.5986 21.875 27.5986 20.5V5.5C27.5986 4.125 26.4736 3 25.0986 3ZM25.0986 20.5H7.59863L5.09863 23V5.5H25.0986V20.5Z"
        fill="currentColor"
      />
    </svg>
  );
};

