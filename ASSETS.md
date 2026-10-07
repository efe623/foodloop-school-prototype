# Image assets and credits

FoodLoop logo: an edited version of the user's supplied logo screenshot, saved as `public/images/foodloop-logo.png`. It uses a white background and dark “Food” lettering while preserving the two green leaves and green “Loop” styling.

Navigation logo: `public/images/foodloop-logo-dark.png` has a genuinely transparent background, white “Food” lettering and the same green leaves and “Loop”. It is used in the desktop sidebar and mobile header, allowing their dark backgrounds to show through. The role-selection screen keeps the white version.

Ms. Watson option: uses Lucide clipboard, student and store icons instead of a photograph.

Both logo versions were edited with the built-in image generation tool (not the CLI fallback), in one request per version. Their exact prompts are recorded below.

Stock photographs illustrate fictional demo listings and roles; they do not represent participating businesses or users. All photos used under the Pexels License: https://www.pexels.com/license/.

- croissants: Lara Farber — https://www.pexels.com/photo/croissants-on-baking-tray-13870808/
- chicken-rice: Change C.C — https://www.pexels.com/photo/chicken-with-rice-on-a-plate-21517313/
- mixed-fruit: Any Lane — https://www.pexels.com/photo/fresh-healthy-fruits-placed-in-bowl-5945874/
- bananas: Threze Gue — https://www.pexels.com/photo/bunch-of-bananas-26447849/
- fruit-salad: Dextar Studio — https://www.pexels.com/photo/fruit-salad-in-a-bowl-15832882/
- mac-cheese: Carla Kroell — https://www.pexels.com/photo/plate-of-macaroni-and-cheese-on-table-25449940/
- pesto-pasta: Valeria Boltneva — https://www.pexels.com/photo/delicious-pesto-pasta-with-parmesan-cheese-30910495/
- sandwiches: Hannah Milar — https://www.pexels.com/photo/close-up-shot-of-sandwiches-6169449/
- student-campus: Keira Burton — https://www.pexels.com/photo/ethnic-female-student-strolling-with-folder-in-street-6147378/
- bakery-interior: Lisa Fotios — https://www.pexels.com/photo/interior-of-classic-bakery-with-elegant-furniture-and-decorations-6640262/

Fixed map: © OpenStreetMap contributors, https://www.openstreetmap.org/copyright. This is a local tile montage; markers and collection points are fictional.

Donuts: Alexander Grey — https://www.pexels.com/photo/closeup-photo-of-doughnuts-1191639/
Orange juice: beytlik — https://www.pexels.com/photo/glass-with-orange-juice-14692486/

## Generated image prompts

### White logo (referenced-image edit)

```text
Use case: precise-object-edit.
Asset type: FoodLoop school prototype logo on a white page.
Input image 1 is the edit target: preserve the reference wordmark exactly.
Primary request: replace the dark background with pure white (#FFFFFF), and change only the "Food" lettering to a very dark green/charcoal so it is readable on white.
Text (verbatim): "FoodLoop".
Invariants: exactly preserve the existing typography, letter shapes, wordmark placement, and the two green leaves above the center. Keep the lime-green "Loop" color. Preserve the leaf shapes and colors.
Composition: tight horizontal logo composition with minimal empty margins, approximately 2.15:1 landscape aspect ratio.
Constraints: opaque pure white background; no frame, shadow, gradient, new decorative elements, additional text, or watermark.
```

### Navigation logo (referenced-image edit)

```text
Use case: background-extraction
Asset type: existing FoodLoop wordmark for a dark desktop sidebar and mobile header.
Input image 1: edit target, the existing FoodLoop logo.
Primary request: make exactly one precise edit of this supplied image. Change only the dark charcoal "Food" lettering to solid white, and remove only the white background to genuine transparent alpha. Preserve the exact current FoodLoop letter shapes, typography, letter spacing, placement, two lime green leaf shapes above the wordmark, the green "Loop" color, all sizing, composition, and aspect ratio.
Text (verbatim): "FoodLoop"
Composition/framing: retain the same tight horizontal source framing and approximately 2.15:1 canvas aspect ratio. Retain every letter and both leaves fully, in precisely their original positions.
Constraints: keep the existing green "Loop" lettering and both lime green leaves exactly as in the input. The white regions outside the logo and inside letter counters and leaf cutouts must become actual transparent alpha; the newly white "Food" letter strokes must remain opaque. Do not redesign, restyle, move, resize, retypeset, or add anything.
Avoid: opaque rectangle, white or dark background fill, checkerboard painted into the image, shadows, frames, new decoration, extra text, alternatives.
```
