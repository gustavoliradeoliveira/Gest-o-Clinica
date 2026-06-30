const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware.ensureAuthenticated);
router.get('/', noteController.list);
router.get('/new', noteController.showCreate);
router.post('/', noteController.create);
router.get('/:id/edit', noteController.showEdit);
router.put('/:id', noteController.update);
router.delete('/:id', noteController.delete);

module.exports = router;
