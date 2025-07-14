const create_emp_btn = document.getElementById("create_employee");
const update_emp_btn = document.getElementById("update_employee");
const all_input_field = [...document.querySelectorAll(".input_data")];
const all_input_status = [...document.querySelectorAll(".status input")];
const tbody = document.querySelector("tbody");
const employee_fName = document.getElementById("full_name");
const employee_email = document.getElementById("email");
const employee_phone = document.getElementById("phone");
const employee_address = document.getElementById("address");
const employee_position = document.getElementById("position");
const employee_salary = document.getElementById("salery");
const email_massage = document.getElementById("email_massage");
const phone_massage = document.getElementById("phone_massage");
const phone_uncorrect = document.getElementById("phone_uncorrect");

let mode_system = "creation";
let all_employees_data;
let all_correct = false;

if (localStorage.employees == undefined) {
  all_employees_data = [];
} else {
  all_employees_data = JSON.parse(localStorage.employees);
}

// Check the input entry is correct
function check_input_correct() {
  // set all massages for email and phone to defualt case
  email_massage.classList.remove("has_exist");
  phone_massage.classList.remove("has_exist");
  // if all_employees_data is empty return from here
  if (all_employees_data.length === 0) {
    all_correct = true;
    return;
  }

  let data_check_email = [];
  let data_check_phone = [];
  // set the data for check email in creation mode
  if (mode_system === "creation") {
    all_employees_data.forEach((data) => {
      data_check_email.push(data.email);
      data_check_phone.push(data.phone);
    });
  }
  // set the data for check email in update mode
  else {
    all_employees_data.forEach((data) => {
      // Exclude currently modified data from the list
      if (data.id != update_emp_btn.dataset.current_id) {
        data_check_email.push(data.email);
        data_check_phone.push(data.phone);
      }
    });
  }

  // If the current data is has been exist don't create or delete any thing
  if (
    data_check_email.includes(employee_email.value.trim()) ||
    data_check_phone.includes(employee_phone.value.trim())
  ) {
    all_correct = false;
  }
  // If the current data is hasn't been exist create or delete this data
  else {
    all_correct = true;
  }

  // Show warning massage if email or phone are exists
  if (data_check_email.includes(employee_email.value.trim())) {
    email_massage.classList.add("has_exist");
  }
  if (data_check_phone.includes(employee_phone.value.trim())) {
    phone_massage.classList.add("has_exist");
  }
}

// [1] Funciton To Validate The Entry Employee Data
function validate_entery() {
  // Get all fields that are empty
  let empty_inputs = all_input_field.filter((input) => input.value == "");
  // Check if the there are inputs thios empty so make create_emp_btn or update_emp_btn are unclickable
  if (empty_inputs.length === 0) {
    if (mode_system === "creation") {
      create_emp_btn.classList.add("active");
      create_emp_btn.disabled = false;
    } else {
      update_emp_btn.classList.add("active");
      update_emp_btn.disabled = false;
    }
    // Check if the there are inputs thios empty so make create_emp_btn or update_emp_btn are clickable
  } else {
    if (mode_system === "creation") {
      create_emp_btn.classList.remove("active");
      create_emp_btn.disabled = true;
    } else {
      update_emp_btn.classList.remove("active");
      update_emp_btn.disabled = true;
    }
  }

  // call The check_field to handle the input case
  check_field();
}

// [2] Check field values [not_valid class css]
function check_field() {
  all_input_field.forEach((input) => {
    if (input.value == "") {
      input.classList.remove("not_valid");
    } else {
      input.classList.add("not_valid");
    }
  });
}

// Adjust The Id For All Data
function handle_data_id() {
  all_employees_data.forEach((data, index) => {
    data.id = index;
  });
}

// [3] Create Employee After The User Click Create Btn
function create_employee_obj() {
  // Get the active input status
  let active_status;
  all_input_status.forEach((input) => {
    if (input.checked) {
      active_status = input;
    }
  });

  // Create The Employee Data
  let new_emp = {
    full_name: employee_fName.value,
    email: employee_email.value,
    phone: employee_phone.value,
    address: employee_address.value,
    position: employee_position.value,
    salary: employee_salary.value,
    status: active_status.dataset.status,
  };

  // Storage the new employee in localStorage
  if (mode_system === "creation") {
    all_employees_data.push(new_emp);
  }

  // set id for all data before storage it
  handle_data_id();
  localStorage.employees = JSON.stringify(all_employees_data);
}

