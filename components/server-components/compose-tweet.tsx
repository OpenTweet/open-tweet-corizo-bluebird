import createSupabaseServerClient from '@/lib/supabase/server';
import { randomUUID } from 'crypto';
import ComposeTweetForm from '../client-components/compose-tweet-form';
import { SupabaseClient } from '@supabase/supabase-js';

export default function ComposeTweet() {
    async function submitTweet(formData: any) {
        "use server";

        const tweet = formData.get('tweet');

        if (!tweet) return;

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SECRET_KEY;

        const supabaseClient = createSupabaseServerClient();

        if (!supabaseUrl || !supabaseKey) {
            return { error: { message: 'Supabase credentials not provided' } };
        }

        const supabaseServer = new SupabaseClient(
            supabaseUrl,
            supabaseKey
        );

        const auth = (await supabaseClient)?.auth;
        const { data: userData, error: userError } = await auth.getUser();

        if (userError) return;

        const tweetsDB = supabaseServer.from('tweets');

        const { data, error } = await tweetsDB.insert({
            profile_id: userData?.user?.id,
            text: tweet.toString(),
            id: randomUUID()
        });
        console.log({ data, error })
    }

    return <ComposeTweetForm serverAction={submitTweet} />
}