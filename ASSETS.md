# Image assets and credits

FoodLoop logo: an edited version of the user's supplied logo screenshot, saved as `public/images/foodloop-logo.png`. It uses a white background and dark “Food” lettering while preserving the two green leaves and green “Loop” styling.

Ms. Watson card: `public/images/teacher-cs.png` depicts a fictional white teacher with short blonde hair in a computer science classroom. It does not depict the actual Ms. Watson.

Both assets were created with the built-in image generation tool (not the CLI fallback), one request per image. Exact prompts are recorded below.

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

### Teacher (new generation)

```text
Use case: photorealistic-natural.
Asset type: teacher profile card cover for a school prototype, suited to a 350px by 230px cover crop.
Primary request: a photorealistic fictional white female teacher in her 40s, short blonde hair in a short bob or pixie style, friendly professional appearance, in a modern computer science classroom.
Scene: rows of desktop monitors and programming code or computing diagrams visible on a classroom screen or board.
Subject: one generic fictional teacher, centered; face and upper body well framed, medium portrait framing, not an extreme close-up.
Style: realistic educational stock photography with natural skin texture, natural daylight, welcoming professional mood.
Composition: landscape 3:2 photo; keep her face and upper body clearly readable after a 350px by 230px card cover crop.
Constraints: generic fictional person with no real likeness; no names or text identifying an actual school; no watermark.
```