// [4] Create The Employee Element In Table
function create_employee_elements(data, ser_num) {
  let tr = document.createElement("tr");
  tr.dataset.id = data.id;
  // Adjust Id Employee
  let td = document.createElement("td");
  td.textContent = ser_num + 1;
  tr.appendChild(td);

  // Adjust columns for form data
  const td_fName = document.createElement("td");
  const td_email = document.createElement("td");
  const td_phone = document.createElement("td");
  const td_address = document.createElement("td");
  const td_position = document.createElement("td");
  const td_salary = document.createElement("td");
  const td_status = document.createElement("td");

  // Adjust columns textContent for form data
  td_fName.textContent = data.full_name;
  td_email.textContent = data.email;
  td_phone.textContent = data.phone;
  td_address.textContent = data.address;
  td_position.textContent = data.position;
  td_salary.textContent = data.salary;
  td_status.textContent = data.status;

  // Adjust columns AppendChiled for form data
  tr.appendChild(td_fName);
  tr.appendChild(td_email);
  tr.appendChild(td_phone);
  tr.appendChild(td_address);
  tr.appendChild(td_position);
  tr.appendChild(td_salary);
  tr.appendChild(td_status);

  // Adjust The Control Buttons
  let td_btns = document.createElement("td");
  let edit_btn = document.createElement("button");
  let delete_btn = document.createElement("button");

  // Adjust the id Button
  edit_btn.id = "edit";
  delete_btn.id = "delete";

  // Adjust the text Content Button
  edit_btn.textContent = "Update";
  delete_btn.textContent = "Delete";

  // Add Event Listner To Buttons
  edit_btn.addEventListener("click", () => update_employee_info(data.id));
  delete_btn.addEventListener("click", () => del_emp_ele_tab(data.id));

  // Append Child part
  td_btns.appendChild(edit_btn);
  td_btns.appendChild(delete_btn);
  tr.appendChild(td_btns);

  tbody.appendChild(tr);
}

// [5] UI Employees Data
function UI_employee_data() {
  tbody.innerHTML = ``;
  all_employees_data.forEach((data, index) => {
    create_employee_elements(data, index);
  });
}

// [6] Update Data Entry And Table Elements
function update_data() {
  // Return field values to default values
  all_input_field.forEach((input) => (input.value = ""));
  all_correct = false;
  email_massage.classList.remove("has_exist");
  phone_massage.classList.remove("has_exist");
  // Update The Table Data
  UI_employee_data();
  // return the field and create_employee_btn to default value
  validate_entery();
  check_field();
  // Update Local Storage
  localStorage.employees = JSON.stringify(all_employees_data);
}

// fill The Input Field Depend On The Data Employee Information
function fill_input_filed(data) {
  employee_fName.value = data.full_name;
  employee_email.value = data.email;
  employee_phone.value = data.phone;
  employee_address.value = data.address;
  employee_position.value = data.position;
  employee_salary.value = data.salary;
  all_input_status.forEach((input) =>
    input.dataset.status == data.status
      ? (input.checked = true)
      : (input.checked = false)
  );
}

// [7] update employee information date
function update_employee_info(id) {
  // Change Mode System To Update Mode
  mode_system = "update";
  // Get The Employee Information
  all_employees_data.forEach((data) => {
    if (data.id == id) {
      // fill The Input Field Depend On The Data Employee Information
      fill_input_filed(data);
      // Call the validate_entery function
      validate_entery();
    }
  });
  // Passing function
  update_emp_btn.dataset.current_id = id;
}

// [8] Set The Updates Employee Informaiton In The Table After Edit It
function update_table_empl_info() {
  all_employees_data.forEach((data) => {
    if (data.id == update_emp_btn.dataset.current_id) {
      data.full_name = employee_fName.value;
      data.email = employee_email.value;
      data.phone = employee_phone.value;
      data.address = employee_address.value;
      data.position = employee_position.value;
      data.salary = employee_salary.value;
      let active_status;
      all_input_status.forEach((input) => {
        if (input.checked) {
          active_status = input;
        }
      });
      data.status = active_status.dataset.status;
    }
  });

  localStorage.employees = JSON.stringify(all_employees_data);
  update_data();

  // Change The Mode System To Creation
  mode_system = "creation";
}

// [9] Delete employee element from table
function del_emp_ele_tab(id) {
  // Delete data whose id matches the element's id
  all_employees_data = all_employees_data.filter((data) => data.id !== id);
  update_data();
}

UI_employee_data();

// ======================================================
// ========= Add Event Listner For All Element ==========
// ======================================================
// Input Field
all_input_field.forEach((input) => {
  input.addEventListener("input", () => {
    validate_entery();
    check_field();
    // if the email or phone are exists so don't create the new employee and show warning massage
    check_input_correct();
  });
});

// Create Employee Button
create_emp_btn.addEventListener("click", (e) => {
  if (all_employees_data.length !== 0) {
    if (all_correct == true) {
      // if the email or phone are not exists so create the new employee
      create_employee_obj();
      // update data
      update_data();
    }
  } else {
    // if the email or phone are not exists so create the new employee
    create_employee_obj();
    // update data
    update_data();
  }
});

// Update Employee Button
update_emp_btn.addEventListener("click", () => update_table_empl_info());
