// Defination All Element That Will Need it
const all_input_field = [...document.querySelectorAll(".input_data")];
const update_emp_btn = document.getElementById("update_employee");
const create_emp_btn = document.getElementById("create_employee");
const tbody = document.getElementById("emp_tbody");
const fullName = document.getElementById("full_name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const address = document.getElementById("address");
const position = document.getElementById("position");
const salary = document.getElementById("salery");
const all_status_input = [...document.querySelectorAll(".status input")];
const email_massage = document.getElementById("email_massage");
const phone_massage = document.getElementById("phone_massage");
const phone_uncorrect = document.getElementById("phone_uncorrect");

let All_employees;
let system_mode = "creation";

// =================================================================================
// [1] Create a function to validate if all inputs is empty or not to create the employee
function validate_inputs() {
  let empty_inputs = all_input_field.filter((input) => input.value == "");
  if (empty_inputs.length === 0 && validate_exist_data()) {
    if (system_mode === "creation") {
      create_emp_btn.classList.add("active");
      create_emp_btn.disabled = false;
    } else {
      update_emp_btn.classList.add("active");
      update_emp_btn.disabled = false;
    }
    // Check if the there are inputs thios empty so make create_emp_btn or update_emp_btn are clickable
  } else {
    if (system_mode === "creation") {
      create_emp_btn.classList.remove("active");
      create_emp_btn.disabled = true;
    } else {
      update_emp_btn.classList.remove("active");
      update_emp_btn.disabled = true;
    }
  }
}

// [2] Create a function to validate if the employee data entery is has exist or not
function validate_exist_data() {
  // set all massages for email and phone to defualt case
  email_massage.classList.remove("has_exist");
  phone_massage.classList.remove("has_exist");

  let data_check_email = [];
  let data_check_phone = [];
  // set the data for check email in creation mode
  if (system_mode === "creation") {
    All_employees.forEach((data) => {
      data_check_email.push(data.email);
      data_check_phone.push(data.phone);
    });
  } // set the data for check email in update mode
  else {
    All_employees.forEach((data) => {
      // Exclude currently modified data from the list
      if (data.id != update_emp_btn.dataset.id) {
        data_check_email.push(data.email);
        data_check_phone.push(data.phone);
      }
    });
  }

  // Show warning massage if email or phone are exists
  if (data_check_email.includes(email.value.trim())) {
    email_massage.classList.add("has_exist");
  }
  if (data_check_phone.includes(phone.value.trim())) {
    phone_massage.classList.add("has_exist");
  }

  // If the current data is has been exist don't create or delete any thing
  if (
    data_check_email.includes(email.value.trim()) ||
    data_check_phone.includes(phone.value.trim())
  ) {
    return false;
  }
  // If the current data is hasn't been exist create or delete this data
  else {
    return true;
  }
}

// [3] Create a basic class through which all employees are created
class Employees_master {
  // ===================================================================================

  static counter = 0;

  // Set all properties of object [employees]
  constructor() {
    this.id = handle_data_id();
    this.name = fullName.value;
    this.email = email.value;
    this.phone = phone.value;
    this.address = address.value;
    this.position = position.value;
    this.salary = salary.value;
    this.status = get_status();
    // Increase the counter to set the next employee's ID
    Employees_master.counter++;
  }
}
// [4] Create a Function to display all employees within table when the page reload
function handle_emp_table() {
  if (localStorage.employees == undefined) {
    All_employees = [];
  } else {
    All_employees = JSON.parse(localStorage.employees);
    create_emp_element();
    handle_data_id();
  }
}

// Get status of employees
function get_status() {
  const current_status = all_status_input.filter((input) => input.checked);
  return current_status[0].dataset.status;
}

// =================================================================================
// [5] Clear all input field and return it to defualt value
function reset_input_values() {
  fullName.value = "";
  email.value = "";
  phone.value = "";
  address.value = "";
  position.value = "";
  salary.value = "";
}

// =================================================================================
// [6] handle the data id
function handle_data_id() {
  All_employees.forEach((data, index) => {
    data.id = index;
  });
  update_data();
  return All_employees.length;
}

// =================================================================================
// [8] Store all employees data in localstorage
function update_data() {
  localStorage.employees = JSON.stringify(All_employees);
}

// ==================================================================================================================
// [9] Create a function within the class that create the employees element and display it within the employees table
function create_emp_element() {
  tbody.innerHTML = "";
  All_employees.forEach((data, index) => {
    // create element
    let tr = document.createElement("tr");
    let td_id = document.createElement("td");
    const td_fName = document.createElement("td");
    const td_email = document.createElement("td");
    const td_phone = document.createElement("td");
    const td_address = document.createElement("td");
    const td_position = document.createElement("td");
    const td_salary = document.createElement("td");
    const td_status = document.createElement("td");
    let td_btns = document.createElement("td");
    let edit_btn = document.createElement("button");
    let delete_btn = document.createElement("button");

    // text content part
    tr.dataset.id = data.id;
    td_id.textContent = index + 1;
    td_fName.textContent = data.name;
    td_email.textContent = data.email;
    td_phone.textContent = data.phone;
    td_address.textContent = data.address;
    td_position.textContent = data.position;
    td_salary.textContent = data.salary;
    td_status.textContent = data.status;
    edit_btn.textContent = "Update";
    delete_btn.textContent = "Delete";

    // set id part
    edit_btn.id = "edit";
    delete_btn.id = "delete";

    // Add event listner part
    edit_btn.addEventListener("click", () => edit_emp_data(data.id));
    delete_btn.addEventListener("click", () => delete_emp_data(data.id));

    // append child part
    tr.appendChild(td_id);
    tr.appendChild(td_fName);
    tr.appendChild(td_email);
    tr.appendChild(td_phone);
    tr.appendChild(td_address);
    tr.appendChild(td_position);
    tr.appendChild(td_salary);
    tr.appendChild(td_status);
    td_btns.appendChild(edit_btn);
    td_btns.appendChild(delete_btn);
    tr.appendChild(td_btns);

    tbody.appendChild(tr);
  });
}

// ==================================================================================================================
// [10] Adjust the settings of the edit button on employee data
function edit_emp_data(id) {
  All_employees.forEach((data) => {
    if (data.id === id) {
      fullName.value = data.name;
      email.value = data.email;
      phone.value = data.phone;
      address.value = data.address;
      position.value = data.position;
      salary.value = data.salary;
      all_status_input.forEach((input) => {
        input.dataset.status == data.status
          ? (input.checked = true)
          : (input.checked = false);
      });
    }
  });
  update_emp_btn.dataset.id = id;
  // Change system mode to update mode
  system_mode = "update";
  // call validate function to active the update button
  validate_inputs();
}

// ==================================================================================================================
// [11] Create a function that modifies and updates employee data in the table
function modifie_and_update_data(id) {
  All_employees.forEach((data) => {
    if (data.id === +id) {
      data.name = fullName.value;
      data.email = email.value;
      data.phone = phone.value;
      data.address = address.value;
      data.position = position.value;
      data.salary = salary.value;
      data.status = get_status();
    }
  });
  // update localstorage
  update_data();
  // call a create_emp_element to create the employees element and display it within the table
  create_emp_element();
  // return the inputs values to defualt values
  reset_input_values();
  // call validate inputs to prevent the update btn from working
  validate_inputs();
  // Return the system mode to creation mode again
  system_mode = "creation";
}

// ==================================================================================================================
// [12] Create a function that delete employee data from the table
function delete_emp_data(id) {
  // Delete the employee data from All_employees array
  All_employees = All_employees.filter((data) => data.id != id);
  // Update LocalStorage
  update_data();
  // call a create_emp_element to create the employees element and display it within the table
  create_emp_element();
}

/*=================================================
=============== Event Listner Part ================
=================================================== */
// Check data entry fields if they are empty or not during the entry process
all_input_field.forEach((input) => {
  input.addEventListener("input", function () {
    validate_inputs();

    validate_exist_data();
  });
});

// ========================================================================================================
// [7] Create a new employee if user click on create employee button and push it in all_employees array
create_emp_btn.addEventListener("click", function () {
  const user = new Employees_master();
  if (validate_exist_data()) {
    All_employees.push(user);
    // update the localstorage
    update_data();
    //   create employees element
    create_emp_element();
    //  return the inputs value to defualt value
    reset_input_values();
    // call validate_inputs to handle the create and update buttons
    validate_inputs();
  }
});

// ========================================================================================================
// Create a function that modifies and updates employee data in the table
update_emp_btn.addEventListener("click", () => {
  modifie_and_update_data(update_emp_btn.dataset.id);
});

window.addEventListener("load", () => {
  // Recall the handle_emp_table to display the employee element when page reload
  handle_emp_table();
  // Call this function to prevent buttons (create, update employee) from working at the beginning of the page
  validate_inputs();
});
