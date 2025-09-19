import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error(
		"Missing Supabase environment variables. Please check your .env file."
	);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: true,
		flowType: "pkce",
	},
	global: {
		headers: {
			"X-Client-Info": "syncronauts-groupouting@1.0.0",
		},
	},
});

// Auth helper functions
export const auth = {
	// Sign up new user
	signUp: async (email, password, userData = {}) => {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: userData, // This will be stored in raw_user_meta_data
			},
		});
		return { data, error };
	},

	// Sign in existing user
	signIn: async (email, password) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		return { data, error };
	},

	// Sign out current user
	signOut: async () => {
		const { error } = await supabase.auth.signOut();
		return { error };
	},

	// Get current session
	getSession: async () => {
		const { data, error } = await supabase.auth.getSession();
		return { data, error };
	},

	// Get current user
	getUser: async () => {
		const { data, error } = await supabase.auth.getUser();
		return { data, error };
	},

	// Reset password
	resetPassword: async (email) => {
		const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/reset-password`,
		});
		return { data, error };
	},

	// Update user password
	updatePassword: async (password) => {
		const { data, error } = await supabase.auth.updateUser({
			password,
		});
		return { data, error };
	},

	// Listen to auth state changes
	onAuthStateChange: (callback) => {
		return supabase.auth.onAuthStateChange(callback);
	},
};

// Database helper functions
export const db = {
	// Get user profile
	getProfile: async (userId) => {
		const { data, error } = await supabase
			.from("profiles")
			.select("*")
			.eq("id", userId)
			.single();
		return { data, error };
	},

	// Update user profile
	updateProfile: async (userId, updates) => {
		const { data, error } = await supabase
			.from("profiles")
			.update({ ...updates, updated_at: new Date().toISOString() })
			.eq("id", userId)
			.select()
			.single();
		return { data, error };
	},

	// Get member info
	getMember: async (userId) => {
		const { data, error } = await supabase
			.from("member_profiles")
			.select("*")
			.eq("user_id", userId)
			.single();
		return { data, error };
	},

	// Update member info
	updateMember: async (userId, updates) => {
		const { data, error } = await supabase
			.from("members")
			.update({ ...updates, updated_at: new Date().toISOString() })
			.eq("user_id", userId)
			.select()
			.single();
		return { data, error };
	},

	// Get all members (for member directory)
	getAllMembers: async () => {
		const { data, error } = await supabase
			.from("member_profiles")
			.select("*")
			.order("joined_at", { ascending: false });
		return { data, error };
	},
};

// Storage helper functions
export const storage = {
	// Upload avatar
	uploadAvatar: async (userId, file) => {
		const fileExt = file.name.split(".").pop();
		const fileName = `${userId}/avatar.${fileExt}`;

		const { data, error } = await supabase.storage
			.from("avatars")
			.upload(fileName, file, {
				cacheControl: "3600",
				upsert: true, // Replace existing file
			});
		return { data, error };
	},

	// Get avatar URL
	getAvatarUrl: (path) => {
		if (!path) return null;
		const { data } = supabase.storage.from("avatars").getPublicUrl(path);
		return data.publicUrl;
	},

	// Delete avatar
	deleteAvatar: async (path) => {
		const { data, error } = await supabase.storage
			.from("avatars")
			.remove([path]);
		return { data, error };
	},
};

export default supabase;
