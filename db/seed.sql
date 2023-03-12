-- Select employee_db as the datavase to utilize and perform SQL operations
USE employee_db;

INSERT INTO department(dept_name)
VALUES
('Engineering'),
('Sales'),
('Finance'),
('Legal');

INSERT INTO roles(title, salary, department_id)
VALUES
('Lead Engineer', 150000, 1).
('Software Engineer', 120000, 1),
('Sales Lead', 100000, 2),
('Salesperson', 80000, 2),
('Account Manager', 160000, 3),
('Accountant', 125000, 3),
('Legal Team Lead' 250000, 4),
('Lawyer', 190000, 4);

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES
('John', 'Doe', 3, 0),
('Mike', 'Chan', 2, 0),
('Ashley', 'Rodriguez', 4, 0),
('Kevin', 'Tupik', 1, 0),
('Kunal', 'Singh', 3, 0),
('Malia', 'Brown', 2, 0),
('Sarah', 'Lourd', 4, 0),
('Tom', 'Allen', 4, 0);