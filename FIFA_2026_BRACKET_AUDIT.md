# FIFA 2026 Bracket Correctness Audit

An aggressive audit of the generated `fifa_2026_r32_seed.sql` against real-world football structure requirements for the **48-Team FIFA World Cup 2026 format**.

### Verification Checklist

1. **FIFA 2026 format uses 48 teams:** `[PASS]`
   - Structurally, the tournament does expand to 48 teams, resulting in a 32-team knockout bracket (Round of 32). The bracket depth (16 matches -> 8 matches -> 4 -> 2 -> 1) aligns properly.

2. **Number of groups:** `[FAIL]`
   - **Real World:** 48 teams divided into **12 groups** (Groups A through L) of 4 teams each.
   - **Current Seed Assumption:** The naively generated seed blindly assumes Groups A through Q (17 groups!). 

3. **Number of group winners:** `[FAIL]`
   - **Real World:** 12 Group Winners (A to L).
   - **Current Seed Assumption:** Assumes Winners up to Group P.

4. **Number of group runners-up:** `[FAIL]`
   - **Real World:** 12 Group Runners-up (A to L).
   - **Current Seed Assumption:** Assumes Runners-up up to Group Q.

5. **Number of third-place qualifiers:** `[FAIL]`
   - **Real World:** The 8 best third-place teams advance to the Round of 32.
   - **Current Seed Assumption:** Missing entirely. The seed script made zero provision for third-place qualifying slots (e.g. `3rd Group A/B/C`).

6. **Round of 32 structure:** `[FAIL]`
   - **Real World:** Round of 32 matches pair the 12 group winners, 12 runners-up, and 8 best third-place teams across a structured collision grid.
   - **Current Seed Assumption:** A simple iterative `Winner Group N vs Runner-up Group N+1`.

### Audit Conclusion
**CRITICAL FAILURE**. The `fifa_2026_r32_seed.sql` dataset is mathematically broken regarding the official FIFA 2026 topology. While the *math* of 32 knockout slots works for the scoring engine, the *naming conventions* (Group P, Group Q) make no football sense and completely ignore the 8 wildcard 3rd-place qualifier slots.

**Remediation Needed:** The seed script must be rebuilt using the authentic FIFA 2026 12-group 3rd-place wildcard format map.
