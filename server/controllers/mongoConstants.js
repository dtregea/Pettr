const constants = {
  USER_EXCLUSIONS: {
    user: {
      password: 0,
      createdAt: 0,
      updatedAt: 0,
      logins: 0,
      bookmarks: 0,
      __v: 0,
    },
  },
  USER_HAS_LIKED: (req, arrayName) => {
    return {
      $addFields: {
        isLiked: {
          $cond: [
            {
              $in: [req.user._id, arrayName],
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
              $in: [req.user._id, arrayName],
            },
            true,
            false,
          ],
        },
      },
    };
  },
};

module.exports = constants;
