# USER_FLOWS.md

# FIFA World Cup 2026 ML Prediction Challenge

## User Flow Specification

Version: 1.0

---

# Purpose

This document defines every major user journey within the application.

The implementation must follow these flows exactly.

No alternative workflows should be introduced unless explicitly approved.

---

# User Types

1. Public Visitor
2. Participant
3. Administrator

---

# FLOW 1: Public Visitor

Purpose:

Allow anyone to explore the competition.

Entry Point:

Homepage

Flow:

Homepage

↓

View Tournament Overview

↓

View Leaderboard

↓

View Analytics

↓

View Rankings

↓

Register

OR

Login

---

Expected Pages:

/

/leaderboard

/analytics

/login

/register

---

# FLOW 2: Participant Registration

Purpose:

Create a participant account.

Flow:

Register

↓

Enter Email

↓

Enter Password

↓

Create Account

↓

Email Verification

↓

Login

↓

Create Team

↓

Dashboard

---

Validation:

Email required

Valid email format

Password minimum length

Unique team name

---

Failure States:

Email already exists

Invalid email

Weak password

Team name already taken

---

Success State:

User redirected to Dashboard

---

# FLOW 3: Participant Login

Flow:

Login

↓

Enter Credentials

↓

Authenticate

↓

Dashboard

---

Failure States:

Invalid credentials

Disabled account

Unverified account

---

Success State:

Dashboard loads

---

# FLOW 4: Create Team

Purpose:

Each participant owns exactly one team.

Flow:

Dashboard

↓

Create Team

↓

Enter Team Name

↓

Validate Availability

↓

Create Team

↓

Submission Center

---

Rules:

One team per user

Team names unique

Cannot be modified after submission lock

---

# FLOW 5: Download CSV Template

Purpose:

Provide official submission format.

Flow:

Submission Center

↓

Download Template

↓

Template Downloaded

---

Requirements:

Latest template version only

Template generated from system configuration

---

# FLOW 6: Submit Prediction File

Purpose:

Upload tournament predictions.

Flow:

Submission Center

↓

Upload CSV

↓

Store File

↓

Validate CSV

↓

Validate Teams

↓

Validate Players

↓

Validate Match Coverage

↓

Parse Predictions

↓

Create Submission

↓

Lock Submission

↓

Success Confirmation

---

Validation Rules:

All matches predicted

Champion included

Required columns present

Valid teams

Valid players

Valid confidence values

No duplicate rows

No missing matches

---

Failure States:

Invalid CSV

Missing columns

Duplicate matches

Unknown player

Invalid score

Incomplete tournament predictions

---

Success State:

Submission permanently locked

---

# FLOW 7: View Personal Dashboard

Purpose:

Allow participants to monitor performance.

Flow:

Dashboard

↓

Overview

↓

View Score Breakdown

↓

View Submission Summary

↓

View Accuracy Metrics

↓

View Champion Status

---

Dashboard Widgets:

Total Score

Current Rank

Accuracy %

Winner Accuracy

Score Accuracy

Scorer Accuracy

Stats Accuracy

Champion Prediction Status

Confidence Impact

---

# FLOW 8: View Leaderboard

Purpose:

Public ranking page.

Flow:

Leaderboard

↓

Load Rankings

↓

Sort Results

↓

Display Teams

↓

Display Metrics

---

Displayed Information:

Rank

Team Name

Total Score

Accuracy %

Winner Accuracy

Score Accuracy

Champion Status

---

Not Displayed:

Raw submissions

Prediction files

Detailed match predictions

---

# FLOW 9: View Tournament Analytics

Purpose:

Provide insights.

Flow:

Analytics

↓

Load Metrics

↓

Load Charts

↓

Display Results

---

Metrics:

Overall Accuracy

Most Accurate Team

Hardest Match

Easiest Match

Average Confidence

Champion Prediction Distribution

Winner Prediction Accuracy

Score Prediction Accuracy

Scorer Prediction Accuracy

---

