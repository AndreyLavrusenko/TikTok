import axios from "axios";
import {IVideo} from "../models/models";
import NoResults from "../components/NoResults";
import VideoCard from "../components/VideoCard";
import {BASE_URL} from "../utils";


interface IProps {
    videos: IVideo[]
}

export default function Home({videos}: IProps) {
    return (
        <div className={"flex flex-col gap-10 videos h-full"}>
            {videos.length ? (
                videos.map((video: IVideo) => (
                   <VideoCard post={video} key={video._id} />
                ))
            ) : (
                <NoResults text={"No Videos"} />
            )}
        </div>
    )
}


export const getServerSideProps = async ({query: {topic}}: {query: {topic: string}}) => {
    let response;
    if (topic) {
        response = await axios.get(`${BASE_URL}/api/post/discover/${topic}`)
    } else {
        response = await axios.get(`${BASE_URL}/api/post/post`)
    }

    return {
        props: {
            videos: response.data
        }
    }
}
