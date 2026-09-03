/* objects.js — the procedural hero objects, one per client site.
 *
 * Each builder takes (THREE, ctx) from hero3d.mountHero and returns a Group.
 * ctx gives {mat, h, tex, paint} — see hero3d.js.
 *
 * Modelling notes that matter for realism:
 *  - Anything turned on a lathe in reality is built with LatheGeometry from a
 *    hand-authored profile. Straight cylinders read as toys; a profile with a
 *    shoulder, a taper and a fillet reads as machined.
 *  - Flat forged parts (scissor blades, clipper blades, wrench jaws) use
 *    ExtrudeGeometry with a bevel so the edges catch a highlight.
 *  - Patterns (barber stripes, coil windings, tyre tread) are canvas textures
 *    rather than geometry — far cheaper and more convincing at this scale.
 */

/* ---------------------------------------------------------------- BARBER POLE
   Humble Barbershop. Glass sleeve over a helical stripe, chrome end caps
   lathed from a real turned profile, wall bracket. */

/* Extracted for this site only — the full library of 11 hero objects
   lives in _shared/objects.js. Regenerate with tools/build_site.py. */

export function tattooMachine(THREE, ctx) {
  const {mat, h, tex} = ctx;
  const g = new THREE.Group();

  const coilTex = tex(96, 256, (c, w, hh) => {
    const grd = c.createLinearGradient(0, 0, w, 0);
    grd.addColorStop(0, '#5C3213'); grd.addColorStop(0.3, '#B87333');
    grd.addColorStop(0.5, '#E4AE72'); grd.addColorStop(0.72, '#A9622A');
    grd.addColorStop(1, '#4E2A10');
    c.fillStyle = grd; c.fillRect(0, 0, w, hh);
    c.lineWidth = 1.6;
    for (let y = -4; y < hh + 6; y += 5.2) {
      c.strokeStyle = 'rgba(38,18,6,.5)';
      c.beginPath(); c.moveTo(0, y); c.lineTo(w, y + 3); c.stroke();
      c.strokeStyle = 'rgba(255,214,170,.22)';
      c.beginPath(); c.moveTo(0, y + 2); c.lineTo(w, y + 5); c.stroke();
    }
  }, [3, 1]);
  const copper = new THREE.MeshPhysicalMaterial({
    map: coilTex, metalness: 1, roughness: 0.34, envMapIntensity: 1.8
  });

  [[2.85,0.22,1.00, 0.10,-1.15,0],
   [0.30,2.30,0.90, 1.38,-0.08,0],
   [1.75,0.26,0.80, 0.62, 1.05,0],
   [0.28,1.15,0.76,-0.22, 0.52,0]].forEach(p => {
    g.add(h.at(h.box(p[0], p[1], p[2], mat.steel), p[3], p[4], p[5]));
  });
  g.add(h.at(h.box(2.87, 0.05, 1.02, mat.darkMetal), 0.10, -1.26, 0));

  [0.10, 1.00].forEach(x => {
    g.add(h.at(h.cyl(0.36, 0.36, 1.15, copper, 48), x, -0.45, 0));
    g.add(h.at(h.cyl(0.44, 0.44, 0.09, mat.darkMetal), x, 0.16, 0));
    g.add(h.at(h.cyl(0.44, 0.44, 0.09, mat.darkMetal), x, -1.06, 0));
    g.add(h.at(h.cyl(0.10, 0.10, 1.55, mat.brass, 24), x, -0.45, 0));
  });

  const arma = h.at(h.box(1.85, 0.11, 0.46, mat.steel), 0.58, 0.36, 0);
  arma.rotation.z = -0.05;
  g.add(arma,
        h.at(h.box(0.07, 0.60, 0.34, mat.steel), 1.30, 0.64, 0),
        h.at(h.box(0.07, 0.70, 0.34, mat.steel), -0.18, 0.04, 0),
        h.at(h.cyl(0.055, 0.055, 0.5, mat.steel, 20), 1.20, 0.80, 0));

  g.add(h.at(h.lathe([[0,0],[0.17,0.02],[0.21,0.10],[0.20,0.20],[0.12,0.26],[0,0.28]],
                     mat.brass, 32), 1.20, 1.04, 0));

  g.add(h.at(h.lathe([[0,0],[0.15,0],[0.17,0.16],[0.26,0.30],[0.27,1.15],
                      [0.22,1.30],[0.23,1.95],[0.30,2.05],[0.30,2.20],[0,2.24]],
                     mat.steel, 56), -0.22, -2.05, 0));
  g.add(h.at(h.cyl(0.285, 0.285, 0.55, mat.darkMetal, 44), -0.22, -1.02, 0));
  g.add(h.at(h.cyl(0.032, 0.032, 2.6, mat.steel, 16), -0.22, -0.62, 0));
  g.add(h.at(h.cyl(0.006, 0.03, 0.34, mat.darkMetal, 12), -0.22, -2.14, 0));

  const band = h.tor(0.30, 0.028, mat.rubber, 40);
  band.position.set(0.20, 0.32, 0); band.rotation.y = Math.PI / 2;
  const nub = h.at(h.cyl(0.09, 0.09, 0.3, mat.darkMetal, 20), 1.38, -0.95, 0);
  nub.rotation.z = Math.PI / 2;
  g.add(band, nub);

  return g;
}

/* ------------------------------------------------------------- BOX STACK
   Spring Cleaning Co. (cleaning + junk removal). Corrugated cardboard is the
   whole read here, so the texture does the work: fluted edges, tape seam and
   a slightly warm, non-uniform brown. Flat boxes with clean edges look like
   toy blocks. */
