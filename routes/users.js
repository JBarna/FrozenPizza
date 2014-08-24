var MongoClient = require('mongodb').MongoClient;
var mongo = new MongoClient();
var express = require('express');
var router = express.Router();

/* GET A USER's profile. */
router.get('/:userid', function(req, res) {
    
    //connect to database and get the info   
    mongo.connect(process.env.MONGOLAB_URI, function(err, db){
        db.collection("users", function(err, collection){
            collection.findOne({username: req.param('userid')}, function(err, item){
                if (item){ //found the user
                    var willShow = false;
                    if (req.session.username === req.param('userid'))
                        willShow = true;
                    res.render('profile', {pageTitle: req.param('userid'), username: req.param('userid'), showEdit: willShow, aboutme: item.aboutme, 
                          interests: item.interests, goals: item.goals}); 
                } else { //no user by that name
                    //TODO make no user page with link back to profile
                    //for now, just reroute to home
                    res.redirect('/');
                }
            });
            setTimeout(function(){ db.close(); }, 1000);
        });
    }); 
});

router.post('/:userid', function(req, res){
});

module.exports = router;
