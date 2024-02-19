type DashboardIconProps = {
  className?: string;
  width?: number;
  height?: number;
};

export const DashboardIcon = ({
  className = "",
  width = 15,
  height = 16,
}: DashboardIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
      viewBox="0 0 23 23"
      fill="none"
    >
      <path
        d="M13.0625 10.1203L11.1742 9.25859L13.0625 8.39692L13.9242 6.50859L14.7858 8.39692L16.6742 9.25859L14.7858 10.1203L13.9242 12.0086L13.0625 10.1203ZM3.84082 13.8419L4.70249 11.9536L6.59082 11.0919L4.70249 10.2303L3.84082 8.34192L2.97915 10.2303L1.09082 11.0919L2.97915 11.9536L3.84082 13.8419ZM7.96582 9.25859L8.96499 7.04942L11.1742 6.05025L8.96499 5.05109L7.96582 2.84192L6.96665 5.05109L4.75749 6.05025L6.96665 7.04942L7.96582 9.25859ZM4.29915 19.8003L9.79915 14.2911L13.4658 17.9578L21.2575 9.19442L19.965 7.90192L13.4658 15.2078L9.79915 11.5411L2.92415 18.4253L4.29915 19.8003Z"
        fill="currentColor"
      />
    </svg>
  );
};

