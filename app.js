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
    .prompt({
      name: "dept_add",
      type: "rawlist",
      message: "What department would you like to add?",
      choices: [
        "Accounting",
        "Engineering",
        "Marketing",
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
                    data.forEach(({ dept_name, id }) => {
                        choiceArray.push(`${id} [${dept_name}]`);
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
                            data.forEach(({ title, id }) => {
                                choiceArray.push(`${id} [${title}]`);
                            });
                            return choiceArray;
                        },
                    },        
                    {
                        name: "emp_manager",
                        type: "input",
                        message: "What is the employee\'s manager\'s last name?",
                        choices() {
                            connection.query("SELECT * FROM employee", (err, info) => {
                                const managerArray = [];
                                info.forEach(({ last_name, id})) => {
                                    managerArray.push(`${id} [${last_name}]`);
                                };     
                            });
                            return managerArray;
                        },

                    },
                
            ])
            .then((answer) => {
                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: answer.emp_first_name,
                        last_name: answer.emp_last_name,
                        role_id: parseInt(answer.emp_role_id),
                        // manager_id: answer.emp_manager,
                    },
                    (err) => {
                        if (err) throw err;
                        start();
                    }
                );                
            });    
});
};