const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require('../models/persons_list');
const Ngo = require('../models/ngo_list');
const Donation = require('../models/donation');
const fileHelper = require('../util/file');

module.exports = {
  createUser: async function({userInput}, req) {
    // validation
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({message: 'E-mail is invalid.'});
    }
    if (validator.isEmpty(userInput.password)) {
      errors.push({message: 'E-mail is not valid.'});
    } else if (!validator.isLength(userInput.password, {min: 5})) {
      errors.push({message: 'Password too short'});
    }
    if (errors.length > 0) {
      const error = new Error('Invalid input');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    // logic
    const existingUser = await User.findOne({email: userInput.email});
    if (existingUser) {
      const error = new Error('User already Exist');
      error.statusCode = 422;
      throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw,
    });
    const createdUser = await user.save();
    return {...createdUser._doc, _id: createdUser._id.toString()};
  },

  login: async function({email, password}) {
    const user = await User.findOne({email: email});
    if (!user) {
      const error = new Error('User ot found');
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Password is incorrect');
      error.code = 401;
      throw error;
    }
    const token = jwt.sign({
      email: user.email,
      userId: user._id.toString(),
    }, 'SuperToken', {expiresIn: '1h'});
    return {token: token, userId: user._id.toString()};
  },

  createPeoples: async function({peopleInput}, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Not Authenticated');
    //   error.code = 401;
    //   throw error;
    // }
    const errors = [];
    if (validator.isEmpty(peopleInput.title)||
    !validator.isLength(peopleInput.title, {min: 5})) {
      errors.push({message: 'Title is invalid.'});
    }
    if (validator.isEmpty(peopleInput.cordinate)||
    !validator.isLength(peopleInput.cordinate, {min: 10})) {
      errors.push({message: 'cordinate is invalid.'});
    }
    if (errors.isLength>0) {
      const error = new Error('Invalid Input');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    // const user = await User.findById(req.userId);
    // if (!user) {
    //   const error = new Error('Invalid User');
    //   error.code = 401;
    //   throw error;
    // }
    const post = new Post({
      title: peopleInput.title,
      cordinate: peopleInput.cordinate,
      imageUrl: peopleInput.imageUrl.replace(/\\/g, '/'),
      // creator: user,
    });

    const createdPost = await post.save();
    // user.posts.push(createdPost);
    // await user.save();
    return {...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    };
  },

  createNgo: async function({ngoInput}, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Not Authenticated');
    //   error.code = 401;
    //   throw error;
    // }
    const errors = [];
    if (validator.isEmpty(ngoInput.name)||
    !validator.isLength(ngoInput.name, {min: 5})) {
      errors.push({message: 'Name is invalid.'});
    }
    if (validator.isEmpty(ngoInput.works)||
    !validator.isLength(ngoInput.works, {min: 10})) {
      errors.push({message: 'works is invalid.'});
    }
    if (errors.isLength>0) {
      const error = new Error('Invalid Input');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    // const user = await User.findById(req.userId);
    // if (!user) {
    //   const error = new Error('Invalid User');
    //   error.code = 401;
    //   throw error;
    // }
    const ngo = new Ngo({
      name: ngoInput.name,
      works: ngoInput.works,
      // place: ngoInput.imageUrl.replace(/\\/g, '/'),
      place: ngoInput.place,
      // creator: user,
    });

    const createdNgo = await ngo.save();
    // user.posts.push(createdPost);
    // await user.save();
    return {...createdNgo._doc,
      _id: createdNgo._id.toString(),
      createdAt: createdNgo.createdAt.toISOString(),
      updatedAt: createdNgo.updatedAt.toISOString(),
    };
  },

  createDonation: async function({donationInput}, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Not Authenticated');
    //   error.code = 401;
    //   throw error;
    // }
    const errors = [];
    if (validator.isEmpty(donationInput.item)||
    !validator.isLength(donationInput.item, {min: 5})) {
      errors.push({message: 'item is invalid.'});
    }
    // if (validator.isEmpty(donationInput.works)||
    // !validator.isLength(donationInput.works, {min: 10})) {
    //   errors.push({message: 'works is invalid.'});
    // }
    if (errors.isLength>0) {
      const error = new Error('Invalid Input');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    // const user = await User.findById(req.userId);
    // if (!user) {
    //   const error = new Error('Invalid User');
    //   error.code = 401;
    //   throw error;
    // }
    const donation = new Donation({
      item: donationInput.item,
      // works: donationInput.works,
      // place: ngoInput.imageUrl.replace(/\\/g, '/'),
      // place: donationInput.place,
      // creator: user,
    });

    const createdDonation = await donation.save();
    // user.posts.push(createdPost);
    // await user.save();
    return {...createdDonation._doc,
      _id: createdDonation._id.toString(),
      createdAt: createdDonation.createdAt.toISOString(),
      updatedAt: createdDonation.updatedAt.toISOString(),
    };
  },

  peoples: async function({page}, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Not Authenticated');
    //   error.code = 401;
    //   throw error;
    // }
    if (!page) {
      page = 1;
    }
    const perPage = 2;
    const totalPosts = await Post.find().countDocuments();
    const posts = await Post.find().populate()
    // const posts = await Post.find().populate('creator')
        .sort({createdAt: -1})
        .skip((page-1)*perPage)
        .limit(perPage);
    return {
      posts: posts.map((p) => {
        return {
          ...p._doc,
          _id: p._id.toString(),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        };
      }),
      totalPosts: totalPosts,
    };
  },

  ngo: async function(req) {
    // if (!req.isAuth) {
    //   const error = new Error('Not Authenticated');
    //   error.code = 401;
    //   throw error;
    // }
    // if (!page) {
    //   page = 1;
    // }
    // const perPage = 2;
    console.log('ok');
    const totalNgo = await Ngo.find().countDocuments();
    const ngos = await Ngo.find().populate();
    // const posts = await Post.find().populate('creator')
    // .sort({createdAt: -1})
    // .skip((page-1)*perPage)
    // .limit(perPage);
    console.log(ngos);
    return {
      ngos: ngos.map((p) => {
        return {
          ...p._doc,
          _id: p._id.toString(),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        };
      }),
      totalNgo: totalNgo,
    };
  },

  donations: async function( req) {
    // if (!req.isAuth) {
    //   const error = new Error('Not Authenticated');
    //   error.code = 401;
    //   throw error;
    // }
    // if (!page) {
    //   page = 1;
    // }
    // const perPage = 2;
    const totalDonations = await Donation.find().countDocuments();
    const donations = await Donation.find().populate();
    // const posts = await Post.find().populate('creator')
    // .sort({createdAt: -1});
    // .skip((page-1)*perPage)
    // .limit(perPage);
    console.log(donations);
    return {
      donations: donations.map((p) => {
        return {
          ...p._doc,
          _id: p._id.toString(),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        };
      }),
      totalDonations: totalDonations,
    };
  },

  post: async function({postId}, req) {
    // if (!req.isAuth) {
    //   const error = new Error('Not Authenticated');
    //   error.code = 401;
    //   throw error;
    // }

    // const post = await Post.findById(postId).populate('creator');
    const post = await Post.findById(postId).populate();
    if (!post) {
      const error = new Error('No post found');
      error.code = 404;
      throw error;
    }
    return {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  },

  updatePost: async function({postId, peopleInput}, req) {
    // check authentication
    if (!req.isAuth) {
      const error = new Error('Not Authenticated');
      error.code = 401;
      throw error;
    }
    // check validation
    const errors = [];
    if (validator.isEmpty(peopleInput.title)||
    !validator.isLength(peopleInput.title, {min: 5})) {
      errors.push({message: 'Title is invalid.'});
    }
    if (validator.isEmpty(peopleInput.content)||
    !validator.isLength(peopleInput.content, {min: 10})) {
      errors.push({message: 'Content is invalid.'});
    }
    if (errors.isLength>0) {
      const error = new Error('Invalid Input');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    // updation logic
    const post = await Post.findById(postId).populate('creator');
    if (!post) {
      const error = new Error('No post found');
      error.code = 404;
      throw error;
    }
    if (post.creator._id.toString() !== req.userId) {
      const error = new Error('Not Auithorization');
      error.statusCode = 403;
      throw error;
    }
    if (typeof peopleInput.imageUrl!=='undefined') {
      post.imageUrl = peopleInput.imageUrl;
    }
    post.title = peopleInput.title;
    post.content = peopleInput.content;
    const updatedPost = await post.save();
    return {
      ...updatedPost._doc,
      _id: updatedPost._id.toString(),
      createdAt: updatedPost.createdAt.toISOString(),
      updatedAt: updatedPost.updatedAt.toISOString(),
    };
  },
  deletePost: async function({postId}, req) {
    // check authentication
    if (!req.isAuth) {
      const error = new Error('Not Authenticated');
      error.code = 401;
      throw error;
    }
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('No post found');
      error.code = 404;
      throw error;
    }
    if (post.creator._id.toString() !== req.userId) {
      const error = new Error('Not Auithorization');
      error.statusCode = 403;
      throw error;
    }
    console.log('post.imageUrl');
    console.log(post.imageUrl);
    fileHelper.clearFile(post.imageUrl);
    await Post.findByIdAndRemove(postId, {useFindAndModify: false});
    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();
    console.log('post destoyed');
    return true;
  },

  user: async function(args, req) {
    if (!req.isAuth) {
      const error = new Error('Not Authenticated');
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('No User found');
      error.code = 404;
      throw error;
    }
    return {
      ...user._doc,
      _id: user._id.toString(),
    };
  },
  updateStatus: async function({status}, req) {
    if (!req.isAuth) {
      const error = new Error('Not Authenticated');
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('No User found');
      error.code = 404;
      throw error;
    }
    user.status = status;
    user.save();
    return {
      ...user._doc,
      _id: user._id.toString(),
    };
  },
};

