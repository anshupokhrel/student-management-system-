const storageKey = 'smsAppUsers';
const currentUserKey = 'smsCurrentUser';

const defaultUsers = [
  {
    username: 'student1',
    password: 'student123',
    role: 'student',
    name: 'Aman Kumar',
    email: 'aman.kumar@example.com',
    phone: '9876543210',
    address: 'Gangoh, Uttar Pradesh',
    studentId: 'S1001',
    bio: 'Enthusiastic computer science student.',
    joined: '2024-06-01',
    courses: 'DSA, SE, CN',
  },
  {
    username: 'faculty1',
    password: 'faculty123',
    role: 'faculty',
    name: 'Prof. Neha Sharma',
    email: 'neha.sharma@example.com',
    phone: '9123456780',
    address: 'Gangoh, Uttar Pradesh',
    studentId: 'F2001',
    bio: 'Faculty coordinator for undergraduate programs.',
    joined: '2022-12-15',
    courses: 'Software Engineering, DSA',
  },
];

let appData = {
  attendance: [
    { student: 'Aman Kumar', date: '2026-05-02', status: 'Present' },
    { student: 'Aman Kumar', date: '2026-05-03', status: 'Absent' },
    { student: 'Shivam Sahaghal', date: '2026-05-02', status: 'Present' },
  ],
  grades: [
    { student: 'Aman Kumar', subject: 'Software Engineering', marks: 86 },
    { student: 'Aman Kumar', subject: 'DSA', marks: 91 },
    { student: 'Vipul Sharma', subject: 'C++ Programming', marks: 79 },
  ],
  assignments: [
    { title: 'SE Project', dueDate: '2026-05-15', status: 'Pending' },
    { title: 'DSA Homework', dueDate: '2026-05-18', status: 'Submitted' },
  ],
  events: [
    { name: 'Annual Tech Fest', date: '2026-06-10', time: '10:00 AM', location: 'Campus Hall', description: 'Innovation and tech projects showcase.' },
  ],
  fees: [
    { student: 'Aman Kumar', amount: 15000, date: '2026-04-20' },
  ],
  documents: [
    { student: 'Aman Kumar', type: 'Aadhaar', fileName: 'aadhaar.pdf', uploadDate: '2026-04-30' },
  ],
  leaves: [
    { student: 'Aman Kumar', startDate: '2026-05-20', endDate: '2026-05-22', reason: 'Medical appointment', status: 'Pending' },
  ],
  feedback: [
    { course: 'DSA', student: 'Aman Kumar', rating: 4, comments: 'Great teaching style.' },
  ],
  queries: [
    { student: 'Aman Kumar', subject: 'Data Stucture', query: 'Can we have more practice problems?', status: 'Open', response: '' },
  ],
  notifications: [
    { title: 'Campus Wi-Fi Upgrade', message: 'The campus Wi-Fi will be upgraded on May 10. Expect short outages.' },
  ],
};

function getUsers() {
  const stored = localStorage.getItem(storageKey);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(storageKey, JSON.stringify(defaultUsers));
  return [...defaultUsers];
}

function saveUsers(users) {
  localStorage.setItem(storageKey, JSON.stringify(users));
}

function getCurrentUser() {
  const stored = localStorage.getItem(currentUserKey);
  return stored ? JSON.parse(stored) : null;
}

function setCurrentUser(user) {
  localStorage.setItem(currentUserKey, JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem(currentUserKey);
}

function showRegister() {
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('register-page').style.display = 'flex';
}

function showLogin() {
  document.getElementById('register-page').style.display = 'none';
  document.getElementById('login-page').style.display = 'flex';
}

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const button = document.querySelector('.theme-toggle');
  button.textContent = document.body.classList.contains('dark-theme') ? '🌙' : '☀️';
}

function toggleNav() {
  const drawer = document.getElementById('nav-drawer');
  drawer.classList.toggle('open');
}

function showSection(sectionId) {
  if (sectionId === 'dashboard-home') sectionId = 'home';
  const sections = document.querySelectorAll('.section');
  sections.forEach((section) => section.classList.remove('active'));
  const target = document.getElementById(sectionId);
  if (target) target.classList.add('active');
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => link.classList.toggle('active', link.getAttribute('onclick')?.includes(sectionId)));

  if (sectionId === 'home') {
    updateDashboard();
  }
  setRoleViews();
}

