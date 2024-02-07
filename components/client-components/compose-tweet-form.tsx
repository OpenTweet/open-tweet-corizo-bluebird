"use client";
import { useRef, useTransition } from "react";
import toast from "react-hot-toast";
import { FaRegFaceSmile } from 'react-icons/fa6';
import { LuMapPin } from 'react-icons/lu';
import { MdOutlineGifBox } from 'react-icons/md';
import { RiGalleryLine, RiListCheck2 } from 'react-icons/ri';
import { SlCalender } from 'react-icons/sl';
import LoadingCircle from "../loading/loading-cirlce";

type ComposeTweetFormProps = {
    serverAction: any;
};

const ComposeTweetForm = ({ serverAction }: ComposeTweetFormProps) => {
    const resetRef = useRef<HTMLButtonElement>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmitTweet = async (data: any) => {
        try {
            startTransition(() => {
                isPending;
            });

            const tweet = data.get('tweet');
            if (!tweet) return toast.error("Tweet cannot be empty!");

            const res = await serverAction(data);

            if (res?.error) {
                return toast.error(res.error.message);
            }
            toast.success("Tweet sent successfully!");
            resetRef.current?.click();

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form action={handleSubmitTweet} className='flex flex-col w-full'>
            <div className='flex flex-row items-center text-xl'>
                <input type='text'
                    name='tweet'
                    placeholder="What's happening?!"
                    className='w-full h-full bg-transparent p-1 outline-none border-none placeholder:text-gray-500'
                />
            </div>
            <div className='w-full flex flex-row justify-between my-2 py-2'>
                <div className='flex flex-row text-primary'>
                    <div className='icon-hover hover:bg-blue-500 hover:bg-opacity-20'>
                        <RiGalleryLine className='w-[1.2rem] h-[1.2rem]' />
                    </div>
                    <div className='icon-hover hover:bg-blue-500 hover:bg-opacity-20'>
                        <MdOutlineGifBox className='w-[1.2rem] h-[1.2rem]' />
                    </div>
                    <div className='icon-hover hover:bg-blue-500 hover:bg-opacity-20'>
                        <RiListCheck2 className='w-[1.2rem] h-[1.2rem]' />
                    </div>
                    <div className='icon-hover hover:bg-blue-500 hover:bg-opacity-20'>
                        <FaRegFaceSmile className='w-[1.2rem] h-[1.2rem]' />
                    </div>
                    <div className='icon-hover hover:bg-blue-500 hover:bg-opacity-20'>
                        <SlCalender className='w-[1.2rem] h-[1.2rem]' />
                    </div>
                    <div className='icon-hover hover:bg-blue-500 hover:bg-opacity-20'>
                        <LuMapPin className='w-[1.2rem] h-[1.2rem]' />
                    </div>
                </div>
                <button
                    disabled={isPending}
                    className={`btn-primary p-2 px-5 text-sm w-24`}
                >
                    {isPending ?
                        <LoadingCircle /> :
                        <p>Post</p>
                    }
                </button>
                <button ref={resetRef} className="hidden" type="reset"></button>
            </div>
        </form>
    );
};

export default ComposeTweetForm;