const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemSchema = {
    name: String
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Default Item 1"
});

const item2 = new Item({
    name: "Default Item 2"
});

const item3 = new Item({
    name: "Default Item 3"
});

const listSchema = {
    name: String,
    items:[itemSchema]
};


const List = mongoose.model("List", listSchema);

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

// app.get("/work", function(req, res){
//     res.render("list", {
//         listTitle: "Work",
//         newListItems: work_items
//     })
// })

//adding item and redirect
app.post("/", function(req, res){
    var itemName = req.body.newItem;
    const listName = req.body.list;
    const newItem = new Item({
        name: itemName
    });
    if(listName === "Today"){
        newItem.save();
        res.redirect("/");
    }else{
        List.findOne({name: listName}, function(err, result){
            result.items.push(newItem);
            result.save();
            res.redirect("/"+ listName);
        });
    }
})

app.post("/delete", function(req, res){
    const checkItemId = req.body.checkBox;
    const listName = req.body.listName;
    if(listName === "Today"){
        Item.findByIdAndRemove(checkItemId, function(err){
            if(err){
                console.log(err);
            }
            res.redirect("/");
        });
    }else{
        List.findOneAndUpdate({name: listName},{$pull: {items: {_id: checkItemId}}}, function(err, foundList){
            if(!err){
                res.redirect("/" + listName);
            }
        })
    }
})

app.get("/:customName", function(req, res){
    const customListName = _.capitalize(req.params.customName);
    
    customListName 
    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if(!foundList){
                //create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItem
                });
                list.save();
                res.redirect("/" + customListName);
            }else{
                //show existed list
                res.render("list",{
                    listTitle: foundList.name,
                    newListItems: foundList.items});
            }
        }
    })

})

// app.get("/about", function(req, res){
//     res.render("about");
// });
// app.post("/work", function(req, res){
//     var val = req.body.newItem;
//     if(val != ""){
//         work_items.push(val);
//         res.redirect("/work");
//     }
// })
app.listen(port, function(){
    console.log("listening to " + port);
});