import { test, expect } from 'vitest'
import {
  loadComponent,
  show,
  makeUser,
  spy,
  within,
  textRegExp,
  checkboxFor,
} from './helpers.jsx'

const noa = { id: 1, name: 'Noa Levi', role: 'Leader', isActive: true }
const yael = { id: 4, name: 'Yael Ben-David', role: 'Guest', isActive: true }
const noaTasks = [
  { id: 101, title: 'Prepare the React workshop', done: false, assignedTo: 1 },
  { id: 102, title: 'Book the meeting room', done: true, assignedTo: 1 },
]

async function renderPanel(member, tasks) {
  const TasksPanel = await loadComponent('TasksPanel')
  const onToggleTask = spy()
  const view = show(
    <TasksPanel member={member} tasks={tasks} onToggleTask={onToggleTask} />,
  )
  return { ...view, onToggleTask, panel: within(view.container) }
}

function checkboxOf(view, title) {
  const box = checkboxFor(view.container, title)
  expect(
    box,
    `the task "${title}" should be shown with a checkbox next to it`,
  ).toBeTruthy()
  return box
}

test("TasksPanel: with no selected member shows 'Select a member…'", async () => {
  const { panel } = await renderPanel(null, [])
  expect(
    panel.queryByText(/select a member/i),
    'when member is null show the message "Select a member to see their tasks"',
  ).toBeTruthy()
})

test("TasksPanel: shows the selected member's name and a row for every task (with a loop)", async () => {
  const { panel } = await renderPanel(noa, noaTasks)
  expect(
    panel.queryAllByText(textRegExp(noa.name)).length,
    'the panel should show the name of the selected member',
  ).toBeGreaterThan(0)
  for (const task of noaTasks) {
    expect(
      panel.queryByText(textRegExp(task.title)),
      `the task "${task.title}" should be shown`,
    ).toBeTruthy()
  }
  expect(
    panel.queryByText(/select a member/i),
    'when a member is selected don\'t show "Select a member…"',
  ).toBe(null)
})

test('TasksPanel: a done task has a checked checkbox and an open task an unchecked one', async () => {
  const view = await renderPanel(noa, noaTasks)
  expect(
    checkboxOf(view, 'Prepare the React workshop').checked,
    'a task with done=false should have an unchecked checkbox',
  ).toBe(false)
  expect(
    checkboxOf(view, 'Book the meeting room').checked,
    'a task with done=true should have a checked checkbox (checked={task.done})',
  ).toBe(true)
})

test("TasksPanel: clicking a task's checkbox calls onToggleTask with the task id", async () => {
  const view = await renderPanel(noa, noaTasks)
  const user = makeUser()
  await user.click(checkboxOf(view, 'Prepare the React workshop'))
  expect(
    view.onToggleTask.calls,
    'clicking the checkbox of a task should call onToggleTask(task.id)',
  ).toEqual([[101]])
  await user.click(checkboxOf(view, 'Book the meeting room'))
  expect(
    view.onToggleTask.calls.at(-1),
    'clicking the second task should call onToggleTask with its id (102)',
  ).toEqual([102])
})

test("TasksPanel: shows 'No tasks yet' when the selected member has no tasks", async () => {
  const { panel } = await renderPanel(yael, [])
  expect(
    panel.queryByText(/no tasks yet/i),
    'a selected member with no tasks should show "No tasks yet"',
  ).toBeTruthy()
  expect(
    panel.queryByText(/select a member/i),
    'a member is selected, so don\'t show "Select a member…"',
  ).toBe(null)
})
