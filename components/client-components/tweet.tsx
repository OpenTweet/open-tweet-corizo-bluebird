"use client"

import { TweetType, likeTweet } from '@/lib/supabase/queries';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import { BiBarChart } from 'react-icons/bi';
import { BsThreeDots } from 'react-icons/bs';
import { FaRegBookmark, FaRegComment, FaRegHeart } from 'react-icons/fa';
import { FiShare } from 'react-icons/fi';
import { LuDot, LuRepeat2 } from 'react-icons/lu';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

dayjs.extend(relativeTime);

type TweetProps = {
    tweet: TweetType
}


export default function Tweet({ tweet }: TweetProps) {

    // const supabase = getSupabaseBrowserClient();
    const [supabase]: any = useState(() => getSupabaseBrowserClient());
    let [isLikePending, startTransition] = useTransition()

    return <div className='flex flex-row border-t-[0.5px] twitter-border-color'>
        <div className='userIcon p-3 pe-1'>
            <div className='w-10 h-10 bg-slate-400 rounded-full'></div>
        </div>
        <div className='postContent p-1 px-2 w-full'>
            <header className='flex flex-row w-full items-center justify-between'>
                <div className='flex flex-row items-center space-x-1'>
                    <p className='font-bold text-sm'>{tweet.profiles.full_name}</p>
                    <p className='text-sm text-gray-500'>@{tweet.profiles.username}</p>
                    <p className='text-sm text-gray-500'>
                        <LuDot />
                    </p>
                    <p className='text-sm text-gray-500'>{dayjs(tweet.created_at).fromNow()}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <p className='icon-hover text-gray-500 hover:bg-blue-500 hover:text-blue-500 hover:bg-opacity-25'>
                        <BsThreeDots size={17} />
                    </p>
                </div>
            </header>
            <div className='postText pe-2 space-y-3'>
                <p className='text-sm'>
                {tweet.text}
                </p>
                {/* Post Image */}
                <div className='bg-slate-400 aspect-square w-full h-96 rounded-xl'></div>
            </div>
            {/* Icons */}
            <div className='flex flex-row w-full justify-between space-x-1 py-3 text-slate-500'>
                <div className='icon-hover hover:bg-blue-500 hover:text-blue-500 hover:bg-opacity-25'>
                    <FaRegComment size={15} />
                    <p className='absolute ms-[20px]'>2</p>
                </div>
                <div className='icon-hover hover:bg-green-500 hover:text-green-500 hover:bg-opacity-25'>
                    <LuRepeat2 size={20} />
                    <p className='absolute ms-[23px]'>10</p>
                </div>
                <button
                    disabled={isLikePending}
                    onClick={() => {
                        supabase.auth.getSession().then((res: any) => {
                            if (res.data && res.data.session.user) {
                                const user = res.data.session.user;
                                startTransition(() => likeTweet({
                                    tweetId: tweet.id,
                                    userId: user.id
                                }))
                            } else {
                                toast.error('You need to be logged in to like a tweet')
                            }
                        })

                    }}
                    className='icon-hover hover:bg-pink-500 hover:text-pink-500 hover:bg-opacity-25'>
                    <FaRegHeart size={15} />
                    <p className='absolute ms-[20px]'>17</p>
                </button>
                <div className='icon-hover hover:bg-blue-500 hover:text-blue-500 hover:bg-opacity-25'>
                    <BiBarChart size={20} />
                    <p className='absolute ms-[23px]'>188K</p>
                </div>
                <div className='flex flex-row '>
                    <div className='icon-hover hover:bg-blue-500 hover:text-blue-500 hover:bg-opacity-25'>
                        <FaRegBookmark size={15} />
                    </div>
                    <div className='icon-hover hover:bg-blue-500 hover:text-blue-500 hover:bg-opacity-25'>
                        <FiShare size={15} />
                    </div>
                </div>
            </div>
        </div>
    </div>
}