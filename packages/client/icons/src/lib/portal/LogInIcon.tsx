type Props = {
  height?: number;
  width?: number;
  className?: string;
};

export const LoginIcon = ({ height = 15, width = 15, className = "" }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={height}
      height={width}
      viewBox="0 0 23 23"
      fill="none"
    >
      <path
        d="M10.2568 6.73771L8.9735 8.02104L11.3568 10.4044H2.00684V12.2377H11.3568L8.9735 14.621L10.2568 15.9044L14.8402 11.321L10.2568 6.73771ZM18.5068 17.7377H11.1735V19.571H18.5068C19.5152 19.571 20.3402 18.746 20.3402 17.7377V4.90438C20.3402 3.89604 19.5152 3.07104 18.5068 3.07104H11.1735V4.90438H18.5068V17.7377Z"
        // fill="#F1F4F6"
        fill="currentColor"
      />
    </svg>
  );
};

