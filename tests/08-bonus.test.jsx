// Bonus (Stretch) - not required. The task is approved without these.
import { expect } from 'vitest'
import {
  loadComponent,
  show,
  makeUser,
  screen,
  within,
  textRegExp,
  checkboxFor,
  bonus,
} from './helpers.jsx'

const NAMES = [
  'Noa Levi',
  'Maya Cohen',
  'Dana Mizrahi',
  'Yael Ben-David',
  'Shira Katz',
]

async function renderApp() {
  const App = await loadComponent('App')
  show(<App />)
  return makeUser()
}

const area = () => document.querySelector('.membersList')
const visibleMembers = () =>
  NAMES.filter((name) => area() && within(area()).queryByText(textRegExp(name)))

async function selectMember(user, name) {
  const nameEl = area() && within(area()).queryByText(textRegExp(name))
  expect(nameEl, `the member "${name}" should be shown`).toBeTruthy()
  await user.click(nameEl)
}

const pageText = () => document.body.textContent.replace(/\s+/g, ' ')

bonus('task counter shows done/total for the selected member', async () => {
  const user = await renderApp()
  await selectMember(user, 'Noa Levi')
  expect(
    pageText(),
    'Noa has 1 done task out of 2 - show a counter like "1/2"',
  ).toMatch(/(?<!\d)1\s*(\/|of)\s*2(?!\d)/)
  const box = checkboxFor(document.body, 'Prepare the React workshop')
  expect(box, 'the task should have a checkbox').toBeTruthy()
  await user.click(box)
  expect(
    pageText(),
    'after marking another task done the counter should show "2/2"',
  ).toMatch(/(?<!\d)2\s*(\/|of)\s*2(?!\d)/)
})

bonus(
  'quick add - typing a title and clicking Add adds a task to the selected member',
  async () => {
    const user = await renderApp()
    await selectMember(user, 'Yael Ben-David')
    const addButton = screen.queryAllByRole('button', { name: /add/i })[0]
    expect(
      addButton,
      'the tasks panel should have an "Add" button',
    ).toBeTruthy()
    let input = null
    for (
      let node = addButton.parentElement;
      node && !input;
      node = node.parentElement
    ) {
      input = node.querySelector('input[type="text"], input:not([type])')
    }
    expect(
      input,
      'there should be a text input next to the Add button',
    ).toBeTruthy()
    await user.type(input, 'Plan the hackathon')
    await user.click(addButton)
    const box = checkboxFor(document.body, 'Plan the hackathon')
    expect(
      box,
      'after clicking Add the new task should be shown with a checkbox',
    ).toBeTruthy()
    expect(box.checked, 'a new task should start as not done').toBe(false)
    expect(
      screen.queryByText(/no tasks yet/i),
      '"No tasks yet" should disappear after adding a task',
    ).toBe(null)
    await selectMember(user, 'Noa Levi')
    expect(
      screen.queryByText(/plan the hackathon/i),
      'the new task belongs to Yael - it should not be shown for Noa',
    ).toBe(null)
  },
)

bonus('search box filters the members by name', async () => {
  const user = await renderApp()
  const input =
    screen.queryByRole('searchbox') ??
    screen.queryByPlaceholderText(/search/i) ??
    screen.queryByRole('textbox', { name: /search/i })
  expect(
    input,
    'add a search input (type="search" or a placeholder with the word "Search")',
  ).toBeTruthy()
  await user.type(input, 'noa')
  expect(
    visibleMembers(),
    'typing "noa" should show only Noa Levi (ignore upper/lower case)',
  ).toEqual(['Noa Levi'])
  await user.clear(input)
  expect(
    visibleMembers(),
    'clearing the search should show all the members again',
  ).toEqual(NAMES)
})
