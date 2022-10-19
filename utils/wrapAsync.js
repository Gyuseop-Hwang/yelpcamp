module.exports = function (func) {
  return function (req, res, next) {
    // func(req, res).catch(err => next(err))
    func(req, res).catch(next)
  }
}