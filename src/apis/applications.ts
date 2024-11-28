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

export const fetchApplications = async (limit: number): Promise<Tables<'applications'>[]> => {
    const { data, error } = await supabase
        .from('applications')
        .select()
        .order('created_at', { ascending: false })
        .limit(limit);
    
    if (error) throw error;
    return data;
}



