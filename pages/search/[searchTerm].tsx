import axios from "axios";
import {BASE_URL} from "../../utils";
import {IUser, IVideo} from "../../models/models";
import React, {useState} from "react";
import NoResults from "../../components/NoResults";
import {useRouter} from "next/router";
import VideoCard from "../../components/VideoCard";
import useAuthStore from "../../store/authStore";
import Image from "next/image";
import {GoVerified} from "react-icons/go";
import Link from "next/link";


interface IProps {
    videos: IVideo[]
}

const Search = ({videos}: IProps) => {
    const [isAccounts, setIsAccounts] = useState(false)
    const router = useRouter()
    const {searchTerm}: any = router.query
    const {allUsers} = useAuthStore()


    const accounts = isAccounts ? 'border-b-2 border-black' : 'text-gray-400'
    const video = !isAccounts ? 'border-b-2 border-black' : 'text-gray-400'

    const searchedAccounts = allUsers.filter((user: IUser) => user.userName.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <div className="w-full">
            <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full">
                <p className={`text-xl font-semibold cursor-pointer mt-2 ${accounts}`} onClick={() => setIsAccounts(true)}>Accounts</p>
                <p className={`text-xl font-semibold cursor-pointer mt-2 ${video}`} onClick={() => setIsAccounts(false)}>Videos</p>
            </div>
            {isAccounts ? (
                <div className="md:mt-16">
                    {searchedAccounts.length > 0 ? (
                        searchedAccounts.map((user: IUser, index: number) => (
                            <Link href={`/profile/${user._id}`} key={index}>
                                <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded border-b-2 border-gray-200">
                                    <div>
                                        <Image
                                            src={user.image}
                                            width={50}
                                            height={50}
                                            className={"rounded-full"}
                                            alt={"user profile"}
                                        />
                                    </div>

                                    <div className="hidden xl:block ">
                                        <p className={"flex gap-1 items-center text-md font-bold text-primary lowercase"}>
                                            {user.userName.replaceAll(' ', '')}
                                            <GoVerified className="text-blue-400" />
                                        </p>
                                        <p className={"capitalize text-gray-400 text-xs"}>
                                            {user.userName}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <NoResults text={`No accounts results for ${searchTerm}`} />
                    )}
                </div>
            ) : (
                <div className={"md:mt-16 flex flex-wrap gap-6 md:justify-start"}>
                    {videos.length ? (
                        videos.map((video: IVideo, index: number) => (
                            <VideoCard post={video} key={index} />
                        ))
                    ) : (
                        <NoResults text={`No video results for ${searchTerm}`} />
                    )}
                </div>
            )}
        </div>
    )
}


export const getServerSideProps = async ({params: {searchTerm}} : {params: {searchTerm: string}}) => {
    const res = await axios.get(`${BASE_URL}/api/search/${searchTerm}`)

    return {
        props: {videos: res.data}
    }
}

export default Search