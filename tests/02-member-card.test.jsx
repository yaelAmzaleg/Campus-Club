import { test, expect } from 'vitest'
import {
  loadComponent,
  show,
  makeUser,
  spy,
  within,
  textRegExp,
  cardButton,
  rolesShownBy,
  looksFaded,
  looksSelected,
} from './helpers.jsx'

const noa = { id: 1, name: 'Noa Levi', role: 'Leader', isActive: true }
const maya = { id: 2, name: 'Maya Cohen', role: 'Member', isActive: true }
const dana = { id: 3, name: 'Dana Mizrahi', role: 'Member', isActive: false }
const shira = { id: 5, name: 'Shira Katz', role: 'Guest', isActive: true }

async function renderCard(member, isSelected = false) {
  const MemberCard = await loadComponent('MemberCard')
  const onSelect = spy()
  const view = show(
    <MemberCard member={member} isSelected={isSelected} onSelect={onSelect} />,
  )
  const card = () => within(view.container)
  const rerender = (selected) =>
    view.rerender(
      <MemberCard member={member} isSelected={selected} onSelect={onSelect} />,
    )
  return { ...view, card, rerender, onSelect }
}

function nameOf(view, member) {
  const el = view.card().queryByText(textRegExp(member.name))
  expect(el, `the card should show the name "${member.name}"`).toBeTruthy()
  return el
}

function buttonOf(view) {
  const button = cardButton(view.container)
  expect(button, 'the card should have a small action <button>').toBeTruthy()
  return button
}

test("MemberCard: shows the member's name and role", async () => {
  const view = await renderCard(noa)
  nameOf(view, noa)
  expect(
    view.card().queryAllByText(/leader/i).length,
    'the card should show the role badge "Leader"',
  ).toBeGreaterThan(0)
})

test('MemberCard: the avatar shows the initials of the name (Noa Levi -> NL)', async () => {
  const view = await renderCard(noa)
  expect(
    view.card().queryByText(/^\s*NL\s*$/),
    'the avatar of "Noa Levi" should show the initials "NL"',
  ).toBeTruthy()
})

test('MemberCard: the initials are calculated from the name, not hard-coded (Maya Cohen -> MC)', async () => {
  const view = await renderCard(maya)
  expect(
    view.card().queryByText(/^\s*MC\s*$/),
    'the avatar of "Maya Cohen" should show "MC" - take the first letter of each word of the name',
  ).toBeTruthy()
})

test('MemberCard: the role button color matches the role (Leader=blue, Member=green, Guest=purple)', async () => {
  for (const [member, color] of [
    [noa, 'blue'],
    [maya, 'green'],
    [shira, 'purple'],
  ]) {
    const view = await renderCard(member)
    const role = member.role.toLowerCase()
    expect(
      rolesShownBy(buttonOf(view)),
      `the button of a ${member.role} should be ${color}: give it the class styles.${role}`,
    ).toEqual([role])
    view.unmount()
  }
})

test('MemberCard: an active member is not faded and the button is enabled', async () => {
  const view = await renderCard(noa)
  expect(
    buttonOf(view).disabled,
    'the button of an active member should be enabled',
  ).toBe(false)
  expect(
    looksFaded(nameOf(view, noa), view.container),
    "an active member's card should not be faded",
  ).toBe(false)
})

test('MemberCard: an inactive member looks faded and the button is disabled', async () => {
  const view = await renderCard(dana)
  expect(
    buttonOf(view).disabled,
    'the button of an inactive member should be disabled (disabled={...})',
  ).toBe(true)
  expect(
    looksFaded(nameOf(view, dana), view.container),
    "an inactive member's card should look faded - add the class styles.inactive to the card",
  ).toBe(true)
})

test('MemberCard: clicking the card calls onSelect with the member id', async () => {
  const view = await renderCard(maya)
  await makeUser().click(nameOf(view, maya))
  expect(
    view.onSelect.calls.length,
    'clicking the card should call onSelect once',
  ).toBe(1)
  const [arg] = view.onSelect.calls[0]
  expect(
    arg === maya.id || arg?.id === maya.id,
    `onSelect should be called with the member id (${maya.id})`,
  ).toBe(true)
})

test("MemberCard: the card has the class 'selected' only when isSelected is true", async () => {
  const view = await renderCard(noa, true)
  expect(
    looksSelected(nameOf(view, noa), view.container),
    'when isSelected is true the card should get the class styles.selected',
  ).toBe(true)
  view.rerender(false)
  expect(
    looksSelected(nameOf(view, noa), view.container),
    'when isSelected is false the card should not have the class styles.selected',
  ).toBe(false)
})
