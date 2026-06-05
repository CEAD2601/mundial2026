# AI Visual Prompts — Quiniela Mundial 2026

Prompts listos para generar assets visuales con herramientas de IA (Higgsfield, Midjourney, DALL·E 3, Stable Diffusion, Firefly, etc.).

**Carpeta de destino:** `/public/assets/generated/`  
**Formatos recomendados:** WebP (calidad 85) · AVIF · PNG con fondo transparente para overlays  
**Optimización:** Usar `next/image` con `priority` para hero, `lazy` para el resto

---

## ⚠️ Reglas de uso de IA visual

- ✅ Solo para assets decorativos, fondos y elementos visuales
- ✅ Sin logos oficiales de FIFA, selecciones nacionales ni marcas registradas
- ✅ Sin texto pequeño incrustado (el texto se agrega via CSS/HTML)
- ✅ Sin material que parezca oficial de FIFA
- ✅ Optimizar para web antes de usar (max 200KB para hero)
- ❌ Nunca generar datos de partidos, horarios, nombres de equipos o resultados

---

## 1. Imagen Hero Principal

**Archivo destino:** `/public/assets/hero/hero-main.webp`  
**Tamaño:** 1440×600px · Horizontal 16:9  
**Uso:** Fondo del header principal de la landing page

```prompt
Cinematic aerial view of a massive illuminated football stadium at night during a major international tournament. 
Stadium lights create dramatic god rays across a perfectly manicured green pitch. 
The scene has a premium, professional sports atmosphere with deep blue sky, golden yellow floodlights, 
and emerald green field. 
Abstract and atmospheric — no players, no logos, no text, no official FIFA branding. 
Photorealistic, 8K quality, ultra wide angle, dramatic lighting, 
suitable as a web hero background with space for text overlay in the center. 
Color palette: deep navy blues, vibrant greens, golden ambers.
```

**Variante oscura (para mejor contraste de texto):**
```prompt
Same prompt but with darker overall tones, moody atmosphere, subtle fog effect over the pitch, 
stadium lights cutting through darkness, more dramatic contrast between shadows and golden highlights.
```

---

## 2. Fondo Abstracto Deportivo

**Archivo destino:** `/public/assets/hero/sports-abstract-bg.webp`  
**Tamaño:** 1920×1080px  
**Uso:** Sección de puntuación, FAQ, textures de cards

```prompt
Abstract modern sports background inspired by football field geometry. 
Clean diagonal lines suggesting a pitch, subtle hexagonal patterns reminiscent of a football surface, 
flowing gradients in deep emerald green and royal blue with gold accents. 
No logos, no text, no players, no official emblems. 
Minimal and elegant, suitable as a CSS background-image for a web app. 
Flat design meets subtle depth, professional and modern.
Color palette: #16a34a (green), #1d4ed8 (blue), #ca8a04 (gold), white highlights.
```

---

## 3. Banner para Compartir por WhatsApp

**Archivo destino:** `/public/assets/share/whatsapp-banner.webp`  
**Tamaño:** 1200×630px · OG card ratio  
**Uso:** Meta og:image, compartir en redes

```prompt
Vibrant promotional sports banner for a football prediction pool web app. 
Modern Venezuelan-friendly design with energetic football atmosphere. 
Large trophy silhouette in gold on the right side, green football field texture in background, 
dynamic diagonal composition suggesting competition and excitement. 
Space reserved in the center-left for app title text overlay. 
No official FIFA logos, no team emblems, no registered trademarks. 
Bold colors: emerald green (#16a34a), royal blue (#1d4ed8), gold (#fbbf24), white accents. 
Festive yet professional, high contrast, optimized for mobile sharing.
```

---

## 4. Ilustración de Podio / Ranking

**Archivo destino:** `/public/assets/generated/podium-illustration.webp`  
**Tamaño:** 800×600px  
**Uso:** Sección de ranking, podio de top 3

```prompt
Modern minimalist sports leaderboard podium illustration. 
Three-level podium with gold (center, tallest), silver (left), bronze (right). 
Abstract human silhouettes on each podium level with arms raised in victory. 
Stadium atmosphere in background — blurred crowd and lights. 
Trophy icons, star elements, confetti. 
Clean vector-art style meets photorealism. 
No faces, no logos, no text. 
Colors: gold #fbbf24, silver #94a3b8, bronze #b45309, background deep blue navy. 
Suitable for a web app ranking page, professional sports design language.
```

---

## 5. Imagen de Resultados

**Archivo destino:** `/public/assets/generated/results-bg.webp`  
**Tamaño:** 1440×400px  
**Uso:** Banner superior de la página de resultados

