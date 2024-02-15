type EditIconProps = {
  height?: number;
  width?: number;
  className?: string;
};

export const EditIcon = ({
  height = 15,
  width = 15,
  className = "",
}: EditIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 17 17"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.3995 5.89262L11.2045 6.69762L3.27705 14.6251H2.47205V13.8201L10.3995 5.89262ZM13.5495 0.625122C13.3308 0.625122 13.1033 0.712622 12.937 0.878872L11.3358 2.48012L14.617 5.76137L16.2183 4.16012C16.5595 3.81887 16.5595 3.26762 16.2183 2.92637L14.1708 0.878872C13.9958 0.703872 13.777 0.625122 13.5495 0.625122ZM10.3995 3.41637L0.722046 13.0939V16.3751H4.0033L13.6808 6.69762L10.3995 3.41637Z"
        fill="currentColor"
      />
    </svg>
  );
};

