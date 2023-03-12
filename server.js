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

// View all departments
function viewDept() {

    // Sql command to get data from department table
    let query = "SELECT department.dept_name AS departments FROM department;";

    // Connect to mySQL u sing query instructions
    connection.query(query, function(err, res) {

        // Throw error if there is issue
        if (err) throw err;

        // Prints data retrieved to terminal in table format
        console.table(res);

        // Prompt user
        cli_prompt();

    });
};

// View all roles
function viewRoles() {

    // Sql command to tget data from roles table
    let query = "SELECT roles.title, roles.salary, department.dept_name AS derpartment FROM roles INNER JOIN department ON department.id = roles.department_id;";

    
    connection.query(query, function(err, res) {

        if (err) throw err;

        console.table(res);

        cli_prompt();
    });
};


// Add new employee
function addEmployee() {

    // SQL command to get data from roles table
    let query = "SELECT title FROM roles";

    // SQL command to get employee first_name/ last_name/ manager_id, role title/ salary and department name data from employees, roles, and department tables
    let query2 = 

        "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, department.dept_name, employees.manager_id " + 
        "FROM employees " + 
        "JOIN roles ON roles.id = employees.role_id " +
        "JOIN department ON roles.department_id = department.id " +
        "ORDER BY employees.id;"
    ;

    connection.query(query, function(err, res) {

        if (err) throw err;

        let rolesList = res;

        connection.query(query2, function(err, res) {
            
            if (err) throw err;

            for (i = 0; i < res.length; i++) {

                if(res[i].manager_id == 0) {

                    res[i].manager = "None"

                } else {

                    // Creates new row called manager, containing each employee's manager name
                    res[i].manager = res[res[i].manager_id -1].first_name + " " + res[res[i].manager_id -1].last_name;

                };

                // Removes manager id from res
                delete res[i].manager_id;

            };

            // Prints data
            conso9le.table(res);

            // Assigns data from employee table to (res) to managerList
            let managerList = res;

            // Array of actions to prompt user
            let addEmpPrompt = [

                {
                    name: "first_name",
                    type: "input",
                    message: "Enter new employee's first name."
                },

                {
                    name: "last_name",
                    type: "input",
                    message: "Enter new employee's last name."
                },

                {
                    name: "select_role",
                    type: "list",
                    message: "Select new employee's role.",

                    // Dynamic choices using rolesList
                    choices: function() {

                        // Init roles array
                        roles = [];

                        // Loop through rolesList to extract the role titles from rolesList which is an object array containing data from roles table
                        for (i = 0; i< rolesList.length; i++) {

                            // Looping parameter "i" will always align with the table index, therefore by adding 1 we have effectively converted it to match table id's
                            const roleId = i + 1;

                            // Concat roleId and title strings and push the resulting string into our roles
                            roles.push(roleId = ": " + rolesList[i].title);

                        };

                        // Add string "0: Exit" to the beginning of roles
                        roles.unshift("0: Exit");

                        // Return roles array to be rendered by inquirer
                        return roles;
                    }
                },

                {
                    name: "select_manager",
                    type: "list",
                    message: "Select new employee's manager",

                    // Dynamic choices using managerList
                    choices: function() {

                        // Init manager array
                        managers = [];

                        // Loop through managerList to extract the employee names from managerList
                        for(i = 0; i < managerList.length; i++) {

                            const mId = i + 1;

                            managers.push(mId + ": " + managerList[i].first_name + " " + managerList[i].last_name);

                        };

                        managers.unshift("0: None");

                        managers.unshift("E: Exit");

                        return managers;
                    },

                    // Dont use this prompt if user selected exit in previous prompt
                    when: function ( answers ) {
                        
                        return answers.select_role !== "0: Exit";

                    }
                }
            ];

            // Prompt user actions using inquirer
            inquirer.prompt(addEmpPrompt)

            // Await user response
            .then(function(answer) {

                // If user selects exit return to main menu
                if(answer.select_role == "0: Exit" || answer.select_manager == "E: Exit") {

                    cli_prompt();

                } else {

                    console.log(answer);

                    let query = "INSERT INTO employees SET ?";

                    connection.query(query, 
                        {
                            first_name: answer.first_name,
                            last_name: answer.last_name,

                            // New employees table role_id col value is extracted by parsing
                            role_id: parseInt(answer.select_role.split(":")[0]),

                            manager_id: parseInt(answer.select_manager.split(":")[0])
                        },
                        function(err, res) {

                            if (err) throw err;

                        })

                        // Array of actions to prompt user
                        let addAgainPrompt = [
                            {
                                name: "again",
                                type: "list",
                                message: "Would you like to add another employee?",
                                choices: ["Yes", "Exit"]
                            }
                        ];

                        inquirer.prompt(addAgainPrompt)

                        .then(function(answer) {

                            let query = 
                                "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, department.dept_name, employees.manager_id " +
                                "FROM employees " +
                                "JOIN roles ON roles.id = employees.role_id " +
                                "JOIN department ON roles.department_id = department.id " +
                                "ORDER BY employees.id;"
                                ;
                            
                            connection.query(query, function(err, res) {

                                if (err) throw err;

                                if (answer.again == "Yes") {

                                    addEmployee();

                                } else if (answer.again == "Exit") {

                                    for (i = 0; i < res.length; i++) {

                                        if(res[i].manager_id == 0) {

                                            res[i].manager = res[res[i].manager_id - 1].first_name + " " + res[res[i].manager_id - 1].last_name;

                                        };

                                        delete res[i].manager_id;
                                    
                                    };

                                    console.table(res);

                                    cli_prompt();

                                    
                                };
                            }); 
                        });
                };
            });
        })
    })
};

