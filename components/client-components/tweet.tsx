import { TweetType, getLikesCount, isLiked } from '@/lib/supabase/queries';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { BiBarChart } from 'react-icons/bi';
import { BsThreeDots } from 'react-icons/bs';
import { FaRegBookmark, FaRegComment } from 'react-icons/fa';
import { FiShare } from 'react-icons/fi';
import { LuDot, LuRepeat2 } from 'react-icons/lu';
import LikeButton from './like-button';
import createSupabaseServerClient from '@/lib/supabase/server';
import getUserSession from '@/lib/getUserSession';
import { Profile, Tweet } from '@/lib/db/schema';
import ProfileAvatar from './profile-avatar';
import ReplyDialog from './reply-dialog';

dayjs.extend(relativeTime);

type TweetProps = {
    tweet: {
        profile: Profile;
        tweet: Tweet;
    };
    currentUserId?: string;
    likesCount: number;
    hasLiked: boolean;
    repliesCount: number;
};



export default async function Tweet({
    tweet,
    likesCount,
    hasLiked,
    repliesCount,
}: TweetProps) {

    return <div className='flex flex-row border-t-[0.5px] twitter-border-color'>
        <div className='userIcon p-3 pe-1'>
            <div className='w-10 h-10 bg-slate-400 rounded-full'>
                <ProfileAvatar
                    username={tweet.profile.username}
                    avatarUrl={tweet.profile.avatarUrl}
                    isOnTimeline={true}
                />
            </div>
        </div>
        <div className='postContent p-1 px-2 w-full'>
            <header className='flex flex-row w-full items-center justify-between'>
                <div className='flex flex-row items-center space-x-1'>
                    <p className='font-bold text-sm'>{tweet.profile.fullName}</p>
                    <p className='text-sm text-gray-500'>@{tweet.profile.username}</p>
                    <p className='text-sm text-gray-500'>
                        <LuDot />
                    </p>
                    <p className='text-sm text-gray-500'>{dayjs(tweet.tweet.createdAt).fromNow()}</p>
                </div>
                <div className='flex flex-row items-center'>
                    <p className='icon-hover text-gray-500 hover:bg-blue-500 hover:text-blue-500 hover:bg-opacity-25'>
                        <BsThreeDots size={17} />
                    </p>
                </div>
            </header>
            <div className='postText pe-2 space-y-3'>
                <p className='text-sm'>
                    {tweet.tweet.text}
                </p>
                {/* Post Image */}
                <div className='bg-slate-400 aspect-square w-full h-96 rounded-xl'></div>
            </div>
            {/* Icons */}
            <div className='flex flex-row w-full justify-between space-x-1 py-3 text-slate-500'>
                <ReplyDialog tweet={tweet} repliesCount={repliesCount} />
                <div className='icon-hover hover:bg-green-500 hover:text-green-500 hover:bg-opacity-25'>
                    <LuRepeat2 size={20} />
                    <p className='absolute ms-[23px]'>10</p>
                </div>

                <LikeButton
                    tweetId={tweet.tweet.id}
                    likesCount={likesCount}
                    isLikedByUser={hasLiked}
                />

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