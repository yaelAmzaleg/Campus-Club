// App keeps the state (useState). These tests click, toggle and switch like a user,
// and check that every piece of state changes the screen the right way.
import { test, expect } from 'vitest'
import {
  loadComponent,
  show,
  makeUser,
  screen,
  within,
  textRegExp,
  hasLayout,
  cardOf,
  cardButton,
  looksFaded,
  looksSelected,
  checkboxFor,
  isCurrentButton,
  noticeKinds,
} from './helpers.jsx'

const NAMES = [
  'Noa Levi',
  'Maya Cohen',
  'Dana Mizrahi',
  'Yael Ben-David',
  'Shira Katz',
]
const ACTIVE = ['Noa Levi', 'Maya Cohen', 'Yael Ben-David']
const TASKS_OF = {
  'Noa Levi': ['Prepare the React workshop', 'Book the meeting room'],
  'Maya Cohen': ['Review pull requests', 'Update the club website'],
}
const ALL_TASKS = [
  'Prepare the React workshop',
  'Book the meeting room',
  'Review pull requests',
  'Update the club website',
  'Send the monthly newsletter',
  'Collect workshop feedback',
]

async function renderApp() {
  const App = await loadComponent('App')
  show(<App />)
  return makeUser()
}

function membersArea() {
  const area = document.querySelector('.membersList')
  expect(
    area,
    'the page should show the members inside an element with the class styles.membersList (MembersList)',
  ).toBeTruthy()
  return area
}

const visibleMembers = () =>
  NAMES.filter((name) => within(membersArea()).queryByText(textRegExp(name)))
const visibleTasks = () =>
  ALL_TASKS.filter((title) => screen.queryByText(textRegExp(title)))

async function selectMember(user, name) {
  const nameEl = within(membersArea()).queryByText(textRegExp(name))
  expect(nameEl, `the member "${name}" should be shown`).toBeTruthy()
  await user.click(nameEl)
}

function activeToggle() {
  const box = checkboxFor(document.body, 'Show only active members')
  expect(
    box,
    'the page should have the checkbox "Show only active members" (FilterBar)',
  ).toBeTruthy()
  return box
}

function layoutButton(label) {
  const name = new RegExp(`^\\s*${label}\\s*$`, 'i')
  const button =
    screen.queryByRole('button', { name }) ??
    screen.queryByRole('radio', { name })
  expect(
    button,
    `the page should have a "${label}" button (FilterBar)`,
  ).toBeTruthy()
  return button
}

function taskBox(title) {
  const box = checkboxFor(document.body, title)
  expect(
    box,
    `the task "${title}" should be shown with a checkbox`,
  ).toBeTruthy()
  return box
}

const warnings = () =>
  [...document.querySelectorAll('.notice')].filter((box) =>
    noticeKinds(box).includes('warning'),
  )
const isLayout = (layout) => hasLayout(membersArea(), layout)

test('App: shows all the components - Header, FilterBar, MembersList, TasksPanel and Footer', async () => {
  await renderApp()
  expect(
    screen.queryByRole('heading', { level: 1, name: /campus club dashboard/i }),
    'the page should show the Header',
  ).toBeTruthy()
  activeToggle()
  layoutButton('List')
  layoutButton('Grid')
  membersArea()
  expect(
    screen.queryByText(/select a member/i),
    'the page should show the TasksPanel ("Select a member…" at the start)',
  ).toBeTruthy()
  expect(
    document.querySelector('footer')?.textContent ?? '',
    'the page should show the Footer',
  ).toContain('Campus Coding Club')
})

