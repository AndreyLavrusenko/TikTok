import React, {useEffect, useRef, useState} from 'react'
import {GoVerified} from "react-icons/go";
import {MdOutlineCancel} from "react-icons/md";
import {BsFillPlayFill} from "react-icons/bs";
import {HiVolumeUp, HiVolumeOff} from "react-icons/hi";
import axios from "axios";
import {BASE_URL} from "../../utils";
import {IVideo} from "../../models/models";
import {useRouter} from "next/router";
import Link from "next/link";
import Image from "next/image";
import useAuthStore from "../../store/authStore";
import Comments from "../../components/Comments";
import LikeButton from "../../components/LikeButton";
import comments from "../../components/Comments";


interface IProps {
    postDetails: IVideo
}

const Detail = ({postDetails} : IProps) => {
    const [post, setPost] = useState(postDetails)
    const [playing, setPlaying] = useState(false)
    const [isVideoMuted, setIsVideoMuted] = useState(false)
    const [comment, setComment] = useState("")
    const [isPostingComment, setIsPostingComment] = useState(false)

    const router = useRouter()

    const videoRef= useRef<HTMLVideoElement>(null)

    const {userProfile}: any = useAuthStore()


    const onVideoClick = () => {
       if (playing) {
           videoRef?.current?.pause()
           setPlaying(false)
       } else {
           videoRef?.current?.play()
           setPlaying(true)
       }
    }

    useEffect(() => {
        if (videoRef?.current) {
            videoRef.current.muted = isVideoMuted
        }
    }, [isVideoMuted])


    const handleLike = async (like: boolean) => {
        if (userProfile) {
            const {data} = await axios.put(`${BASE_URL}/api/like`, {
                userId: userProfile._id,
                postId: post._id,
                like
            })

            setPost({ ...post, likes: data.likes })
        }
    }

    const addComment = async (e: any) => {
        e.preventDefault()

        if (userProfile && comment) {
            setIsPostingComment(true)

            const {data} = await axios.put(`${BASE_URL}/api/post/${post._id}`, {
                userId: userProfile._id,
                comment
            })

            setPost({...post, comments: data.comments})
            setComment('')
            setIsPostingComment(false)
        }
    }


    if (!postDetails) return null;


    return (
        <div className="flex w-full absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap">
            <div className="relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-black">
                <div className="absolute top-6 left-2 lg:left-6 flex gap-6 z-50">
                    <p className="cursor-pointer" onClick={() => router.back()}>
                        <MdOutlineCancel className={"text-white text-[35px]"} />
                    </p>
                </div>
                <div className="relative">
                    <div className={"lg:h-[100vh] h-[60vh]"}>
                        <video
                            ref={videoRef}
                            loop
                            onClick={onVideoClick}
                            src={post.video.asset.url}
                            className={"h-full cursor-pointer"}
                        />
                    </div>

                    <div className={"absolute top-[45%] left-[40%] cursor-pointer"}>
                        {!playing && (
                            <button onClick={onVideoClick}>
                                <BsFillPlayFill className="text-white text-6xl lg:text-8xl"/>
                            </button>
                        )}
                    </div>
                </div>

                <div className="absolute bottom-5 lg:bottom-10 right-5 lg:right-10 cursor-pointer">
                    {isVideoMuted ? (
                        <button>
                            <HiVolumeOff onClick={() => setIsVideoMuted(false)} className={"text-white text-2xl lg:text-4xl"}/>
                        </button>
                    ) : (
                        <button>
                            <HiVolumeUp onClick={() => setIsVideoMuted(true)} className={"text-white text-2xl lg:text-4xl"}/>
                        </button>
                    )}
                </div>
            </div>

            <div className="relative w-[1000px] md:w-[900px] lg:w-[700px]">
                <div className="lg:mt-20 mt-10">
                    <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded">
                        <div className={"ml-4 md:w-20 md:h-20 w-16 h-16"}>
                            <Link href={"/"}>
                                <>
                                    <Image
                                        width={62}
                                        height={62}
                                        className="rounded-full"
                                        src={post.postedBy.image}
                                        alt={"profile photo"}
                                    />
                                </>
                            </Link>
                        </div>
                        <div>
                            <Link href={'/'}>
                                <div className={"flex flex-col gap-2"}>
                                    <p className="flex gap-2 items-center md:text-md font-bold text-primary">
                                        {post.postedBy.userName} {``}
                                        <GoVerified
                                            className="text-blue-400 text-md"
                                        />
                                    </p>
                                    <p className="capitalize text-medium text-xs text-gray-500 hidden md:block">
                                        {post.postedBy.userName}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <p className={"px-10 text-lg text-gray-500"}>{post.caption}</p>

                    <div className="mt-10 px-10">
                        {userProfile && (
                            <LikeButton likes={post.likes} handleDislike={() => handleLike(false)} handleLike={() => handleLike(true)} />
                        )}
                    </div>

                    <Comments
                        comment={comment}
                        setComment={setComment}
                        addComment={addComment}
                        isPostingComment={isPostingComment}
                        // @ts-ignore
                        comments={post.comments}
                    />

                </div>
            </div>

        </div>
    )
}


interface IPropsSever  {
    params: {
        id: string
    }
}

export const getServerSideProps = async ({ params: {id}} : IPropsSever) => {
    const {data} = await axios.get(`${BASE_URL}/api/post/${id}`)

    return {
        props: {postDetails: data}
    }
}

export default Detail