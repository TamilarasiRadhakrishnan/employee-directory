let employees = [...mockEmployees];
let filteredEmployees = [...employees];
let currentPage = 1;
let itemsPerPage = 10;

// DOM Elements
const listContainer = document.getElementById('employee-list');
const paginationContainer = document.getElementById('pagination');
const searchInput = document.getElementById('search-input');
const filterBtn = document.getElementById('filter-btn');
const filterPanel = document.getElementById('filter-panel');
const applyFilterBtn = document.getElementById('apply-filter-btn');
const closeFilterBtn = document.getElementById('close-filter-btn');
const sortField = document.getElementById('sort-field');
const addEmployeeBtn = document.getElementById('add-employee-btn');

// Only execute if on index.html
if (listContainer) {
  renderEmployees();

  searchInput?.addEventListener('input', () => {
    const keyword = searchInput.value.toLowerCase();
    filteredEmployees = employees.filter(
      (e) =>
        e.firstName.toLowerCase().includes(keyword) ||
        e.lastName.toLowerCase().includes(keyword) ||
        e.email.toLowerCase().includes(keyword)
    );
    renderEmployees();
  });

  filterBtn?.addEventListener('click', () => {
    filterPanel.classList.toggle('hidden');
  });

  applyFilterBtn?.addEventListener('click', () => {
    const firstName = document.getElementById('filter-firstname').value.toLowerCase();
    const department = document.getElementById('filter-department').value.toLowerCase();
    const role = document.getElementById('filter-role').value.toLowerCase();

    filteredEmployees = employees.filter((e) => {
      return (
        (firstName === '' || e.firstName.toLowerCase().includes(firstName)) &&
        (department === '' || e.department.toLowerCase().includes(department)) &&
        (role === '' || e.role.toLowerCase().includes(role))
      );
    });

    filterPanel.classList.add('hidden');
    renderEmployees();
  });

  closeFilterBtn?.addEventListener('click', () => {
    filterPanel.classList.add('hidden');
  });

  sortField?.addEventListener('change', () => {
    const field = sortField.value;
    if (field) {
      filteredEmployees.sort((a, b) =>
        a[field].localeCompare(b[field])
      );
    }
    renderEmployees();
  });

  addEmployeeBtn?.addEventListener('click', () => {
    window.location.href = 'add-edit.html';
  });
}

function renderEmployees() {
  listContainer.innerHTML = '';

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const pageItems = filteredEmployees.slice(startIdx, endIdx);

  pageItems.forEach((emp) => {
    const div = document.createElement('div');
    div.className = 'employee-card';
    div.innerHTML = `
      <h3>${emp.firstName} ${emp.lastName}</h3>
      <p>ID: ${emp.id}</p>
      <p>Email: ${emp.email}</p>
      <p>Department: ${emp.department}</p>
      <p>Role: ${emp.role}</p>
      <button onclick="editEmployee(${emp.id})">Edit</button>
      <button onclick="deleteEmployee(${emp.id})">Delete</button>
    `;
    listContainer.appendChild(div);
  });

  renderPagination();
}

function renderPagination() {
  paginationContainer.innerHTML = '';

  const pages = Math.ceil(filteredEmployees.length / itemsPerPage);
  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.style.fontWeight = 'bold';
    btn.addEventListener('click', () => {
      currentPage = i;
      renderEmployees();
    });
    paginationContainer.appendChild(btn);
  }
}

function deleteEmployee(id) {
  if (confirm('Delete this employee?')) {
    employees = employees.filter((e) => e.id !== id);
    filteredEmployees = [...employees];
    renderEmployees();
  }
}

function editEmployee(id) {
  window.location.href = `add-edit.html?id=${id}`;
}

// Only execute if on add-edit.html
if (document.getElementById('employee-form')) {
  const form = document.getElementById('employee-form');
  const urlParams = new URLSearchParams(window.location.search);
  const editId = Number(urlParams.get('id'));

  if (editId) {
    document.getElementById('form-title').textContent = 'Edit Employee';
    const emp = employees.find((e) => e.id === editId);
    if (emp) {
      document.getElementById('employee-id').value = emp.id;
      document.getElementById('first-name').value = emp.firstName;
      document.getElementById('last-name').value = emp.lastName;
      document.getElementById('email').value = emp.email;
      document.getElementById('department').value = emp.department;
      document.getElementById('role').value = emp.role;
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('employee-id').value;
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const department = document.getElementById('department').value.trim();
    const role = document.getElementById('role').value.trim();

    if (!firstName || !lastName || !email || !department || !role) {
      alert('All fields are required.');
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      alert('Invalid email format.');
      return;
    }

    if (id) {
      const index = employees.findIndex((e) => e.id == id);
      if (index !== -1) {
        employees[index] = { id: Number(id), firstName, lastName, email, department, role };
      }
    } else {
      const newId = Date.now();
      employees.push({ id: newId, firstName, lastName, email, department, role });
    }

    window.location.href = 'index.html';
  });

  document.getElementById('cancel-btn').addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}
