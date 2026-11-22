import { test, expect } from 'vitest'
import { loadComponent, show, screen } from './helpers.jsx'

const clean = (text) => text.replace(/\s+/g, ' ').trim()

test("Header: shows the title 'Campus Club Dashboard' in an <h1>", async () => {
  const Header = await loadComponent('Header')
  show(<Header />)
  const h1 = screen.queryByRole('heading', { level: 1 })
  expect(h1, 'Header should render an <h1>').toBeTruthy()
  expect(
    clean(h1.textContent),
    'the <h1> should say "Campus Club Dashboard"',
  ).toContain('Campus Club Dashboard')
})

test("Footer: shows '© 2025 Campus Coding Club' inside a <footer>", async () => {
  const Footer = await loadComponent('Footer')
  const { container } = show(<Footer />)
  const footer = container.querySelector('footer')
  expect(footer, 'Footer should render a <footer> element').toBeTruthy()
  expect(
    clean(footer.textContent),
    'the <footer> should say "© 2025 Campus Coding Club"',
  ).toContain('© 2025 Campus Coding Club')
})
