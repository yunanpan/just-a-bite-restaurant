const db = require('../models')

const { Menu } = db

const menu = {
  index: (req, res) => {
    Menu.findAll()
      .then((menus) => {
        res.render('menu', {
          menus,
          isAdd: false,
        })
      })
  },
}

module.exports = menu
