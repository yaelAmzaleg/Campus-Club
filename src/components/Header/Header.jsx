// Header - big, centered, bold title.
// Renders an <h1> with the text: Campus Club Dashboard
import styles from './Header.module.css'

export default function Header() {

  return (
 <header className={styles.header}>
      <h1 className={styles.title}>Campus Club Dashboard</h1>
    </header>
)
}