function addDept() {

    let query = "SELECT department.dept_name FROM department;";

    connection.query(query, function(err, res) {

        if (err) throw err;

        console.table(res);

        let addDeptPrompt = [
            {
                name: "new_department",
                type: "input",
                message: "Enter a new company department."
            },
        ];

        inquirer.prompt(addDeptPrompt)

        .then(function(answer) {

            console.log(answer);

            let query = "INSERT INTO department SET ?";

            connection.query(query,
                {
                    dept_name: answer.new_department
                }, function(err, res) {

                    if (err) throw err;

                });
            
            let addAgainPrompt = [
                {
                    name: "again",
                    type: "list",
                    message: "Would you like to add another department?",
                    choices: ["Yes", "Exit"]
                },
            ];

            inquirer.prompt(addAgainPrompt)

            .then(function(answer) {

                let query = "SELECT department.dept_name FROM department" ;

                connection.query(query, function(err, res) {

                    if (err) throw err;

                    if (answer.again == "Yes") {

                        addDept();

                    } else if (answer.again == "Exit") {

                        console.table(res);

                        cli_prompt();
                    };
                });
            });
        });
    });
};

function addRole() {

    let query1 = "SELECT roles.title AS roles, roles.salary, department.dept_name FROM INNER JOIN department.id = roles.department_id;";

    let query2 = "SELECT department.dept_name FROM department";

    connection.query(query1, function(err, res) {

        if (err) throw err;

        console.table(res);

        connection.query(query2, function(err, res) {

            if (err) throw err;

            let departmentList = res;

            let addRolePrompt = [
                {
                    name: "add_role",
                    type: "input",
                    message: "Enter a new companyt role."
                },
                {
                    name: "add_salary",
                    type: "input",
                    message: "Enter a salary for this role."
                },
                {
                    name: "select_department",
                    type: "list",
                    message: "Select a department.",
                    choices: function() {
                        departments = [];

                        for (i = 0; i< departmentList.length; i++) {
                            const releId = i +1;

                            departmens.push(roleId + ": " + departmentList[i].dept_name);

                        };

                        departments.unshift("0: Exit");

                        return departments;
                    }
                }
            ];

            inquirer.prompt(addRolePrompt)

            .then(function(answer) {

                if(answer.select_department == "0: Exit") {

                    cli_prompt();

                } else {

                    console.log(answer);

                    let query = "INSERT INTO roles SET ?";

                    connecti9on.query(query, 
                        {
                            title: answer.add_role,
                            salary: answer.add_salary,

                            department_id: parseInt(answer.select_department.split(":")[0])
                        }, function (err, res) {

                            if (err) throw err;

                        });

                        let addAgainPrompt = [
                            {
                                name: "again",
                                type: "list",
                                message: "Would you like to add another role?",
                                choices: ["Yes", "Exit"]
                            },
                        ];

                        inquirer.prompt(addAgainPrompt)

                        .then(function(answer) {

                            let query = "SELECT roles.id, roles.title AS roles, roles.salary, department.dept_name FROM roles INNER JOIN department ON department.id = roles.department_id;";

                            connection.query(query, function (err, res) {

                                if (err) throw err;

                                if (answer.again == "Yes") {

                                    addRole();

                                } else if (answer.again == "Exit") {

                                    console.table(res);

                                    cli_prompt();
                                };
                            });
                        });
                };
            });
        });
    });
};

