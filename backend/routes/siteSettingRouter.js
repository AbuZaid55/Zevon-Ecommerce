const router = require("express").Router()
const {siteInformation, getSiteSettings} = require('../controller/siteSettingController')
const auth = require('../auth/auth')
const upload = require('../utils/uploadFile')

router.post('/siteSetting',auth,upload.fields([{name:"banner"}]),siteInformation)
router.get('/siteSetting',auth,getSiteSettings)

module.exports = router