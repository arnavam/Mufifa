import csv

stages = [
    ("group_stage", 1.0, 72, "GS"),
    ("round_of_32", 1.2, 16, "R32"),
    ("round_of_16", 1.5, 8, "R16"),
    ("quarter_final", 2.0, 4, "QF"),
    ("semi_final", 3.0, 2, "SF"),
    ("third_place", 2.5, 1, "TP"),
    ("final", 5.0, 1, "F")
]

groups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]

teams = []
for g in groups:
    teams.extend([f"Team {g}1", f"Team {g}2", f"Team {g}3", f"Team {g}4"])

matches = []
match_idx = 1
start_date = "2026-06-11T16:00:00Z"

# Group stage
for g in groups:
    t1, t2, t3, t4 = f"Team {g}1", f"Team {g}2", f"Team {g}3", f"Team {g}4"
    group_matches = [
        (t1, t2), (t3, t4),
        (t1, t3), (t4, t2),
        (t4, t1), (t2, t3)
    ]
    for home, away in group_matches:
        match_code = f"GS_{match_idx:03d}"
        matches.append((match_code, "group_stage", home, away, start_date, "scheduled", 1.0))
        match_idx += 1

# R32
for i in range(16):
    match_code = f"R32_{match_idx:03d}"
    matches.append((match_code, "round_of_32", f"R32 Home {i+1}", f"R32 Away {i+1}", start_date, "scheduled", 1.2))
    match_idx += 1

# R16
for i in range(8):
    match_code = f"R16_{match_idx:03d}"
    matches.append((match_code, "round_of_16", f"Winner R32_{(i*2)+73:03d}", f"Winner R32_{(i*2)+74:03d}", start_date, "scheduled", 1.5))
    match_idx += 1

# QF
for i in range(4):
    match_code = f"QF_{match_idx:03d}"
    matches.append((match_code, "quarter_final", f"Winner R16_{(i*2)+89:03d}", f"Winner R16_{(i*2)+90:03d}", start_date, "scheduled", 2.0))
    match_idx += 1

# SF
for i in range(2):
    match_code = f"SF_{match_idx:03d}"
    matches.append((match_code, "semi_final", f"Winner QF_{(i*2)+97:03d}", f"Winner QF_{(i*2)+98:03d}", start_date, "scheduled", 3.0))
    match_idx += 1

# TP
match_code = f"TP_{match_idx:03d}"
matches.append((match_code, "third_place", f"Loser SF_101", f"Loser SF_102", start_date, "scheduled", 2.5))
match_idx += 1

# F
match_code = f"F_{match_idx:03d}"
matches.append((match_code, "final", f"Winner SF_101", f"Winner SF_102", start_date, "scheduled", 5.0))

# Write SQL
with open("fifa_2026_seed.sql", "w") as f:
    f.write("-- 1. Insert Teams\n")
    f.write("INSERT INTO public.teams (team_name) VALUES\n")
    team_vals = []
    for t in teams:
        team_vals.append(f"('{t}')")
    f.write(",\n".join(team_vals) + "\nON CONFLICT DO NOTHING;\n\n")

    f.write("-- 2. Insert Matches\n")
    f.write("INSERT INTO public.matches (match_code, stage, home_team, away_team, kickoff_time, status, multiplier) VALUES\n")
    match_vals = []
    for m in matches:
        match_vals.append(f"('{m[0]}', '{m[1]}', '{m[2]}', '{m[3]}', '{m[4]}', '{m[5]}', {m[6]})")
    f.write(",\n".join(match_vals) + "\nON CONFLICT DO NOTHING;\n")

# Write CSV
csv_columns = [
  'match_id', 'home_team', 'away_team', 'predicted_winner', 'predicted_home_score',
  'predicted_away_score', 'predicted_extra_time_home', 'predicted_extra_time_away',
  'predicted_penalty_home', 'predicted_penalty_away', 'predicted_goal_scorers',
  'predicted_first_goal_scorer', 'predicted_possession_home', 'predicted_possession_away',
  'predicted_shots_home', 'predicted_shots_away', 'predicted_xg_home', 'predicted_xg_away',
  'predicted_yellow_home', 'predicted_yellow_away', 'predicted_red_home', 'predicted_red_away',
  'confidence', 'tournament_champion'
]

with open("full_submission_template.csv", "w", newline='') as f:
    writer = csv.writer(f)
    writer.writerow(csv_columns)
    for i, m in enumerate(matches):
        row = [m[0], m[2], m[3]] + [""] * 21
        if i == 0:
            row[-1] = "TBD" # Example champion
        writer.writerow(row)