```prompt
Abstract football scoreboard and data visualization background. 
Glowing digital numbers and statistics suggesting a live score system. 
Green football pitch reflection on a wet surface at night. 
Dramatic stadium atmosphere with neon-like glow effects. 
Abstract and atmospheric — no actual scores, no team names, no logos, no text. 
Deep blue and green color scheme with bright accent highlights. 
Cinematic quality, suitable as a page header background image for a football results web page.
```

---

## 6. Elementos Decorativos — Pattern Fútbol

**Archivo destino:** `/public/assets/hero/hex-pattern-dark.webp`  
**Tamaño:** 400×400px · Tile-able (seamless)  
**Uso:** Overlay pattern sutil en secciones CTA, hero

```prompt
Seamless tileable hexagonal pattern inspired by a football surface texture. 
Classic black and white pentagon/hexagon football panel pattern, very subtle and minimal. 
Suitable as a CSS background-image repeating pattern at very low opacity (5-10%). 
Clean vector style, high contrast black on transparent (or white), 
no text, no logos, perfectly repeating at edges. 
Modern, geometric, sports-inspired.
```

---

## 7. Trophy Hero Asset (objeto standalone)

**Archivo destino:** `/public/assets/generated/trophy-hero.webp`  
**Tamaño:** 400×600px · PNG con transparencia  
**Uso:** Elemento decorativo en landing, CTA section

```prompt
Stunning photorealistic football world cup trophy - generic design without official FIFA logo or branding. 
Pure gold metallic finish with dramatic studio lighting. 
Black background or fully transparent background for easy compositing. 
Ultra-detailed surface reflections, deep shadows, golden glow. 
Suitable as a decorative web element. 
No text, no official markings, no registered trademarks. 
Isolated product-shot style photography.
```

---

## 8. Avatar / Placeholder de Participante

**Archivo destino:** `/public/assets/generated/avatar-placeholder.webp`  
**Tamaño:** 200×200px · circular crop  
**Uso:** Avatar genérico para participantes sin foto

```prompt
Modern minimal user avatar placeholder for a sports web app. 
Abstract human silhouette inside a circular badge. 
Football/sports theme with dynamic lines. 
Deep blue and green gradient background. 
Clean icon-style design suitable for profile pictures. 
No face details, no text, sports-app aesthetic.
```

---

## Herramientas Recomendadas

| Herramienta | Tipo | Notas |
|-------------|------|-------|
| Midjourney | Imagen | Mejor calidad fotorrealista |
| DALL·E 3 (ChatGPT) | Imagen | Buen seguimiento de instrucciones |
| Adobe Firefly | Imagen | Comercialmente seguro |
| Stable Diffusion XL | Imagen | Gratis, local |
| Higgsfield | Video/Imagen | Disponible en Claude Code |
| Remove.bg | Fondo | Eliminar fondo de assets |
| Squoosh | Optimización | Convertir a WebP/AVIF |

---

## Instrucciones de Optimización

```bash
# Convertir PNG a WebP con calidad 85
cwebp -q 85 input.png -o output.webp

# Con ffmpeg
ffmpeg -i input.png -c:v libwebp -quality 85 output.webp

# Redimensionar y optimizar con sharp (Node.js)
npx sharp-cli -i input.png -o output.webp --webp --quality 85 --width 1440
```

---

## Dónde usar cada asset en el código

```tsx
// Hero background
<Image src="/assets/hero/hero-main.webp" alt="" fill className="object-cover" priority />

// Pattern overlay
<div style={{ backgroundImage: 'url(/assets/hero/hex-pattern-dark.webp)', backgroundSize: '200px' }} />

// OG meta tag (en app/layout.tsx)
<meta property="og:image" content="/assets/share/whatsapp-banner.webp" />

// Trophy decorativo
<Image src="/assets/generated/trophy-hero.webp" alt="" width={200} height={300} />
```

---

## Assets ya generados con SVG (sin IA)

Los siguientes assets ya están creados con SVG puro y no requieren generación con IA:

| Archivo | Descripción |
|---------|-------------|
| `/public/assets/hero/stadium-bg.svg` | Fondo hero con estadio, luces y cancha |
| `/public/assets/hero/trophy-glow.svg` | Trofeo dorado con glow |
| `/public/assets/hero/football-pattern.svg` | Patrón hexagonal de fútbol |

Estos SVG son livianos, escalables y están actualmente en uso en la app.

---

*Última actualización: 2026-06-05 · Quiniela Mundial 2026*
