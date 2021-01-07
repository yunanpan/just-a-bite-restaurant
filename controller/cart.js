const db = require('../models')

const { CustomerData } = db
const { Cart } = db
const { Menu } = db

const cart = {
  index: (req, res) => {
    // 看 session 有沒有從 menu 頁放的產品
    if (!req.session.products) {
      return res.render('cart', {
        isUpdated: false,
      })
    }
    // 有的話就先丟進 cart db 裡
    // 還要看 cart db 裡有沒有已經存在的單
    if (!req.session.cartId) {
      return Cart.create({
        product: JSON.stringify(req.session.products),
        price: JSON.stringify(req.session.prices),
        quanlity: JSON.stringify(req.session.quanlities),
      }).then((cart) => {
        // 為了之後辨別有沒有已經存在的單
        req.session.cartId = cart.id
        res.render('cart', {
          cart,
          isUpdated: false,
        })
      })
    }

    Cart.update({
      product: JSON.stringify(req.session.products),
      price: JSON.stringify(req.session.prices),
      quanlity: JSON.stringify(req.session.quanlities),
    }, {
      where: {
        id: req.session.cartId,
      },
    }).then(() => {
      Cart.findOne({
        where: {
          id: req.session.cartId,
        },
      }).then((cart) => {
        res.render('cart', {
          cart,
          isUpdated: false,
        })
      }).catch((err) => {
        console.log(err)
      })
    })
  },

  updateCart: (req, res) => {
    const index = req.params.id
    const { quanlity } = req.body

    req.session.quanlities.splice(index, 1, quanlity)

    Cart.update({
      quanlity: JSON.stringify(req.session.quanlities),
    }, {
      where: {
        id: req.session.cartId,
      },
    }).then(() => {
      Cart.findOne({
        where: {
          id: req.session.cartId,
        },
      }).then((cart) => {
        res.render('cart', {
          cart,
          isUpdated: true,
        })
      })
    })
  },

  addCart: (req, res) => { // 存 session
    // 判斷是不是同一個人訂購的
    if (!req.session.products) {
      req.session.products = []
      req.session.prices = []
      req.session.quanlities = []
    }

    // 判斷是不是有買過同一個品項
    // 品項一多可能會變很慢@@
    for (let i = 0; i < req.session.products.length; i += 1) {
      if (req.session.products[i] === req.query.product) {
        req.session.quanlities[i] += 1
        return Menu.findAll()
          .then((menus) => {
            res.render('menu', {
              menus,
              isAdd: true,
            })
          })
      }
    }

    req.session.products.push(req.query.product)
    req.session.prices.push(req.query.price)
    req.session.quanlities.push(1)

    Menu.findAll()
      .then((menus) => {
        res.render('menu', {
          menus,
          isAdd: true,
        })
      })
  },

  addCustomer: (req, res, next) => {
    const { name } = req.body
    const { phone } = req.body
    const { email } = req.body
    const { location } = req.body

    if (!name || !phone || !email || !location) {
      req.flash('errorMessage', '缺資料')
      return next()
    }

    // 購物車沒東西也不能送訂單
    if (!req.session.products || req.session.products.length === 0) {
      req.flash('errorMessage', '購物車是空的')
      return next()
    }

    CustomerData.create({
      name,
      phone,
      email,
      location,
    }).then((customer) => {
      Cart.update({
        CustomerDatumId: customer.id,
      }, {
        where: {
          id: req.session.cartId,
        },
      }).then(() => {
        console.log('done')
        CustomerData.findAll({
          where: {
            id: customer.id,
          },
          include: Cart,
        }).then((result) => {
          // 清空 session，避免再新增訂單改到原訂單
          req.session.products = null
          req.session.prices = null
          req.session.quanlities = null
          req.session.cartId = null

          res.render('cart_success', {
            result,
          })
        })
      })
    })
  },

  deleteCart: (req, res) => {
    const index = req.params.id
    req.session.products.splice(index, 1)
    req.session.prices.splice(index, 1)
    req.session.quanlities.splice(index, 1)

    res.redirect('/cart')
  },
}

module.exports = cart
