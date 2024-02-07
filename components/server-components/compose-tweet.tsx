import createSupabaseServerClient from '@/lib/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import ComposeTweetForm from '../client-components/compose-tweet-form';
import { db } from '@/lib/db';
import { tweets } from '@/lib/db/schema';
import getUserSession from '@/lib/getUserSession';

export default function ComposeTweet() {


    async function submitTweet(formData: any) {
        "use server";

        const tweet = formData.get('tweet');

        if (!tweet) return;
        const supabase = getUserSession();
        console.log('working');
        
        const userId = (await supabase).data.session?.user.id;
        if(!userId) {
            return { error: { message: 'User not authenticated' } };
        }

        let err = "";

        const res = await db
        .insert(tweets)
        .values({
          text: tweet.toString(),
          id: randomUUID(),
          profileId: userId,
        })
        .returning()
        .catch((error) => {
          console.log(error);
          err = "something wrong with server";
        });

        revalidatePath('/');
        return { data: res, error: err };
    }

    return <ComposeTweetForm serverAction={submitTweet} />
}