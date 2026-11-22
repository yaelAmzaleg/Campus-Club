// MemberCard - avatar (initials), name, role badge and a small role-colored action button.
import styles from './MemberCard.module.css'
function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}
/**
 * @param {object} props
 * @param {{id: number, name: string, role: "Leader" | "Member" | "Guest", isActive: boolean}} props.member
 * @param {boolean} props.isSelected - true when this is the selected member (the card gets styles.selected)
 * @param {(memberId: number) => void} props.onSelect - call it with member.id when the card is clicked
 */
export default function MemberCard({ member, isSelected, onSelect }) {
  const roleKey = member.role.toLowerCase()
  const cardClasses = [
    styles.card,
    isSelected ? styles.selected : '',
    !member.isActive ? styles.inactive : '',
  ]
    .filter(Boolean)
    .join(' ')
    const buttonClasses = [styles.roleButton, styles[roleKey] ?? '']
    .filter(Boolean)
    .join(' ')
  return (
<article className={cardClasses} onClick={() => onSelect(member.id)}>
  <span className={styles.avatar} aria-hidden="true">{getInitials(member.name)}</span>
  <span className={styles.name}>{member.name}</span>
  <span className={styles.badge}>{member.role}</span>
  <button type="button"
        className={buttonClasses}
        disabled={!member.isActive}
        onClick={(e) => e.stopPropagation()}>{member.role}</button>
</article>
  )
}