test('App (members state): renders all 5 members with a loop; inactive ones are faded with a disabled button', async () => {
  await renderApp()
  expect(
    visibleMembers(),
    'all 5 members from data.js should be shown, in the same order',
  ).toEqual(NAMES)
  for (const name of NAMES) {
    const { nameEl, card } = cardOf(membersArea(), name)
    const inactive = !ACTIVE.includes(name)
    const button = cardButton(card)
    expect(button, `the card of ${name} should have a button`).toBeTruthy()
    expect(
      button.disabled,
      inactive
        ? `${name} is inactive - the button should be disabled`
        : `${name} is active - the button should be enabled`,
    ).toBe(inactive)
    expect(
      looksFaded(nameEl, membersArea()),
      inactive
        ? `${name} is inactive - the card should look faded`
        : `${name} is active - the card should not be faded`,
    ).toBe(inactive)
  }
})

test('App (showOnlyActive state): starts as false - the toggle is unchecked and all members are shown', async () => {
  await renderApp()
  expect(
    activeToggle().checked,
    'showOnlyActive should start as false - the checkbox should be unchecked',
  ).toBe(false)
  expect(
    visibleMembers(),
    'at the start all 5 members should be shown',
  ).toEqual(NAMES)
})

test('App (showOnlyActive state): checking the toggle shows only active members, unchecking shows all again', async () => {
  const user = await renderApp()
  await user.click(activeToggle())
  expect(
    activeToggle().checked,
    'after clicking, the checkbox should be checked',
  ).toBe(true)
  expect(
    visibleMembers(),
    'with the toggle on only the active members should be shown (Noa, Maya, Yael)',
  ).toEqual(ACTIVE)
  await user.click(activeToggle())
  expect(
    activeToggle().checked,
    'after clicking again, the checkbox should be unchecked',
  ).toBe(false)
  expect(
    visibleMembers(),
    'with the toggle off all 5 members should be shown again',
  ).toEqual(NAMES)
})

test("App (layout state): starts as 'list'; clicking Grid switches to grid and List switches back", async () => {
  const user = await renderApp()
  expect(
    isLayout('list') && !isLayout('grid'),
    'layout should start as "list" - the members wrapper should have the class styles.list',
  ).toBe(true)
  expect(
    isCurrentButton(layoutButton('List')),
    'at the start the "List" button should have the class styles.active',
  ).toBe(true)

  await user.click(layoutButton('Grid'))
  expect(
    isLayout('grid') && !isLayout('list'),
    'after clicking "Grid" the members wrapper should have the class styles.grid',
  ).toBe(true)
  expect(
    isCurrentButton(layoutButton('Grid')),
    'after clicking "Grid" the "Grid" button should have the class styles.active',
  ).toBe(true)
  expect(
    isCurrentButton(layoutButton('List')),
    'after clicking "Grid" the "List" button should not be active',
  ).toBe(false)
  expect(
    visibleMembers(),
    'switching the layout should not hide members',
  ).toEqual(NAMES)

  await user.click(layoutButton('List'))
  expect(
    isLayout('list') && !isLayout('grid'),
    'after clicking "List" the members wrapper should have the class styles.list again',
  ).toBe(true)
  expect(
    isCurrentButton(layoutButton('List')),
    'after clicking "List" the "List" button should be active again',
  ).toBe(true)
})

test("App (selectedMemberId state): starts as null - the tasks panel says 'Select a member…' and shows no tasks", async () => {
  await renderApp()
  expect(
    screen.queryByText(/select a member/i),
    'before choosing a member the tasks panel should say "Select a member to see their tasks"',
  ).toBeTruthy()
  expect(
    visibleTasks(),
    'before choosing a member no tasks should be shown',
  ).toEqual([])
})

test("App (selectedMemberId state): clicking a member shows only that member's tasks", async () => {
  const user = await renderApp()
  await selectMember(user, 'Noa Levi')
  expect(
    visibleTasks(),
    'after clicking Noa Levi only her 2 tasks should be shown',
  ).toEqual(TASKS_OF['Noa Levi'])
  expect(
    screen.queryByText(/select a member/i),
    'after choosing a member "Select a member…" should disappear',
  ).toBe(null)

  await selectMember(user, 'Maya Cohen')
  expect(
    visibleTasks(),
    "after clicking Maya Cohen only her 2 tasks should be shown (not Noa's)",
  ).toEqual(TASKS_OF['Maya Cohen'])
})

