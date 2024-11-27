const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const Prato = require('../models/prato');

exports.getPratos = (req, res, next) => {
  
    Prato.find()
    .then(pratos => {
      res
        .status(200)
        .json({ message: 'Fetched posts successfully.', pratos: pratos });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPrato = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    // if (!req.file) {
    //     const error = new Error('No image provided.');
    //     error.statusCode = 422;
    //     throw error;
    // }
    //const imageUrl = req.file.path.replace(/\\/g, '/') | null;
    const title = req.body.title;
    const content = req.body.content;
    const category = req.body.category;
    let imageUrl = req.body.image;

    const prato = new Prato({
        title: title,
        content: content,
        imageUrl: imageUrl,
        category: category
      });
    prato
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Post created successfully!',
        post: result
      });
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    });
};

exports.getPrato = (req, res, next) => {
    const postId = req.params.postId;
    Prato.findById(postId)
      .then(post => {
        if (!post) {
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }
        res.status(200).json({ message: 'Post fetched.', post: post });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  };

exports.updatePost = (req, res, next) => {
    const postId = req.params.postId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error(
            'Validation failed, entered data is incorrect.'
        );
        error.statusCode = 422;
        throw error;
    }
    const title = req.body.title;
    const content = req.body.content;
    const category = req.body.category;
    let imageUrl = req.body.image;

    if (req.file) {
        /** REPLACE ALL '\' WITH '/' */
        imageUrl = req.file.path.replace(/\\/g, '/');
    }
    // if (!imageUrl) {
    //     const error = new Error('No file picked.');
    //     error.statusCode = 422;
    //     throw error;
    // }
    Prato.findById(postId)
        .then((post) => {
            if (!post) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }
            if (imageUrl !== post.imageUrl) {
                clearImage(post.imageUrl);
            }
            post.title = title;
            post.imageUrl = imageUrl;
            post.content = content;
            post.category = category;
            return post.save();
        })
        .then((result) => {
            res.status(200).json({ message: 'Post updated!', post: result });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    Prato.findById(postId)
        .then((post) => {
            if (!post) {
                const error = new Error('Could not find post.');
                error.statusCode = 404;
                throw error;
            }
            // Check logged in user
            clearImage(post.imageUrl);
            /** .findByIdAndRemove -- REMOVED */
            return Prato.findByIdAndDelete(postId);
        })
        .then((result) => {
            console.log(result);
            res.status(200).json({ message: 'Deleted post.' });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

const clearImage = (filePath) => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, (err) => console.log(err));
};
