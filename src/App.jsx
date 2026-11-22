// App - keeps all the state (useState) and builds the page from the components.
import { initialMembers, initialTasks } from './data.js'
import styles from './App.module.css'

export default function App() {
  // TODO: state (useState):
  //   members          - start with initialMembers
  //   tasks            - start with initialTasks
  //   selectedMemberId - start with null
  //   showOnlyActive   - start with false
  //   layout           - start with "list"

  // TODO: compute the members to show, the selected member and their tasks

  // TODO: render: Header, FilterBar, Notice (only when needed), MembersList, TasksPanel, Footer
  return <div className={styles.app}>{/* TODO */}</div>
}
