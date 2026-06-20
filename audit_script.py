import re
import csv

def audit():
    results = {}
    
    # 1. Read SQL file
    try:
        with open('fifa_2026_seed.sql', 'r') as f:
            sql_data = f.read()
    except Exception as e:
        print(f"Failed to read SQL: {e}")
        return

    # Extract all MATCH lines
    match_lines = re.findall(r"\('(.*?)',\s*'(.*?)',\s*'(.*?)',\s*'(.*?)',\s*'.*?',\s*'.*?',\s*(.*?)\)", sql_data)
    
    # Audit 1: Exactly 104 matches
    results['Total Matches'] = len(match_lines)
    
    # Audit 2: No duplicate match_codes
    match_codes = [m[0] for m in match_lines]
    results['Unique Match Codes'] = len(set(match_codes)) == len(match_codes)
    
    # Audit 4-10: Stage counts
    stages = [m[1] for m in match_lines]
    results['Group Stage Count'] = stages.count('group_stage')
    results['R32 Count'] = stages.count('round_of_32')
    results['R16 Count'] = stages.count('round_of_16')
    results['QF Count'] = stages.count('quarter_final')
    results['SF Count'] = stages.count('semi_final')
    results['TP Count'] = stages.count('third_place')
    results['Final Count'] = stages.count('final')
    
    # Audit 11: Multipliers
    multipliers = [float(m[4]) for m in match_lines if m[4]]
    results['All Matches Have Multiplier'] = len(multipliers) == len(match_lines)
    
    # Audit 14: Bracket references
    # Home/Away teams in knockouts contain 'Winner X' or 'Loser X'
    bracket_valid = True
    for m in match_lines:
        home, away = m[2], m[3]
        if 'Winner' in home or 'Loser' in home:
            ref = home.split(' ')[-1]
            if ref not in match_codes:
                bracket_valid = False
                print(f"Broken bracket reference: {ref} in {m[0]}")
        if 'Winner' in away or 'Loser' in away:
            ref = away.split(' ')[-1]
            if ref not in match_codes:
                bracket_valid = False
                print(f"Broken bracket reference: {ref} in {m[0]}")
    results['Bracket Valid'] = bracket_valid

    # Read CSV
    try:
        with open('full_submission_template.csv', 'r') as f:
            reader = csv.reader(f)
            rows = list(reader)
    except Exception as e:
        print(f"Failed to read CSV: {e}")
        return
    
    # Audit 12: CSV Rows (excluding header)
    results['CSV Data Rows'] = len(rows) - 1
    
    # Audit 13: CSV Headers
    expected_headers = [
      'match_id', 'home_team', 'away_team', 'predicted_winner', 'predicted_home_score',
      'predicted_away_score', 'predicted_extra_time_home', 'predicted_extra_time_away',
      'predicted_penalty_home', 'predicted_penalty_away', 'predicted_goal_scorers',
      'predicted_first_goal_scorer', 'predicted_possession_home', 'predicted_possession_away',
      'predicted_shots_home', 'predicted_shots_away', 'predicted_xg_home', 'predicted_xg_away',
      'predicted_yellow_home', 'predicted_yellow_away', 'predicted_red_home', 'predicted_red_away',
      'confidence', 'tournament_champion'
    ]
    results['CSV Headers Match'] = rows[0] == expected_headers

    for k, v in results.items():
        print(f"{k}: {v}")

if __name__ == '__main__':
    audit()
