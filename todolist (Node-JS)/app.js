
// install packages
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const ejs = require('ejs');
const mongoose = require("mongoose");
const _ = require("lodash");

// start useing packages for app

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));



// to connect the server of data base
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

// create new schema
const itemsSchema ={
    name:String,
    
};

//schema model
const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item ({
    name:"welcome to my todo",
});
const item2 = new Item ({
    name:"click + to save it ",
});
const item3 = new Item ({
    name:"delete it ",
});

const defaultItems = [item1,item2,item3];

//list database
const listSchema = {
    name:String,
    items:[itemsSchema]
};

const List = mongoose.model("List",listSchema);


// first page 
app.get('/', async (req, res) =>{

    Item.find({}).then((foundItems) => {

        if (foundItems.length === 0){
            Item.insertMany(defaultItems);
            res.redirect("/");
        }else {
            // context in page
            res.render("list", {listTitle: "Today", newListItems: foundItems});
        }
    });
    
});
 
app.get("/:listName",async (req, res) =>{

    const listName = _.capitalize(req.params.listName);

    List.findOne({name:listName}).then(async(foundList) =>{

        if (foundList === null){

            //create new list
            const foundList = new List({
                name: listName,
                items:defaultItems
            });
            await foundList.save();

            res.redirect("/"+ listName);

        }else{
            res.render("list",{listTitle: foundList.name, newListItems: foundList.items})
        };

    });

    
});


// req function to get respons
app.post("/", async (req, res) => {

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const newItem = new Item ({
        name : itemName
    });

    if (listName === "Today"){
        newItem.save();
        res.redirect("/");
    }else {

        await List.findOne({name:listName}).then(async(foundList) =>{

            foundList.items.push(newItem)
            await foundList.save();
            
            res.redirect("/"+ listName);

        });
            
    };



});

app.post("/delete", async (req, res) =>{

    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){

        await Item.findByIdAndRemove(checkedItemId)

        res.redirect("/");
        
    }else{
        await List.findOneAndUpdate(
            { name: listName }, 
            { $pull: { items: { _id: checkedItemId } } });
            
        res.redirect("/" + listName);
           
        
    }

});




// app.get("/about", function(req, res){
//     res.render("about");
// });


// loclal host port 
app.listen(3000,function(){
    console.log("salam sayed");
})
