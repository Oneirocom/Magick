export const MagickWatermark = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 422.93 372.16"
    {...props}
  >
    <defs>
      <linearGradient
        id="a"
        x1={211.46}
        x2={211.46}
        y1={297.64}
        y2={196.69}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0} stopColor="#21c2e9" />
        <stop offset={1} stopColor="#c6e8f0" />
      </linearGradient>
      <linearGradient
        xlinkHref="#a"
        id="b"
        x1={211.46}
        x2={211.46}
        y1={391.3}
        y2={40}
      />
      <linearGradient
        xlinkHref="#a"
        id="c"
        x1={211.46}
        x2={211.46}
        y1={391.3}
        y2={-707.07}
      />
    </defs>
    <g data-name="Layer 2">
      <g data-name="Layer 1">
        <circle
          cx={211.46}
          cy={258.66}
          r={45.03}
          style={{
            fill: 'url(#a)',
          }}
        />
        <path
          d="M244.06 372.16h-65.2v-29.72A22.14 22.14 0 0 1 201 320.29h20.89a22.14 22.14 0 0 1 22.15 22.15Z"
          style={{
            fill: 'url(#b)',
          }}
        />
        <path
          d="M401 372.16h-37.36l-79.22-137.23-73.23-126.88L145 222.74 58.74 372.16H21.92A21.89 21.89 0 0 1 3 339.33L192.5 11a21.89 21.89 0 0 1 37.92 0L420 339.33a21.88 21.88 0 0 1-19 32.83Z"
          style={{
            fill: 'url(#c)',
          }}
        />
      </g>
    </g>
  </svg>
)
