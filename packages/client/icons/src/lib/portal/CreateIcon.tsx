type CreateIconProps = {
  className?: string;
  width?: number;
  height?: number;
};

export const CreateIcon = ({
  className = '',
  width = 18,
  height = 16,
}: CreateIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 18 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.7768 7.33321V1.99988H10.7883V3.99988H6.51242V1.99988H1.52392V7.33321H6.51242V5.33321H7.93771V11.9999H10.7883V13.9999H15.7768V8.66654H10.7883V10.6665H9.363V5.33321H10.7883V7.33321H15.7768ZM5.08714 5.99988H2.94921V3.33321H5.08714V5.99988ZM12.2136 9.99988H14.3515V12.6665H12.2136V9.99988ZM12.2136 3.33321H14.3515V5.99988H12.2136V3.33321Z"
        fill="currentColor"
      />
    </svg>
  );
};

