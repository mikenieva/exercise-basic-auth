const express = require("express");
const router = express.Router();

// MIDDLEWARE (CADENERO DE VERIFICACIÓN)
router.use((req, res, next) => {
  //EL USUARIO TIENE COOKIE DE VERIFICACIÓN E IDENTIDAD
  if(req.session.currentUser){
    // ENVÍALO A LA RUTA DE SECRET
    next()
  } else { // EN CASO DE QUE NO TENGA COOKIE, REDIRÍGELO AL LOGIN
    res.redirect("/login")
  }
})


// RUTAS
router.get("/", (req, res, next) => {
  res.render("home");
});

router.get("/secret", (req, res, next) => {
  res.render("secret")
})

module.exports = router;
