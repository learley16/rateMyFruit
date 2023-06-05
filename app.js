//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// Connecting to MongoDB Database
//mongoose.connect("mongodb://localhost:27017/fruitDB", { useUnifiedTopology: true, useNewUrlParser: true});

//connect to MongoDB by specifying port to access MongoDB server

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/fruitDB');
}

const fruitSchema = new mongoose.Schema ({
    name: { type: String,
        required: [true, "No name entered"]
    },
    rating: { type:Number,
        min:1 ,
        max: 10 },
    review: String
});

const Fruit = mongoose.model("fruit", fruitSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

// const peach = new Fruit({
//     name: "Peach",
//     rating: 7,
//     review: "Peaches are solid as a fruit"
// }); 

// //peach.save();

// const kiwi = new Fruit({
//     name: "Kiwi",
//     rating: 10,
//     review: "The best fruitT"
// }); 

// const orange = new Fruit({
//     name: "Orange",
//     rating: 4,
//     review: "Too sour for me"
// }); 

// const banana = new Fruit({
//     name: "Banana",
//     rating: 3,
//     review: "World Texture"
// }); 

// //Fruit.insertMany([peach, kiwi, orange, banana]);

const item1 = new Fruit(
    {
        name: "Apple",
        rating: 5,
        review: ""
    }
)

const item2 = new Fruit(
    {
        name: "Banana",
        rating: 8,
        review: ""
    }
)

const item3 = new Fruit(
    {
        name: "Strawberry",
        rating: 9,
        review: ""
    }
)

const defaultFruit = [item1, item2, item3];

app.get("/", function(req, res){
    //res.render("list", {fruitList:defaultFruit});

    Fruit.find()
        .then(function(foundFruits){
            if (foundFruits.length === 0){
                Fruit.insertMany(defaultFruit);
                res.redirect("/");
            } else {
                res.render("list", {fruitList: foundFruits});
            }
        })
        .catch(function(err){
            console.log(err);
        })    
    });

app.post("/", function(req, res){
    const fruitName = req.body.fruitName;
    const rating = req.body.rating;

    const fruit = new Fruit({name:fruitName, rating: rating, review:""});

    //defaultFruit.push(fruit);
    
    const allFruits = Fruit.find();

    Fruit.findOne({name:fruitName})
    .then(function(foundFruits){
        if (foundFruits != null){
            console.log("Already Found");
            res.redirect("/");
        } else {
            console.log("Added to Database");
            fruit.save();
            res.redirect("/");
        }
    })
    .catch(function(err){
        console.log(err);
    })   
});


app.listen(3000, function(){
    console.log("Server is started on port 3000")
});