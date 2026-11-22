// Notice - a colored box: yellow for warnings, blue for info.
import styles from './Notice.module.css'

/**
 * @param {object} props
 * @param {"warning" | "info"} props.type - the box gets styles.notice + styles.warning or styles.info
 * @param {React.ReactNode} props.children - the text of the notice
 */
export default function Notice({ type, children }) {
 const typeClass = type === 'info' ? styles.info : styles.warning
  return (
    <aside className={`${styles.notice} ${typeClass}`} role="status">
      {children}
    </aside>
  )
}