test("App (selectedMemberId state): only the clicked member's card is marked 'selected'", async () => {
  const user = await renderApp()
  const selected = (name) =>
    looksSelected(cardOf(membersArea(), name).nameEl, membersArea())
  await selectMember(user, 'Noa Levi')
  expect(
    selected('Noa Levi'),
    'after clicking Noa Levi her card should have the class styles.selected',
  ).toBe(true)
  expect(
    selected('Maya Cohen'),
    'only the clicked card should be selected',
  ).toBe(false)
  await selectMember(user, 'Maya Cohen')
  expect(
    selected('Maya Cohen'),
    'after clicking Maya Cohen her card should be selected',
  ).toBe(true)
  expect(
    selected('Noa Levi'),
    "Noa's card should not be selected anymore",
  ).toBe(false)
})

test("App (selectedMemberId state): a member without tasks shows 'No tasks yet'", async () => {
  const user = await renderApp()
  await selectMember(user, 'Yael Ben-David')
  expect(
    screen.queryByText(/no tasks yet/i),
    'Yael Ben-David has no tasks - the panel should say "No tasks yet"',
  ).toBeTruthy()
  expect(visibleTasks(), 'no tasks should be shown for Yael').toEqual([])
})

test("App (tasks state): clicking a task's checkbox marks it done, clicking again marks it undone", async () => {
  const user = await renderApp()
  await selectMember(user, 'Noa Levi')
  const title = 'Prepare the React workshop'
  expect(taskBox(title).checked, `"${title}" starts as not done`).toBe(false)
  await user.click(taskBox(title))
  expect(
    taskBox(title).checked,
    `after clicking, "${title}" should be done (update the tasks state)`,
  ).toBe(true)
  await user.click(taskBox(title))
  expect(
    taskBox(title).checked,
    `after clicking again, "${title}" should be undone`,
  ).toBe(false)
  expect(
    taskBox('Book the meeting room').checked,
    'toggling one task should not change the other tasks',
  ).toBe(true)
})

test('App (tasks state): a task stays done after switching to another member and back', async () => {
  const user = await renderApp()
  await selectMember(user, 'Noa Levi')
  await user.click(taskBox('Prepare the React workshop'))
  await selectMember(user, 'Maya Cohen')
  expect(
    taskBox('Review pull requests').checked,
    "Maya's tasks should not change when Noa's task is toggled",
  ).toBe(false)
  await selectMember(user, 'Noa Levi')
  expect(
    taskBox('Prepare the React workshop').checked,
    'the task should still be done - keep the tasks in a state in App',
  ).toBe(true)
})

test('App (notice): selecting an inactive member shows a yellow warning notice', async () => {
  const user = await renderApp()
  expect(
    warnings().length,
    'at the start there should be no warning notice',
  ).toBe(0)
  await selectMember(user, 'Dana Mizrahi')
  const [box] = warnings()
  expect(
    box,
    'selecting an inactive member (Dana Mizrahi) should show a Notice with type="warning"',
  ).toBeTruthy()
  expect(
    box.textContent,
    'the warning should say that the member is inactive, e.g. "Dana Mizrahi is inactive"',
  ).toMatch(/inactive|not active/i)
})

test('App (notice): the warning disappears when an active member is selected', async () => {
  const user = await renderApp()
  await selectMember(user, 'Dana Mizrahi')
  expect(
    warnings().length,
    'selecting Dana Mizrahi (inactive) should show one warning notice',
  ).toBe(1)
  await selectMember(user, 'Noa Levi')
  expect(
    warnings().length,
    'after selecting Noa Levi (active) the warning should disappear',
  ).toBe(0)
})