function updateEmployee() {

    let query = "SELECT title FROM roles";

    let query2 = 

        "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, department.dept_name, employees.manager_id " +
        "FROM employees " +
        "JOIN roles ON roles.id = employees.role_id " +
        "JOIN department ON roles.department_id = department.id " +
        "ORDER BY employees.id;"

    ;

    connection.query(query2, function(err, res) {

        if (err) throw err;

        let rolesList = res;

        connection.query(query2, function(err, res) {

            if (err) throw err;

            for (i = 0; i< res.length; i++) {

                if (res[i].manager_id == 0) {

                    res[i].manager = "None"

                } else {

                    res[i].manager = res[res[i].manager_id -1].first_name + " " + res[res[i].manager_id -1].last_name;

                };

                delete res[i].manager_id;
            };

        console.table(res);

        let employeeList = res;

        let addEmpPrompt = [
            {
                name: "select_employee",
                type: "list",
                message: "Select employee to edit.",
                choices: function() {
                    employees = [];

                    for (i = 0; i < employeeList.length; i++) {

                        const mId = i + 1;

                        employees.push(mId + ": " + employeeList[i].first_name + " " + employeeList[i].last_name);

                    };

                    employees.unshift("0: Exit");

                    return employees;
                }

            }
        ];

        inquirer.prompt(addEmpPrompt)

        .then(function(answer) {

            if(answer.select_employee == "0: Exit") {

                cli_prompt();

            } else {

                let empSelect = answer.select_employee.split(":")[0]

                let empPropPrompt = [
                    {
                        name: "select_role",
                        type: "list",
                        message: "Edit employee role.",
                        
                        choices: function() {
                            
                            roles = [];

                            for (i = 0; i < rolesList.length; i++) {

                                const roleId = i + 1;

                                roles.push(roleId + ": " + rolesList[i].title);

                            };

                            roles.unshift("0: Exit");

                            return roles;

                        }
                    },
                    {
                        name: "select_manager",
                        type: "list",
                        message: "Edit employee manager",

                        choices: function () {

                            managers = [];

                            for (i = 0; i < employeeList.length; i++) {

                                const mId = i + 1;

                                if (answer.select_employee.split(": ")[1] !== employeeList[i].first_name + " " + employeeList[i].last_name) {

                                    managers.push(mId + ": " + employeeList[i].first_name + " " + employeeList[i].last_name);

                                };
                            };

                            managers.unshift("0: None");

                            managers.unshift("E: Exit");

                            return managers;

                        },

                        when: function ( answers ) {

                            return answer.select_role !== "0: Exit";

                        }
                    }
                ];

                inquirer.prompt(empPropPrompt)

                .then(function(answer) {
                    if (answer.select_role == "0: Exit" || answer.select_manager == "E: Exit") {

                        cli_prompt();

                    } else {
                        
                        console.log(answer);

                        let query = "UPDATE employee SET ? WHERE employees.id = " + empSelect;

                        connection.query(query,
                            {
                                role_id: parseInt(answer.select_role.split(":")[0]),

                                manager_id: parseInt(answer.select_manager.split(":")[0])
                            },
                            function(err, res) {

                                if (err) throw err;

                            });

                            let addAgainPrompt = [
                                {
                                    name: "again",
                                    type: "list",
                                    message: "Would you like to add another employee?",
                                    choices: ["Yes", "Exit"]
                                }
                            ];

                            inquirer.prompt(addAgainPrompt)

                            .then(function(answer) {

                                let query = 
                                    "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, department.dept_name, employees.manager_id " +
                                    "FROM employees " +
                                    "JOIN roles ON roles.id = employees.role_id " +
                                    "JOIN department ON roles.department_id = department.id " +
                                    "ORDER BY employees.id;"

                                ;

                                connection.query(query, function(err, res) {

                                    if (err) throw err;

                                    if (answer.again == "Yes") {

                                        updateEmployee();

                                    } else if (answer.again == "Exit") {

                                        for (i = 0; i <res.length; i++) {

                                            if(res[i].manager_id == 0) {
                                                
                                                res[i].manager = "None"

                                            } else {

                                                res[i].manager = res[res[i].manager_id - 1].first_name + " " + res[res[i].manager_id - 1].last_name;

                                            };

                                            delete res[i].manager_id;

                                        };

                                        console.table(res);

                                        cli_prompt();
                                    };  
                                });
                            }); 
                        };
                    });    
                };
            });
        })
    })
};

