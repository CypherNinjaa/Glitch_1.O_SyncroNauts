# Chat Room System - Setup Instructions

## ⚠️ IMPORTANT: Use the Safe Setup

If you're getting trigger errors, use **`complete-safe-setup.sql`** instead of the individual files. This handles existing objects properly.

## 🚀 Quick Setup (Recommended)

### Single File Setup
Run **`complete-safe-setup.sql`** in your Supabase SQL editor. This file:
- Safely drops existing objects to prevent conflicts
- Creates all necessary tables, functions, and policies
- Handles the "trigger already exists" error automatically

## 🔧 Alternative Setup (Step by Step)

If you prefer step-by-step setup:

### 1. First, run `profiles-setup.sql`
This creates the profiles table and sets up automatic profile creation for new users.

### 2. Then, run `chat-room-setup.sql`
This creates the main chat room tables and all necessary functions.

### 3. If you get errors, run `fix-recursion.sql`
This fixes any RLS policy conflicts.

## 🛠️ Troubleshooting

### Error: "trigger already exists"
**Solution:** Use `complete-safe-setup.sql` - it safely handles existing objects.

### Error: "infinite recursion detected"
**Solution:** Run `fix-recursion.sql` to fix circular RLS policies.

### Error: Authentication issues
**Solution:** Ensure you're logged in to your app and user profiles are created.

## Database Tables Created

1. **profiles** - User profile information
2. **chat_rooms** - Chat room details with auto-generated room IDs
3. **room_participants** - Junction table for room membership
4. **chat_messages** - All chat messages with timestamps

## Features Implemented

### 🏠 Room Creation
- Users can create chat rooms with custom names
- Auto-generated 5-character room IDs (e.g., "A4B2C")
- Password protection for rooms
- Automatic room creator becomes first participant

### 🚪 Room Joining
- Join rooms using Room ID and password
- Password verification and room capacity checks
- Automatic participant addition
- System messages for join/leave events

### 💬 Real-time Chat
- Send and receive messages instantly
- Message persistence in database
- User avatars and timestamps
- System messages for user actions

### 👥 Participant Management
- View all room participants
- See when users joined
- Real-time participant list updates
- Room creator identification

### 🔧 Room Management
- Leave rooms functionality
- Room information display
- Copy room details for sharing
- Room capacity limits (default 50 users)

## Security Features

- Row Level Security (RLS) enabled on all tables
- Users can only see rooms they participate in
- Users can only send messages to their rooms
- Password hashing for room security
- User authentication required

## How to Use

1. **Create a Room**: Go to Chat → Create Room tab, enter name and password
2. **Share Room**: Give others the Room ID and password (shown after creation)
3. **Join a Room**: Go to Chat → Join Room tab, enter Room ID and password
4. **Chat**: Send messages, view participants, and manage room settings

## Technical Notes

- Real-time messaging uses Supabase real-time subscriptions
- Messages are automatically sorted by timestamp
- Chat history persists when users leave and rejoin
- Responsive design works on desktop and mobile
- Integration with existing authentication system

All chat rooms and messages are stored securely in your Supabase database with proper data relationships and constraints.