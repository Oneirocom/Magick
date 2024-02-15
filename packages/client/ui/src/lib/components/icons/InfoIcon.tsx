type InfoIconProps = {
  className?: string;
  width?: number;
  height?: number;
};

export const InfoIcon = ({
  className = "",
  width = 15,
  height = 16,
}: InfoIconProps) => {
  return (
    <svg
      width={width}
      className={className}
      height={height}
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.625 4.55168H10.375V6.21834H8.625V4.55168ZM8.625 7.88501H10.375V12.885H8.625V7.88501ZM9.5 0.38501C4.67 0.38501 0.75 4.11834 0.75 8.71834C0.75 13.3183 4.67 17.0517 9.5 17.0517C14.33 17.0517 18.25 13.3183 18.25 8.71834C18.25 4.11834 14.33 0.38501 9.5 0.38501ZM9.5 15.385C5.64125 15.385 2.5 12.3933 2.5 8.71834C2.5 5.04334 5.64125 2.05168 9.5 2.05168C13.3587 2.05168 16.5 5.04334 16.5 8.71834C16.5 12.3933 13.3587 15.385 9.5 15.385Z"
        fill="currentColor"
      />
    </svg>
  );
};

