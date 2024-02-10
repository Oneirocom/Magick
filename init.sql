-- This sets up a role for stripe-sync-engine to use
-- On supabase this role is created by default
CREATE OR REPLACE FUNCTION create_role_if_not_exists() RETURNS void AS $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'postgres') THEN
        CREATE ROLE postgres WITH LOGIN SUPERUSER;
    END IF;
END
$$ LANGUAGE plpgsql;

SELECT create_role_if_not_exists();

DROP FUNCTION create_role_if_not_exists();
