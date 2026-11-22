// Shared helpers for the tests. You don't need to read or change this file.
import { test } from 'vitest'
import { render, within, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

export { within, screen }

function firstLine(error) {
  return String(error?.message ?? error).split('\n')[0]
}

// Each file is imported inside the test, so a mistake in one component
// fails only the tests of that component, with a readable message.
const FILES = {
  Header: () => import('../src/components/Header/Header.jsx'),
  Footer: () => import('../src/components/Footer/Footer.jsx'),
  FilterBar: () => import('../src/components/FilterBar/FilterBar.jsx'),
  MemberCard: () => import('../src/components/MemberCard/MemberCard.jsx'),
  MembersList: () => import('../src/components/MembersList/MembersList.jsx'),
  TasksPanel: () => import('../src/components/TasksPanel/TasksPanel.jsx'),
  Notice: () => import('../src/components/Notice/Notice.jsx'),
  App: () => import('../src/App.jsx'),
}

// Terminal color codes (ESC [ ... m)
const COLOR_CODES = new RegExp(String.fromCharCode(27) + '\\[[0-9;]*m', 'g')

// A syntax error comes as a long colored box - keep only "file:line:col - what is wrong".
function describeLoadError(error) {
  const text = String(error?.message ?? error).replace(COLOR_CODES, '')
  const problem = text.match(/\[[A-Z_]*ERROR\]\s*(.+)/)?.[1]?.trim()
  const where = text.match(/((?:src|tests)\/[^\s\]]+:\d+:\d+)/)?.[1]
  if (problem) return where ? `${where} - ${problem}` : problem
  return firstLine(error)
}

const pathOf = (name) =>
  name === 'App' ? 'src/App.jsx' : `src/components/${name}/${name}.jsx`

/** Imports the default export of a component, e.g. await loadComponent('Header') */
export async function loadComponent(name) {
  let module
  try {
    module = await FILES[name]()
  } catch (error) {
    throw new Error(
      `could not load ${pathOf(name)}: ${describeLoadError(error)}`,
    )
  }
  if (typeof module.default !== 'function') {
    throw new Error(
      `${pathOf(name)} should "export default" the ${name} component function`,
    )
  }
  return module.default
}

/** Throws a clear error if the student's code threw inside an event handler. */
export function checkPageErrors() {
  const errors = globalThis.__pageErrors
  if (errors.length) {
    const error = errors[0]
    errors.length = 0
    throw new Error(`Your code threw an error: ${firstLine(error)}`)
  }
}

/** Renders a React element and fails clearly if the component crashed. */
export function show(element) {
  globalThis.__pageErrors.length = 0
  let result
  try {
    result = render(element)
  } catch (error) {
    throw new Error(
      `The component crashed while rendering: ${firstLine(error)}`,
    )
  }
  checkPageErrors()
  return result
}

/** A user that clicks and types like a real person, and reports errors from event handlers. */
export function makeUser() {
  const user = userEvent.setup()
  const wrapped = {}
  for (const name of ['click', 'type', 'clear', 'keyboard']) {
    wrapped[name] = async (...args) => {
      try {
        await user[name](...args)
      } catch (error) {
        throw new Error(`Your code threw an error: ${firstLine(error)}`)
      }
      checkPageErrors()
    }
  }
  return wrapped
}

/** A spy function that remembers how it was called. */
export function spy() {
  const fn = (...args) => {
    fn.calls.push(args)
  }
  fn.calls = []
  return fn
}

/** A bonus test: shown with a star, never blocks the approval. */
export function bonus(name, fn) {
  test(`Bonus: ${name}`, async ({ task }) => {
    task.meta.bonus = true
    try {
      await fn()
      task.meta.bonusDone = true
    } catch (error) {
      task.meta.bonusDone = false
      task.meta.bonusReason = firstLine(error)
    }
  })
}

export const escapeRegExp = (text) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
/** Matches an element whose own text contains `text` (case-insensitive). */
export const textRegExp = (text) => new RegExp(escapeRegExp(text), 'i')

// ---------- classes ----------

function tokensOf(el) {
  return String(el?.getAttribute?.('class') ?? '')
    .split(/\s+/)
    .filter(Boolean)
}

/** true if the element has a class like "word", "isWord", "card--word", "word-card". */
export function hasClassWord(el, word, { ignore = [] } = {}) {
  return tokensOf(el)
    .filter((token) => !ignore.includes(token.toLowerCase()))
    .some((token) =>
      token
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase()
        .split(/[-_]+/)
        .includes(word),
    )
}

// ---------- colors ----------

const NAMED = {
  blue: [0, 0, 255],
  navy: [0, 0, 128],
  royalblue: [65, 105, 225],
  dodgerblue: [30, 144, 255],
  steelblue: [70, 130, 180],
  cornflowerblue: [100, 149, 237],
  lightblue: [173, 216, 230],
  skyblue: [135, 206, 235],
  deepskyblue: [0, 191, 255],
  aliceblue: [240, 248, 255],
  green: [0, 128, 0],
  seagreen: [46, 139, 87],
  forestgreen: [34, 139, 34],
  limegreen: [50, 205, 50],
  lightgreen: [144, 238, 144],
  mediumseagreen: [60, 179, 113],
  darkgreen: [0, 100, 0],
  lime: [0, 255, 0],
  purple: [128, 0, 128],
  rebeccapurple: [102, 51, 153],
  mediumpurple: [147, 112, 219],
  blueviolet: [138, 43, 226],
  darkviolet: [148, 0, 211],
  violet: [238, 130, 238],
  plum: [221, 160, 221],
  orchid: [218, 112, 214],
  darkorchid: [153, 50, 204],
  magenta: [255, 0, 255],
  fuchsia: [255, 0, 255],
  yellow: [255, 255, 0],
  gold: [255, 215, 0],
  khaki: [240, 230, 140],
  lightyellow: [255, 255, 224],
  lemonchiffon: [255, 250, 205],
  lightgoldenrodyellow: [250, 250, 210],
  moccasin: [255, 228, 181],
  orange: [255, 165, 0],
  goldenrod: [218, 165, 32],
  cornsilk: [255, 248, 220],
  papayawhip: [255, 239, 213],
}

