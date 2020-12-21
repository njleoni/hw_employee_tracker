const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table')
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
        "View All Employees",
        "View Employee by Manager",
        "Change Employee\'s Role",
        "Update Employee\'s Manager",
        "Add New Department",
        "Add New Role",
        "Add New Employee",
        "View Departments", //Search by All, Sales, Engineering, Production, Training, QA
        "View Roles", //Search by title (All, Sales, Engineering, Production, Training, QA), Salary, Department_ID
        "View Employees", //Search by id, firstname, lastname, role_id, manager_id
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View All Employees':
          viewAllEmployees();
          break;

        case 'View Employee by Manager':
          viewByManager();
          break;

        case 'Change Employee\'s Role':
          empRole();
          break;

        case 'Update Employee\'s Manager':
          managerId();
          break;

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

        case 'View Employees':
          viewEmployees();
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
    .prompt({
      name: "dept_add",
      type: "rawlist",
      message: "What department would you like to add?",
      choices: [
        "Accounting",
        "Engineering",
        "Marketing",
        "Production",
        "Quality Assurance", //Search by All, Sales, Engineering, Production, Training, QA
        "Sales", //Search by title (All, Sales, Engineering, Production, Training, QA), Salary, Department_ID
        "Shipping", //Search by id, firstname, lastname, role_id, manager_id
      ],
    })
    .then(({ dept_add }) => {
        console.log(dept_add);
      connection.query(
        "INSERT INTO department SET ?",
        {
          dept_name: dept_add,
        },
        (err) => {
          if (err) throw err;
          console.log(`Department added ${dept_add}`);
          start();
        }
      );
    });
};

const addRole = () => {
    connection.query("SELECT * FROM department", (err, data) => {
        if (err) throw err;
        inquirer
            .prompt([
            {
                name: "role_title",
                type: "input",
                message: "What job role would you like to add?",
            },
            {
                name: "role_salary",
                type: "input",
                message: "What is the salary of this position?",
            },
            {
                name: "role_dept_id",
                type: "rawlist",
                message: "Which department does this position belong to?",
                choices() {
                    const choiceArray = [];
                    data.forEach(({ dept_name, dept_id }) => {
                        choiceArray.push(`${dept_id}: ${dept_name}`);
                    });
                    return choiceArray;
                },
            },                   
            ])
            .then((answer) => {
                console.log(answer.role_title);
                connection.query(
                    "INSERT INTO role SET ?",
                    {
                        title: answer.role_title,
                        salary: answer.role_salary,
                        department_id: parseInt(answer.role_dept_id),
                    },
                    (err) => {
                        if (err) throw err;
                        start();
                    }
                );                
            });
    });
};
  
const addEmployee = () => {
    connection.query("SELECT * FROM role", (err, data) => {
        inquirer
            .prompt([
                    {
                        name: "emp_first_name",
                        type: "input",
                        message: "What is the employee\'s first name?",
                    },
                    {
                        name: "emp_last_name",
                        type: "input",
                        message: "What is the employee\'s last name?",
                    },
                    {
                        name: "emp_role_id",
                        type: "rawlist",
                        message: "What is this employee\'s role?",
                        choices() {
                            const choiceArray = [];
                            data.forEach(({ title, role_id }) => {
                                choiceArray.push(`${role_id}: ${title}`);
                            });
                            return choiceArray;
                        },
                    },
                    {
                        name: "manager_id",
                        type: "input",
                        message: "What is your manager\'s id",
                    },

            ])
            .then((answer) => {
                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: answer.emp_first_name,
                        last_name: answer.emp_last_name,
                        role_id: parseInt(answer.emp_role_id),
                        manager_id: answer.manager_id,
                    },
                    (err) => {
                        if (err) throw err;
                        start();
                    }
                );
            });
  });
};

const managerId = () => {
    connection.query("SELECT * FROM employee", (err, data) => {
        inquirer
            .prompt([
                    {
                        name: "emp_name",
                        type: "rawlist",
                        message: "WHich employee needs their manager updated?",
                        choices() {
                            const choiceArray = [];
                            data.forEach(({ last_name }) => {
                                choiceArray.push(`${last_name}`);
                            });
                            return choiceArray;
                        },
                    },              
                    {
                        name: "manager_id",
                        type: "rawlist",
                        message: "Who is your currentmanager?",
                        choices() {
                            const choiceArray = [];
                            data.forEach(({ emp_id, first_name, last_name }) => {
                                choiceArray.push(`${emp_id}: ${first_name} ${last_name}`);
                            });
                            return choiceArray;
                        },
                    },
                   
            ])
            .then((answer) => {
                const query = 
                  'UPDATE employee SET manager_id = ? WHERE last_name = ? ';
                connection.query(query, [parseInt(answer.manager_id), answer.emp_name ], (err, res) => {
                  // if (err) throw err;
                  start();
               
            });    
        });
    });
};

const empRole = () => {
    connection.query("SELECT * FROM role", (err, data) => {
        inquirer
            .prompt([
                    {
                        name: "emp_last_name",
                        type: "input",
                        message: "Which employee\'s role would you like to change?",
                    },
                    {
                        name: "emp_role_id",
                        type: "rawlist",
                        message: "What is the employee\'s new role?",
                        choices() {
                            const choiceArray = [];
                            data.forEach(({ title, role_id }) => {
                                choiceArray.push(`${role_id}: ${title}`);
                            });
                            return choiceArray;
                        },
                    },                   
            ])
            .then((answer) => {              
                const query = 'UPDATE employee SET role_id = ? WHERE last_name = ?';
                connection.query(query,  [parseInt(answer.emp_role_id), answer.emp_last_name ], (err, res) => {
                  if (err) throw err;
                  console.log(`${res.affectedRows}`);
                  start();
                });                
            });    
  });
};

const viewDepartment = () => {
    connection.query("SELECT dept_id, dept_name FROM department;", (err, res) => {
            if (err) throw err
            console.table(res)
            start();
    });
};

const viewRoles = () => {
    connection.query("SELECT role_id, title, salary, department_id FROM role;", (err, res) => {
            if (err) throw err
            console.table(res)
            start();
    });
};

const viewEmployees = () => {
    connection.query("SELECT emp_id, first_name, last_name, role_id, manager_id FROM employee;", (err, res) => {
            if (err) throw err
            console.table(res)
            start();
    });
};

const viewAllEmployees = () => {
    connection.query('SELECT employee.emp_id, employee.first_name, employee.last_name, role.role_id, role.title, role.salary, employee.manager_id FROM role LEFT JOIN employee ON (role.role_id=employee.role_id) ORDER BY employee.last_name', (err, res) => {
      if (err) throw err
            console.table(res)
            start();
    })
};

const viewByManager = () => {
    inquirer
      .prompt([
        {
          name: 'manager',
          message: 'What manager would you like to search by?',
          type: 'input'
        },
      ])

    .then((answer) => {
      const query = 'SELECT employee.emp_id, employee.first_name, employee.last_name, role.role_id, role.title, role.salary FROM role LEFT JOIN employee ON (role.role_id=employee.role_id) WHERE (employee.manager_id = ?) ORDER BY employee.last_name';
      connection.query(query,  { manager_id: answer.manager }, (err, res) => {
        if (err) throw err
            console.table(res)
            start();
      })
    })
  };