const express = require('express');
const mysql = require('mysql');

//setting up mysql connection
const connection = mysql.createConnection({
  host     : '129.158.83.140',
  port : 3306,
  user     : 'root',
  password : 'Makrand@1234',
  database : 'testdatabase'
});

//checking if the connection works
connection.connect((err) => {
  if(err){
    throw err;
  }
  console.log("Mysql Database Connected");
});

const app = express();

//created a route for creating a database
app.get('/createdb', (req,res) => {
  const dbName = "testDatabase"
  let sql = `CREATE DATABASE ${dbName}`;
  connection.query(sql, (err, results) => {
    if(err)
    {
       console.log(err.code);
	   //console.log(err);
	   return;
    }
    console.log(results);
    res.send("DATABASE created..");
  });
});
//Created a route for creating a table in selected database
app.get('/createtable', (req,res) => {
  //res.send("route created");
  const tableName = "customers"
  let sql = `CREATE TABLE ${tableName} (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), address VARCHAR(255))`;
  connection.query(sql, (err, results) => {
    if(err)
    {
      throw err;
    }
    console.log(results);
    res.send("TABLE created");
  });
});

//Created a route for inserting data into the table
app.get('/insertdata',(req, res) => {
    const tableName = "customers"
    const sql = `INSERT INTO ${tableName} (name,address) VALUES ('Mak','Long Beach')`;
    connection.query(sql, (err, results) => {
      if(err){
        throw err;
      }
      console.log("data inserted successfully");
      res.json(results);
    });
  });

//Created a route for inserting data into the table
app.get('/insertrow',(req,res) => {
  const tableName = "customers"
  const sql = `INSERT INTO ${tableName} SET ?`;
  const row = {
    name : 'Pats',
    address : 'San Jose'
  };
  connection.query(sql,row,(err,results) => {
    if(err){
      throw err;
    }
    console.log("data inserted successfully");
    res.json(results);
  });
});

app.get('/insertrow2',(req,res) => {
  const tableName = "customers"
  const sql = `INSERT INTO ${tableName} (name, address) VALUES ?`;
  const rows = [
    ['John', 'Highway 71'],
    ['Peter', 'Lowstreet 4'],
    ['Amy', 'Apple st 652']
  ];
  connection.query(sql,[rows],(err,results) => {
    if(err){
      throw err;
    }
    console.log("data inserted successfully");
    res.json(results);
  });
});

app.get('/selectrows',(req,res) => {
  const tableName = "customers"
  const sql = `SELECT * FROM ${tableName}`;
  connection.query(sql,(err,results) => {
    if(err){
      throw err;
    }
    console.log("data retreived successfully");
    for(let row of results){
      console.log(row);
//      console.log(row.name);
//      console.log(`${row.id} , ${row.name} , ${row.address}`);
    }
    res.json(results);
  });
});

app.get('/selectrow/:id', (req, res) => {
  const tableName = "customers"
  const id = req.params.id;
  const sql = `SELECT * FROM ${tableName} WHERE id = ${id}`;
  connection.query(sql, (err,result) => {
    if(err)
    {
      throw err;
    }
    console.log("row retrieved successfully");
    console.log(result);
    res.json(result);
  });
});

// Route for updating row
// localhost:port/updaterow/3?name=make&address=california US
app.get('/updaterow/:id', (req, res) => {
  const tableName = "customers"
  const id = req.params.id;
  const name = req.query.name;             //https://stackoverflow.com/questions/18524125/request-query-and-request-param-in-expressjs
  const address = req.query.address;
  const sql = `UPDATE ${tableName} SET name = ? , address = ? WHERE id = ?`;
  connection.query(sql, [name , address, id], (err,result) => {
    if(err)
    {
      throw err;
    }
    console.log("row Updated successfully");
    res.json(result);
 });
});

app.get('/deleterow/:id',(req,res) => {
  const tableName = "customers"
  const id = req.params.id;
  const sql = `DELETE FROM ${tableName} WHERE id = ?`;
  connection.query(sql,[id], (err,result) =>{
    if(err)
    {
      throw err;
    }
    console.log("row Deleted successfully");
    res.json(result);
  });
});

app.listen(3000,()=>{
  console.log("App started on port 3000");
});
