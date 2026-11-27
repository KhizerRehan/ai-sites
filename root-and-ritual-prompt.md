# Root & Ritual Website Prompt

Build a complete, responsive website for **Root & Ritual**, a fictional premium vegetable juice brand.

Use the attached screen recording as inspiration for its bold product-led composition, full-screen flavor carousel, oversized typography, coordinated background colors, and smooth transitions. Create an original visual identity, product imagery, copy, and layout details for Root & Ritual.

The result should feel like a premium beverage campaign: fresh, colorful, dramatic, appetizing, playful, and polished. The first impression should make visitors curious about the flavors and want to try the juices.

## Brand and products

Create four fictional vegetable-forward blends:

1. **Carrot Glow** — carrot and ginger; warm, juicy orange or peach; sunny, energetic, and inviting.
2. **Beet Boost** — beetroot and leafy greens; rich berry, magenta, or muted beet pink; bold, vibrant, and indulgent.
3. **Green Garden** — cucumber, celery, and spinach; fresh sage or vibrant botanical green; crisp, refreshing, and cool.
4. **Golden Harvest** — yellow pepper, carrot, and turmeric; golden yellow; bright, warm, and uplifting.

Clearly identify Root & Ritual and its products as a fictional concept brand. Use sample prices and avoid unsupported health, nutritional, or sourcing claims.

## Homepage hero

Create an immersive, nearly full-viewport product carousel. For each flavor:

- Place a large, realistic juice bottle in the center. Give all bottles a consistent, original Root & Ritual label and packaging style. The juice color and flavor label should match the selected blend.
- Place the main flavor name in oversized, bold typography behind the bottle. The bottle should overlap the text, creating a strong sense of depth.
- Change the full background color to match the current flavor.
- Surround the bottle with realistic whole vegetables, slices, leaves, and flavor-specific ingredients.
- Include a dramatic arc of liquid splash and small droplets around the product. Make the liquid and lighting feel like a premium studio beverage photograph.
- Use highlights, shadows, selective blur, and differences in scale to make ingredients feel close to or far from the viewer.
- Keep the product label, flavor name, navigation, and main shopping action readable throughout the animation.

The composition should feel appetizing and cinematic, while preserving the simple, colorful visual impact of the reference.

## Immersive ingredient motion

The ingredients should feel as if they are moving through the space around the bottle, not merely sliding across a flat screen.

- Animate whole vegetables, slices, and leaves along slow elliptical or spiral-like paths around the bottle.
- Let some ingredients pass behind the bottle and others pass in front, changing their scale, position, and layering to suggest depth.
- Give each ingredient a slightly different speed, rotation, and position so the movement feels natural and art-directed.
- Add subtle movement to the splash and droplets. The splash should support the scene without obscuring the bottle or looking chaotic.
- On desktop, introduce gentle parallax in response to pointer movement.
- On touch devices, preserve the ambient animation and allow the user to swipe between flavors.
- Keep the bottle mostly stable as the visual anchor.
- Avoid excessive spinning, flashing, abrupt motion, or movement that makes the page difficult to use.
- Respect `prefers-reduced-motion` by presenting a composed static scene and minimizing transitions.

## Flavor carousel and transitions

- Place the Root & Ritual wordmark in the upper-left corner.
- Show the four flavor names in the main navigation, with a clear active state.
- Place a cart control in the upper-right corner.
- Include previous and next controls near the bottom corners of the hero.
- Put a prominent **Shop this blend** action near the bottom center.
- Include a subtle slide indicator or progress marker.
- Allow visitors to select a flavor from the navigation, use the arrow controls, swipe on touchscreens, and navigate with the keyboard.
- When changing flavors, animate the background, typography, bottle, and ingredients in a coordinated horizontal transition.
- Use slight staggering and depth to make the transition feel premium.
- The carousel should not automatically change slides in a way that interrupts the visitor.

## Website content

Build a complete landing page beneath the hero:

1. **Brand introduction** — Introduce the fictional brand with concise, warm copy. Explain the appeal of vegetable-forward blends without making health claims.
2. **Shop section** — Display all four blends with original imagery, short descriptions, sample prices, and add-to-cart controls. Make the cards visually consistent with each flavor’s color palette.
3. **Ingredients section** — Showcase fresh vegetables with inviting photography and a short explanation of the flavor combinations. Use only fictional or clearly illustrative sourcing information.
4. **Brand story** — Present a short, memorable brand philosophy centered on colorful everyday rituals and enjoyment.
5. **Newsletter section** — Include an email field and signup action. If no newsletter service is connected, clearly label it as a demo and do not imply that an email was submitted.
6. **Footer** — Include the wordmark, useful page links, and a note that the brand is fictional.

## Cart behavior

- Make add-to-cart buttons functional.
- Show selected products, quantities, and a calculated subtotal in a cart drawer or panel.
- Allow visitors to remove items or reduce quantities.
- Persist the demo cart in the browser if practical.
- Clearly state that checkout is not connected unless a real checkout integration is explicitly added.
- Make the cart accessible with keyboard controls, a visible close button, Escape-to-close behavior, and appropriate focus management.

## Visual system

- Use a bold, rounded display typeface for the large flavor names and a clean, highly readable typeface for navigation and body copy.
- Develop a consistent system for colors, spacing, buttons, hover states, typography, and iconography.
- Use high-quality, realistic product and ingredient imagery. Generate or source separate transparent assets for the bottles, vegetables, slices, leaves, and splash so they can move independently.
- Keep lighting, camera angle, and packaging consistent across flavors.
- Avoid emojis, generic placeholder illustrations, broken images, or visible implementation details in the visitor experience.
- Use generous spacing and thoughtful art direction. The page should feel expressive without being cluttered.

## Responsiveness and accessibility

- Design for desktop, tablet, and mobile.
- Preserve the bottle, oversized flavor name, ingredient motion, and main shopping action on smaller screens without overlap that blocks usability.
- Adapt the navigation for smaller screens while keeping flavor selection easy.
- Use semantic HTML, descriptive alternative text, accessible names for controls, visible keyboard focus, and readable contrast.
- Treat moving decorative ingredients and droplets as decorative for assistive technology.
- Make sure motion does not interfere with reading or interaction.

## Implementation and quality

- Choose an appropriate modern web stack and keep the implementation maintainable.
- Optimize image sizes and animation performance, especially on mobile.
- Use `transform` and `opacity` for animation where practical.
- Handle image loading gracefully and avoid layout shifts.
- Test the carousel, flavor navigation, swipe behavior, keyboard controls, cart, responsive layouts, and reduced-motion behavior.
- Visually inspect the finished site at desktop and mobile sizes and refine anything that feels awkward, crowded, or unfinished.
- Deliver a working website, not just a static mockup.
