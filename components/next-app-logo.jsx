import clsx from "clsx";

export const NextAppLogo = ({ color, width, height, className }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 52 52"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color, padding: "2px" }}
      className={clsx(className, "rounded-lg")}
    >
      <g fill="none" fillRule="evenodd">
        <path fill="#DCDCDC" d="M-2102-176H702v1830h-2804z" />
        <text
          fontFamily=".AppleSystemUIFont"
          fontSize="11"
          fill="#000"
          transform="translate(-2102 -176)"
        >
          <tspan x="20" y="1822">
            Copyright © 2022 Apple Inc. All rights reserved.
          </tspan>
        </text>
        <text
          fontFamily=".AppleSystemUIFont"
          fontSize="22"
          fill="#000"
          transform="translate(-2102 -176)"
        >
          <tspan x="2686.375" y="27">
            macOS 12
          </tspan>
        </text>
        <text
          fontFamily=".AppleSystemUIFont"
          fontSize="22"
          fill="#000"
          transform="translate(-2102 -176)"
        >
          <tspan x="20" y="27">
            App Icons
          </tspan>
        </text>
        <g transform="translate(-6 -6)">
          <path fill="#3D3D3D" d="M6 6h52v52H6z" />
          <image
            width="64"
            height="64"
            xlinkHref="data:image/png;base64,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"
          />
        </g>
      </g>
    </svg>
  );
};
