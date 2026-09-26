interface MasCoreLogoProps {
  compact?: boolean;
  showText?: boolean;
}

export default function MasCoreLogo({
  compact = false,
  showText = true,
}: MasCoreLogoProps) {
  return (
    <div
      className={`mascore-logo ${
        compact ? "mascore-logo-compact" : ""
      }`}
      aria-label="MasCore"
    >
      <div className="mascore-logo-mark">
        <svg
          className="mascore-logo-svg"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect
            x="1"
            y="1"
            width="46"
            height="46"
            rx="14"
            className="mascore-logo-frame"
          />

          <path
            d="M13 32V16L24 27L35 16V32"
            className="mascore-logo-m"
          />

          <path
            d="M18 16H13V21"
            className="mascore-logo-detail"
          />

          <circle
            cx="35"
            cy="16"
            r="2.2"
            className="mascore-logo-dot"
          />
        </svg>
      </div>

      {showText && (
        <div className="mascore-logo-text">
          <span className="mascore-logo-name">
            MasCore
          </span>

          {!compact && (
            <span className="mascore-logo-subtitle">
              DIGITAL WORKSPACE
            </span>
          )}
        </div>
      )}
    </div>
  );
}