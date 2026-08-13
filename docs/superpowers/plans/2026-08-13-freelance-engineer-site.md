# Freelance Engineer Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, responsive one-page freelance software engineering site that turns a vague project idea into a copyable consultation brief.

**Architecture:** A dependency-free static site uses semantic HTML and a single CSS design system. A small browser script binds the form and contact CTAs to pure utility functions so the copy-generation behavior can be tested with Node's built-in test runner.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node.js built-in `node:test`

## Global Constraints

- Preserve every service category, pricing factor, process step, trust promise, and consultation prompt from the supplied Traditional Chinese copy.
- Keep contact links routed to `#contact` until a real URL is supplied.
- Do not transmit or persist form data.
- Support keyboard navigation, reduced motion, and layouts from 360px through 1440px.
- Do not add runtime dependencies or external fonts.

---

### Task 1: Consultation brief utilities

**Files:**
- Create: `package.json`
- Create: `tests/brief.test.js`
- Create: `js/brief.js`

**Interfaces:**
- Consumes: plain objects with `project`, `problem`, `existing`, and `timeline` string fields.
- Produces: `BriefTools.formatBrief(fields): string`, `BriefTools.resolveContactHref(url): string`, and `BriefTools.copyText(text, clipboard): Promise<void>` on `globalThis`.

- [x] **Step 1: Write the failing tests**

Create tests that load `js/brief.js` in a VM and assert that a complete brief is normalized into this shape:

```text
你好，我想詢問一個軟體開發需求：

① 想做什麼：會員管理後台
② 想解決什麼問題：減少人工整理
③ 目前有沒有既有系統：使用試算表
④ 希望什麼時候完成：三個月內

想先請你協助評估可行性與開發方向，謝謝！
```

Also assert blank values become `尚未確定`, an empty contact URL becomes `#contact`, and copying sends the exact generated text to the provided clipboard boundary.

- [x] **Step 2: Run tests to verify RED**

Run: `npm test`
Expected: FAIL because `BriefTools` has not been implemented.

- [x] **Step 3: Implement the utilities**

Implement an IIFE that trims single-line fields, uses `尚未確定` for blank input, formats the four numbered lines, resolves the fallback anchor, and validates the clipboard boundary before calling `writeText`.

- [x] **Step 4: Run tests to verify GREEN**

Run: `npm test`
Expected: all utility tests pass with zero failures.

### Task 2: Semantic page and visual system

**Files:**
- Create: `index.html`
- Create: `styles.css`

**Interfaces:**
- Consumes: `styles.css`, `js/brief.js`, and `js/app.js` from `index.html`.
- Produces: named sections `services`, `pricing`, `process`, `promise`, and `contact`; the contact form has inputs `project`, `problem`, `existing`, and `timeline`, plus output `brief-output`.

- [x] **Step 1: Build semantic content structure**

Add a skip link, labeled navigation, one `h1`, section headings, six service cards, the five-factor pricing formula, five ordered process stages, eight trust commitments, example request chips, and the four-field consultation form.

- [x] **Step 2: Build the responsive visual system**

Define the exact color tokens from the design spec, fluid type and spacing scales, clipped blueprint panels, service grid, pricing formula, process pipeline, trust checklist, and form states. Collapse multi-column layouts below 860px and simplify spacing below 560px.

- [x] **Step 3: Check static rendering**

Open the page at desktop and mobile widths. Verify no horizontal overflow, headings remain readable, all cards fit, and the sticky navigation does not cover anchor targets.

### Task 3: Browser interaction and accessibility

**Files:**
- Create: `js/app.js`
- Modify: `index.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `globalThis.BriefTools` and DOM elements identified by the Task 2 IDs.
- Produces: live brief preview, copy feedback, example-chip autofill, mobile navigation state, and centralized `[data-contact-link]` routing.

- [x] **Step 1: Bind the real UI to tested utilities**

On `DOMContentLoaded`, generate the output from current fields, update it on `input`, wire example buttons to the project/problem fields, and route all contact links through `resolveContactHref('')`.

- [x] **Step 2: Add resilient copy behavior**

Use `navigator.clipboard.writeText` when available. On failure, focus and select the output so the visitor can copy manually. Announce both outcomes through a polite live region.

- [x] **Step 3: Run full verification**

Run: `npm test`
Expected: all tests pass. Then verify navigation, brief generation, example buttons, copy feedback, keyboard focus, reduced-motion CSS, and mobile layout in a real browser.
