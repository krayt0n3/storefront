var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "bexley10",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  displayProducts();
});

function displayProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log('ID: ' + res[i].item_id + '\n'
       + 'Product Name: ' + res[i].product_name + '\n'
        + 'Department Name: ' + res[i].department_name + '\n'
         + 'Price: $' + res[i].price + '\n'
         + 'Stock Quantity: ' + res[i].stock_quantity + '\n' + '\n');
      
    }
    
    askCustomer();
  });
}

function askCustomer() {
  inquirer
  .prompt([ {
    type: 'checkbox',
    name: 'id',
    message: 'Input the ID of the product that you\'d like to buy.',
    choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'EXIT'] 
  },
  {
    type: 'number',
    name: 'quantity',
    message: 'Enter the quantity that you would like to buy.'
  }
  ])
  .then(function(answer) {
      connection.query("SELECT * FROM products", function(err, res) {
        var id = +answer.id;
        var quantity = +answer.quantity;
        var item_id = res[id -1].item_id;
        var stock_quantity = res[id -1].stock_quantity;
    console.log(res[0].stock_quantity);
    console.log(+answer.quantity);
    if (id === item_id) {
      if (quantity < stock_quantity) {
        updateProduct()
      } else if (quantity >= stock_quantity){ 
        console.log('Insufficient quantity!');
        askCustomer();
      };
}
})

function updateProduct() {
  connection.query(
    "UPDATE products SET stock_quantity = " + answer.quantity + " WHERE item_id = " + parseInt(answer.id)
    );
    
    Cost();

    
}

function Cost() {
  connection.query("SELECT * FROM products", function(err, res) {
    var id = +answer.id;
        var price = res[id -1].price;
        var stock_quantity = res[id -1].stock_quantity;
    console.log("$" + stock_quantity * price);
    connection.end();
  })
}

  })
}