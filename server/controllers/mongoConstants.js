const { default: mongoose } = require("mongoose");
const constants = {
  USER_EXCLUSIONS: {
    user: {
      password: 0,
      createdAt: 0,
      updatedAt: 0,
      logins: 0,
      bookmarks: 0,
      __v: 0,
      refreshToken: 0,
    },
  },
  USER_HAS_LIKED: (req, arrayName) => {
    return {
      $addFields: {
        isLiked: {
          $cond: [
            {
              $in: [mongoose.Types.ObjectId(req.user), arrayName],
            },
            true,
            false,
          ],
        },
      },
    };
  },
  USER_HAS_REPOSTED: (req, arrayName) => {
    return {
      $addFields: {
        isReposted: {
          $cond: [
            {
              $in: [mongoose.Types.ObjectId(req.user), arrayName],
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
  PAGINATE: (page, isoDate) => {
    return [
      {
        $match: {
          createdAt: { $lte: new Date(isoDate) },
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: (page - 1) * 15 }, { $limit: 15 }],
        },
      },
    ];
  },
};

module.exports = constants;
