# Seed Investments — Design System & Component Architecture

> **Last updated:** 2026-06-19
> **Framework:** Next.js 15 + React 19 + TypeScript  
> **Styling:** TailwindCSS 3.4 + Framer Motion 11  
> **Theme:** next-themes (class strategy, light default, system-aware)  

---

## 1. Design Token Foundation

### 1.1 HSL CSS Variables (`app/globals.css`)

All semantic tokens are defined as HSL triplets in `:root` (light) and `.dark`, consumed by Tailwind via `hsl(var(--token))`.

| Token | Light | Dark | Tailwind |
|-------|-------|------|----------|
| `--background` | `0 0% 100%` | `222 47% 7%` | `bg-background` |
| `--foreground` | `222 47% 11%` | `210 40% 98%` | `text-foreground` |
| `--card` | `0 0% 100%` | `222 47% 10%` | `bg-card` |
| `--primary` | `221 83% 53%` | `217 91% 60%` | `bg-primary` / `text-primary` |
| `--secondary` | `210 40% 96%` | `217 33% 17%` | `bg-secondary` |
| `--muted` | `210 40% 96%` | `217 33% 17%` | `bg-muted` |
| `--muted-foreground` | `215 16% 47%` | `215 20% 65%` | `text-muted-foreground` |
| `--border` | `214 32% 91%` | `217 33% 20%` | `border-border` |
| `--success` | `152 76% 40%` | `152 60% 35%` | `text-success` / `bg-success` |
| `--warning` | `38 92% 50%` | `38 80% 45%` | `text-warning` / `bg-warning` |
| `--error` | `0 84% 60%` | `0 65% 50%` | `text-error` / `bg-error` |
| `--radius` | `0.75rem` | `0.75rem` | `rounded-lg` |

### 1.2 Extended Brand Colors

Static hex values in `tailwind.config.ts` (not theme-aware):

| Color | DEFAULT | light | dark |
|-------|---------|-------|------|
| `primary-lightest` | `#EBF5FF` | — | — |
| `primary-light` | `#BEE3F8` | — | — |
| `primary-dark` | `#2563EB` | — | — |
| `primary-darkest` | `#1D4ED8` | — | — |
| `navy` | `#0A1F44` | `#0F2A5C` | `#061534` |
| `gold` | `#C8A04A` | `#E0B45C` | `#A07E2E` |

### 1.3 Typography Scale

| Utility | Size | Line Height | Letter Spacing | Weight |
|---------|------|-------------|----------------|--------|
| `text-display` | 3.5rem (56px) | 1.05 | -0.03em | (varies) |
| `text-h1` | 2.5rem (40px) | 1.1 | -0.02em | (varies) |
| `text-h2` | 2rem (32px) | 1.15 | -0.02em | (varies) |
| `text-h3` | 1.5rem (24px) | 1.2 | -0.01em | (varies) |
| `text-body-lg` | 1.125rem (18px) | 1.7 | normal | normal |
| `text-body` (default) | 1rem (16px) | 1.6 | normal | normal |
| `text-caption` | 0.75rem (12px) | 1.4 | 0.05em | (varies) |

**Font families:**
- `font-sans`: Inter (`var(--font-inter)`, variable, latin subset)
- `font-serif`: Fraunces (`var(--font-fraunces)`, for editorial/blog/text accents)

### 1.4 Spacing Rhythm

| Element | Value |
|---------|-------|
| Section padding | `py-24 md:py-32 lg:py-40` |
| Container max-width | `max-w-7xl` with `px-6 lg:px-8` |
| Section heading bottom margin | `mb-16 lg:mb-24` |
| Card padding | `p-8 md:p-10` |
| Bento grid gaps | `gap-6` |

---

## 2. UI Primitive Components

All located in `components/ui/`.

### 2.1 Button

CVA-based: **7 variants × 5 sizes**

| Variant | Style |
|---------|-------|
| `default` | `bg-primary text-primary-foreground shadow-sm hover:bg-primary-dark` |
| `gradient` | `bg-gradient-to-r from-primary-dark to-blue-400 text-white shadow-lg` |
| `outline` | `border border-border bg-background hover:bg-accent` |
| `secondary` | `bg-secondary text-secondary-foreground hover:bg-secondary/80` |
| `ghost` | `hover:bg-accent hover:text-accent-foreground` |
| `link` | `text-primary underline-offset-4 hover:underline` |
| `destructive` | `bg-destructive text-destructive-foreground hover:bg-destructive/90` |