# FLOW 10: Compare Teams

Purpose:

Compare leaderboard participants.

Flow:

Analytics

↓

Select Team A

↓

Select Team B

↓

Generate Comparison

↓

Display Metrics

---

Comparison Metrics:

Total Score

Winner Accuracy

Score Accuracy

Scorer Accuracy

Stats Accuracy

Champion Accuracy

Confidence Calibration

---

# FLOW 11: Admin Login

Purpose:

Secure administrative access.

Flow:

Admin Login

↓

Authenticate

↓

Verify Role

↓

Admin Dashboard

---

Requirements:

Admin role required

Non-admin users denied

---

# FLOW 12: Admin Tournament Management

Purpose:

Manage World Cup matches.

Flow:

Admin Dashboard

↓

Tournament Management

↓

Create Match

OR

Edit Match

↓

Save

---

Editable Fields:

Match Code

Stage

Teams

Kickoff Time

Multiplier

Status

---

# FLOW 13: Admin Result Entry

Purpose:

Enter official results.

Flow:

Admin Dashboard

↓

Results Management

↓

Select Match

↓

Enter Actual Result

↓

Save

↓

Trigger Recalculation

↓

Leaderboard Updated

---

Fields:

Winner

Scores

Extra Time

Penalties

Goal Scorers

First Goal Scorer

Possession

Shots

xG

Cards

---

# FLOW 14: Scoring Configuration

Purpose:

Modify scoring system.

Flow:

Admin Dashboard

↓

Scoring Configuration

↓

Update Rule

↓

Save

↓

Recalculate Scores

↓

Leaderboard Updated

---

Editable:

Winner Points

Scoreline Points

Scorer Points

Champion Points

Confidence Bonus

Multipliers

All Configurable Rules

---

# FLOW 15: Leaderboard Recalculation

System Flow

Triggered By:

Result Update

Scoring Change

Manual Admin Action

Process:

Load Predictions

↓

Load Results

↓

Calculate Scores

↓

Apply Multipliers

↓

Calculate Accuracy

↓

Update Leaderboard

↓

Update Analytics

↓

Broadcast Realtime Events

---

Expected Duration:

Less than 30 seconds

---

# FLOW 16: Public Tournament Progression

Purpose:

Track competition progress.

Flow:

Homepage

↓

Current Tournament Status

↓

Upcoming Matches

↓

Completed Matches

↓

Leaderboard

---

Widgets:

Tournament Progress

Match Counter

Completed Matches

Remaining Matches

Current Leader

---

# FLOW 17: Submission Lock Enforcement

Purpose:

Prevent prediction tampering.

Flow:

Submission Created

↓

Validation Passed

↓

Submission Locked

↓

No Further Modifications

---

Restrictions:

No CSV Reupload

No Prediction Editing

No Champion Editing

No Team Renaming

---

Admin Override:

Allowed

Logged in Audit Log

---

# FLOW 18: Audit Logging

Purpose:

Track critical actions.

Trigger Events:

Admin Login

Result Update

Scoring Change

User Disable

Submission Override

Tournament Edit

Leaderboard Recalculation

---

Stored Information:

Actor

Timestamp

Action

Entity

Payload

---

# FLOW 19: Logout

Flow:

Logout

↓

Destroy Session

↓

Redirect Homepage

---

# FLOW 20: Error Recovery

CSV Upload Failure

↓

Display Validation Errors

↓

Allow Reupload

Only Before Successful Submission

---

Database Failure

↓

Display Friendly Error

↓

Retry Option

---

Unauthorized Access

↓

Redirect Login

OR

Show Access Denied

---

# Mobile Requirements

All flows must function on:

Desktop

Tablet

Mobile

---

Accessibility Requirements

Keyboard Navigation

Screen Reader Support

Color Contrast Compliance

Focus States

Responsive Layouts

---

User Experience Principles

Fast

Simple

Transparent

Competition-Focused

Mobile Friendly

Football Tournament Themed

Leaderboard First
