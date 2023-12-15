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
     "SELECT * from areaRatings WHERE area like '%" + req.query.keyword + "%'";
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
    
    app.get('/listusers', function(req, res) {

        // Query database to get all the users
    
        let sqlquery = "SELECT * FROM users";
    
        // Execute sql query
    
        db.query(sqlquery, (err, result) => {                                                                                                         
    
            if (err) {
                res.redirect('./');
            }
    
            let newData = Object.assign({}, shopData, { userList: result });
    
            console.log(newData);
    
            res.render("listusers.ejs", newData);
    
        });
    
    });
    

    app.get('/listofareas', function(req, res) {

        // Query database to get all the books

        let sqlquery = "SELECT * FROM areaRatings";

                                                                                                                                                      

        // Execute sql query

        db.query(sqlquery, (err, result) => {                                                                                                         

            if (err) {

                res.redirect('./');

            }

            let newData = Object.assign({}, shopData, {availablearea:result});

            console.log(newData)                                                                                                                      

            res.render("listofareas.ejs", newData)

         });                                                                                                                                          

    });
   app.get('/review', function(req,res) {
   let sqlquery = "SELECT * FROM area WHERE rating<80";
   db.query(sqlquery, (err, result) => {
   if (err) {
   res.redirect('./');
   }
   let newData = Object.assign({}, shopData, {availableBooks:result});
    console.log(newData)
   res.render("review.ejs", newData)
   });
   });


   const { body, validationResult } = require('express-validator');

   app.post('/registered',
       [
           // Use express-validator to sanitize and validate input
           body('first').trim().escape(),
           body('last').trim().escape(),
           body('email').trim().isEmail().normalizeEmail(),
           // Add more validation and sanitization rules as needed
       ],
       function (req, res) {
           // Saving data in the database
           const bcrypt = require('bcrypt');
           const saltRounds = 10;
           const plainPassword = req.body.password;
   
           bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
               let sqlquery = "INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (?,?,?,?,?)";
   
               // execute SQL query
               let newrecord = [
                   req.body.username,
                   req.body.first,
                   req.body.last,
                   req.body.email,
                   hashedPassword
               ];
   
               db.query(sqlquery, newrecord, (err, result) => {
                   if (err) {
                       return console.error(err.message);
                   } else {
                       result = 'Hello ' + req.body.first + ' ' + req.body.last + ' you are registered! You will receive an email at ' + req.body.email;
                       result += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword;
                       res.send(result);
                   }
               });
           });
       }
   );
   
   app.get('/login', function (req,res) {
    res.render('login.ejs', { shopName: "London ratings forums"});
});
app.post('/LoggedIn', function(req, res) {
    // Assuming req.body.username contains the username entered by the user
    const username = req.body.username;

    // Compare the form data with the data stored in the database
    let sqlquery = "SELECT hashedPassword FROM LondonRatings.users WHERE username = ?";

    // Save user session here, when login is successful
    req.session.userId = username;

    db.query(sqlquery, [username], (err, result) => {
        if (err) {
            return console.error(err.message);
        } else if (result.length === 0) {
            // No user found with that username
            res.send('Invalid username or password');
        } else {
            // User found, compare the passwords
            let hashedPassword = result[0].hashedPassword;
            const bcrypt = require('bcrypt');
            bcrypt.compare(req.body.password, hashedPassword, function(err, result) {
                if (err) {
                    // Handle error
                    return console.error(err.message);
                } else if (result === true) {
                    // The passwords match, login successful
                    res.send('Welcome, ' + req.body.username + '!' + '<a href=' + './' + '>Home</a>');
                } else {
                    // Login failed
                    res.send('Invalid username or password');
                }
            });
        }
    });
});



                                                                                                                                                                                                                                                             

    app.post('/addanarea', function (req,res) {

          // saving data in database

          let sqlquery = "INSERT INTO areaRatings (area, rating) VALUES (?,?)";

          // execute sql query

          let newrecord = [req.body.area, req.body.rating];

          db.query(sqlquery, newrecord, (err, result) => {                                                                                            

            if (err) {

              return console.error(err.message);

            }

            else{

            

            res.send(' This area is added to the database, area: '+ req.body.area+ ' rating '+ req.body.rating);
            }
            });
        });
                                                                                                                                 
    }
