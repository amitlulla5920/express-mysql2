// Author: Amit Lulla
// Date: 30-03-2023
const express = require('express');
const app = express();
const port = 3000
const mysql = require('./connection').con
// const path = require('path');

app.set('view engine', 'hbs')
app.set('views', './views')
app.use(express.static(__dirname + '/public'))

//Routing
app.get('/', (req, res) => {
    res.render("index")
})

app.get('/add', (req, res) => {
    res.render("add")
})
app.get('/search', (req, res) => {
    res.render("search")
})
app.get('/update', (req, res) => {
    res.render("update")
})
app.get('/delete', (req, res) => {
    res.render("delete")
})
app.get('/view', (req, res) => {
    let qry = "select * from userdetails ";
    mysql.query(qry, (err, results) => {
        if (err) {
            throw err;
        }
        else {
            res.render("view", { data: results });
        }
    });
})

app.get("/addemployee", (req, res) => {
    // fetching data from form
    const { name, phone, email, gender } = req.query

    // Sanitization XSS...
    let qry = "select * from userdetails where emailid=? or phoneno=?";
    mysql.query(qry, [email, phone], (err, results) => {
        if (err)
            throw err
        else {

            if (results.length > 0) {
                res.render("add", { checkmesg: true })
            } else {

                // insert query
                let qry2 = "insert into userdetails values(?,?,?,?)";
                mysql.query(qry2, [name, phone, email, gender], (err, results) => {
                    if (results.affectedRows > 0) {
                        res.render("add", { mesg: true })
                    }
                })
            }
        }
    })
});


app.get("/searchemployee", (req, res) => {
    // fetch data from the form


    const { phone } = req.query;

    let qry = "select * from userdetails where phoneno=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                res.render("search", { mesg1: true, mesg2: false })
            } else {

                res.render("search", { mesg1: false, mesg2: true })

            }

        }
    });
})

app.get("/updatesearch", (req, res) => {

    const { phone } = req.query;

    let qry = "select * from userdetails where phoneno=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                res.render("update", { mesg1: true, mesg2: false, data: results })
            } else {

                res.render("update", { mesg1: false, mesg2: true })

            }

        }
    });
})
app.get("/updateemployee", (req, res) => {
    // fetch data

    const { phone, name, gender } = req.query;
    let qry = "update userdetails set username=?, gender=? where phoneno=?";

    mysql.query(qry, [name, gender, phone], (err, results) => {
        if (err) throw err
        else {
            if (results.affectedRows > 0) {
                res.render("update", { umesg: true })
            }
        }
    })

});

app.get("/removeemployee", (req, res) => {

    // fetch data from the form


    const { phone } = req.query;

    let qry = "delete from userdetails where phoneno=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err) throw err
        else {
            if (results.affectedRows > 0) {
                res.render("delete", { mesg1: true, mesg2: false })
            } else {

                res.render("delete", { mesg1: false, mesg2: true })

            }

        }
    });
});

//Creating Server
app.listen(port, (err)=> {
    if(err) {
        throw err;
    }else{
        console.log('listening on port http://localhost:'+port);
    }
})