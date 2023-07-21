const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const ejs=require('ejs');

const app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});
//defining schema
const articleSchema={
    title: String,
    content: String
}
//defining model
const Article=mongoose.model("Article",articleSchema);
// routes is started here
/////////////////////////////////////REQUEST TARGETING ALL ARTICLES/////////////////////////////////////
//1. This is get method.
app.get("/articles",function(req,res){
    async function fetchArticles() {
        try {
            const foundArticles = await Article.find();
            console.log(foundArticles);
        } catch (err) {
            console.error("Error occurred while finding articles:", err);
        }
    }
    
    fetchArticles();
    
})
//2. This is post method.
// app.post("/articles",function(req,res){
//     console.log(req.body.title);
//     console.log(req.body.content);

//     const newArticle = new Article({
//         title:  req.body.title,
//         content : req.body.content
//     })
//     newArticle.save(function(err){
//          if(!err){
//             console.log("Successfully added a new article")
//          }else{
//             res.send(err);
//          }
//     });
// })
//3. This is post method.
app.delete("/articles", async function(req, res) {
    try {
      await Article.deleteMany();
      res.send("successfully deleted");
    } catch (err) {
      res.status(500).send(err);
    }
  });
  

  /////////////////////////////////////REQUEST TARGETING SPECIFIC ARTICLES/////////////////////////////////////
  
  //this method is used to get specific article
  app.route("/articles/:articleTitle")
  .get(async function(req, res) {
    try {
      const foundArticle = await Article.findOne({ title: req.params.articleTitle }).exec();
      
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title were found");
      }
    } catch (err) {
      // Handle any errors that occurred during the database operation
      console.error(err);
      res.status(500).send("An error occurred while fetching the article");
    }
  })
  .put(async function (req, res) {
    try {
      const filter = { title: req.params.articleTitle };
      const update = { title: req.body.title, content: req.body.content };
  
      const updateResult = await Article.updateOne(filter, update);
   
      if (updateResult.n > 0) {
        res.send('Article updated successfully');
      } else {
        res.send('No articles matching that title were found');
      }
    } catch (err) {
      // Handle any errors that occurred during the database operation
      console.error(err);
      res.status(500).send('An error occurred while updating the article');
    }
  })
  .delete(async function (req, res){
    try {
      const filter = { title: req.params.articleTitle };
  
      const deleteResult = await Article.deleteOne(filter);
  
      if (deleteResult.deletedCount === 1) {
        res.send('Article deleted successfully');
      } else {
        res.send('No article matching that title was found');
      }
    } catch (err) {
      // Handle any errors that occurred during the database operation
      console.error(err);
      res.status(500).send('An error occurred while deleting the article');
    }
  });
  



// .post()

// .delete();

app.listen(3000,function(){
    console.log("server started on port 3000");
})