function deleteEmployee() {

    let query = "SELECT employees.id, employees.first_name, employees.last_name FROM employees;";

    connection.query(query, function( err, res) {

        if (err) throw err;

        for (i = 0; i < res.length; i++) {
            res[i].employee = res[i].first_name + " " + res[i].last_name;

            delete res[i].first_name;

            delete res[i].last_name;

        };

        console.table(res);

        let employeeList = res;

        let addEmpPrompt = [
            {
                name: "select_employee",
                type: "list",
                message: "Terminate employee.",

                choices: function() {
                    employees = [];

                    for (i = 0; i < employeeList.length; i++) {
                        
                        employee.push(employeeList[i].id + ": " + employeeList[i].employee);

                    };

                    employees.unshift("0: Exit");

                    return employees;

                }
            },
            {
                name: "confirm",
                type: "list",

                message: function(answer) {

                    return "Are you sure you want to TERMINATE " + answers.select_employee.split(": ")[1];

                },

                choices: ["Yes", "No"],

                when: function( answers ) {

                    return answers.select_employee !== "0: Exit";

                }
            }
        ];

        inquirer.prompt(addEmpPrompt)

        .then(function(answer) {

            if(answer.select_employee == "0: Exit") {

                cli_prompt();

            } else if (answer.confirm == "No") {

                deleteEmployee();

            } else {

                let query = "DELETE FROM employees WHERE employees.id =" + answer.select_employee.split(": ")[0];

                connection.query(query, function(err, res) {

                    if (err) throw err;

                });

                let addAgainPrompt = [
                    {
                        name: "again",
                        type: "list",
                        message: "Would you like to remove another employee?",
                        choices: ["Yes", "Exit"]
                    }
                ];

                inquirer.prompt(addAgainPrompt)

                .then(function(answer) {

                    let query = "SELECT employees.id, employees.first_name, employees.last_name FROM employees;";
                    
                    connection.query(query, function(err, res) {

                        if (err) throw err;

                        for (i = 0; i < res.length; i++) {

                            res[i].employee = res[i].first_name + " " + res[i].last_name;

                            delete res[i].first_name;

                            delete res[i].last_name;

                        };

                        if (answer.again == "Yes") {

                            deleteEmployee();

                        } else if (answer.again == "Exit") {

                            console.table(res);

                            cli_prompt();

                        };
                    });
                });
            };
        });
    });
};

function exit() {

    connection.end();

    console.log("Take care.");

};