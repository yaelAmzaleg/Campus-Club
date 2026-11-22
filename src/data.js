// The starting data of the club. This file is ready - use it as the initial value of your state.
// (The tests use these exact members and tasks, so don't change them.)

export const initialMembers = [
  { id: 1, name: 'Noa Levi', role: 'Leader', isActive: true },
  { id: 2, name: 'Maya Cohen', role: 'Member', isActive: true },
  { id: 3, name: 'Dana Mizrahi', role: 'Member', isActive: false },
  { id: 4, name: 'Yael Ben-David', role: 'Guest', isActive: true },
  { id: 5, name: 'Shira Katz', role: 'Guest', isActive: false },
]

export const initialTasks = [
  { id: 101, title: 'Prepare the React workshop', done: false, assignedTo: 1 },
  { id: 102, title: 'Book the meeting room', done: true, assignedTo: 1 },
  { id: 103, title: 'Review pull requests', done: false, assignedTo: 2 },
  { id: 104, title: 'Update the club website', done: true, assignedTo: 2 },
  { id: 105, title: 'Send the monthly newsletter', done: false, assignedTo: 3 },
  { id: 106, title: 'Collect workshop feedback', done: false, assignedTo: 5 },
]
