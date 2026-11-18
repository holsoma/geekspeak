import { ImageResponse } from "next/og";
export const dynamic = "force-static";
export const alt = "GeekSpeak. Tech talk. Now you get it.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#f7f4ec",
        color: "#173548",
        padding: 65,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", fontSize: 32, fontWeight: 700 }}>
        GeekSpeak.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 105,
          lineHeight: 0.95,
          fontWeight: 900,
          letterSpacing: -5,
        }}
      >
        TECH TALK.
        <br />
        NOW YOU GET IT.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 27,
          background: "#ee855b",
          padding: "18px 26px",
          alignSelf: "flex-start",
        }}
      >
        200 useful terms. 10 packs. Zero streaks.
      </div>
    </div>,
    size,
  );
}
