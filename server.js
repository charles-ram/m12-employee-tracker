// Load dependencies 
const mysql = require('mysql');
const inquirer = require('inquirer');

// Creates connection to the database
const connection = mysql.createConnection ({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_db'
});

connection.connect(function(err){
    // Throw err if there was issue
    if (err) throw err;

    // Prompt user with inquirer
    cli_prompt();
});

const mainPrompt = [
    {
        name: "action",
        type: "list",
        message: "Select an action",
        choices: [
            "View employees",
            "View roles",
            "View departments",
            "Add role",
            "Add employee",
            "Edit employee",
            "Remove employee",
            "EXIT"
        ]   
    }
];

// Prompts user with inquirer and executes function
function cli_prompt() {
    // Prompt user actions using inquirer
    inquirer.prompt(mainPrompt)

    // Await user response
    .then(function(answer) {

        // Execute function viewDept if user selection is "View departments"
        if(answer.action == "View employees") {
            viewAll();
        } else if (answer.action == "View departments") {
            viewDept();
        } else if (answer.action == "View roles") {
            viewRoles();
        } else if (answer.action == "Add employee") {
            addEmployee();
        } else if (answer.action == "Add department") {
            addDept();
        } else if (answer.action == "Add role") {
            addRole();
        } else if (answer.action == "Edit employee") {
            updateEmployee();
        } else if (answer.action == "Remove employee") {
            deleteEmployee();
        } else if (answer.action == "EXIT") {
            exit();
        };
    });
};

// Views all employees in employee_db
function viewAll() {
    let query =
        "SELECT employees.first_name, employee.last_name, roles.title, roles.salary, department.dept_name AS department, employee.manager_id " + 
        "FROM employees " + 
        "JOIN roles ON roles.id = employees.role_id " + 
        "JOIN department ON roles.derpoartment_id = department.id " + 
        "ORDER BY employees.id;"
        ;
    connection.query(query, function(err, res) {
        if (err) throw err;
        for
    })
}