"use server"

import { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { Database } from './../database.types';


export type TweetType = Database["public"]["Tables"]["tweets"]["Row"] & {
    profiles: Pick<
        Database["public"]["Tables"]["profiles"]["Row"],
        "full_name" | "username"
    >;
};

export const getTweets = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return { error: { message: 'Supabase credentials not provided' } };
    }

    const supabaseServer = new SupabaseClient(
        supabaseUrl,
        supabaseKey
    );

    const { data, error } = await supabaseServer.from('tweets').select(`
        *,
        profiles(
            full_name,
            username
        )    
    `)
        .order(`updated_at`, { ascending: false })
        .returns<(TweetType)[]>();

    return { data, error };

}

export const likeTweet = async ({
    tweetId,
    userId
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

    const {data, error} = await supabaseServer.from('likes').insert({
        id: randomUUID(),
        tweet_id: tweetId,
        user_id: userId
    })
    console.log({data, error})
}