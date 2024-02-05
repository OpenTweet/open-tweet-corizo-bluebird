import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

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
        .returns<
            (Database['public']['Tables']['tweets']['Row'] & {
                profiles: Pick<
                    Database['public']['Tables']['profiles']['Row'], 'full_name' | 'username'
                >;
            })[]>();

    return { data, error };

}