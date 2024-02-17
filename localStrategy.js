const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt');
const CadUser = require("./models/CadUser");
const CadEmpr = require("./models/CadEmpr");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      (email, password, done) => {
        CadUser.findOne({ where: { email: email } })
          .then((user) => {
            if (user) {
              bcrypt.compare(password, user.senha, (err, isValid) => {
                if (err) {
                  return done(err);
                }
                if (isValid) {
                  return done(null, user);
                } else {
                  return done(null, false);
                }
              });
            } else {
              CadEmpr.findOne({ where: { email: email } })
                .then((empresa) => {
                  if (empresa) {
                    bcrypt.compare(password, empresa.senha, (err, isValid) => {
                      if (err) {
                        return done(err);
                      }
                      if (isValid) {
                        return done(null, empresa);
                      } else {
                        return done(null, false);
                      }
                    });
                  } else {
                    return done(null, false);
                  }
                })
                .catch((err) => {
                  return done(err);
                });
            }
          })
          .catch((err) => {
            return done(err);
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.cpf);
  });

  passport.deserializeUser((id, done) => {
    CadUser.findOne({ cpf: id })
      .then((user) => {
        if (user) {
          done(null, user);
        } else {
          CadEmpr.findOne({ cnpj: id })
            .then((empresa) => {
              if (empresa) {
                done(null, empresa);
              } else {
                done(null, false);
              }
            })
            .catch((err) => {
              console.log(err);
              done(err, null);
            });
        }
      })
      .catch((err) => {
        console.log(err);
        done(err, null);
      });
  });
  
}