const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Colorado20!0",
  database: "emp_trackerDB",
});
connection.connect((err) => {
  if (err) throw err;
  start();
});

const start = () => {
    inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Add New Department",
        "Add New Role",
        "Add New Employee",
        "View Departments", //Search by All, Sales, Engineering, Production, Training, QA
        "View Roles", //Search by title (All, Sales, Engineering, Production, Training, QA), Salary, Department_ID
        "View Employee", //Search by id, firstname, lastname, role_id, manager_id
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'Add New Department':
          addDepartment();
          break;

        case 'Add New Role':
          addRole();
          break;

        case 'Add New Employee':
          addEmployee();
          break;

        case 'View Departments':
          viewDepartment();
          break;

        case 'View Roles':
          viewRoles();
          break;

        case 'View Employee':
          viewEmployee();
          break;

        case 'Exit':
          connection.end();
          break;             

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

const addDepartment = () => {
  inquirer
    .prompt([
        {
            message: 'What department would you like to add?',
            name: 'dept_name',
        },
        {
            message: 'What is the department ID number?',            
            name: 'dept_id',
        },
    ])
    .then(({dept_name, dept_id}) => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          dept_name: dept_name,
          id: dept_id,
        },
        (err) => {
          if (err) throw err;
          console.log(`Department added ${dept_name}`);
          start();
        }
      );
    });
};

const addRole = () => {
  inquirer
    .prompt([
        {
            message: 'What position title would you like to add?',
            name: 'role_title',
        },
        {
            message: 'What is the role ID number?',   
            name: 'role_id',
        },
        {
            message: 'What is the salary of this role?',      
            name: 'role_salary',
        },
        
        {
            message: 'What is the department ID for this role?',   
            name: 'role_dept_id',
        },                
    ])
    .then(({role_title, role_id, role_salary, role_dept_id}) => {
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: role_title,
          id: role_id,
          salary: role_salary,
          department_id: role_dept_id,
        },
        (err) => {
          if (err) throw err;
          console.log(`Role added ${role_title}`);
          start();
        }
      );
    });
};

const addEmployee = () => {
  inquirer
    .prompt([
        {
            message: 'What is the employee\'s first name?',
            name: 'emp_first_name',
        },
        {
            message: 'What is the employee\'s last name?',
            name: 'emp_last_name',
        },
        {
            message: 'What is the employee\'s ID number?',   
            name: 'employee_id',
        },
        {
            message: 'What is the department ID for this role?',   
            name: 'role_dept_id',
        },                
    ])
    .then(({role_title, emp_first_name, emp_last_name, employee_id, role_dept_id, }) => {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: emp_first_name,
          last_name: emp_last_name,
          id: employee_id,
          role_id: role_dept_id,
          manager_id: role_dept_id,
        },
        (err) => {
          if (err) throw err;
          console.log(`Role added ${role_title}`);
          start();
        }
      );
    });
};