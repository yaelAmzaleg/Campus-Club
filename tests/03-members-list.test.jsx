import { test, expect } from 'vitest'
import {
  loadComponent,
  show,
  makeUser,
  spy,
  within,
  textRegExp,
  hasLayout,
  looksSelected,
} from './helpers.jsx'

const members = [
  { id: 1, name: 'Noa Levi', role: 'Leader', isActive: true },
  { id: 2, name: 'Maya Cohen', role: 'Member', isActive: true },
  { id: 3, name: 'Dana Mizrahi', role: 'Member', isActive: false },
]

async function renderList(props = {}) {
  const MembersList = await loadComponent('MembersList')
  const onSelect = spy()
  const all = {
    members,
    layout: 'list',
    selectedMemberId: null,
    onSelect,
    ...props,
  }
  const view = show(<MembersList {...all} />)
  const rerender = (more) => view.rerender(<MembersList {...all} {...more} />)
  return { ...view, onSelect, rerender, list: within(view.container) }
}

function nameEl(view, name) {
  const el = view.list.queryByText(textRegExp(name))
  expect(
    el,
    `"${name}" should be shown - render a MemberCard for every member`,
  ).toBeTruthy()
  return el
}

test('MembersList: renders a MemberCard for every member (with a loop)', async () => {
  const view = await renderList()
  for (const member of members) nameEl(view, member.name)
  const { list: two } = await renderList({ members: members.slice(0, 2) })
  expect(
    two.queryAllByText(textRegExp('Dana Mizrahi')).length,
    'only the members in the members prop should be shown',
  ).toBe(0)
})

test("MembersList: shows 'No members to show' when there are no members", async () => {
  const { list } = await renderList({ members: [] })
  expect(
    list.queryByText(/no members to show/i),
    'with an empty members array show the message "No members to show"',
  ).toBeTruthy()
})

test("MembersList: the wrapper has the class 'membersList' plus the layout ('list' / 'grid')", async () => {
  const view = await renderList({ layout: 'list' })
  const area = () => view.container.querySelector('.membersList')
  expect(
    area(),
    'the element that wraps the cards should have the class styles.membersList',
  ).toBeTruthy()
  expect(
    hasLayout(area(), 'list') && !hasLayout(area(), 'grid'),
    'with layout="list" the wrapper should also have the class styles.list',
  ).toBe(true)
  view.rerender({ layout: 'grid' })
  expect(
    hasLayout(area(), 'grid') && !hasLayout(area(), 'list'),
    'with layout="grid" the wrapper should have the class styles.grid (and not styles.list)',
  ).toBe(true)
})

test("MembersList: clicking a card calls onSelect with that member's id", async () => {
  const view = await renderList()
  await makeUser().click(nameEl(view, 'Maya Cohen'))
  expect(
    view.onSelect.calls.length,
    'clicking a card should call onSelect once - pass onSelect to every MemberCard',
  ).toBe(1)
  const [arg] = view.onSelect.calls[0]
  expect(
    arg === 2 || arg?.id === 2,
    'clicking Maya Cohen should call onSelect with her id (2)',
  ).toBe(true)
})

test("MembersList: only the card of selectedMemberId is marked 'selected'", async () => {
  const view = await renderList({ selectedMemberId: 2 })
  const selected = (name) => looksSelected(nameEl(view, name), view.container)
  expect(
    selected('Maya Cohen'),
    "with selectedMemberId=2 Maya's card should have the class styles.selected",
  ).toBe(true)
  expect(
    selected('Noa Levi'),
    "only the selected member's card should have the class styles.selected",
  ).toBe(false)
  view.rerender({ selectedMemberId: 1 })
  expect(
    selected('Noa Levi'),
    "with selectedMemberId=1 Noa's card should be selected",
  ).toBe(true)
  expect(
    selected('Maya Cohen'),
    "Maya's card should not be selected anymore",
  ).toBe(false)
})
