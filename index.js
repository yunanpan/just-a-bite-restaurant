/* eslint import/no-unresolved:0 */
require("dotenv").config();

const express = require("express");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");

// express 引入進來的是一個 function
// 執行 function, 建立 app
const app = express();

// 指定 port
const port = process.env.PORT || 5001;

const main = require("./controller/main");
const prize = require("./controller/prize");
const admin = require("./controller/admin");
const menu = require("./controller/menu");
const cart = require("./controller/cart");
const faq = require("./controller/faq");

// 實作 view 設定
app.set("view engine", "ejs");

// 設定 session: https://www.npmjs.com/package/express-session
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// 使用 body-parser: http://expressjs.com/en/resources/middleware/body-parser.html
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// 使用 connet-flash
app.use(flash());

// 從哪裡拿 css、img 等靜態檔案
app.use(express.static(__dirname + "/public")); // eslint-disable-line

// 以利於在 view 中直接透過屬性直接引用值
// 參考：https://itbilu.com/nodejs/npm/Ny0k0TKP-.html
app.use((req, res, next) => {
  res.locals.username = req.session.username;
  res.locals.products = req.session.products;
  res.locals.prices = req.session.prices;
  res.locals.quanlities = req.session.quanlities;
  res.locals.errorMessage = req.flash("errorMessage");
  next();
});

app.get("/", main.index);

function redirectBack(req, res) {
  res.redirect("back");
}

// 權限管理
function isAdmin(req, res, next) {
  if (!req.session.username) {
    return res.redirect("/");
  }
  next();
}

app.get("/admin", admin.login);
app.post("/login", admin.handleLogin, redirectBack);
app.get("/logout", admin.logout);

app.get("/admin-prize", isAdmin, admin.prize);
app.get("/admin-menu", isAdmin, admin.menu);
app.get("/admin-faq", isAdmin, admin.faq);

// 抽獎頁面
app.get("/prize", prize.index);

app.get("/edit-prize", isAdmin, admin.editPrize);
app.post("/edit-prize", isAdmin, admin.addPrize, redirectBack);
app.get("/delete-prize/:id", isAdmin, admin.deletePrize);
app.get("/update-prize/:id", isAdmin, admin.updatePrize);
app.post("/update-prize/:id", isAdmin, admin.handleUpdatePrize, redirectBack);
app.get("/getprize", prize.getPrize);

// menu
app.get("/menu", menu.index);

app.get("/edit-menu", isAdmin, admin.editMenu);
app.post("/edit-menu", isAdmin, admin.addMenu, redirectBack);
app.get("/update-menu/:id", isAdmin, admin.updateMenu);
app.post("/update-menu/:id", isAdmin, admin.handleUpdateMenu, redirectBack);
app.get("/delete-menu/:id", isAdmin, admin.deleteMenu);

// faq
app.get("/faq", faq.index);

app.get("/edit-faq", isAdmin, admin.editFaq);
app.post("/edit-faq", isAdmin, admin.addFaq, redirectBack);
app.get("/update-faq/:id", isAdmin, admin.updateFaq);
app.post("/update-faq/:id", isAdmin, admin.handleUpdateFaq, redirectBack);
app.get("/delete-faq/:id", isAdmin, admin.deleteFaq);

// cart
app.get("/cart", cart.index);

app.post("/cart", cart.addCustomer, redirectBack);
app.get("/addcart", cart.addCart);
app.get("/delete-cart/:id", cart.deleteCart);
app.post("/update-cart/:id", cart.updateCart);

app.listen(port, () => {
  console.log(`You are now connected to port ${port}`);
});
