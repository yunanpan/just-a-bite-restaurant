const main = {
  index: (req, res) => {
    res.render('index.ejs', {
      req,
    })
  },

  faq: (req, res) => {
    res.render('faq.ejs')
  },
}

module.exports = main
