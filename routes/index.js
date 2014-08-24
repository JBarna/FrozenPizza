var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var mongo = new MongoClient();


/* GET home page. */
router.get('/', function(req, res) {
    if (!req.session.loggedIn){
          res.render('login', { pageTitle: "Frozen Pizza", title: 'This is the login page!', failedLogIn: req.session.failedLogIn, 
                              loginMessage: req.session.loginMessage});
    }
    else{
        res.redirect('/users/' + req.session.username);
    }
});


/*POST home page or LOGIN*/
router.post('/', function(req, res){
    
    //connect to the database
    mongo.connect(process.env.MONGOLAB_URI, function(err, db){
        db.collection("users", function(err, collection){
            
            
            if(req.body.action == "signin"){
                //if we are signing in, check both username and password
                var query = {username: req.body.username, password: req.body.password}; 
                collection.findOne(query, function(err, item){
                    if(item){

                        console.log(req.body.username + " logged in");
                        req.session.loggedIn = true;
                        req.session.failedLogIn = false;
                        req.session.username = req.body.username;
                        res.redirect('/users/' + req.session.username);
                    } else{ //failed login
                        req.session.failedLogIn = true;
                        req.session.loginMessage = "Username or password is incorrect.";
                        res.redirect('/');
                    }
                });
            } else {
                //sign up! Check to make sure no one has that username
                var query = {username: req.body.username}
                collection.findOne(query, function(err, item){
                    if (!item){
                        //define our new database object
                        query.password = req.body.password; 
                        query.aboutme = ""; 
                        query.interests = ""; query.goals = "";
                        var options = {w:1, wtimeout:5000, journal:true};
                        collection.insert(query, options, function(err, results){
                            if (results)
                                console.log("User: " + query.username + " Password: " + query.password + " created");
                            req.session.loggedIn = true;
                            req.session.failedLogIn = false;
                            req.session.username = req.body.username;
                            res.redirect('/users/' + req.body.username);
                        });
                    } else{
                        req.session.failedLogIn = true;
                        req.session.loginMessage = req.body.username + " has already been taken.";
                        res.redirect('/');
                    }
                });
            }
                
            setTimeout(function(){ db.close(); }, 1000);
        });
    });
});


router.get('/clear', function(req, res) {
    req.session.destroy(function(){
      res.redirect('/');
    });
  });

router.post('/save', function(req, res){
    var data = {hi: "hello!"};
    res.send({"data": JSON.stringify(data) });
    
    /*Connect to the database of users and insert this information*/
    mongo.connect(process.env.MONGOLAB_URI, function(err, db){
        db.collection("users", function(err, collection){
            var update = {}
            switch(req.body.type){
                    case "aboutme":
                        update.$set = {aboutme: req.body.data};
                        break;
                    case "interests":
                        update.$set = {interests: req.body.data};
                        break;
                    case "goals":
                        update.$set = {goals: req.body.data};
                        break;
            }
                    
            var query = {username: req.session.username};
            var options = {w:1, wtimeout:1000, journal:true, upsert:false, multi:false};
            
            collection.update(query, update, options, function(err, results){
                if (err){
                    console.log(JSON.stringify(err));
                }
                console.log("\nUpdate Results: " + JSON.stringify(results));
            });
            setTimeout(function(){ db.close(); }, 2000);
        });
    });              
});

module.exports = router;
