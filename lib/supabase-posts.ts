import { supabase } from './supabase';

export interface Post {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    date: string;
    read_time: string;
    author_name: string;
    author_avatar: string;
    published: boolean;
    created_at?: string;
}

export async function getPublishedPosts() {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
    return data as Post[];
}

export async function getAllPosts() {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching all posts:', error);
        return [];
    }
    return data as Post[];
}

export async function getPostBySlug(slug: string) {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching post by slug:', error);
        return null;
    }
    return data as Post;
}

export async function createPost(post: Omit<Post, 'id' | 'created_at'>) {
    const { data, error } = await supabase
        .from('posts')
        .insert([post])
        .select();

    if (error) throw error;
    return data[0];
}

export async function updatePost(id: string, post: Partial<Post>) {
    const { data, error } = await supabase
        .from('posts')
        .update(post)
        .eq('id', id)
        .select();

    if (error) throw error;
    return data[0];
}

export async function deletePost(id: string) {
    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return true;
}

export async function uploadImage(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `blog/${fileName}`;

    const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

    return publicUrl;
}
