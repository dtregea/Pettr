import { ObjectId } from "mongoose"

export interface AccessToken {
    UserInfo: {
        username: string
        _id: string,
      },
  }

  export interface RefreshToken {
    _id: ObjectId,
    username: string
  }