const express = require("express");
const usersRouter = require("./router/user-router");
const categoriesRouter = require("./router/category-router");
const productsRouter = require("./router/product-router");
const productImagesRouter = require("./router/productImage-router");
const participantsRouter = require("./router/participant-router");
const transactionsRouter = require("./router/transaction-router");

var cors = require("cors");
var path = require("path");
const { errorMiddleware } = require("./middleware/error-middleware");

const app = express();

app.use(errorMiddleware);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(usersRouter);
app.use(categoriesRouter);
app.use(productsRouter);
app.use(productImagesRouter);
app.use(participantsRouter);
app.use(transactionsRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
