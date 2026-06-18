CREATE TYPE user_role AS ENUM ('participant', 'admin');
CREATE TYPE match_status AS ENUM ('scheduled', 'live', 'completed', 'cancelled');
CREATE TYPE tournament_stage AS ENUM ('group_stage', 'round_of_32', 'round_of_16', 'quarter_final', 'semi_final', 'third_place', 'final');
