const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")


const app = express();
const port = 3000;

const vals = ["buy food", "cook food", "eat food"];
const work_items = [];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemSchema = {
    name: String
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "welcome1"
});

const item2 = new Item({
    name: "welcome2"
});

const item3 = new Item({
    name: "welcome3"
});

const defaultItem = [item1, item2, item3];


app.get("/", function(req, res){
    
    Item.find({}, function(err, result){
        if(result.length === 0){
            Item.insertMany(defaultItem, function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("Success to mongoDB");
                }
            })
            res.redirect("/");
        }else{
            res.render("list",{
                listTitle: "Today",
                newListItems: result
            });
        }
    })
});

app.get("/work", function(req, res){
    res.render("list", {
        listTitle: "Work",
        newListItems: work_items
    })
})

//adding item and redirect
app.post("/", function(req, res){
    var itemName = req.body.newItem;
    const newItem = new Item({
        name: itemName
    });
    newItem.save();
    res.redirect("/");
})

app.post("/delete", function(req, res){
    const checkItemId = req.body.checkBox;
    Item.findByIdAndRemove(checkItemId, function(err){
        if(err){
            console.log(err);
        }
    });
    res.redirect("/");
})

app.get("/about", function(req, res){
    res.render("about");
});
app.post("/work", function(req, res){
    var val = req.body.newItem;
    if(val != ""){
        work_items.push(val);
        res.redirect("/work");
    }
})
app.listen(port, function(){
    console.log("listening to " + port);
});