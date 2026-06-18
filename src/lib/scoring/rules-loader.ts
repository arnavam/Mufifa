import { createAdminClient } from '../supabase/admin'
import { ScoringRule } from '@/types/scoring'

export async function loadScoringRules(): Promise<Record<string, ScoringRule>> {
  const supabase = createAdminClient()
  const { data: rules } = await supabase
    .from('scoring_rules')
    .select('*')
    .eq('is_enabled', true)

  const rulesMap: Record<string, ScoringRule> = {}
  
  if (rules) {
    rules.forEach(rule => {
      rulesMap[rule.rule_key] = rule
    })
  }

  return rulesMap
}
