import Post from "../models/postModel";
import User from "../models/userModel";
import mongoose from 'mongoose';

class aggregationBuilder {
    aggregate: any[];
    constructor() {
        this.aggregate = [];
    }

    contains(fieldName: string, userId: string, arrayName: string) {
        this.aggregate.push({
            $addFields: {
                [fieldName]: {
                    $cond: [
                        {
                            $in: [new mongoose.Types.ObjectId(userId), arrayName],
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

    addCountField(fieldName: string, arrayNameExpression: any) {
        this.aggregate.push({
            $addFields: {
                [fieldName]: {
                    $size: arrayNameExpression,
                },
            },
        });
        return this;
    }

    addField(fieldName: string, expression: any) {
        this.aggregate.push({
            $addFields: {
                [fieldName]: expression,
            },
        });
        return this;
    }

    unwind(path: string, preserveNullAndEmptyArrays: boolean) {
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
    sortNewest(field: string) {
        this.aggregate.push({
            $sort: { [field]: -1 }
        });
        return this;
    }

    paginate(cursorDate: string, sortBy: string, limit = 15) {
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

    limit(limit: number) {
        this.aggregate.push({
            $limit: limit
        });
        return this;
    }

    cleanUser(field: string | null) {
        this.aggregate.push(
            field ? {
                $project: { [field]: this.USER_EXCLUSIONS }
            } : { $project: this.USER_EXCLUSIONS }
        );
        return this;
    }

    cleanPost(field: string | null) {
        this.aggregate.push(
            field ? {
                $project: { [field]: this.POST_EXCLUSIONS }
            } : { $project: this.POST_EXCLUSIONS }
        );
        return this;
    }

    project(fields: any) {
        this.aggregate.push({
            $project: fields
        }
        );
        return this;
    }

    match(conditions: any) {
        this.aggregate.push({
            $match: conditions
        });
        return this;
    }

    lookup(from: string, localField: string, foreignField: string, as: string) {
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

    specifyRepostedByFollowing(followedIds: any) {
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

    push(aggregateField: any) {
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

    USER_EXCLUSIONS_MONGOOSE = "-password -logins -bookmarks -updatedAt -__v -refreshToken"

    POST_EXCLUSIONS = {
        mostRecentRepost: 0,
        reposts: 0,
        likes: 0,
        comments: 0,
        quotes: 0,
        user: this.USER_EXCLUSIONS
    }
}

export default aggregationBuilder;