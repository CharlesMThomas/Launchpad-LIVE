const router = require('express').Router()
const {Key, User} = require('../db/models')
const fs = require('fs')
const {bucket} = require('../index')
const Lame = require("node-lame").Lame;
module.exports = router

router.get('/:keyboardId', (req, res, next) => {
  Key.findAll({where: {keyboardId: req.params.keyboardId}})
    .then(keys => res.json(keys));
})

router.post('/', (req, res, next) => {
  fs.writeFile(__dirname + `/tmp/${req.headers.name}`, req.body, function(err) {

    if(err) console.log(err)
    else {
      bucket
      .upload(__dirname + `/tmp/${req.headers.name}`,{
        metadata: {
          metadata: {
            firebaseStorageDownloadTokens: process.env.ACCESS_TOKEN
          }
        }
      })
        .then(result => {
          // console.log('Result: ', result[0]);
          console.log('File Uploaded!');
          const audioURL = `https://firebasestorage.googleapis.com/v0/b/fsa-stackathon.appspot.com/o/${req.headers.name}?alt=media&token=4148436AE4D4AAD5A6A02DB2E79C01FAC1B0DCF5E0160A58366ADCE568606481`

          Key.create({name: req.headers.name, audioURL, keyboardId: req.headers.keyboardid})
            .then(key => {
              res.send(key);
            })
            .catch(next)
        })
        .catch(err => {
          console.error('ERROR:', err);
        });
    }
  })

})

router.put('/:id', (req, res, next) => {
  Key.update(req.body, { where: {id: req.params.id}})
    .then(key => res.json(key))
    .catch(next)
})

router.delete('/:id', (req, res, next) => {
  Key.destroy({where: {id: req.params.id}})
    .then(() => res.sendStatus(200))
    .catch(next);
})
