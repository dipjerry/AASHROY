const {validationResult} = require('express-validator/check');
const NGO = require('../models/ngo_list');
// const User = require('../models/user');
// const fileHelper = require('../util/file');

exports.postNgo = (req, res, next) => {
//   const image = req.file;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed , entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  //   if (!image) {
  //     const error = new Error('No image provided!!!');
  //     error.statusCode = 422;
  //     throw error;
  //   }
  //   const imageUrl = image.path.replace(/\\/g, '/');
  const name = req.body.name;
  const works = req.body.works;
  const place = req.body.place;
  //   let creator;
  const ngo = new NGO({
    name: name,
    works: works,
    place: place,
  });
  ngo.save()
  //   .then(
  //       (result)=>{
  //         return User.findById(req.userId);
  //       })
  //   .then((user)=>{
  //     // creator = user;
  //     user.posts.push(post);
  //     return user.save();
  //   })

      .then((result)=>{
        res.status(201).json({
          message: 'post created succesfull!!!!',
          post: ngo,
          //   creator: {
          //     _id: creator._id,
          //     name: creator.name,
          //   },
        });
      })
      .catch((err)=>{
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
};
