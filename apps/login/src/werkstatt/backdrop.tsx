// wunderwerk: the Werkstatt backdrop behind every login page. A blueprint grid
// fading to the edges, and the wunderwerk-ci line drawings as CSS masks, so the
// branding colours ink them. Desktop only; styles and the drawing files are
// wired in ./werkstatt.css (bundled: the standalone image serves no public/).
//
//   rocket (primary ink)        card        TV, typewriter (muted ink)

const DRAWINGS = ["rocket", "tv", "typewriter"] as const;

export function WerkstattBackdrop() {
  return (
    <div data-ww="backdrop" aria-hidden="true">
      <div data-ww="blueprint" />
      {DRAWINGS.map((name) => (
        <div key={name} data-ww="drawing" data-drawing={name} />
      ))}
    </div>
  );
}
