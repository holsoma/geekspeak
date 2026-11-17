import type { CSSProperties } from "react";
export function Logo({
  className = "",
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      className={className}
      aria-hidden={!title}
      role={title ? "img" : undefined}
    >
      {title && <title>{title}</title>}
      <path
        fill="currentColor"
        d="M16 84V67C8 55 8 40 11 29 15 13 27 7 40 8c18 1 27 12 25 28l9 13c2 4-1 7-8 7v9c0 8-5 13-15 13h-7v6H16Z"
      />
      <path
        d="M79 36c8 8 8 20 0 28M87 25c13 14 13 36 0 50"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function Arrow({
  diagonal = false,
  className = "",
}: {
  diagonal?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={`arrow ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h16m-7-7 7 7-7 7"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m5 12 4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.26-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.82c.85 0 1.7.12 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.66.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}
export function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle
        cx="10.5"
        cy="10.5"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m16 16 5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function PackArt({
  symbol,
  className = "",
  style,
}: {
  symbol: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 280 210"
      className={`pack-art ${className}`}
      style={style}
      fill="none"
      aria-hidden="true"
    >
      {symbol === "spark" && (
        <>
          <path
            d="m141 19 17 57 58-18-34 47 48 35-59-1-1 58-29-50-50 30 21-55-55-21 58-12Z"
            fill="currentColor"
          />
          <circle cx="141" cy="110" r="23" fill="var(--pack-colour)" />
          <path
            d="m56 29 4 13 14 4-14 4-4 14-4-14-14-4 14-4Z"
            fill="currentColor"
          />
          <circle cx="224" cy="184" r="6" fill="currentColor" />
        </>
      )}
      {symbol === "search" && (
        <>
          <g stroke="currentColor" strokeWidth="2">
            <path d="M40 40h120v136H40z" />
            <path d="M55 25h120v136H55z" />
            <path d="M75 49h75M75 65h63M75 81h57M75 97h68" />
          </g>
          <circle
            cx="175"
            cy="115"
            r="42"
            fill="var(--pack-colour)"
            stroke="currentColor"
            strokeWidth="12"
          />
          <path
            d="m205 147 40 40"
            stroke="currentColor"
            strokeWidth="18"
            strokeLinecap="round"
          />
          <path
            d="M164 115h22m-11-11v22"
            stroke="currentColor"
            strokeWidth="3"
          />
        </>
      )}
      {symbol === "agent" && (
        <>
          <path
            d="M69 66c0-15 12-27 27-27h87c15 0 27 12 27 27v68c0 15-12 27-27 27h-25l-23 24v-24H96c-15 0-27-12-27-27Z"
            fill="currentColor"
          />
          <circle cx="113" cy="91" r="13" fill="var(--pack-colour)" />
          <circle cx="166" cy="91" r="13" fill="var(--pack-colour)" />
          <path
            d="M140 17v22M46 84v37M233 84v37"
            stroke="currentColor"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M119 129h40"
            stroke="var(--pack-colour)"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </>
      )}
      {symbol === "nodes" && (
        <>
          <g stroke="currentColor" strokeWidth="2">
            {[40, 105, 170].flatMap((y) =>
              [55, 105, 155].map((z) => (
                <path key={`${y}-${z}`} d={`M60 ${y} 140 ${z} 220 ${105}`} />
              )),
            )}
          </g>
          {[40, 105, 170].map((y) => (
            <circle key={y} cx="60" cy={y} r="17" fill="currentColor" />
          ))}
          {[55, 105, 155].map((y) => (
            <circle
              key={y}
              cx="140"
              cy={y}
              r="17"
              fill="var(--pack-colour)"
              stroke="currentColor"
              strokeWidth="3"
            />
          ))}
          <circle cx="220" cy="105" r="25" fill="currentColor" />
        </>
      )}
      {symbol === "eye" && (
        <>
          <path
            d="M26 105Q140-19 254 105 140 229 26 105Z"
            stroke="currentColor"
            strokeWidth="3"
          />
          <circle cx="140" cy="105" r="47" fill="currentColor" />
          <circle cx="151" cy="93" r="17" fill="var(--pack-colour)" />
          <path
            d="M49 31H26v23m205-23h23v23M26 156v23h23m182 0h23v-23"
            stroke="currentColor"
            strokeWidth="4"
          />
        </>
      )}
      {symbol === "gauge" && (
        <>
          <path
            d="M54 153a86 86 0 1 1 172 0"
            stroke="currentColor"
            strokeWidth="24"
          />
          <path d="m140 141 44-66-23 78Z" fill="currentColor" />
          <circle cx="140" cy="146" r="15" fill="currentColor" />
          <path d="M58 179h164" stroke="currentColor" strokeWidth="3" />
          <path
            d="m76 83 15 12m47-46v20m59 13-15 13"
            stroke="var(--pack-colour)"
            strokeWidth="4"
          />
        </>
      )}
      {symbol === "code" && (
        <>
          <path
            d="m90 55-55 50 55 50m100-100 55 50-55 50M158 28l-36 154"
            stroke="currentColor"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M29 183h30m162-156h30"
            stroke="currentColor"
            strokeWidth="3"
          />
        </>
      )}
      {symbol === "database" && (
        <>
          <path d="M63 57v101c0 41 154 41 154 0V57" fill="currentColor" />
          <ellipse
            cx="140"
            cy="57"
            rx="77"
            ry="27"
            fill="var(--pack-colour)"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            d="M63 91c0 37 154 37 154 0M63 125c0 37 154 37 154 0"
            stroke="var(--pack-colour)"
            strokeWidth="3"
          />
          <circle cx="191" cy="152" r="5" fill="var(--pack-colour)" />
        </>
      )}
      {symbol === "system" && (
        <>
          <g stroke="currentColor" strokeWidth="3">
            <path d="M139 73v35M60 137v-29h160v29" />
            <rect
              x="97"
              y="20"
              width="85"
              height="54"
              rx="5"
              fill="currentColor"
            />
            <rect x="21" y="137" width="78" height="53" rx="5" />
            <rect x="182" y="137" width="78" height="53" rx="5" />
          </g>
          <circle cx="140" cy="108" r="9" fill="currentColor" />
          <path
            d="M114 38h50m-50 17h31"
            stroke="var(--pack-colour)"
            strokeWidth="3"
          />
          <path
            d="M38 155h44m-44 15h25m161-15h44m-44 15h25"
            stroke="currentColor"
            strokeWidth="3"
          />
        </>
      )}
      {symbol === "cloud" && (
        <>
          <path
            d="M72 141C19 139 24 70 73 67c10-59 102-58 114 3 58-8 79 72 16 72Z"
            fill="currentColor"
          />
          <path
            d="M113 110v68m-16-16 16 16 16-16M163 178v-68m-16 16 16-16 16 16"
            stroke="var(--pack-colour)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M113 148v30m-16-16 16 16 16-16M163 178v-30"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}
