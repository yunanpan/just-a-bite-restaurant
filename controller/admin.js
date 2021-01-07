/* eslint import/no-unresolved: 0 */
const bcrypt = require('bcrypt')
const db = require('../models')

const Admin = db.prizeAdmin
const { Prize } = db
const { Menu } = db
const Faq = db.faq

const admin = {
  login: (req, res) => {
    // 如果非登入狀態就要去 /login 登入
    if (!req.session.username) {
      return res.render('login')
    }
    // 已經是登入狀態就去 /admin 後台
    // 後台會有編輯 prize 或是編輯 menu faq 的選項
    res.render('admin')
  },

  handleLogin: (req, res, next) => {
    const { username, password } = req.body
    // 先檢查資料是否齊全
    if (!username || !password) {
      req.flash('errorMessage', '缺少必要欄位')
      return next()
    }

    Admin.findOne({
      where: {
        name: username,
      },
    }).then((user) => {
      if (!user) {
        req.flash('errorMessage', '使用者不存在')
        return next()
      }
      bcrypt.compare(password, user.password, (err, isSuccess) => {
        if (err || !isSuccess) {
          req.flash('errorMessage', '密碼錯誤')
          return next()
        }
        req.session.username = user.name
        res.redirect('/admin')
      })
    }).catch((err) => {
      req.flash('errorMessage', err.toString())
      return next()
    })
  },

  logout: (req, res) => {
    req.session.username = null
    return res.redirect('/')
  },

  // prize

  prize: (req, res) => {
    Prize.findAll({
      order: [
        ['probability', 'ASC'],
      ],
    }).then((prizes) => {
      res.render('admin_prize', {
        prizes,
      })
    })
  },

  editPrize: (req, res) => {
    res.render('edit_prize')
  },

  addPrize: (req, res, next) => {
    const { name } = req.body
    const { imgLink } = req.body
    const { description } = req.body
    const { probability } = req.body

    // 先檢查資料
    if (!name || !imgLink || !description || !probability) {
      req.flash('errorMessage', '缺資料')
      return next()
    }

    Prize.create({
      name,
      imgLink,
      description,
      probability,
    }).then(() => {
      res.redirect('/admin-prize')
    })
  },

  deletePrize: (req, res) => {
    const { id } = req.params
    Prize.destroy({
      where: {
        id,
      },
    })
    res.redirect('/admin-prize')
  },

  updatePrize: (req, res) => {
    const { id } = req.params
    Prize.findOne({
      where: {
        id,
      },
    }).then((prize) => {
      res.render('update_prize', {
        prize,
      })
    })
  },

  handleUpdatePrize: (req, res, next) => {
    const { id } = req.params
    const { name } = req.body
    const { imgLink } = req.body
    const { description } = req.body
    const { probability } = req.body

    // 先檢查資料
    if (!name || !imgLink || !description || !probability) {
      req.flash('errorMessage', '缺資料')
      return next()
    }

    Prize.update({
      name,
      imgLink,
      description,
      probability,
    }, {
      where: {
        id,
      },
    }).then(() => {
      res.redirect('/admin-prize')
    }).catch((err) => {
      req.flash('errorMessage', err.toString())
      return next()
    })
  },

  // menu

  menu: (req, res) => {
    Menu.findAll({
      order: [
        ['createdAt', 'DESC'],
      ],
    }).then((menus) => {
      res.render('admin_menu', {
        menus,
      })
    })
  },

  editMenu: (req, res) => {
    res.render('edit_menu')
  },

  addMenu: (req, res, next) => {
    const { mealname } = req.body
    const { mealimg } = req.body
    const { price } = req.body

    // 先檢查資料
    if (!mealname || !mealimg || !price) {
      req.flash('errorMessage', '缺資料')
      return next()
    }

    Menu.create({
      mealname,
      mealimg,
      price,
    }).then(() => {
      res.redirect('/admin-menu')
    })
  },

  updateMenu: (req, res) => {
    const { id } = req.params
    Menu.findOne({
      where: {
        id,
      },
    }).then((menu) => {
      res.render('update_menu', {
        menu,
      })
    })
  },

  handleUpdateMenu: (req, res, next) => {
    const { id } = req.params
    const { mealname } = req.body
    const { mealimg } = req.body
    const { price } = req.body

    // 先檢查資料
    if (!mealname || !mealimg || !price) {
      req.flash('errorMessage', '缺資料')
      return next()
    }

    Menu.update({
      mealname,
      mealimg,
      price,
    }, {
      where: {
        id,
      },
    }).then(() => {
      res.redirect('/admin-menu')
    }).catch((err) => {
      req.flash('errorMessage', err.toString())
      return next()
    })
  },

  deleteMenu: (req, res) => {
    const { id } = req.params
    Menu.destroy({
      where: {
        id,
      },
    })
    res.redirect('/admin-menu')
  },

  faq: (req, res) => {
    Faq.findAll({
      order: [
        ['order', 'ASC'],
      ],
    }).then((faqs) => {
      res.render('admin_faq', {
        faqs,
      })
    })
  },

  editFaq: (req, res) => {
    res.render('edit_faq')
  },

  addFaq: (req, res, next) => {
    const { title } = req.body
    const { content } = req.body
    const { order } = req.body

    // 先檢查資料
    if (!title || !content || !order) {
      req.flash('errorMessage', '缺資料')
      return next()
    }

    Faq.create({
      title,
      content,
      order,
    }).then(() => {
      res.redirect('/admin-faq')
    })
  },

  updateFaq: (req, res) => {
    const { id } = req.params
    Faq.findOne({
      where: {
        id,
      },
    }).then((faq) => {
      res.render('update_faq', {
        faq,
      })
    })
  },

  handleUpdateFaq: (req, res, next) => {
    const { id } = req.params
    const { title } = req.body
    const { content } = req.body
    const { order } = req.body

    // 先檢查資料
    if (!title || !content || !order) {
      req.flash('errorMessage', '缺資料')
      return next()
    }

    // 先檢查 order 是否有重複的情形
    Faq.findOne({
      where: {
        order,
      },
    }).then((faq) => {
      if (faq !== null) {
        req.flash('errorMessage', '該筆順序已存在')
        return next()
      }
      // order 沒有重複再更新資料庫
      Faq.update({
        title,
        content,
        order,
      }, {
        where: {
          id,
        },
      }).then(() => {
        res.redirect('/admin-faq')
      }).catch((err) => {
        req.flash('errorMessage', err.toString())
        return next()
      })
    })
  },

  deleteFaq: (req, res) => {
    const { id } = req.params
    Faq.destroy({
      where: {
        id,
      },
    })
    res.redirect('/admin-faq')
  },
}

module.exports = admin
