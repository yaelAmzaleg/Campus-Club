import { useState } from 'react'
import { initialMembers, initialTasks } from './data.js'
import Header from './components/Header/Header.jsx'
import FilterBar from './components/FilterBar/FilterBar.jsx'
import Notice from './components/Notice/Notice.jsx'
import MembersList from './components/MembersList/MembersList.jsx'
import TasksPanel from './components/TasksPanel/TasksPanel.jsx'
import Footer from './components/Footer/Footer.jsx'
import styles from './App.module.css'

export default function App() {
  const [members] = useState(initialMembers)
  const [tasks, setTasks] = useState(initialTasks)
  const [selectedMemberId, setSelectedMemberId] = useState(null)
  const [showOnlyActive, setShowOnlyActive] = useState(false)
  const [layout, setLayout] = useState('list')

  const visibleMembers = showOnlyActive
    ? members.filter((member) => member.isActive)
    : members

  const selectedMember =
    members.find((member) => member.id === selectedMemberId) ?? null

  const selectedTasks = selectedMember
    ? tasks.filter((task) => task.assignedTo === selectedMember.id)
    : []

  function handleToggleTask(taskId) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task,
      ),
    )
  }

  return (
    <section className={styles.app}>
      <Header />

      <main className={styles.main}>
        <FilterBar
          showOnlyActive={showOnlyActive}
          onToggleActive={() => setShowOnlyActive((prev) => !prev)}
          layout={layout}
          onLayoutChange={setLayout}
        />

        {selectedMember && !selectedMember.isActive && (
          <Notice type="warning">{selectedMember.name} is inactive</Notice>
        )}

        <section className={styles.content} aria-label="Members and tasks">
          <MembersList
            members={visibleMembers}
            layout={layout}
            selectedMemberId={selectedMemberId}
            onSelect={setSelectedMemberId}
          />

          <TasksPanel
            member={selectedMember}
            tasks={selectedTasks}
            onToggleTask={handleToggleTask}
          />
        </section>
      </main>

      <Footer />
    </section>
  )
}