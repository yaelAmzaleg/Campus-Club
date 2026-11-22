import { test, expect } from 'vitest'
import { loadComponent, show, noticeKinds } from './helpers.jsx'

// The text is passed both as children and as a "message" prop, so both ways of writing Notice work.
async function renderNotice(type, text) {
  const Notice = await loadComponent('Notice')
  const view = show(
    <Notice type={type} message={text}>
      {text}
    </Notice>,
  )
  const box = view.container.querySelector('.notice')
  expect(
    box,
    'Notice should render a box with the class styles.notice',
  ).toBeTruthy()
  return box
}

test("Notice: shows its text inside a box with the class 'notice'", async () => {
  const box = await renderNotice('info', 'Club meeting on Monday')
  expect(
    box.textContent,
    'the notice box should show the text it gets (children)',
  ).toContain('Club meeting on Monday')
})

test("Notice: type 'warning' is yellow and type 'info' is blue", async () => {
  const warning = await renderNotice('warning', 'Careful!')
  expect(
    noticeKinds(warning),
    'type="warning" should be a yellow box - add the class styles.warning next to styles.notice',
  ).toEqual(['warning'])
  const info = await renderNotice('info', 'Good to know')
  expect(
    noticeKinds(info),
    'type="info" should be a blue box - add the class styles.info next to styles.notice',
  ).toEqual(['info'])
})
