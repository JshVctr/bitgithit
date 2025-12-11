# Authentication & Profile System Guide

## Overview
The Ratio app now features a fully functional authentication and profile system with username-only login, integrated with Supabase for data persistence.

## Features Implemented

### Authentication System
- Simple username-only login (no password required)
- Automatic account creation for new users
- Persistent login sessions using localStorage
- Logout functionality with confirmation

### Profile Management
All buttons and features in the profile page are now fully functional:

1. **Edit Profile**
   - Click "Edit" to modify your name and email
   - Changes are saved to Supabase database
   - Success notification appears after saving
   - Cancel button reverts changes

2. **Training Preferences**
   - All checkboxes save immediately to database
   - Show Strategy Hints toggle
   - Enable Card Counting toggle
   - Auto-Advance toggle
   - Difficulty level dropdown (beginner/intermediate/advanced)

3. **Logout Button**
   - Red logout button in top-right corner
   - Confirmation dialog before logging out
   - Clears session and returns to login screen

### Level & XP System
- Fully integrated with Supabase
- XP gains are automatically saved to database
- Level progress persists across sessions
- Dynamic XP requirements based on level tiers
- Toast notifications for XP gains and level ups

### Database Integration
All user data is stored in Supabase:
- User profiles (name, email, username, level, experience)
- Game statistics (games played, win rate, strategy accuracy)
- Achievements (unlocked achievements with timestamps)
- Preferences (all training settings)
- Quiz results (basic strategy and card counting)
- Game sessions (recent play history)

## How to Use

### First Time Login
1. Open the app
2. Enter any username (3-20 characters, letters/numbers/underscores only)
3. Click "Continue"
4. Account is automatically created with default settings

### Returning Users
1. Enter your existing username
2. Click "Continue"
3. All your data is loaded from Supabase

### Profile Page Features
1. **View Profile**: See your avatar, name, email, level, and member since date
2. **Edit Account**: Click "Edit" button to change name/email, then "Save Changes"
3. **Adjust Preferences**: Toggle any setting - saves automatically
4. **View Achievements**: See your recent achievements (if any)
5. **Logout**: Click logout button in top-right

## Technical Details

### Database Schema
- `user_profiles`: Core user data and level/XP
- `game_stats`: Gameplay statistics
- `game_sessions`: Play history
- `achievements`: Unlocked achievements
- `user_preferences`: Training settings
- `quiz_results`: Quiz performance data
- `learning_progress`: Learning module progress

### Context Providers
- `AuthContext`: Manages login/logout and session
- `UserContext`: Handles user data and database operations
- `ThemeContext`: Light/dark mode (already existed)

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Policies ensure proper data isolation

## Testing Checklist

- [x] Login with new username creates account
- [x] Login with existing username loads data
- [x] Edit profile saves to database
- [x] All preference toggles save automatically
- [x] Difficulty dropdown saves
- [x] XP gains update database
- [x] Level ups persist
- [x] Logout clears session
- [x] Logout confirmation works
- [x] Profile displays correct user data
- [x] Achievements display (when earned)
- [x] Build completes successfully
