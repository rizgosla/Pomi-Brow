// The glow on a pale-pink link tile (LinkTiles.astro): a soft white light that follows the
// mouse. The tile's CSS draws it; this script only tells it where the pointer is, as --x / --y.
//
// Why it is built this way:
// - One listener per group of tiles, not one per tile. The group finds the tile under the
//   pointer itself, so nine tiles cost one listener.
// - At most one measurement a frame, of that one tile. Pointer events can arrive faster than
//   the screen redraws, and measuring on every event would force layout for frames that
//   never paint.
// - Mouse only. The glow answers hover, which a finger does not have. The CSS shows it only
//   under (hover: hover) and (pointer: fine), and this checks the same query, so it never
//   does work that nobody sees.
// - Everything else stays in CSS: the look, the fade, the still glow on keyboard focus,
//   reduced motion and forced colours.

const FINE_HOVER = "(hover: hover) and (pointer: fine)";

let started = false;

function start() {
  // Once per page, however many tile groups render.
  if (started) return;
  started = true;

  const fine = window.matchMedia(FINE_HOVER);

  document.querySelectorAll<HTMLElement>("[data-spotlight]").forEach((group) => {
    let tile: HTMLElement | null = null;
    let x = 0;
    let y = 0;
    let frame = 0;

    const paint = () => {
      frame = 0;
      if (!tile) return;
      // Relative to the tile, because that is what the gradient's "at" position is measured from.
      const box = tile.getBoundingClientRect();
      tile.style.setProperty("--x", `${x - box.left}px`);
      tile.style.setProperty("--y", `${y - box.top}px`);
    };

    group.addEventListener(
      "pointermove",
      (e) => {
        if (e.pointerType !== "mouse" || !fine.matches) return;
        const over = (e.target as Element).closest<HTMLElement>(".linktile");
        if (!over) return;
        tile = over;
        x = e.clientX;
        y = e.clientY;
        if (!frame) frame = requestAnimationFrame(paint);
      },
      { passive: true },
    );
  });
}

start();
