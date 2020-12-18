DROP DATABASE IF EXISTS emp_trackerDB;
CREATE database emp_trackerDB;

USE emp_trackerDB;

CREATE TABLE department (
  id INT PRIMARY KEY,
  dept_name VARCHAR(30)
);

CREATE TABLE role (
  id INT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL(10,2),
  department_id INT
);

CREATE TABLE employee (
  id INT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT
);

INSERT INTO department(id, dept_name) VALUES(1, "Engineering"), (2, "Sales");
INSERT INTO role(id, title, salary, department_id) VALUES(1, "engineer", 70000.00, 10), (2, "sales", 80000.00, 20);
INSERT INTO employee(id, first_name, last_name, role_id, manager_id) VALUES(1, "Bill", "Ding", 1, 5), (2, "John", "Middlebury", 2, 6);


SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;