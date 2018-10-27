const express = require('express');
const router = express.Router();
const ctrlCats = require('../controllers/cats');
const userData = require('../controllers/userData');
var passport = require('passport');

const auth = passport.authenticate('jwt', {
  session: false
});


router.get('/userData', auth, userData.getInfo);

router.get('/', auth, ctrlCats.getCats);

router.get('/:id', auth, ctrlCats.getCat);

router.post('/', auth, ctrlCats.addCat);

router.put('/:id', auth, ctrlCats.editCat);

router.delete('/:id', auth, ctrlCats.deleteCat);

module.exports = router;