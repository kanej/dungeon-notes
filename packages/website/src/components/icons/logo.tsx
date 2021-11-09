import * as React from 'react'

const Logo = (props: React.SVGProps<SVGSVGElement>): JSX.Element => {
  return (
    <svg
      version="1.1"
      baseProfile="full"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="75 100 340 340"
      height={40}
      width={40}
      {...props}
    >
      <g>
        <path
          d="M 330.88704528131177 296.91097929422534 L 258.01357527815765 341.3095732750843 L 183.12652999684582 300.39859398085895 L 181.1129547186882 215.0890207057747 L 253.98642472184235 170.69042672491574 L 328.8734700031541 211.601406019141 Z"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
        />
        <path
          d="M 258.01357527815765 341.3095732750843 L 181.1129547186882 215.0890207057747 L 328.8734700031541 211.601406019141 Z"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
        />
        <path
          d="M 219.56326499842294 278.1992969904295 L 254.99321236092118 213.34521336245786 L 293.4435226406559 276.45548964711264 Z"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
        />
        <path
          d="M 330.88704528131177 296.91097929422534 L 293.4435226406559 276.45548964711264 Z"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
        />
        <path
          d="M 183.12652999684582 300.39859398085895 L 219.56326499842294 278.1992969904295 Z"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
        />
        <path
          d="M 253.98642472184235 170.69042672491574 L 254.99321236092118 213.34521336245786 Z"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
        />
      </g>
      <g stroke="currentColor" strokeWidth="8" fill="none">
        <rect x="128" y="128" width="256" height="256" />
        <path
          d="M 108 148
a 20 20 0 0 1 20 -20"
        />
        <path
          d="M 128 424
A 10 10 0 0 1 128 384"
        />
        <path
          d="M 379 424
A 300 100 0 0 1 379 384"
        />
        <line x1="128" y1="424" x2="384" y2="424" />
        <line x1="108" y1="148" x2="108" y2="404" />
      </g>
    </svg>
  )
}

export default Logo
