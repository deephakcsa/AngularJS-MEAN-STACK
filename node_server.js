var express = require('express'),
    app = express(),
    mongodb = require ('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectID,
    bodyParser = require('body-parser');

const mongo_conn = 'mongodb://localhost/';
var db = '';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.get('/',function(req,res){
    res.sendFile(__dirname+'/app.html');
});

app.post('/profile', function(req,res){
    var myquery = { username: req.body.username };
    var newvalues = { $set: {password: req.body.password, 
        firstname: req.body.firstname, 
        lastname: req.body.lastname, 
        email: req.body.email, 
        phone: req.body.phone, 
        location: req.body.location } };
    db.collection("users").updateOne(myquery, newvalues, function(err) {
        if(!err){
            console.log("updated!");
            res.send({
                success:true
            });
        }else{
            console.log("update error "+err);
        }
    });
});

app.post('/register', function(req,res){
    db.collection('users').find({"username":req.body.username}).toArray(function(err,docs){
        if(docs.length < 1){
            db.collection('users').insert(req.body, function(err){
                if(!err){
                    console.log("registered!");
                    res.send({
                        success:true
                    });
                }else{
                    console.log("registration error "+err);
                }
            });
        }else{
            res.send({
                success:false
            });
        }
    });
    
});

app.post('/login', function(req, res){
    db.collection('users').find(req.body).toArray(function(err,docs){
        res.send({
            success:true,
            docs: docs
        });
    });
});


app.post('/messages', function(req, res){
    db.collection('messages').find({$or:[{sender: req.body.username},{receiver: req.body.username}]}).toArray(function(err, docs){
        res.send({
            success:true,
            docs: docs
        });
    });
});

app.post('/sendmessage', function(req,res){
    db.collection('messages').insert(req.body, function(err){
        if(!err){
            console.log("message sent!");
            res.send({
                success:true
            });
        }else{
            console.log("error sending message "+err);
            res.send({
                success:false
            });
        }
    });
});

app.post('/deletemessage', function(req,res){
    db.collection("messages").deleteOne({_id: new ObjectId(req.body._id)}, function(err) {
        if(!err){
            console.log("deleted message!");
            res.send({
                success:true
            });
        }else{
            console.log("error "+err);
        }
    });
});

app.post('/markmessage', function(req,res){
    db.collection("messages").update({_id: new ObjectId(req.body._id)},{$set: {imp : true}}, function(err) {
        if(!err){
            console.log("marked message!");
            res.send({
                success:true
            });
        }else{
            console.log("error "+err);
        }
    });
});

app.post('/sendreply', function(req,res){
    db.collection("messages").update({_id: new ObjectId(req.body._id)},{$set: {replies : req.body.replies}}, function(err) {
        if(!err){
            console.log("reply sent!");
            res.send({
                success:true
            });
        }else{
            console.log("error "+err);
        }
    });
});

mongodb.connect(mongo_conn,function(err, client){
    if(!err){
        console.log('Connection Established!');
        app.listen(1234, function(){
            console.log("Server Started @ localhost:1234");
        });
        db = client.db('mydb');
    }else{
        console.log('Could not connect to MongoDB');
    }
    
});
