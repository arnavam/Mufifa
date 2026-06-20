-- ==============================================================================
-- PRE-LAUNCH CLEANUP SCRIPT
-- Purpose: Safely purge all participant testing data before public launch.
--
-- This script PRESERVES:
--   - Admin accounts (profiles)
--   - Competition Settings (competition_settings)
--   - Scoring Rules (scoring_rules)
--   - Matches (matches)
--
-- This script REMOVES:
--   - Teams, Predictions, Submissions, Leaderboard, Actual Results, Analytics, Audit Logs
-- ==============================================================================

BEGIN;

-- 1. Remove independent logging and analytics data
DELETE FROM audit_logs;
DELETE FROM analytics_cache;

-- 2. Remove actual match results entered during testing
DELETE FROM actual_results;

-- 3. Remove dependent team data (order matters to avoid FK constraint errors, 
--    though ON DELETE CASCADE exists, explicit deletion ensures safety)
DELETE FROM leaderboard;
DELETE FROM submissions;
DELETE FROM champion_predictions;
DELETE FROM predictions;

-- 4. Remove all participant teams
DELETE FROM teams;

-- (Optional) If you also wish to remove the participant auth profiles themselves,
-- you would need to delete from auth.users. This script leaves the registered users
-- intact but removes their teams so they can re-create them.

COMMIT;

-- ==============================================================================
-- ROLLBACK INSTRUCTIONS
-- ==============================================================================
-- 1. This script executes a hard DELETE on production data. There is no "UNDO" command.
-- 2. BEFORE running this script, you MUST take a manual backup of your database:
--    pg_dump -h <host> -U postgres -d postgres > pre_launch_backup.sql
-- 3. If you accidentally run this script, restore your backup via:
--    psql -h <host> -U postgres -d postgres < pre_launch_backup.sql
-- ==============================================================================
