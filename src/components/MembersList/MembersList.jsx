// MembersList - wraps all the MemberCards and switches between list and grid.
import styles from './MembersList.module.css'

/**
 * @param {object} props
 * @param {Array<{id: number, name: string, role: string, isActive: boolean}>} props.members - the members to show (already filtered)
 * @param {"list" | "grid"} props.layout - the wrapper gets styles.membersList + styles.list or styles.grid
 * @param {number | null} props.selectedMemberId
 * @param {(memberId: number) => void} props.onSelect - pass it to every MemberCard
 */
export default function MembersList({
  members,
  layout,
  selectedMemberId,
  onSelect,
}) {
  // TODO: a loop over members -> <MemberCard ... />
  // TODO: if there are no members -> the message "No members to show"
  return null
}
