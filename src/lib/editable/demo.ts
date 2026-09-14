import type { Storyboard } from "./schema";

/** Canonical reverse-engineered "Earth" cut — ships so the studio is playable with no API key. */
export const EARTH_STORYBOARD: Storyboard = {
  theme: "Earth",
  title: "The Untouchable Planet",
  logline:
    "A universe of silent worlds. One sphere refuses to be forgotten — named, spun, and slammed into the drop.",
  durationSeconds: 32.4,
  vectorSpine:
    "hold_push → slam_in → rotational_zoom_cw → whip_pan_right → snap_zoom_in → orbital_ccw → whip_pan_left → vertical_whip_up → slam_in → orbital_cw → snap_zoom_in → orbital_cw",
  hiddenThread:
    "Every cut rhymes a rotation or inward punch: planets, dancers, irises, voxel worlds and bootprints all spin or fall toward a center named Earth.",
  audio: {
    style: "Dark aura funk, slowed + reverb, sparse 808s, distant metallic bells",
    bpm: 90,
    dropTimestamp: 8.6,
    dialogue: [
      {
        time: 0.2,
        text: "In a universe filled with billions of planets.",
        voice: "dry cinematic narrator, close, no room, male, measured",
      },
      {
        time: 3.6,
        text: "Some are silent. Forgotten.",
        voice: "same narrator, slightly quieter, almost swallowed",
      },
      {
        time: 6.4,
        text: "But there is one that stands untouchable.",
        voice: "narrator leans in, a grain of arrogance",
      },
      {
        time: 8.6,
        text: "YOU DON'T SEEM TO UNDERSTAND.",
        voice: "shouted hook, clipped consonants, over the kick",
      },
      {
        time: 11.2,
        text: "We call it Earth.",
        voice: "low, close, after the first snap zoom",
      },
    ],
    structure: [
      { section: "cold_open", start: 0, end: 7.4, cue: "dry VO over a low sub drone, no beat" },
      { section: "hitch", start: 7.4, end: 8.6, cue: "silence hitch, then slam into the named sphere" },
      { section: "drop", start: 8.6, end: 24.2, cue: "aura funk drop, kicks land on every cut" },
      { section: "climax", start: 24.2, end: 30.6, cue: "hats double, flashes on snares, density up" },
      { section: "hold", start: 30.6, end: 32.4, cue: "orbital hold, bass tail, last word of the world" },
    ],
  },
  clips: [
    {
      index: 1,
      start: 0,
      duration: 3.8,
      beat: "cold_open",
      subject: "The Milky Way core from beyond the heliopause, a warmer speck not yet named",
      juxtapositionRole: "cosmic",
      kineticRhyme: "Slow inward drift — the whole edit is a fall toward a center",
      prompt:
        "1:1 square frame, photoreal cinematic 24fps, extreme wide of the Milky Way core from a silent vantage beyond the solar heliopause, billions of cold pin-prick stars, a dusty band, one slightly warmer speck in the lower third, slow 8 percent hold-push toward that speck, crushed blacks, cyan-teal highlight roll-off, heavy 35mm grain, anamorphic spherical aberration, no text, no watermark, no subtitles, no logo",
      negativePrompt:
        "text, watermark, subtitles, collage, split screen, earth close, low-res, cartoon",
      camera: { move: "hold_push", velocity: 0.18, direction: "in" },
      transitionOut: { type: "match_push", direction: "in", matchOn: "motion_vector" },
      post: {
        speedRamp: "100% hold",
        shake: 0.02,
        grade: "dark aura, crushed blacks, cyan rim, warm speck",
        flash: "none",
      },
    },
    {
      index: 2,
      start: 3.8,
      duration: 3.6,
      beat: "cold_open",
      subject: "A silent, forgotten cratered moon — no flag, no life, ash-gray",
      juxtapositionRole: "architectural",
      kineticRhyme: "Same inward push, now across dead architecture of impact basins",
      prompt:
        "1:1 square frame, photoreal cinematic 24fps, desolate cratered moonscape filling the square, ash-gray basins receding to a sharp curved horizon, no structures, no flag, harsh unfiltered sunlight raking rims, slow push-in across a crater lip, 35mm grain, crushed blacks, cold cyan terminator, anamorphic flare from the sun just out of frame, no text, no watermark, no subtitles, no logo",
      negativePrompt:
        "text, watermark, earth, astronaut, flag, collage, cartoon, city",
      camera: { move: "hold_push", velocity: 0.22, direction: "in" },
      transitionOut: { type: "slam_zoom", direction: "in", matchOn: "scale" },
      post: {
        speedRamp: "100% → 70% on last 8 frames",
        shake: 0.06,
        grade: "bone-gray, cyan terminator, no warmth",
        flash: "none",
      },
    },
    {
      index: 3,
      start: 7.4,
      duration: 1.2,
      beat: "hitch",
      subject: "Earth rising over the lunar limb, slammed into the lens",
      juxtapositionRole: "cosmic",
      kineticRhyme: "The push becomes a punch — scale explode onto the named sphere",
      prompt:
        "1:1 square frame, photoreal cinematic 24fps, Earth rising over a sharp lunar limb, oceans and cloud swirls suddenly filling the square, violent snap-zoom from lunar-wide to full-frame planet in eight frames, specular ocean glints, cyan atmosphere limb, crushed space-black, 35mm grain, motion blur on the zoom, no text, no watermark, no subtitles, no logo",
      negativePrompt:
        "text, watermark, cartoon, collage, spaceship cockpit HUD, extra planets",
      camera: { move: "slam_in", velocity: 0.92, direction: "in" },
      transitionOut: { type: "rotational_hand-off", direction: "cw", matchOn: "rotation" },
      post: {
        speedRamp: "40% hitch → 210% snap on drop frame",
        shake: 0.42,
        grade: "dark aura, cyan limb, warm continents",
        flash: "1-frame white on the slam",
      },
    },
    {
      index: 4,
      start: 8.6,
      duration: 2.6,
      beat: "drop",
      subject: "A sequined pop icon spinning on a concert stage — Earth-rotation rhyme",
      juxtapositionRole: "pop_icon",
      kineticRhyme: "Body spin clockwise matches the planet's rotation we just punched into",
      prompt:
        "1:1 square frame, photoreal cinematic 24fps, a sequined 1980s pop performer spinning clockwise on a dark concert stage, fedora brim catching a single hard spotlight, sequins throwing cyan and warm sparks, rotational zoom pushing in while the camera rolls 12 degrees clockwise, crushed blacks, heavy grain, anamorphic streaks from stage PAR cans, crowd a dark texture, no text, no watermark, no subtitles, no logo",
      negativePrompt:
        "text, watermark, modern phone screens, collage, logo, readable signage",
      camera: { move: "rotational_zoom_cw", velocity: 0.7, direction: "cw-in" },
      transitionOut: { type: "whip_pan", direction: "right", matchOn: "motion_vector" },
      post: {
        speedRamp: "45% spin hold 0.7s → 180% on kick",
        shake: 0.34,
        grade: "stage black, cyan sparkle, warm skin",
        flash: "none",
      },
    },
    {
      index: 5,
      start: 11.2,
      duration: 2.5,
      beat: "drop",
      subject: "Iridescent beetle wing, spherical, Earth-map in miniature",
      juxtapositionRole: "nature_macro",
      kineticRhyme: "Whip-right into a sphere the size of a thumbnail that still reads as a world",
      prompt:
        "1:1 square frame, photoreal cinematic 24fps, extreme macro of an iridescent beetle elytron filling the square like a planet, green-cyan oil-slick continents, black suture as terminator, whip-pan entering from the left then snap-zoom into a single hexagonal cell, specular studio key, 35mm grain, crushed blacks, shallow stack, no insect body visible, no text, no watermark, no subtitles, no logo",
      negativePrompt:
        "text, watermark, whole insect horror, collage, cartoon, blood",
      camera: { move: "whip_pan_right", velocity: 0.74, direction: "right-in" },
      transitionOut: { type: "snap_zoom", direction: "in", matchOn: "scale" },
      post: {
        speedRamp: "100% → 40% on the cell → 170% out",
        shake: 0.28,
        grade: "teal-cyan iridescence, warm residual sparkle",
        flash: "soft cyan flash on cell snap",
      },
    },
    {
      index: 6,
      start: 13.7,
      duration: 2.5,
      beat: "drop",
      subject: "Voxel sandbox terrain, a blocky earth under a square sun",
      juxtapositionRole: "game_synthetic",
      kineticRhyme: "Snap-in continues into a cubic planet; orbit rhymes the beetle's sphere",
      prompt:
        "1:1 square frame, photoreal-virtual cinematic 24fps, vast voxel sandbox landscape of cubic grass, dirt and stone, a blocky spherical world-horizon, square sun, camera snap-zooms then orbits counterclockwise around a lone cubic mountain, chunk-fog in the distance, cyan skylight, crushed cave-black, film grain over the render, no UI, no hotbar, no text, no watermark, no subtitles, no logo",
      negativePrompt:
        "text, watermark, HUD, inventory bar, recognizable branded character, collage",
      camera: { move: "orbital_ccw", velocity: 0.62, direction: "ccw" },
      transitionOut: { type: "whip_pan", direction: "left", matchOn: "motion_vector" },
      post: {
        speedRamp: "90% orbit → 160% on the whip-out",
        shake: 0.3,
        grade: "game-cyan daylight, film print overlay",
        flash: "none",
      },
    },
    {
      index: 7,
      start: 16.2,
      duration: 2.5,
      beat: "drop",
      subject: "A 1969 bootprint in gray dust, human claim on a dead world",
      juxtapositionRole: "historical_archive",
      kineticRhyme: "Whip-left into the print; the tread is another circular world",
      prompt:
        "1:1 square frame, photoreal cinematic 24fps, extreme close of a ribbed astronaut bootprint pressed into pale lunar dust, hard unfiltered sun, long black shadow in the treads, camera whip-pans left into the print then holds, archive-film grain heavier than previous clips, cyan-cold highlights, crushed blacks, slight gate weave, no flag, no visor, no NASA mark, no text, no watermark, no subtitles, no logo",
      negativePrompt:
        "text, watermark, logo, flag, modern sneaker, collage, color earth",
      camera: { move: "whip_pan_left", velocity: 0.68, direction: "left" },
      transitionOut: { type: "vertical_whip", direction: "up", matchOn: "motion_vector" },
      post: {
        speedRamp: "70% into print → 150% whip-up",
        shake: 0.36,
        grade: "archive silver, cyan dust sparkle",
        flash: "1-frame white as the boot 'lands'",
      },
    },
    {
      index: 8,
      start: 18.7,
      duration: 2.5,
      beat: "drop",
      subject: "A curling open-ocean wave, planet-scale water wall",
      juxtapositionRole: "nature_macro",
      kineticRhyme: "Vertical whip-up the face of the wave — same up-vector as the boot's lift",
      prompt:
        "1:1 square frame, photoreal cinematic 24fps, a towering open-ocean wave curling into a cylinder, camera whipping vertically up the face then slightly orbiting with the barrel, turquoise-cyan interior, white spray as stars, golden sun backlighting the lip, 35mm grain, crushed trough-black, anamorphic spray streaks, no surfers, no boats, no text, no watermark, no subtitles, no logo",
      negativePrompt:
        "text, watermark, surfers, logos, collage, cartoon, pool",
      camera: { move: "vertical_whip_up", velocity: 0.78, direction: "up" },
      transitionOut: { type: "slam_zoom", direction: "in", matchOn: "scale" },
      post: {
        speedRamp: "50% in the barrel → 200% on the lip",
        shake: 0.4,
        grade: "ocean cyan, warm sun lip, dark aura trough",
        flash: "spray-white on the lip",
      },
    },
    {
      index: 9,
      start: 21.2,
      duration: 3.0,
      beat: "drop",
      subject: "A packed night plaza, humanity as a weather system",
      juxtapositionRole: "human_ritual",
      kineticRhyme: "Slam-in on the crowd as if it were another planet surface",
      prompt:
        "1:1 square frame, photoreal cinematic 24fps, night plaza packed with thousands of people as a living weather system, camera slams in from high wide to a tight river of shoulders and upturned faces, practical tungsten and cyan LED mix, motion blur on the slam, 35mm grain, crushed blacks, no readable brands, no phones in focus, no text, no watermark, no subtitles, no logo",
      negativePrompt:
        "text, watermark, logos, readable signs, collage, violence, weapons",
      camera: { move: "slam_in", velocity: 0.84, direction: "in" },
      transitionOut: { type: "orbital", direction: "cw", matchOn: "rotation" },
      post: {
        speedRamp: "35% on faces → 190% slam",
        shake: 0.48,
        grade: "tungsten/cyan city, crushed night",
        flash: "1-frame on the tightest frame",
      },
    },
    {
      index: 10,
      start: 24.2,
      duration: 1.8,
      beat: "climax",
      subject: "A ringed gas giant, ice shards as debris weather",
      juxtapositionRole: "cosmic",
      kineticRhyme: "Crowd orbit becomes planetary orbit — same clockwise weather",
      prompt:
        "1:1 square frame, photoreal cinematic 24fps, a massive ringed gas giant filling the square, ice-shard rings slicing the frame, camera orbital clockwise skimming the ring plane, cyan-cream banding, crushed void, 35mm grain, anamorphic, no spacecraft, no HUD, no text, no watermark, no subtitles, no logo",
      negativePrompt:
        "text, watermark, spaceship, HUD, collage, earth",
      camera: { move: "orbital_cw", velocity: 0.8, direction: "cw" },
      transitionOut: { type: "snap_zoom", direction: "in", matchOn: "scale" },
      post: {
        speedRamp: "80% skim → 200% snap to ring particle",
        shake: 0.62,
        grade: "ice-cyan, cream bands, void black",
        flash: "ring-glint flash",
      },
    },
    {
      index: 11,
      start: 26.0,
      duration: 1.8,
      beat: "climax",
      subject: "A child's iris, Earth reflected in the wet surface",
      juxtapositionRole: "intimate_closeup",
      kineticRhyme: "Snap from ring-particle scale to an iris that contains the planet",
      prompt:
        "1:1 square frame, photoreal cinematic 24fps, extreme close of a child's dark iris filling the square, wet specular, a tiny sharp reflection of a blue-white planet in the catchlight, snap-zoom into the reflection, cyan rim light, crushed pupil-black, 35mm grain, shallow focus, no tears of distress, no text, no watermark, no subtitles, no logo",
      negativePrompt:
        "text, watermark, horror, injury, collage, extra faces, logo",
      camera: { move: "snap_zoom_in", velocity: 0.88, direction: "in" },
      transitionOut: { type: "orbital_hand-off", direction: "cw", matchOn: "rotation" },
      post: {
        speedRamp: "40% hold on iris → 180% into reflection",
        shake: 0.7,
        grade: "wet cyan catchlight, warm sclera, crushed pupil",
        flash: "1-frame on the planet catchlight",
      },
    },
    {
      index: 12,
      start: 27.8,
      duration: 4.6,
      beat: "hold",
      subject: "Earth, full-frame, aurora limb, orbital hold — the named world",
      juxtapositionRole: "cosmic",
      kineticRhyme: "The iris-planet blooms into the real sphere; camera finally orbits and stays",
      prompt:
        "1:1 square frame, photoreal cinematic 24fps, full-frame Earth, night side with city veins, day side with cyclone spirals, thin cyan atmosphere, aurora over a polar limb, camera slow orbital clockwise and slight push, 24fps, 35mm grain, crushed space-black, anamorphic, no satellites in focus, no text, no watermark, no subtitles, no logo",
      negativePrompt:
        "text, watermark, spaceship, HUD, collage, extra moons, logo",
      camera: { move: "orbital_cw", velocity: 0.32, direction: "cw" },
      transitionOut: { type: "hold", direction: "cw", matchOn: "rotation" },
      post: {
        speedRamp: "100% hold, 5% ease-in on last second",
        shake: 0.1,
        grade: "dark aura master: cyan limb, warm continents, crushed void",
        flash: "none — let it breathe",
      },
    },
  ],
};
