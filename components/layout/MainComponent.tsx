import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import { FiSettings } from 'react-icons/fi';
import ComposeTweet from '../server-components/compose-tweet';
import Tweet from '../client-components/tweet';
import { getTweets } from '@/lib/supabase/queries';
import { SupabaseClient } from '@supabase/supabase-js';
import getUserSession from '@/lib/getUserSession';

dayjs.extend(relativeTime);

export default async function MainComponent() {

    const supabase = await getUserSession();

    const res = await getTweets({ currentUserID: supabase?.data?.session?.user?.id });

    return <main className=' flex w-[600px] h-full min-h-screen flex-col border-l-[0.5px] border-r-[0.5px] twitter-border-color'>
        <nav className='fixed bg-black backdrop-blur-sm bg-opacity-55 font-semibold z-40 w-[600px] flex flex-row text-center border-b-[0.5px] border-r-[0.5px] twitter-border-color text-sm h-[55px]'>
            <Link
                href={'#'}
                className='h-full w-full '>
                <div className='w-full h-full surfing-nav surfing-link-hover'>
                    <span className='border-b-4 border-blue-400 py-4'>For you</span>
                </div>
            </Link>
            <Link
                href={'#'}
                className='h-full w-full'>
                <div className='w-full h-full surfing-nav surfing-link-hover font-semibold text-gray-500'>
                    <span className='border-b-4 border-transparent py-4'>Following</span>
                </div>
            </Link>
            <div className='flex items-center justify-center p-2'>
                <Link href={'#'}
                    className='p-2 h-fit w-full surfing-link-hover rounded-full'>
                    <FiSettings />
                </Link>
            </div>
        </nav>
        <div className='mt-[55px] border-t-[0.5px] border-b-[0.5px] twitter-border-color min-h-28 pt-2 px-2 space-y-3 relative flex flex-row'>
            {/* logo section */}
            <div className='p-2'>
                <div className='w-10 h-10 bg-slate-400 rounded-full'></div>
            </div>

            {/* input section */}
            <ComposeTweet />
        </div>

        {/* Posts Section */}

        <div className='posts flex flex-col'>
            {/* {
                res?.error && <div>Something wrong with the server</div>
            } */}
            {res && res.map(({ likes, tweet, profile, hasLiked, replies }) => (
                <Tweet
                    key={tweet.id}
                    tweet={{
                        tweet: {
                            ...tweet,
                        },
                        profile: {
                            ...profile,
                        },
                    }}
                    likesCount={likes.length}
                    currentUserId={supabase?.data?.session?.user?.id}
                    hasLiked={hasLiked}
                    repliesCount={replies.length}
                />
            ))}
        </div>

    </main>
}