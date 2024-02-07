"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { db } from "../db";
import { likes, profiles, replies, tweets } from "../db/schema";
import { eq } from "drizzle-orm";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

export const likeTweet = async ({
    tweetId,
    userId,
}: {
    tweetId: string;
    userId: string;
}) => {
    await db
        .insert(likes)
        .values({
            tweetId,
            userId,
        })
        .catch((err) => {
            console.log(err);
        });
    revalidatePath("/");
};

export const unlikeTweet = async ({
    tweetId,
    userId,
}: {
    tweetId: string;
    userId: string;
}) => {

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return { error: { message: 'Supabase credentials not provided' } };
    }

    const supabaseServer = new SupabaseClient<Database>(
        supabaseUrl,
        supabaseKey
    );

    const { data, error } = await supabaseServer
        .from("likes")
        .delete()
        .eq("tweet_id", tweetId)
        .eq("user_id", userId);

    revalidatePath("/");
    console.log({ data, error });
};

export const reply = async ({
    tweetId,
    userId,
    replyText,
}: {
    tweetId: string;
    userId: string;
    replyText: string;
}) => {
    // you can verify/check the replyText is truthy

    if (replyText === "") return;

    await db.insert(tweets).values({
        text: replyText,
        profileId: userId,
        isReply: true,
        replyId: tweetId,
    });

    revalidatePath(`/tweet/[id]`);
};

export const saveNewAvatar = async ({
    publicUrl,
    profileId,
}: {
    publicUrl: string;
    profileId: string;
}) => {
    // check if the user setting the avatar is the actual owner

    await db
        .update(profiles)
        .set({
            avatarUrl: publicUrl,
        })
        .where(eq(profiles.id, profileId));
};