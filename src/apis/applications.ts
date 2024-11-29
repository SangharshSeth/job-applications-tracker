import { Tables } from "@/types/supabase"
import supabase from "@/utils/supabase"

export const createApplication = async (application: Omit<Tables<'applications'>, 'id' | 'user_id' | 'created_at'>) => {

    const { data, error } = await supabase
        .from('applications')
        .insert([
            application
        ])
        .select()
    
    if (error) throw error;
    return data;

}

export const fetchApplications = async (limit?: number): Promise<Tables<'applications'>[]> => {
    let query = supabase
        .from('applications')
        .select()
        .order('created_at', { ascending: false });

    if (limit !== undefined) {
        query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
}

export const fetchApplicationCountByStatus = async () => {
    const { data, error } = await supabase
    .from('applications')
    .select('status')
    if(error) throw error;
    return data;
}




