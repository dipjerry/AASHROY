const {validationResult} = require('express-validator/check');
// const Peoples = require('../models/persons_list');
// const User = require('../models/user');
const Donations = require('../models/donation');
// const fileHelper = require('../util/file');

// async await method
exports.getDonations = async (req, res, next) => {
  const currentPage = +req.query.page || 1;
  const perPage = 2;
  try {
    const totalItems = await Donations.find().countDocuments();
    const posts = await Donations.find().populate('donator')
        .skip((currentPage-1)*perPage)
        .limit(perPage);
    res.status(200).json({
      posts: posts,
      message: 'Posts Fetched Successfully',
      totalItems: totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getDonation = (req, res, next) => {
  const postId = req.params.postId;
  Donations.findById(postId)
      .then((post)=>{
        if (!post) {
          const error = new Error('Could not find post');
          error.statusCode = 404;
          throw error;
        }
        res.status(200).json({
          post: post,
          message: 'Donations fetched Success!!',
        });
      })
      .catch((err)=>{
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
};

// upload a post
exports.postDonations = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed , entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const item = req.body.item;
  //   const cordinate = req.body.cordinate;
  //   let creator;
  const donations = new Donations({
    item: item,

  });
  donations.save()
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
          post: donations,
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
