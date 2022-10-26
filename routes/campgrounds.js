const express = require('express');
const { isLoggedIn, isOwner, validateCampground } = require('../middleware');
const wrapAsync = require('../utils/wrapAsync');
const campgrounds = require('../controllers/campgrounds');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage })
// const upload = multer({ dest: 'uploads/' })


router.route('/')
  .get(wrapAsync(campgrounds.index))
  .post(isLoggedIn, upload.array('image'), validateCampground, wrapAsync(campgrounds.createCampground))
// .post(upload.array('image'), (req, res) => {
//   console.log(req.body, req.files)
//   res.json(req.files)
// })

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(campgrounds.renderEditForm))

router.route('/:id')
  .get(wrapAsync(campgrounds.showCampground))
  .put(isLoggedIn, isOwner, upload.array('image'), validateCampground, wrapAsync(campgrounds.updateCampground))
  .delete(isLoggedIn, isOwner, wrapAsync(campgrounds.deleteCampground))


module.exports = router;