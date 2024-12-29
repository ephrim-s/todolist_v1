//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = {name: String};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});
const item2 = new Item({
    name: "Hit the + button to add a new item."
});
const item3 = new Item({
    name: "<-- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", async (req, res) => {
    
    const foundItems = await Item.find({});

    if (foundItems.length === 0) {
        Item.insertMany(defaultItems);       
    } else {
        res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
    
});

app.get("/:customListName", async (req, res) => {
    const customListName = req.params.customListName;

    const foundList = await List.findById({customListName});
    console.log(foundList);
          
        
    

    // const list = new List({
    //     name: customListName,
    //     items: defaultItems
    // });
    // list.save();

});


app.post("/", function(req, res){
        
    const itemName = req.body.newItem;
    
    const item = new Item({
        name: itemName
    });
    item.save();
    res.redirect("/");
});

app.post("/delete",  async (req, res) => {
    const checkedItemId = req.body.checkbox;
    await Item.findByIdAndDelete(checkedItemId );
    res.redirect("/");
});




app.listen(3000, function(){
    console.log("Server started on port 3000");
});