function updateDashboard() {
  const user = getCurrentUser();
  if (!user) return;
  const isStudent = user.role === 'student';
  document.getElementById('student-dashboard').style.display = isStudent ? 'block' : 'none';
  document.getElementById('faculty-dashboard').style.display = isStudent ? 'none' : 'block';

  const attendanceCount = appData.attendance.filter((item) => item.student === user.name && item.status === 'Present').length;
  const totalDays = appData.attendance.filter((item) => item.student === user.name).length || 1;
  const attendancePercent = Math.round((attendanceCount / totalDays) * 100);
  const progress = Math.min(Math.max(attendancePercent, 0), 100);

  const attendanceSummaryElements = document.querySelectorAll('#student-attendance-summary');
  attendanceSummaryElements.forEach((el) => {
    el.textContent = `${attendancePercent}% attendance recorded over ${totalDays} days.`;
  });

  document.getElementById('academic-progress').style.width = `${progress}%`;
  document.getElementById('academic-progress').textContent = `${progress}%`;
  document.getElementById('fee-payment-status').textContent = `${appData.fees.filter((item) => item.student === user.name).length} payment records found.`;

  document.getElementById('assignment-deadlines').innerHTML = appData.assignments
    .map((assignment) => `<li>${assignment.title} — due ${assignment.dueDate}</li>`)
    .join('');

  const examBody = document.getElementById('exam-schedule-body');
  examBody.innerHTML = `
    <tr><td>Mathematics</td><td>2026-05-12</td><td>10:00 AM</td></tr>
    <tr><td>Software Engineering</td><td>2026-05-16</td><td>02:00 PM</td>
  `;

  document.getElementById('average-grade').textContent = '88';
  document.getElementById('top-performer').textContent = 'Aman Kumar';
  document.getElementById('faculty-attendance-rate').textContent = '92%';
  document.getElementById('faculty-attendance-summary').textContent = 'Attendance status for all students is up-to-date.';
  document.getElementById('assignment-review-list').innerHTML = appData.assignments.map((assignment) => `<li>${assignment.title} — ${assignment.status}</li>`).join('');
}

function handleRegister(event) {
  event.preventDefault();
  const role = document.getElementById('reg-role').value;
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value.trim();
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const error = document.getElementById('register-error');
  const users = getUsers();

  if (!role || !username || !password || !name || !email) {
    error.textContent = 'Please fill in all required fields.';
    return;
  }

  if (users.some((user) => user.username === username)) {
    error.textContent = 'That username is already taken.';
    return;
  }

  const newUser = {
    username,
    password,
    role,
    name,
    email,
    phone,
    address: '',
    studentId: `${role.substring(0, 1).toUpperCase()}${Math.floor(Math.random() * 9000) + 1000}`,
    bio: '',
    joined: new Date().toISOString().split('T')[0],
    courses: role === 'student' ? 'DSA, SE, C++ Programming' : 'Faculty Assigned',
  };

  users.push(newUser);
  saveUsers(users);
  error.textContent = 'Registration successful. You may now login.';
  setTimeout(() => {
    showLogin();
    error.textContent = '';
  }, 1200);
}

function handleLogin(event) {
  event.preventDefault();
  const role = document.getElementById('role').value;
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const error = document.getElementById('login-error');
  const users = getUsers();
  const user = users.find((item) => item.username === username && item.password === password && item.role === role);

  if (!user) {
    error.textContent = 'Invalid login details. Please check your credentials.';
    return;
  }

  setCurrentUser(user);
  error.textContent = '';
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('register-page').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  showSection('home');
  populateProfile();
  setRoleViews();
}

function logout() {
  clearCurrentUser();
  document.getElementById('dashboard').style.display = 'none';
  showLogin();
}

function setRoleViews() {
  const user = getCurrentUser();
  if (!user) return;
  const isStudent = user.role === 'student';

  document.querySelectorAll('[id$="-student-view"]').forEach((section) => {
    section.style.display = isStudent ? 'block' : 'none';
  });
  document.querySelectorAll('[id$="-faculty-view"]').forEach((section) => {
    section.style.display = isStudent ? 'none' : 'block';
  });
}

