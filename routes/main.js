module.exports = function(app, shopData) {
    const redirectLogin = (req, res, next) => {
        if (!req.session.userId ) {
          res.redirect('./login')
        } else { next (); }
    }
    const { check, validationResult } = require('express-validator');
                                                                                                                                                      

    // Handle our routes

    app.get('/',function(req,res){

        res.render('index.ejs', shopData)

    });                                                                                                                                               

    app.get('/aboutlondon',function(req,res){

        res.render('aboutlondon.ejs', shopData);

    });                                                                                                                                               

    app.get('/search', redirectLogin,function(req,res){

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
    let newData = Object.assign({}, shopData, {availableareaRatings:result});
    console.log(newData)
    res.render("search-result.ejs", newData)
   });
    });

    const http = require('https');

    // Define options outside of the callback function
    const options = {
        method: 'GET',
        hostname: 'myallies-breaking-news-v1.p.rapidapi.com',
        port: null,
        path: '/GetCompanyDetailsBySymbol?symbol=twtr',
        headers: {
            'X-RapidAPI-Key': '71a25e318cmsh02d5c91712d6660p1d7d71jsnd6344bb13347',
            'X-RapidAPI-Host': 'myallies-breaking-news-v1.p.rapidapi.com'
        }
    };
    
    app.get('/breakingnews', function (req, res) {
        // Use the defined options here
        // ...
    
        // For example, you can make a request using the defined options
        const request = http.request(options, function (response) {
            // Handle the response
            // ...
        });
    
        // End the request
        request.end();
    });
    
    const req = http.request(options, function (res) {
        const chunks = [];
    
        res.on('data', function (chunk) {
            chunks.push(chunk);
        });
    
        res.on('end', function () {
            const body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });
    
    req.end();
        app.get('/register', function (req,res) {

        res.render('register.ejs', shopData);

    });    
    
     

    app.get('/addanarea', redirectLogin, function (req,res) {

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
    

    app.get('/listofareas', redirectLogin,function(req, res) {

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
    app.get('/addReview', redirectLogin, function (req, res) {
        res.render('addReview.ejs', shopData);
    });

 
    app.post('/review', [
        check('rating').isInt({ min: 0, max: 10 })
    ], function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('./addrating');
        } else {
            // Save new rating in database
            let sqlquery = "INSERT INTO areaRatings (area, rating) VALUES (?,?)";
            let newrecord = [req.sanitize(req.body.area), req.sanitize(req.body.rating)];
            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    return console.error(err.message);
                } else {
                    res.send('You have added new rating for: ' + req.sanitize(req.body.area) + ' rating: ' + req.sanitize(req.body.rating));
                }
            });
        }
    });


   

   app.post('/registered', [check('email').isEmail()], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.redirect('./register'); }
    else { 

    
           // Saving data in the database
           const bcrypt = require('bcrypt');
           const saltRounds = 10;
           const plainPassword = req.body.password;
   
           bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
               let sqlquery = "INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (?,?,?,?,?)";
   
               // execute SQL query
               let newrecord = [
                   req.body.username,
                   req.sanitize(req.body.first),
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

app.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
    if (err) {
      return res.redirect('./')
    }
    res.send('you are now logged out. <a href='+'./'+'>Home</a>');
    })
})



                                                                                                                                                                                                                                                             

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
