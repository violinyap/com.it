export interface OnboardDataType {
  bday?: string,
  coderType?: CoderType | "", 
  mbti?: string,
  productivity?: number,
  stoken?: string,
  stress?: number,
  wdays?: string[],
  wstart?: string,
  wend?: string,
  repos?: string[],
}

export type CoderType = 'aspire' | 'bee' | 'owl' | 'hustle' | 'balance' | 'mindful' | 'goal' | 'solo';