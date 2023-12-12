module.exports = function(app, shopData) {

                                                                                                                                                      

    // Handle our routes

    app.get('/',function(req,res){

        res.render('index.ejs', shopData)

    });                                                                                                                                               

    app.get('/aboutlondon',function(req,res){

        res.render('aboutlondon.ejs', shopData);

    });                                                                                                                                               

    app.get('/search',function(req,res){

        res.render("search.ejs", shopData);

    });                                                                                                                                               

    app.get('/search-result', function (req, res) {

        // Searching in the database
     let sqlquery =
     "SELECT * from books WHERE name like '%" + req.query.keyword + "%'";
     db.query(sqlquery,(err, result) => {
     if (err) {
     res.send("Error");
    }
    let newData = Object.assign({}, shopData, {availableBooks:result});
    console.log(newData)
    res.render("search-result.ejs", newData)
   });
    });


        app.get('/register', function (req,res) {

        res.render('register.ejs', shopData);

    });                                                                                                                                               

    app.get('/addanarea', function (req,res) {

        res.render('addanarea.ejs', shopData);

    });                                                                                                                                               

    app.get('/listofareas', function(req, res) {

        // Query database to get all the books

        let sqlquery = "SELECT * FROM books";

                                                                                                                                                      

        // Execute sql query

        db.query(sqlquery, (err, result) => {                                                                                                         

            if (err) {

                res.redirect('./');

            }

            let newData = Object.assign({}, shopData, {availableBooks:result});

            console.log(newData)                                                                                                                      

            res.render("listofareas.ejs", newData)

         });                                                                                                                                          

    });
   app.get('/review', function(req,res) {
   let sqlquery = "SELECT * FROM books WHERE price<20";
   db.query(sqlquery, (err, result) => {
   if (err) {
   res.redirect('./');
   }
   let newData = Object.assign({}, shopData, {availableBooks:result});
    console.log(newData)
   res.render("review.ejs", newData)
   });
   });


    app.post('/registered', function (req,res) {

        // Saving data in database
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const plainPassword = req.body.password;
        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {

        })
        res.send(' Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email);

    });                                                                                                                                               

                                                                                                                                                      

    app.post('/addanarea', function (req,res) {

          // saving data in database

          let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";

          // execute sql query

          let newrecord = [req.body.name, req.body.price];

          db.query(sqlquery, newrecord, (err, result) => {                                                                                            

            if (err) {

              return console.error(err.message);

            }

            else

            res.send(' This book is added to the database, name: '+ req.body.name

+ ' price '+ req.body.price);

            });                                                                                                                                       

       });                                                                                                                                            

}