| Size | Classes |
|------|---------|
| `default` | `h-10 px-5 py-2.5 text-sm` |
| `sm` | `h-9 rounded-md px-3 text-xs` |
| `lg` | `h-12 rounded-xl px-8 text-base` |
| `xl` | `h-14 rounded-full px-10 text-lg` |
| `icon` | `h-10 w-10` |

### 2.2 Card

Compound component: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`

- Base: `rounded-2xl border border-border bg-card shadow-sm`
- Header: `flex flex-col space-y-1.5 p-8 md:p-10`
- Content: `p-8 md:p-10 pt-0`
- Footer: `flex items-center p-8 md:p-10 pt-0`

### 2.3 BentoCard

Reusable bento grid card with **3 variants**:

| Variant | Style |
|---------|-------|
| `default` | `bg-card border-border/60 shadow-sm hover:shadow-md` |
| `featured` | `bg-gradient-to-br from-blue-50 to-white border-blue-200/60 shadow-md hover:shadow-lg` |
| `dark` | `bg-gray-900 border-gray-800 text-white shadow-lg` |

Features: optional radial gradient overlay (3% opacity), icon container `w-12 h-12 rounded-2xl bg-blue-50`, title `text-xl font-bold tracking-tight`, description `text-sm text-muted-foreground`.

### 2.4 Badge

CVA-based: **6 variants** — `default`, `secondary`, `outline`, `blue`, `success`, `warning`.
- Base: `rounded-full border px-3 py-1 text-xs font-semibold`

### 2.5 Slider

Custom-built range slider (not Radix). Features:
- Gradient fill track (`from-blue-400 to-primary`)
- ARIA support (`aria-label`, `aria-valuenow/min/max`)
- Two thumb sizes: `default` (w-5 h-5) and `large` (w-6 h-6)
- Sub-slider mode for nested controls
- Optional caption

### 2.6 Input

Styled text input with error state:
- Default: `rounded-xl border border-border bg-background`
- Error: `border-error focus-visible:ring-error`
- Includes `aria-invalid` and `aria-describedby` for accessibility

### 2.7 Alert

4 variants with icons:

| Variant | Icon | Container |
|---------|------|-----------|
| `info` | `Info` | `bg-blue-50 border-blue-200` |
| `warning` | `AlertTriangle` | `bg-amber-50 border-amber-200` |
| `success` | `CheckCircle2` | `bg-emerald-50 border-emerald-200` |
| `destructive` | `XCircle` | `bg-red-50 border-red-200` |

Supports `collapsible` mode with expand/collapse animation.

### 2.8 Tooltip

CSS-based hover tooltip (no Radix dependency):
- Appears on `group-hover` with `opacity-0 → 1` transition
- `rounded-lg bg-gray-900 dark:bg-gray-100` with arrow indicator
- `pointer-events-none z-50`

### 2.9 Separator

Simple divider: `h-px w-full bg-border` (horizontal) / `h-full w-px bg-border` (vertical).

### 2.10 Section System

Three primitives in `components/ui/section.tsx`:

| Component | Classes |
|-----------|---------|
| `Section` | `<section class="py-24 md:py-32 lg:py-40">` |
| `Container` | `<div class="mx-auto w-full max-w-7xl px-6 lg:px-8">` |
| `SectionHeading` | Heading `text-4xl lg:text-5xl font-extrabold tracking-tight` + subtitle `text-body-lg text-muted-foreground max-w-3xl` + optional eyebrow pill |

---

## 3. Custom CSS Utilities (`app/globals.css`)

| Utility | Definition |
|---------|------------|
| `.bg-apple-gradient` | Hero dark gradient: `radial-gradient(circle at 50% 0%, #1a1a1a 0%, #000000 70%)` |
| `.glass-panel` | Dark glass: `rgba(255,255,255,0.03)` bg + `blur(20px)` + white border |
| `.glass-light` | Light glass: `rgba(255,255,255,0.7)` + `blur(20px)`, dark variant included |
| `.mobile-glass-card` | Mobile hero card: `rgba(30,30,32,0.7)` + `blur(20px)` + shadow |
| `.bento-card` | `rounded-3xl bg-card border border-border/60 shadow-sm hover:shadow-md` |
| `.hide-scrollbar` | Scrollbar hidden (WebKit + Firefox + IE) |
| `.text-gradient-blue` | `bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent` |
| `.text-balance` | `text-wrap: balance` |
| `.text-pretty` | `text-wrap: pretty` |
| `.tabular-nums` | `font-variant-numeric: tabular-nums` |

---

## 4. Animation System

### 4.1 Tailwind Keyframes (`tailwind.config.ts`)

| Animation | Duration | Purpose |
|-----------|----------|---------|
| `animate-fade-in` | 0.5s ease-out | Entrance opacity |
| `animate-fade-in-up` | 0.6s ease-out | Entrance slide + opacity |
| `animate-float` | 4s infinite | Hover/bounce effect |
| `animate-soft-pulse` | 4s infinite | CTA button pulse |
| `animate-move-down` | 1.5s infinite | Scroll indicator |
| `animate-scroll-infinite` | 35s linear | Infinite marquee (AMC partners) |

### 4.2 Framer Motion Variants (`lib/motion.ts`)

| Variant | Effect |
|---------|--------|
| `fadeUp` | opacity 0→1, y 24→0, 0.6s |
| `fadeUpFast` | opacity 0→1, y 16→0, 0.4s |
| `fadeIn` | opacity 0→1, 0.5s |
| `staggerContainer` | Children staggered by 0.08s |
| `staggerItem` | opacity 0→1, y 20→0, 0.5s |
| `scaleIn` | opacity 0→1, scale 0.95→1, 0.5s |
| `slideInLeft` | x -24→0, 0.6s |
| `slideInRight` | x 24→0, 0.6s |
| `viewportOnce` | `{ once: true, margin: "-80px" }` |

### 4.3 Custom Hook: `useAnimatedCounter`

- Location: `hooks/use-animated-counter.ts`
- Animates a number from previous to target value using `requestAnimationFrame`
- Cubic ease-out (`1 - (1 - t)³`)
- Default duration: 800ms
- Used by: SIP calculator, Budget planner, Goal planner

---

## 5. Chart Components

All D3.js-based, `"use client"`, in `components/charts/`.

### 5.1 GrowthChart (NEW)

- Used by: SIP calculator
- Type: Dual area chart (invested principal + total value)
- Animated draw-in (1200ms)
- Theme-aware via `useChartTheme` hook

### 5.2 GoalChart

- Used by: Goal planner
- Type: Dual line comparison (investment vs. goal target)
- Markers with "Met" / "Needs Review" labels
- Animated draw-in (1500ms)
- Theme-aware via `useChartTheme` hook

### 5.3 CashflowChart

- Used by: (section removed, component kept)
- Type: Stacked area chart (3-bucket withdrawal)
- Not currently themed (no active consumer)

### 5.4 Globe

- Used by: NRI Corner section
- Type: D3 geoOrthographic interactive globe
- Features: country rendering, graticule, animated arc dots, markers with pulse
- Configurable rotation, pointer interaction

### 5.5 Theme Hook: `useChartTheme`

- Location: `hooks/use-chart-theme.ts`
- Reads HSL CSS variables from `document.documentElement` at render time
- Converts to hex strings for D3 usage
- Re-renders on theme change via `next-themes` `resolvedTheme`
- Returns: `primary`, `primaryLight`, `primaryDark`, `green`, `red`, `amber`, `gridColor`, `axisColor`, `tooltipBg`, `tooltipText`, `liquidColor`, `mixedColor`, `equityColor`

---

## 6. Utility Functions

### 6.1 Class Merging (`lib/utils.ts`)

```ts
cn(...inputs: ClassValue[]) → string  // clsx + tailwind-merge
```

### 6.2 Currency Formatting (`lib/format/currency.ts`)

| Function | Example Output |
|----------|---------------|
| `formatCurrency(123456)` | `₹ 1,23,456` |
| `formatCurrencyShort(15000000)` | `₹ 1.50 Cr` |
| `formatCurrencyShort(750000)` | `₹ 7.50 L` |
| `formatCurrencyShort(50000)` | `₹ 50.0 K` |

### 6.3 Financial Calculations (`lib/finance/`)

- `lib/finance/sip.ts`: `calculateSip(monthly, years, returnPct)`, `calculateLumpSumFutureValue(principal, cagr, years)`
- `lib/finance/goal-planner.ts`: `calculateGoalPlan(goals[], savings, sip, increase, cagr)`, `calculateRequiredSip(fv, years, cagr)`, `calculateFutureValue(initial, sip, increase, cagr, years)`
- `lib/finance/cashflow.ts`: `simulateCashFlow({})`, `formatLifespan()` — (simulation module, section removed)

---

## 7. Page Composition

### 7.1 Layout (`app/layout.tsx`)

```
<ThemeProvider defaultTheme="light" enableSystem>
  <Header />            ← Sticky top bar, logo, nav links, theme toggle, mobile menu
  <main>{children}</main>
  <Footer />            ← Regulatory info, grievance redressal, disclaimers, copyright
</ThemeProvider>
```

### 7.2 Page Sections (`app/page.tsx`)

Sections in order, with background rhythm:

| # | Section | Source File | Background |
|---|---------|-------------|------------|
| 1 | **Hero** | `components/sections/hero.tsx` | **Dark** (black + gold, chapter-based) |
| 2 | **FinancialSolutions** | `components/sections/financial-solutions.tsx` | Light (gradient bg) → **bento grid** |
| 3 | **Technology** | `components/sections/technology.tsx` | Light (stacked bento cards) |
| 4 | **Services** | `components/sections/services.tsx` | Light (2 bento pillars) |
| 5 | **Process** | `components/sections/process.tsx` | Light (muted bg, 4-phase stepper) |
| 6 | **SIP Calculator** | `components/calculators/sip-calculator.tsx` | Light (muted bg, 2-col + chart) |
| 7 | **Budget SIP Planner** | `components/calculators/budget-sip-planner.tsx` | Light (muted bg, 2-col + donut) |
| 8 | **Goal Planner** | `components/calculators/goal-planner.tsx` | Light (muted bg, 2-col + chart) |
| 9 | **NRI Corner** | `components/sections/nri-corner.tsx` | Light (globe + feature cards) |
| 10 | **AMC Partners** | `components/sections/amc-partners.tsx` | Light (infinite scroll logo wall) |
| 11 | **Blog Preview** | `components/sections/blog-preview.tsx` | Light (editorial bento, Fraunces) |
| 12 | **Testimonials** | `components/sections/testimonials.tsx` | Light (2x2 grid) |
| 13 | **Wealth Elite CTA** | `components/sections/wealth-elite-cta.tsx` | **Dark** (glassmorphic + gradient) |
| (14) | **Footer** | `components/sections/footer.tsx` | Light (muted, 3-col + alerts) |

### 7.3 Visual Rhythm

```
Dark  →  Light  →  Light  →  Light  →  Light  →  Light(muted)
Light(muted)  →  Light(muted)  →  Light  →  Light  →  Light
Light  →  Light  →  Dark  →  Light(footer)
```

---

## 8. Section Architecture

### 8.1 Each section follows this pattern:

```tsx
// "use client" (if interactivity needed)
import { Section, SectionHeading, Container } from "@/components/ui/section";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

const Component: React.FC = () => {
  return (
    <Section className="...">
      <Container>
        <SectionHeading title="..." subtitle="..." />
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          {items.map(item => (
            <motion.div key={item.id} variants={staggerItem}>
              {/* content */}
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
};
```

### 8.2 Calculator Pattern (SIP, Budget, Goal)

All calculators follow a 2-column bento split:

```
Left column (inputs)          Right column (results)
┌─────────────────────┐       ┌─────────────────────┐
│ Slider inputs        │       │ Animated counter    │
│ (Card, p-8 md:p-10)  │       │ Chart (D3)          │
│ Accordion sections   │       │ Breakdown stats     │
│ (budget planner)     │       │ Legend / compositon │
└─────────────────────┘       └─────────────────────┘
```

---

## 9. Chart Theme Integration

Charts are now theme-aware via `useChartTheme()`:

```tsx
const colors = useChartTheme(); // returns hex values for current theme
// Replace hardcoded hex with: colors.green, colors.red, colors.primary, etc.
```

Charts updated:
- ✅ `GoalChart` — green/red/amber/grid/axis all theme-aware
- ✅ `GrowthChart` — new chart, built with theme hook
- ❌ `CashflowChart` — not updated (unused since section removed)
- ❌ `Globe` — uses hardcoded colors (intentional, globe design)

---

## 10. Key Accessibility Patterns

- Skip-to-content link in Header
- `aria-label` on all interactive elements
- `aria-expanded` on accordion toggles
- `aria-valuenow/min/max` on Slider range inputs
- `aria-invalid` and `aria-describedby` on Input errors
- `role="alert"` on Alert component
- `role="tooltip"` on Tooltip
- `role="img"` with `<title>` and `<desc>` on SVG charts
- Focus-visible ring: `outline-none ring-2 ring-primary ring-offset-2`
- Tab key navigation on mobile menu with focus trapping

---

## 11. Dark Mode

- Strategy: `class` (`.dark` on `<html>`)
- Theme provider: `next-themes` with `defaultTheme="light"`, `enableSystem`
- All semantic colors via HSL CSS variables → auto-switch
- Static hex brand colors (navy, gold, primary-lightest) do NOT theme-switch
- Charts read CSS variables via `useChartTheme` hook → theme-aware
- Custom utilities include `.dark:` overrides where needed

---

## 12. File System Map

```
app/
├── globals.css              Design tokens, utilities, base styles
├── layout.tsx               Root layout, fonts, theme, header/footer
├── page.tsx                 Page composition (13 sections)
├── robots.ts                SEO
└── sitemap.ts               SEO

components/
├── calculators/
│   ├── sip-calculator.tsx     SIP calc with GrowthChart
│   ├── budget-sip-planner.tsx Budget planner with donut viz
│   └── goal-planner.tsx       Multi-goal planner with GoalChart
├── charts/
│   ├── growth-chart.tsx       D3 area chart (NEW)
│   ├── goal-chart.tsx         D3 dual-line chart
│   ├── cashflow-chart.tsx     D3 stacked area (unused)
│   └── globe.tsx              D3 geoOrthographic globe
├── sections/
│   ├── hero.tsx               Dark hero with chapter slider
│   ├── financial-solutions.tsx Bento grid of 7 solutions
│   ├── technology.tsx         3-card tech bento
│   ├── services.tsx           Two-pillar accordion bento
│   ├── process.tsx            4-phase stepper
│   ├── nri-corner.tsx         Globe + 6 feature cards
│   ├── amc-partners.tsx       Infinite scroll logo wall
│   ├── blog-preview.tsx       Editorial bento with Fraunces
│   ├── testimonials.tsx       2x2 testimonial grid
│   ├── wealth-elite-cta.tsx   Dark glassmorphic CTA
│   ├── header.tsx             Sticky nav, mobile menu
│   └── footer.tsx             3-col regulatory footer
├── ui/
│   ├── section.tsx            Section/Container/SectionHeading
│   ├── card.tsx               Compound card component
│   ├── bento-card.tsx         Bento grid card (NEW)
│   ├── button.tsx             CVA button (7 variants)
│   ├── badge.tsx              CVA badge (6 variants)
│   ├── slider.tsx             Custom range slider
│   ├── input.tsx              Text input with error (NEW)
│   ├── alert.tsx              Alert with 4 variants (NEW)
│   ├── tooltip.tsx            CSS hover tooltip (NEW)
│   └── separator.tsx          Divider
└── theme-provider.tsx         next-themes wrapper

hooks/
├── use-animated-counter.ts    rAF number animation
└── use-chart-theme.ts         CSS variable → hex colors (NEW)

lib/
├── utils.ts                   cn() helper
├── motion.ts                  Framer Motion variants (NEW)
├── format/currency.ts         INR formatters
└── finance/
    ├── sip.ts                 SIP math
    ├── goal-planner.ts        Multi-goal projection engine
    └── cashflow.ts            3-bucket withdrawal simulation
```