function toRgb(value) {
  if (!value) return null
  const v = String(value).trim().toLowerCase()
  let m = v.match(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/)
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])]
  m = v.match(/#([0-9a-f]{3,8})\b/)
  if (m) {
    let hex = m[1]
    if (hex.length <= 4) hex = [...hex.slice(0, 3)].map((c) => c + c).join('')
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16))
  }
  for (const word of v.split(/[^a-z]+/)) if (NAMED[word]) return NAMED[word]
  return null
}

function hueOf([r, g, b]) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  if (max === min) return null // gray
  const d = max - min
  let h
  if (max === r) h = ((g - b) / d) % 6
  else if (max === g) h = (b - r) / d + 2
  else h = (r - g) / d + 4
  return (h * 60 + 360) % 360
}

/** "blue" | "green" | "purple" | "yellow" | null - from the inline style of the element. */
export function inlineColorName(el) {
  const style = el?.style
  if (!style) return null
  for (const value of [
    style.backgroundColor,
    style.background,
    style.color,
    style.borderColor,
  ]) {
    const rgb = toRgb(value)
    if (!rgb) continue
    const hue = hueOf(rgb)
    if (hue === null) continue
    if (hue >= 20 && hue < 70) return 'yellow'
    if (hue >= 80 && hue < 170) return 'green'
    if (hue >= 170 && hue < 250) return 'blue'
    if (hue >= 250 && hue < 330) return 'purple'
  }
  return null
}

const ROLE_COLORS = { leader: 'blue', member: 'green', guest: 'purple' }

/** The roles that the button's color says (from its class or its inline color). */
export function rolesShownBy(button) {
  const found = new Set()
  for (const [role, color] of Object.entries(ROLE_COLORS)) {
    if (hasClassWord(button, role) || hasClassWord(button, color))
      found.add(role)
  }
  const inline = inlineColorName(button)
  for (const [role, color] of Object.entries(ROLE_COLORS)) {
    if (inline === color) found.add(role)
  }
  return [...found]
}

/** The kinds ("warning" / "info") that a notice box shows (from its class or its inline color). */
export function noticeKinds(box) {
  const found = new Set()
  if (['warning', 'warn', 'yellow'].some((w) => hasClassWord(box, w)))
    found.add('warning')
  if (['info', 'blue'].some((w) => hasClassWord(box, w))) found.add('info')
  const inline = inlineColorName(box)
  if (inline === 'yellow') found.add('warning')
  if (inline === 'blue') found.add('info')
  return [...found]
}

// ---------- cards ----------

/** Walks up from `el` (inclusive) to `stop` (exclusive) and returns the elements on the way. */
function ancestors(el, stop) {
  const list = []
  for (
    let node = el;
    node && node !== stop && node.nodeType === 1;
    node = node.parentElement
  ) {
    list.push(node)
  }
  return list
}

/** The card of a member: the closest element around the name that also contains a button. */
export function cardOf(scope, name) {
  const nameEl = within(scope).queryByText(textRegExp(name))
  if (!nameEl) throw new Error(`the member "${name}" should be shown`)
  const card = ancestors(nameEl, scope.parentElement).find((el) =>
    el.querySelector('button'),
  )
  return { nameEl, card: card ?? nameEl.parentElement }
}

/** The action button of a member card. */
export function cardButton(card) {
  const buttons = [...card.querySelectorAll('button')]
  return buttons.find((b) => rolesShownBy(b).length) ?? buttons[0] ?? null
}

/** true if the element (or one of its ancestors up to `stop`) looks faded. */
export function looksFaded(el, stop) {
  return ancestors(el, stop).some(
    (node) =>
      ['inactive', 'faded', 'dimmed'].some((w) => hasClassWord(node, w)) ||
      (node.style.opacity !== '' && Number(node.style.opacity) < 1),
  )
}

/** true if the element (or one of its ancestors up to `stop`) is marked as selected. */
export function looksSelected(el, stop) {
  return ancestors(el, stop).some((node) => hasClassWord(node, 'selected'))
}

/** true if a button is marked as the current choice (class "active"/"selected" or aria-pressed). */
export function isCurrentButton(button) {
  return (
    hasClassWord(button, 'active') ||
    hasClassWord(button, 'selected') ||
    button.getAttribute('aria-pressed') === 'true' ||
    button.checked === true
  )
}

/** true if the members area has the layout class ("list" / "grid"), ignoring "membersList" itself. */
export function hasLayout(area, layout) {
  return hasClassWord(area, layout, { ignore: ['memberslist', 'members-list'] })
}

// ---------- checkboxes ----------

/** The checkbox next to a text (a task title, or "Show only active members"). */
export function checkboxFor(scope, text) {
  const byLabel = within(scope).queryAllByRole('checkbox', {
    name: textRegExp(text),
  })
  if (byLabel.length === 1) return byLabel[0]
  const textEl = within(scope).queryByText(textRegExp(text))
  if (!textEl) return null
  for (const node of ancestors(textEl, scope.parentElement)) {
    const boxes = node.querySelectorAll('input[type="checkbox"]')
    if (boxes.length === 1) return boxes[0]
    if (boxes.length > 1) return null
  }
  return null
}
