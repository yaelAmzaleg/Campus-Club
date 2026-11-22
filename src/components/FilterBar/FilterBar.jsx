// FilterBar - the toggle "Show only active members" + the "List" / "Grid" switch.
// It has no state of its own: App owns the state and passes it down as props.
import styles from './FilterBar.module.css'

/**
 * @param {object} props
 * @param {boolean} props.showOnlyActive - is the checkbox checked?
 * @param {() => void} props.onToggleActive - call it when the checkbox is clicked
 * @param {"list" | "grid"} props.layout - the current layout. Its button gets the class styles.active
 * @param {(layout: "list" | "grid") => void} props.onLayoutChange - call it with "list" or "grid"
 */
export default function FilterBar({
  showOnlyActive,
  onToggleActive,
  layout,
  onLayoutChange,
}) {
  return(
  <section className={styles.filterBar} aria-label="Member filters and layout">
  <label className={styles.toggle}><input type="checkbox" checked={showOnlyActive} onChange={onToggleActive}></input> Show only active members</label>
  <nav className={styles.layoutSwitch} aria-label="Layout view">
    <button type="button" onClick={()=> onLayoutChange('list')} className={layout === 'list' ? styles.active : ''}>
List
    </button>
    <button type="button" onClick={()=> onLayoutChange('grid')} className={layout === 'grid' ? styles.active : ''}>
Grid
    </button>
  </nav>
</section>
 )
}
