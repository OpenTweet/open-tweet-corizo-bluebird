"use client"

import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { likeTweet, unlikeTweet } from '@/lib/supabase/mutation';
import { useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import { AiFillHeart } from 'react-icons/ai';
import { FaRegHeart } from 'react-icons/fa';

type TweetLikeProps = {
    tweetId: string,
    likesCount: number | null,
    isLikedByUser: boolean | { error: { message: string } }
}


export default function LikeButton({ tweetId, likesCount, isLikedByUser }: TweetLikeProps) {
    const [supabase]: any = useState(() => getSupabaseBrowserClient());
    let [isLikePending, startTransition] = useTransition()

    return <div className='flex items-center justify-center'>
        <button
            disabled={isLikePending}
            onClick={() => {
                supabase.auth.getSession().then((res: any) => {
                    if (res.data && res.data.session.user) {
                        const user = res.data.session.user;
                        startTransition(() => {
                            isLikedByUser ?
                                unlikeTweet({
                                    tweetId: tweetId,
                                    userId: user.id
                                }) :
                                likeTweet({
                                    tweetId: tweetId,
                                    userId: user.id
                                })
                        })
                    } else {
                        toast.error('You need to be logged in to like a tweet')
                    }
                })

            }}
            className={`icon-hover ${isLikedByUser && 'text-pink-500'} hover:bg-pink-500 hover:text-pink-500 hover:bg-opacity-25 h-fit`}>

            {isLikedByUser ? <AiFillHeart size={15} /> : <FaRegHeart size={15} />}
            <p className='absolute ms-[20px]'>{likesCount ?? 0}</p>
        </button>
    </div>
}