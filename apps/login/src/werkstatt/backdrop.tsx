// wunderwerk: the Werkstatt backdrop behind every login page. A blueprint grid
// fading to the edges, and the wunderwerk-ci line drawings (public/werkstatt)
// as CSS masks, so the branding colours ink them. Desktop only; styles live in
// ./werkstatt.css.
//
//   rocket (primary ink)        card        TV, typewriter (muted ink)

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const DRAWINGS = [
  { name: "rocket", file: "rocket.svg" },
  { name: "tv", file: "tv.svg" },
  { name: "typewriter", file: "typewriter.svg" },
] as const;

export function WerkstattBackdrop() {
  return (
    <div data-ww="backdrop" aria-hidden="true">
      <div data-ww="blueprint" />
      {DRAWINGS.map((d) => (
        <div
          key={d.name}
          data-ww="drawing"
          data-drawing={d.name}
          style={{ maskImage: `url(${BASE_PATH}/werkstatt/${d.file})` }}
        />
      ))}
    </div>
  );
}
