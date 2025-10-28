/*
  Author: Camila Salinas Camacho
  GitHub Username: camilasalinasc
  Student Email: Camila_SalinasCamacho@student.uml.edu

  References / Sources:
    - W3Schools JavaScript DOM Tutorial: https://www.w3schools.com/js/js_htmldom.asp
    - W3Schools DOM createElement() and appendChild(): https://www.w3schools.com/jsref/met_document_createelement.asp
    - W3Schools Event Handling: https://www.w3schools.com/js/js_htmldom_eventlistener.asp
    - W3Schools JavaScript Form Validation: https://www.w3schools.com/js/js_validation.asp
*/

document.getElementById('tableForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const hStart = parseInt(document.getElementById('hStart').value);
  const hEnd = parseInt(document.getElementById('hEnd').value);
  const vStart = parseInt(document.getElementById('vStart').value);
  const vEnd = parseInt(document.getElementById('vEnd').value);
  const errorElem = document.getElementById('error');
  const wrapper = document.getElementById('tableWrapper');
  
  // Reset previous messages and tables
  errorElem.textContent = '';
  wrapper.innerHTML = '';

  // Validation
  if ([hStart, hEnd, vStart, vEnd].some(isNaN)) {
    errorElem.textContent = "❗ Please enter valid numbers for all fields.";
    return;
  }

  if (hStart < -50 || hEnd > 50 || vStart < -50 || vEnd > 50) {
    errorElem.textContent = "❗ Values must be between -50 and 50.";
    return;
  }

  if (hStart > hEnd || vStart > vEnd) {
    errorElem.textContent = "❗ Start values must be less than or equal to end values.";
    return;
  }

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  // Create header row
  const headerRow = document.createElement('tr');
  headerRow.appendChild(document.createElement('th')); // top-left corner cell

  for (let h = hStart; h <= hEnd; h++) {
    const th = document.createElement('th');
    th.textContent = h;
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  for (let v = vStart; v <= vEnd; v++) {
    const row = document.createElement('tr');
    const rowHeader = document.createElement('th');
    rowHeader.textContent = v;
    row.appendChild(rowHeader);

    for (let h = hStart; h <= hEnd; h++) {
      const cell = document.createElement('td');
      cell.textContent = v * h;
      row.appendChild(cell);
    }

    tbody.appendChild(row);
  }

  table.appendChild(tbody);
  wrapper.appendChild(table);
});
