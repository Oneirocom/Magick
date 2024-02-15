type StarIconProps = {
  className?: string;
  width?: number;
  height?: number;
};

export const StarIcon = ({
  className = '',
  width = 16,
  height = 15,
}: StarIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 15"
      fill="none"
      className={className}
      width={width}
      height={height}
    >
      <g clipPath="url(#clip0_2313_10977)">
        <path
          d="M11.9736 5.62503L12.7549 3.90628L14.4736 3.12503L12.7549 2.34378L11.9736 0.625031L11.1924 2.34378L9.47363 3.12503L11.1924 3.90628L11.9736 5.62503Z"
          fill="currentColor"
        />
        <path
          d="M11.9736 9.37503L11.1924 11.0938L9.47363 11.875L11.1924 12.6563L11.9736 14.375L12.7549 12.6563L14.4736 11.875L12.7549 11.0938L11.9736 9.37503Z"
          fill="currentColor"
        />
        <path
          d="M7.28613 5.93753L5.72363 2.50003L4.16113 5.93753L0.723633 7.50003L4.16113 9.06253L5.72363 12.5L7.28613 9.06253L10.7236 7.50003L7.28613 5.93753ZM6.34238 8.11878L5.72363 9.48128L5.10488 8.11878L3.74238 7.50003L5.10488 6.88128L5.72363 5.51878L6.34238 6.88128L7.70488 7.50003L6.34238 8.11878Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_2313_10977">
          <rect
            width="15"
            height="15"
            fill="currentColor"
            transform="translate(0.0986328 3.05176e-05)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

