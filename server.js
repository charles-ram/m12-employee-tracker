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

function cli_prompt() {
}