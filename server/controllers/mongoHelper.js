const mongoose = require('mongoose');

const USER_EXCLUSIONS = {
  password: 0,
  updatedAt: 0,
  logins: 0,
  bookmarks: 0,
  __v: 0,
  refreshToken: 0,
}

const mongoHelper = {
  POST_EXCLUSIONS: {
    mostRecentRepost: 0,
    reposts: 0,
    likes: 0,
    comments: 0,
    reposts: 0,
    quotes: 0,
    user: USER_EXCLUSIONS
  },
  USER_EXCLUSIONS,
  USER_EXCLUSIONS_MONGOOSE: "-password -logins -bookmarks -updatedAt -__v -refreshToken",

  CONTAINS: (fieldName, userId, arrayName) => {
    return {
      $addFields: {
        [fieldName]: {
          $cond: [
            {
              $in: [mongoose.Types.ObjectId(userId), arrayName],
            },
            true,
            false,
          ],
        },
      },
    };
  },
  ADD_COUNT_FIELD: (fieldName, arrayNameExpression) => {
    return {
      $addFields: {
        [fieldName]: {
          $size: arrayNameExpression,
        },
      },
    };
  },
  ADD_FIELD: (fieldName, expression) => {
    return {
      $addFields: {
        [fieldName]: expression,
      },
    };
  },

  LOOKUP: (from, localField, foreignField, as) => {
    return {
      $lookup: {
        from,
        localField,
        foreignField,
        as,
      },
    };
  },
  UNWIND: (path, preserveNullAndEmptyArrays) => {
    return {
      $unwind: {
        path,
        preserveNullAndEmptyArrays,
      },
    };
  },
  SORT_BY_NEWEST: (field) => {
    return {
      $sort: { [field]: -1 }
    };
  }
  ,
  PAGINATE: (cursorDate, sortBy) => {
    return {
      $match: {
        [sortBy]: { $lt: new Date(cursorDate) },
      },
    };
  },
  getObjectID
};

function getObjectID(userId) {
  return mongoose.Types.ObjectId(userId);
}

module.exports = mongoHelper;
