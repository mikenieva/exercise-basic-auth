const express = require('express');
const router  = express.Router();


// User model
const User           = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;


/******************** 
REGISTRO DE USUARIO 
********************/

// GET Sign Up - Aquí obtenemos la vista
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// POST SIGN UP - Aquí enviamos el formulario
router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  // BUSCAMOS EL USUARIO EN MONGODB
  User.findOne({ "username": username })
  .then(user => {
    // SI EL USUARIO YA EXISTE
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username already exists!"
      });
      return;
    }
    
    // SI EL USUARIO NO EXISTE EN BASE DE DATOS...
    // GENERAMOS LA ENCRIPTACIÓN
    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    
    // CREAMOS UN USUARIO
    User.create({
      username,
      password: hashPass
    })
    // SI TODO SALIÓ CORRECTAMENTE, REDIRIGIMOS
    .then(() => {
      res.redirect("/");
    })
    // SI EN EL CAMINO HUBO UN ERROR, MOSTRARLO EN CONSOLA
    .catch(error => {
      console.log(error);
    })
  })
  // SI LA LLAMADA AL SERVIDOR FALLÓ, EJECUTA ESTO
  .catch(error => {
    next(error)
  })
});


router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {

  // Los datos del formulario
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  // SI EL USUARIO NO ESCRIBIÓ NADA, GENERA UN ERROR DE QUE ESCRIBA ALGO
  if (theUsername === "" || thePassword === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

// BUSCAMOS EL USUARIO DENTRO DE LA BASE DE DATOS
  User.findOne({"username": theUsername})
  // SI TODO BIEN, SI ENCONTRAMOS UN USUARIO EN BASE DE DATOS
  .then((user) => {
    // SI EL USUARIO NO EXISTE. NO ENCONTRÓ UN USUARIO
    if(!user){
      res.render("auth/login", {
        errorMessage: "El usuario no existe."
      });
      return;
    }

    // SI SÍ ENCONTRAMOS UN USUARIO
       /* ESTE IF ME TIENE QUE DAR UN FALLSE O UN TRUE */
    if(bcrypt.compareSync(thePassword, user.password)){
        // GENÉRAME LA COOKIE E INSERTALA EN MI NAVEGADOR
        req.session.currentUser =  user
        res.redirect("/secret")
    } else { // SI EL USUARIO ESCRIBIÓ MAL SU PASSWORD O NO ES EL MISMO QUE EL DE BASE DE DATOS
        res.render("auth/login", {
          errorMessage: "Password equivocado"
        })
    }
  })
  // SI NO PUDO HACER UNA ACCESO A BASE DE DATOS, QUE MANDE UN ERROR ESTABLECIDO POR LA BASE DE DATOS
  .catch(error => {
    next(error)
  })






})


module.exports = router;