function populateProfile() {
  const user = getCurrentUser();
  if (!user) return;

  document.getElementById('profile-details-name').textContent = user.name;
  document.getElementById('profile-details-role').textContent = user.role === 'student' ? 'Student' : 'Faculty';
  document.getElementById('profile-details-username').textContent = user.username;
  document.getElementById('profile-details-email').textContent = user.email;
  document.getElementById('profile-details-phone').textContent = user.phone || 'Not set';
  document.getElementById('profile-details-address').textContent = user.address || 'Not set';
  document.getElementById('profile-details-student-id').textContent = user.studentId;
  document.getElementById('profile-details-bio').textContent = user.bio || 'No biography yet.';
  document.getElementById('profile-details-joined').textContent = user.joined;
  document.getElementById('profile-details-courses').textContent = user.courses;

  document.getElementById('profile-name').value = user.name;
  document.getElementById('profile-email').value = user.email;
  document.getElementById('profile-phone').value = user.phone || '';
  document.getElementById('profile-address').value = user.address || '';
  document.getElementById('profile-student-id').value = user.studentId;
  document.getElementById('profile-bio').value = user.bio || '';
}

function updateProfile(event) {
  event.preventDefault();
  const user = getCurrentUser();
  if (!user) return;

  const users = getUsers();
  const current = users.find((item) => item.username === user.username);
  if (!current) return;

  current.name = document.getElementById('profile-name').value.trim();
  current.email = document.getElementById('profile-email').value.trim();
  current.phone = document.getElementById('profile-phone').value.trim();
  current.address = document.getElementById('profile-address').value.trim();
  current.bio = document.getElementById('profile-bio').value.trim();

  saveUsers(users);
  setCurrentUser(current);
  populateProfile();
  alert('Profile updated successfully.');
}

function previewProfilePic(event) {
  const file = event.target.files[0];
  if (!file) return;
  const imageUrl = URL.createObjectURL(file);
  document.getElementById('profile-pic').src = imageUrl;
}

function submitGrade(event) {
  event.preventDefault();
  alert('Grade submitted successfully.');
}

function modifyStudentData(event) {
  event.preventDefault();
  alert('Student data updated successfully.');
}

function markAttendance(event) {
  event.preventDefault();
  alert('Attendance marked successfully.');
}

function uploadAssignment(event) {
  event.preventDefault();
  alert('Assignment uploaded successfully.');
}

function submitAssignment(event) {
  event.preventDefault();
  alert('Assignment submitted successfully.');
}

function handlePayment(event) {
  event.preventDefault();
  alert('Payment recorded successfully.');
}

function applyLeave(event) {
  event.preventDefault();
  alert('Leave request submitted successfully.');
}

function submitFeedback(event) {
  event.preventDefault();
  alert('Feedback submitted. Thank you!');
}

function submitQuery(event) {
  event.preventDefault();
  alert('Query submitted successfully.');
}

function addEvent(event) {
  event.preventDefault();
  alert('Event added successfully.');
}

function uploadDocument(event) {
  event.preventDefault();
  alert('Document uploaded successfully.');
}

function filterAttendance() {
  const dateFilter = document.getElementById('filter-date').value;
  const studentFilter = document.getElementById('filter-student').value;
  const body = document.getElementById('attendance-faculty-body');
  const filtered = appData.attendance.filter((item) => {
    return (!dateFilter || item.date === dateFilter) && (!studentFilter || item.student === studentFilter);
  });
  body.innerHTML = filtered.map((item) => `<tr><td>${item.student}</td><td>${item.date}</td><td>${item.status}</td><td><button class='secondary' type='button'>Review</button></td></tr>`).join('');
}

function filterGrades() {
  const search = document.getElementById('search-grade-student').value.toLowerCase();
  const subject = document.getElementById('filter-grade-subject').value;
  const body = document.getElementById('grades-body');
  const filtered = appData.grades.filter((item) => {
    return (!search || item.student.toLowerCase().includes(search)) && (!subject || item.subject === subject);
  });
  body.innerHTML = filtered.map((item) => `<tr><td>${item.student}</td><td>${item.subject}</td><td>${item.marks}</td><td><button class='secondary' type='button'>View</button></td></tr>`).join('');
}

function exportAttendance(type) {
  alert(`Export attendance to ${type} feature coming soon.`);
}

function exportGrades(type) {
  alert(`Export grades to ${type} feature coming soon.`);
}

function exportFees() {
  alert('Export fees summary to PDF feature coming soon.');
}

function init() {
  getUsers();
  const user = getCurrentUser();
  if (user) {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('register-page').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    showSection('home');
    populateProfile();
    setRoleViews();
  } else {
    document.getElementById('dashboard').style.display = 'none';
    showLogin();
  }
  document.querySelector('.theme-toggle').textContent = '☀️';
}

window.addEventListener('DOMContentLoaded', init);
