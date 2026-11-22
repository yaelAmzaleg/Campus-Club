import { test, expect } from 'vitest'
import {
  loadComponent,
  show,
  makeUser,
  spy,
  within,
  checkboxFor,
  isCurrentButton,
} from './helpers.jsx'

async function renderBar(props = {}) {
  const FilterBar = await loadComponent('FilterBar')
  const onToggleActive = spy()
  const onLayoutChange = spy()
  const all = {
    showOnlyActive: false,
    onToggleActive,
    layout: 'list',
    onLayoutChange,
    ...props,
  }
  const view = show(<FilterBar {...all} />)
  const rerender = (more) => view.rerender(<FilterBar {...all} {...more} />)
  return { ...view, rerender, onToggleActive, onLayoutChange }
}

function toggleOf(view) {
  const box = checkboxFor(view.container, 'Show only active members')
  expect(
    box,
    'FilterBar should have a checkbox with the label "Show only active members"',
  ).toBeTruthy()
  return box
}

function layoutButton(view, label) {
  const bar = within(view.container)
  const name = new RegExp(`^\\s*${label}\\s*$`, 'i')
  const button =
    bar.queryByRole('button', { name }) ?? bar.queryByRole('radio', { name })
  expect(button, `FilterBar should have a "${label}" button`).toBeTruthy()
  return button
}

test("FilterBar: the 'Show only active members' checkbox shows the value of showOnlyActive", async () => {
  const view = await renderBar({ showOnlyActive: false })
  expect(
    toggleOf(view).checked,
    'with showOnlyActive=false the checkbox should be unchecked',
  ).toBe(false)
  view.rerender({ showOnlyActive: true })
  expect(
    toggleOf(view).checked,
    'with showOnlyActive=true the checkbox should be checked (checked={showOnlyActive})',
  ).toBe(true)
})

test('FilterBar: clicking the checkbox calls onToggleActive', async () => {
  const view = await renderBar()
  await makeUser().click(toggleOf(view))
  expect(
    view.onToggleActive.calls.length,
    'clicking the checkbox should call onToggleActive once',
  ).toBe(1)
})

test("FilterBar: clicking 'Grid' / 'List' calls onLayoutChange with 'grid' / 'list'", async () => {
  const view = await renderBar()
  const user = makeUser()
  await user.click(layoutButton(view, 'Grid'))
  expect(
    view.onLayoutChange.calls.at(-1),
    'clicking "Grid" should call onLayoutChange("grid")',
  ).toEqual(['grid'])
  view.rerender({ layout: 'grid' })
  await user.click(layoutButton(view, 'List'))
  expect(
    view.onLayoutChange.calls.at(-1),
    'clicking "List" should call onLayoutChange("list")',
  ).toEqual(['list'])
})

test("FilterBar: the button of the current layout has the class 'active'", async () => {
  const view = await renderBar({ layout: 'list' })
  expect(
    isCurrentButton(layoutButton(view, 'List')),
    'with layout="list" the "List" button should have the class styles.active',
  ).toBe(true)
  expect(
    isCurrentButton(layoutButton(view, 'Grid')),
    'with layout="list" the "Grid" button should not have the class styles.active',
  ).toBe(false)
  view.rerender({ layout: 'grid' })
  expect(
    isCurrentButton(layoutButton(view, 'Grid')),
    'with layout="grid" the "Grid" button should have the class styles.active',
  ).toBe(true)
  expect(
    isCurrentButton(layoutButton(view, 'List')),
    'with layout="grid" the "List" button should not have the class styles.active',
  ).toBe(false)
})
