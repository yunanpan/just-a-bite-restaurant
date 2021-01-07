const db = require('../models')

const Faq = db.faq

const faq = {
  index: (req, res) => {
    Faq.findAll()
      .then((faqs) => {
        res.render('faq', {
          faqs,
        })
      })
  },
}

module.exports = faq
