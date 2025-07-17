import { supabase } from "./supabase";
import { TurkishProject, TurkishPerson } from "./schema";

// ===== TURKISH PROJECTS FUNCTIONS =====

export const getAllTurkishProjects = async (category?: string) => {
  try {
    let query = supabase
      .from('turkish_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching Turkish projects:', error);
      return [];
    }

    return data as TurkishProject[];
  } catch (error) {
    console.error('Error in getAllTurkishProjects:', error);
    return [];
  }
};

export const getTurkishProjectById = async (projectId: string) => {
  try {
    const { data, error } = await supabase
      .from('turkish_projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) {
      console.error('Error fetching Turkish project:', error);
      return null;
    }

    return data as TurkishProject;
  } catch (error) {
    console.error('Error in getTurkishProjectById:', error);
    return null;
  }
};

export const createTurkishProject = async (projectData: Omit<TurkishProject, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('turkish_projects')
      .insert([projectData])
      .select()
      .single();

    if (error) {
      console.error('Error creating Turkish project:', error);
      return null;
    }

    return data as TurkishProject;
  } catch (error) {
    console.error('Error in createTurkishProject:', error);
    return null;
  }
};

export const updateTurkishProject = async (projectId: string, projectData: Partial<TurkishProject>) => {
  try {
    const { data, error } = await supabase
      .from('turkish_projects')
      .update({ ...projectData, updated_at: new Date().toISOString() })
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      console.error('Error updating Turkish project:', error);
      return null;
    }

    return data as TurkishProject;
  } catch (error) {
    console.error('Error in updateTurkishProject:', error);
    return null;
  }
};

export const deleteTurkishProject = async (projectId: string) => {
  try {
    const { error } = await supabase
      .from('turkish_projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      console.error('Error deleting Turkish project:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteTurkishProject:', error);
    return false;
  }
};

// ===== TURKISH PEOPLE FUNCTIONS =====

export const getAllTurkishPeople = async (role?: string) => {
  try {
    let query = supabase
      .from('turkish_people')
      .select('*')
      .order('created_at', { ascending: false });

    if (role && role !== 'all') {
      query = query.eq('role', role);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching Turkish people:', error);
      return [];
    }

    return data as TurkishPerson[];
  } catch (error) {
    console.error('Error in getAllTurkishPeople:', error);
    return [];
  }
};

export const getTurkishPersonById = async (personId: string) => {
  try {
    const { data, error } = await supabase
      .from('turkish_people')
      .select('*')
      .eq('id', personId)
      .single();

    if (error) {
      console.error('Error fetching Turkish person:', error);
      return null;
    }

    return data as TurkishPerson;
  } catch (error) {
    console.error('Error in getTurkishPersonById:', error);
    return null;
  }
};

export const getTurkishPersonByWallet = async (walletAddress: string) => {
  try {
    const { data, error } = await supabase
      .from('turkish_people')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (error) {
      console.error('Error fetching Turkish person by wallet:', error);
      return null;
    }

    return data as TurkishPerson;
  } catch (error) {
    console.error('Error in getTurkishPersonByWallet:', error);
    return null;
  }
};

export const createTurkishPerson = async (personData: Omit<TurkishPerson, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('turkish_people')
      .insert([personData])
      .select()
      .single();

    if (error) {
      console.error('Error creating Turkish person:', error);
      return null;
    }

    return data as TurkishPerson;
  } catch (error) {
    console.error('Error in createTurkishPerson:', error);
    return null;
  }
};

export const updateTurkishPerson = async (personId: string, personData: Partial<TurkishPerson>) => {
  try {
    const { data, error } = await supabase
      .from('turkish_people')
      .update({ ...personData, updated_at: new Date().toISOString() })
      .eq('id', personId)
      .select()
      .single();

    if (error) {
      console.error('Error updating Turkish person:', error);
      return null;
    }

    return data as TurkishPerson;
  } catch (error) {
    console.error('Error in updateTurkishPerson:', error);
    return null;
  }
};

export const deleteTurkishPerson = async (personId: string) => {
  try {
    const { error } = await supabase
      .from('turkish_people')
      .delete()
      .eq('id', personId);

    if (error) {
      console.error('Error deleting Turkish person:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteTurkishPerson:', error);
    return false;
  }
};

// ===== STATS FUNCTIONS =====

export const getTurkishStats = async () => {
  try {
    // Parallel queries for better performance
    const [projectsResult, peopleResult] = await Promise.all([
      supabase.from('turkish_projects').select('id, category'),
      supabase.from('turkish_people').select('id, role')
    ]);

    if (projectsResult.error || peopleResult.error) {
      console.error('Error fetching stats:', projectsResult.error || peopleResult.error);
      return {
        total_projects: 0,
        total_people: 0,
        total_builders: 0,
        total_creators: 0,
        total_investors: 0,
        total_degens: 0,
      };
    }

    const projects = projectsResult.data || [];
    const people = peopleResult.data || [];

    return {
      total_projects: projects.length,
      total_people: people.length,
      total_builders: people.filter(p => p.role === 'geliştirici').length,
      total_creators: people.filter(p => p.role === 'içerik-üretici').length,
      total_investors: people.filter(p => p.role === 'yatırımcı').length,
      total_degens: people.filter(p => p.role === 'topluluk-yöneticisi').length,
    };
  } catch (error) {
    console.error('Error in getTurkishStats:', error);
    return {
      total_projects: 0,
      total_people: 0,
      total_builders: 0,
      total_creators: 0,
      total_investors: 0,
      total_degens: 0,
    };
  }
};

// ===== SEARCH FUNCTIONS =====

export const searchTurkishProjects = async (searchTerm: string, category?: string) => {
  try {
    let query = supabase
      .from('turkish_projects')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error searching Turkish projects:', error);
      return [];
    }

    return data as TurkishProject[];
  } catch (error) {
    console.error('Error in searchTurkishProjects:', error);
    return [];
  }
};

export const searchTurkishPeople = async (searchTerm: string, role?: string) => {
  try {
    let query = supabase
      .from('turkish_people')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (role && role !== 'all') {
      query = query.eq('role', role);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error searching Turkish people:', error);
      return [];
    }

    return data as TurkishPerson[];
  } catch (error) {
    console.error('Error in searchTurkishPeople:', error);
    return [];
  }
};



// ===== UTILITY FUNCTIONS =====

export const getProjectsByCategory = async () => {
  try {
    const { data, error } = await supabase
      .from('turkish_projects')
      .select('category')
      .order('category');

    if (error) {
      console.error('Error fetching project categories:', error);
      return {};
    }

    const categoryCount = data.reduce((acc, project) => {
      acc[project.category] = (acc[project.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return categoryCount;
  } catch (error) {
    console.error('Error in getProjectsByCategory:', error);
    return {};
  }
};

export const getPeopleByRole = async () => {
  try {
    const { data, error } = await supabase
      .from('turkish_people')
      .select('role')
      .order('role');

    if (error) {
      console.error('Error fetching people roles:', error);
      return {};
    }

    const roleCount = data.reduce((acc, person) => {
      acc[person.role] = (acc[person.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return roleCount;
  } catch (error) {
    console.error('Error in getPeopleByRole:', error);
    return {};
  }
}; 