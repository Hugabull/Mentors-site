const labels = ["Child", "Girl", "Black", "Indigenous", "Disability", "French"];
const counters = {
  AM: new Array(labels.length).fill(0),
  PM: new Array(labels.length).fill(0)
};

// Function to create a checkbox column
function createCheckboxColumn(columnId, prefix) {
  const column = document.createElement('ul');
  column.className = 'checkbox-column';
  labels.forEach((label, index) => {
    const checkboxId = `${columnId}_item${index + 1}`;
    const listItem = document.createElement('li');
    listItem.textContent = label;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    checkbox.onchange = () => updateCheckbox(checkboxId, prefix, index);
    listItem.appendChild(checkbox);
    column.appendChild(listItem);
  });
  return column;
}

// Function to initialize checkbox grid
function initializeCheckboxGrid(gridId, prefix) {
  const grid = document.getElementById(gridId);
  for (let i = 1; i <= 20; i++) {
    const columnId = `${prefix}_column${i}`;
    const column = createCheckboxColumn(columnId, prefix);
    grid.appendChild(column);
  }
  loadCheckboxes();
}

// Function to update checkbox state in Firestore
function updateCheckbox(id, prefix, index) {
  const db = firebase.firestore();
  const checkbox = document.getElementById(id);
  db.collection("checkboxes").doc(id).set({
    checked: checkbox.checked
  }).then(() => {
    updateCounters(prefix, index, checkbox.checked);
  });
}

// Function to load checkbox states from Firestore
function loadCheckboxes() {
  const db = firebase.firestore();
  db.collection("checkboxes").get().then((querySnapshot) => {
    // Reset counters
    Object.keys(counters).forEach(prefix => {
      counters[prefix].fill(0);
    });

    querySnapshot.forEach((doc) => {
      const checkbox = document.getElementById(doc.id);
      if (checkbox) {
        checkbox.checked = doc.data().checked;
        const [prefix, , index] = doc.id.split('_');
        if (checkbox.checked) {
          counters[prefix][index.split('item')[1] - 1]++;
        }
      }
    });

    // Update counter display after loading all checkboxes
    updateAllCounters();
  });
}

// Function to update counters
function updateCounters(prefix, index, isChecked) {
  if (isChecked) {
    counters[prefix][index]++;
  } else {
    counters[prefix][index]--;
  }
  updateCounterDisplay(prefix);
}

// Function to update all counters
function updateAllCounters() {
  ['AM', 'PM'].forEach(prefix => {
    updateCounterDisplay(prefix);
  });
}

// Function to update counter display for a prefix
function updateCounterDisplay(prefix) {
  const counterElement = document.getElementById(`${prefix.toLowerCase()}Counter`);
  counterElement.textContent = labels.map((label, idx) => `${counters[prefix][idx]} ${label}`).join(', ');
}

// Function to reset all checkboxes
function resetAllCheckboxes() {
  const db = firebase.firestore();
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      checkbox.checked = false;
      db.collection("checkboxes").doc(checkbox.id).set({
        checked: false
      }).then(() => {
        const [prefix, , index] = checkbox.id.split('_');
        updateCounters(prefix, index.split('item')[1] - 1, false);
      });
    }
  });
}


// Initialize both AM and PM grids
window.onload = () => {
  initializeCheckboxGrid('checkboxGrid', 'AM');
  initializeCheckboxGrid('checkboxGridPM', 'PM');
};
