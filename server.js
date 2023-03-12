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

        // Execute function viewDept
        if(answer.action == "View employees") {
            viewAll();
        
        // Executes function viewDept
        } else if (answer.action == "View departments") {
            viewDept();
        
        // Executes function viewRoles
        } else if (answer.action == "View roles") {
            viewRoles();

        // Executes function addEmployee
        } else if (answer.action == "Add employee") {
            addEmployee();

        // Executes function addDept
        } else if (answer.action == "Add department") {
            addDept();

        // Executes function addRole
        } else if (answer.action == "Add role") {
            addRole();

        // Executes function updateEmployee
        } else if (answer.action == "Edit employee") {
            updateEmployee();

        // Executes function deleteEmployee
        } else if (answer.action == "Remove employee") {
            deleteEmployee();

        // Executes function EXIT to exit prompt
        } else if (answer.action == "EXIT") {
            exit();
        };
    });
};

// Views all employees in employee_db
function viewAll() {

    // SQL command to get employeese information
    let query =
        "SELECT employees.first_name, employee.last_name, roles.title, roles.salary, department.dept_name AS department, employee.manager_id " + 
        "FROM employees " + 
        "JOIN roles ON roles.id = employees.role_id " + 
        "JOIN department ON roles.derpoartment_id = department.id " + 
        "ORDER BY employees.id;"
        ;

    // Connect to mySQL using query instruction to access employees table
    connection.query(query, function(err, res) {

        // Throw error if there is an issue
        if (err) throw err;

        // Adds manager names to the manager_id col
        for( i = 0; i< res.length; i++) {

            // If manager_id contains a "0"
            if (res[i].manager_id == 0) {
                res[i].manager = "None"
            } else {
                
                // Create new row called manager
                res[i].manager = res[res[i].manager_id - 1].first_name + " " + res[res[i].manager_id - 1].last_name;
            };

            // Removes manager id from res to not display it
            delete res[i].manager_id;
        };

        // Prints data retrieved
        console.table(res);

        // Prompts user
        cli_prompt();
    });
};

function viewDept() {
    let query = "SELECT department.dept_name AS departments FROM department;";

    connection.query(query, function(err, res) {

        if (err) throw err;

        console.table(res);

        cli_prompt();
    });
};

