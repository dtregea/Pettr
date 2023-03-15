const Post = require("../models/postModel");
const User = require("../models/userModel");
const mongoose = require('mongoose');

class aggregationBuilder {
    aggregate;
    constructor() {
        this.aggregate = [];
    }

    contains(fieldName, userId, arrayName) {
        this.aggregate.push({
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
        }
        );
        return this;
    }

    addCountField(fieldName, arrayNameExpression) {
        this.aggregate.push({
            $addFields: {
                [fieldName]: {
                    $size: arrayNameExpression,
                },
            },
        });
        return this;
    }

    addField(fieldName, expression) {
        this.aggregate.push({
            $addFields: {
                [fieldName]: expression,
            },
        });
        return this;
    }

    unwind(path, preserveNullAndEmptyArrays) {
        this.aggregate.push({
            $unwind: {
                path,
                preserveNullAndEmptyArrays,
            },
        });
        return this;
    }

    /**
     * 
     * @param sortBy Field to sort by in descending order. 
     *        -$lastInteraction to sort by repost time by
     *         users provided in followedIds.
     *        -$createdAt to sort by post creation time.
     */
    sortNewest(field) {
        this.aggregate.push({
            $sort: { [field]: -1 }
        });
        return this;
    }

    paginate(cursorDate, sortBy, limit = 15) {
        if (cursorDate) {
            this.push({
                $match: {
                    [sortBy]: { $lt: new Date(cursorDate) },
                },
            });
        };
        this.limit(limit);
        return this;
    }

    limit(limit) {
        this.aggregate.push({
            $limit: limit
        });
        return this;
    }

    cleanUser(field) {
        this.aggregate.push(
            field ? {
                $project: { [field]: this.USER_EXCLUSIONS }
            } : { $project: this.USER_EXCLUSIONS }
        );
        return this;
    }

    cleanPost(field) {
        this.aggregate.push(
            field ? {
                $project: { [field]: this.POST_EXCLUSIONS }
            } : { $project: this.POST_EXCLUSIONS }
        );
        return this;
    }

    project(fields) {
        this.aggregate.push({
            $project: fields
        }
        );
        return this;
    }

    match(conditions) {
        this.aggregate.push({
            $match: conditions
        });
        return this;
    }

    lookup(from, localField, foreignField, as) {
        this.aggregate.push({
            $lookup: {
                from,
                localField,
                foreignField,
                as,
            },
        });
        return this;
    }

    specifyRepostedByFollowing(followedIds) {
        this.push({
            $addFields: {
                repostedBy: {
                    $filter: {
                        input: "$reposts",
                        as: "repost",
                        cond: { $in: ["$$repost.user", followedIds] },
                    },
                },
            },
        })
            // Get the most recent repost made by a followed user
            .push({
                $addFields: {
                    mostRecentRepost: {
                        $cond: [
                            {
                                $gt: [{ $size: "$repostedBy" }, 0],
                            },
                            { $last: "$repostedBy" },
                            [],
                        ],
                    },
                },
            })
            // Convert that most recent repost to a single repost object
            .unwind("$mostRecentRepost", true)
            // Determine whether the last interaction was the post creation
            // or a repost made by a followed user
            .push({
                $addFields: {
                    lastInteraction: {
                        $cond: [
                            {
                                $ifNull: ["$mostRecentRepost", false],
                            },
                            "$mostRecentRepost.createdAt",
                            "$createdAt",
                        ],
                    },
                },
            })
            // Convert most recent repost to the user
            .lookup("users", "mostRecentRepost.user", "_id", "mostRecentRepost")
            // Convert it from an array to a property
            .unwind("$mostRecentRepost", true)
            .addField("repostedBy", "$mostRecentRepost.displayname");

        return this;
    }

    push(aggregateField) {
        this.aggregate.push(aggregateField);
        return this;
    }

    async execPost() {
        return Post.aggregate(this.aggregate);
    }

    async execUser() {
        return User.aggregate(this.aggregate);
    }

    USER_EXCLUSIONS = {
        password: 0,
        updatedAt: 0,
        logins: 0,
        bookmarks: 0,
        __v: 0,
        refreshToken: 0,
    }

    USER_EXCLUSIONS_MONGOOSE =  "-password -logins -bookmarks -updatedAt -__v -refreshToken"

    POST_EXCLUSIONS = {
        mostRecentRepost: 0,
        reposts: 0,
        likes: 0,
        comments: 0,
        reposts: 0,
        quotes: 0,
        user: this.USER_EXCLUSIONS
    }
}

module.exports = aggregationBuilder;