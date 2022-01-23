
const newUsuario = require('../model/usuarios.json');
const User = require('../model/Users');
const fs = require("fs");
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');



const controlador = {

    main: (req, res) => {
       res.render('home')
    },
   login: (req,res) => {
       res.render('login')
    },

    productCart: (req,res) => {
        res.render('productCart')
    },

    register: (req,res) => {
        res.render('register')
    },

    registerCreate: (req,res) => {
        const resultValidation = validationResult(req);
       
        
		if (resultValidation.errors.length > 0) {
			
            
             return res.render('register', {
				errors: resultValidation.mapped(),
				oldData: req.body
			});
        }
        let userInDB = User.findByField('email', req.body.email);

		if (userInDB) {
			return res.render('Register', {
				errors: {
					email: {
						msg: 'Este email ya está registrado'
					}
				},
				oldData: req.body
			});





		}
        let userToCreate = {
            ...req.body,
            password: bcryptjs.hashSync(req.body.password, 10),
            
            
        }
        let userCreated = User.create(userToCreate);
		return res.redirect('/login');
	},
    loginProcess: (req, res) => {
        let userToLogin=User.findByField( 'email', req.body.email);
        if(userToLogin){
            let isOKThePass= bcryptjs.compareSync(req.body.password, userToLogin.password)
             if( isOKThePass ){
                 req.session.userLogged = userToLogin;
                 res.redirect('/')
                 
             }else{
              res.render('login', {
                 errors: {
                     email:{
                         msg: 'Las credendicales son inválidas'
                     }
                 }
             });
            }
        } else {
         res.render('login', {
            errors: {
                email:{
                    msg: 'No se encuentra este mail en nuestra base de datos'
                }
            }
        });
    }
},
	
}

	


module.exports = controlador