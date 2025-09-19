import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "../lib/supabase";

const AuthContext = createContext({
	user: null,
	profile: null,
	member: null,
	loading: true,
	signUp: async () => {},
	signIn: async () => {},
	signOut: async () => {},
	updateProfile: async () => {},
	updateMember: async () => {},
});

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [profile, setProfile] = useState(null);
	const [member, setMember] = useState(null);
	const [loading, setLoading] = useState(true);

	// Load user data (profile and member info)
	const loadUserData = async (user) => {
		if (!user) {
			setProfile(null);
			setMember(null);
			return;
		}

		try {
			// Load profile
			const { data: profileData, error: profileError } = await db.getProfile(
				user.id
			);
			if (profileError) {
				console.error("Error loading profile:", profileError);
			} else {
				setProfile(profileData);
			}

			// Load member info
			const { data: memberData, error: memberError } = await db.getMember(
				user.id
			);
			if (memberError) {
				console.error("Error loading member data:", memberError);
			} else {
				setMember(memberData);
			}
		} catch (error) {
			console.error("Error loading user data:", error);
		}
	};

	useEffect(() => {
		// Get initial session
		const getInitialSession = async () => {
			try {
				const {
					data: { session },
					error,
				} = await auth.getSession();
				if (error) {
					console.error("Error getting session:", error);
				} else {
					setUser(session?.user ?? null);
					if (session?.user) {
						await loadUserData(session.user);
					}
				}
			} catch (error) {
				console.error("Error in getInitialSession:", error);
			} finally {
				setLoading(false);
			}
		};

		getInitialSession();

		// Listen for auth changes
		const {
			data: { subscription },
		} = auth.onAuthStateChange(async (event, session) => {
			console.log("Auth state changed:", event, session?.user?.email);

			setUser(session?.user ?? null);

			if (session?.user) {
				await loadUserData(session.user);
			} else {
				setProfile(null);
				setMember(null);
			}

			setLoading(false);
		});

		return () => {
			subscription?.unsubscribe();
		};
	}, []);

	// Sign up function
	const signUp = async (email, password, userData = {}) => {
		try {
			setLoading(true);
			const { data, error } = await auth.signUp(email, password, userData);

			if (error) {
				throw error;
			}

			// If user is confirmed immediately, load their data
			if (data.user && !data.user.email_confirmed_at) {
				// User needs to confirm email
				return {
					data,
					error: null,
					message: "Please check your email to confirm your account.",
				};
			}

			return { data, error: null };
		} catch (error) {
			console.error("Error in signUp:", error);
			return { data: null, error };
		} finally {
			setLoading(false);
		}
	};

	// Sign in function
	const signIn = async (email, password) => {
		try {
			setLoading(true);
			const { data, error } = await auth.signIn(email, password);

			if (error) {
				throw error;
			}

			return { data, error: null };
		} catch (error) {
			console.error("Error in signIn:", error);
			return { data: null, error };
		} finally {
			setLoading(false);
		}
	};

	// Sign out function
	const signOut = async () => {
		try {
			setLoading(true);
			const { error } = await auth.signOut();

			if (error) {
				throw error;
			}

			// Clear local state
			setUser(null);
			setProfile(null);
			setMember(null);

			return { error: null };
		} catch (error) {
			console.error("Error in signOut:", error);
			return { error };
		} finally {
			setLoading(false);
		}
	};

	// Update profile function
	const updateProfile = async (updates) => {
		if (!user) {
			return { data: null, error: new Error("No user logged in") };
		}

		try {
			const { data, error } = await db.updateProfile(user.id, updates);

			if (error) {
				throw error;
			}

			// Update local state
			setProfile(data);
			return { data, error: null };
		} catch (error) {
			console.error("Error updating profile:", error);
			return { data: null, error };
		}
	};

	// Update member function
	const updateMember = async (updates) => {
		if (!user) {
			return { data: null, error: new Error("No user logged in") };
		}

		try {
			const { data, error } = await db.updateMember(user.id, updates);

			if (error) {
				throw error;
			}

			// Reload member data to get the updated view
			await loadUserData(user);
			return { data, error: null };
		} catch (error) {
			console.error("Error updating member:", error);
			return { data: null, error };
		}
	};

	const value = {
		user,
		profile,
		member,
		loading,
		signUp,
		signIn,
		signOut,
		updateProfile,
		updateMember,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
