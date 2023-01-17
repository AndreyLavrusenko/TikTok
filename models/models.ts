export interface IVideo {
    caption: string,
    comments: {
        comment: string,
        _key: string,
        postedBy: {
            _ref: string
        }
    }[],
    likes: {
        postedBy: {
            _id: string,
            image: string,
            userName: string,
        }
    }[],
    postedBy: {
        _id: string,
        image: string,
        userName: string,
    },
    userId: string,
    video: {
        asset: {
            _id: string,
            url: string
        }
    },
    _id: string
}


export interface IUser {
    _id: string,
    _type: string,
    userName: string,
    image: string
}