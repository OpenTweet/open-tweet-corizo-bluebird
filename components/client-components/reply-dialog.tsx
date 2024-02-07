"use client";

import React, { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { BsChat, BsDot, BsThreeDots } from "react-icons/bs";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Profile, Tweet } from "@/lib/db/schema";
import { Input } from "../ui/input";
import { toast } from "react-hot-toast";
import { reply } from "@/lib/supabase/mutation";
import { useSupabase } from "@/app/providers/supabase-provider";

dayjs.extend(relativeTime);

type ReplyDialogProps = {
  tweet: {
    profile: Profile;
    tweet: Tweet;
  };
  repliesCount: number;
};

const ReplyDialog = ({ tweet, repliesCount }: ReplyDialogProps) => {
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);

  let [isReplyPending, startTransition] = useTransition();
  const { supabase } = useSupabase();

  const [replyText, setReplyText] = useState<string>("");

  return (
    <Dialog onOpenChange={setIsReplyDialogOpen} open={isReplyDialogOpen}>
      <DialogTrigger asChild>
        <button className='icon-hover hover:bg-blue-500 hover:bg-opacity-20 hover:text-blue-600'>
          <BsChat size={18} />
          <span className='absolute ms-[23px]'>{repliesCount || 0}</span>
        </button>
      </DialogTrigger>
      <DialogContent className="bg-black sm:max-w-2xl border-none text-white">
        <div className="border-b-[0.5px] border-gray-600 p-2 flex space-x-4 w-full">
          <div>
            <div className="w-10 h-10 bg-slate-200 rounded-full" />
          </div>
          <div className="flex flex-col w-full">
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center space-x-1 w-full">
                <div className="font-bold">
                  {tweet.profile.fullName ?? ""}
                </div>
                <div className="text-gray-500">
                  @{tweet.profile.username}
                </div>
                <div className="text-gray-500">
                  <BsDot />
                </div>
                <div className="text-gray-500">
                  {dayjs(tweet.tweet.createdAt).fromNow()}
                </div>
              </div>
              <div>
                <BsThreeDots />
              </div>
            </div>
            <div className="text-white text-base w-full my-4">
              {tweet.tweet.text}
            </div>
          </div>
        </div>
        <div>Replying to @{tweet.profile.username}</div>
        <div className="flex w-full items-center space-x-2">
          <div>
            <div className="w-10 h-10 bg-slate-200 rounded-full" />
          </div>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full h-full text-2xl placeholder:text-gray-600 bg-transparent border-b-[0.5px] border-gray-600 p-4 outline-none"
          />
        </div>
        <div className="w-full justify-between items-center flex">
          <div></div>
          <div className="w-full max-w-[100px]">
            <button
              disabled={isReplyPending}
              onClick={() => {
                supabase.auth
                  .getUser()
                  .then((res) => {
                    if (res.data && res.data.user) {
                      const user = res.data.user;
                      startTransition(() => {
                        reply({
                          replyText,
                          tweetId: tweet.tweet.id,
                          userId: user.id,
                        })
                          .then(() => {
                            setIsReplyDialogOpen(false);
                          })
                          .catch(() => {
                            toast.error("something went wrong with db");
                          });
                      });
                    } else {
                      toast("please login to reply to a tweet");
                    }
                  })
                  .catch(() => {
                    toast.error("authentication failed");
                  });
              }}
              className="rounded-full bg-twitterColor px-4 py-2 w-full text-lg text-center hover:bg-opacity-70 transition duration-200 font-bold"
            >
              Reply
            </button>
            {/* <button ref={resetRef} className="invisible" type="reset"></button> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyDialog;