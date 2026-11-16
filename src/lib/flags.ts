/**
 * The four flag rules. Flags are observations, not verdicts.
 * The thresholds are SecondLook settings, not market rules, and are always
 * applied to unrounded values.
 */
import type { Offer } from '../types'
import {
  agentRentAgainstAreaRent,
  dueAfterHandover,
  formatMoney,
  formatPct,
  formatShare,
  formatWholePct,
  priceAgainstArea,
} from './calc'
import { LABELS, type Lang } from './labels'

export const THRESHOLDS = {
  /** F1: price per sqft above the area figure by more than this fraction. */
  priceAboveArea: 0.1,
  /** F2: agent's rent above the area rent by more than this fraction. */
  rentAboveArea: 0.1,
  /** F4: fewer delivered projects than this. */
  minProjectsDelivered: 3,
  /** F4: average delay above this many months. */
  maxAvgDelayMonths: 6,
} as const

export type FlagId = 'F1' | 'F2' | 'F3' | 'F4'

export interface Flag {
  id: FlagId
  /** The observation, in plain words, with this offer's values. */
  text: string
  /** The rule behind the flag. */
  rule: string
  /** The question this flag adds to the decision note. */
  question: string
}

interface FlagWords {
  rules: Record<FlagId, string>
  questions: Record<FlagId, string>
  alwaysQuestions: readonly string[]
  priceAboveArea: (pct: string) => string
  rentAboveArea: (pct: string) => string
  dueAfterHandover: (share: string, amount: string) => string
  limitedRecord: (delivered: number, onTime: number) => string
  lateOnAverage: (months: number) => string
}

const priceLimit = formatWholePct(THRESHOLDS.priceAboveArea)
const rentLimit = formatWholePct(THRESHOLDS.rentAboveArea)

const WORDS: Record<Lang, FlagWords> = {
  en: {
    rules: {
      F1: `Rule: price per sqft more than ${priceLimit} above the area figure.`,
      F2: `Rule: agent's rent more than ${rentLimit} above the area rent.`,
      F3: 'Rule: any share of the price due after handover.',
      F4: `Rule: fewer than ${THRESHOLDS.minProjectsDelivered} projects delivered, or average delay above ${THRESHOLDS.maxAvgDelayMonths} months.`,
    },
    questions: {
      F1: 'Which recent sales nearby support this price per sqft?',
      F2: 'Which similar units rent at that level today? Is your yield before or after service charges?',
      F3: 'Over how long is it paid, and what happens if I miss a payment?',
      F4: 'Which projects has this developer handed over, and how late was each one?',
    },
    alwaysQuestions: [
      'Is the 4% registration fee included in the price, waived, or on top?',
      'Who confirmed the service charge rate, and can it change after handover?',
    ],
    priceAboveArea: (pct) => `Price per sqft is ${pct} above the area figure.`,
    rentAboveArea: (pct) => `The agent's yield assumes a rent ${pct} above the area figure.`,
    dueAfterHandover: (share, amount) =>
      `${share} of the price (${amount}) is still due after handover.`,
    limitedRecord: (delivered, onTime) =>
      `Limited track record: ${delivered} delivered, ${onTime} on time.`,
    lateOnAverage: (months) => `Past projects were ${months} months late on average.`,
  },
  ar: {
    rules: {
      F1: `القاعدة: سعر القدم المربعة أعلى من رقم المنطقة بأكثر من ${priceLimit}.`,
      F2: `القاعدة: إيجار الوسيط أعلى من إيجار المنطقة بأكثر من ${rentLimit}.`,
      F3: 'القاعدة: أي نسبة من السعر تُستحق بعد التسليم.',
      F4: `القاعدة: أقل من ${THRESHOLDS.minProjectsDelivered} مشاريع مسلَّمة، أو متوسط تأخير يتجاوز ${LABELS.ar.months(THRESHOLDS.maxAvgDelayMonths)}.`,
    },
    questions: {
      F1: 'ما المبيعات الحديثة القريبة التي تدعم سعر القدم المربعة هذا؟',
      F2: 'ما الوحدات المشابهة المؤجَّرة بهذا المستوى اليوم؟ وهل عائدك قبل رسوم الخدمات أم بعدها؟',
      F3: 'على أي مدة يُسدَّد، وماذا يحدث إن فاتني قسط؟',
      F4: 'ما المشاريع التي سلّمها هذا المطوّر، وكم تأخر كل منها؟',
    },
    alwaysQuestions: [
      'هل رسوم التسجيل 4% مشمولة في السعر، أم معفاة، أم تُضاف إليه؟',
      'من أكّد سعر رسوم الخدمات، وهل يمكن أن يتغير بعد التسليم؟',
    ],
    priceAboveArea: (pct) => `سعر القدم المربعة أعلى من رقم المنطقة بنسبة ${pct}.`,
    rentAboveArea: (pct) => `عائد الوسيط يفترض إيجاراً أعلى من رقم المنطقة بنسبة ${pct}.`,
    dueAfterHandover: (share, amount) => `${share} من السعر (${amount}) تبقى مستحقة بعد التسليم.`,
    limitedRecord: (delivered, onTime) =>
      `سجل محدود: المشاريع المسلَّمة ${delivered}، منها في الموعد ${onTime}.`,
    lateOnAverage: (months) =>
      `تأخرت المشاريع السابقة ${LABELS.ar.months(months)} في المتوسط.`,
  },
}

export const RULES = WORDS.en.rules
export const QUESTIONS = WORDS.en.questions
export const ALWAYS_QUESTIONS = WORDS.en.alwaysQuestions

export function flagsFor(o: Offer, lang: Lang = 'en'): Flag[] {
  const words = WORDS[lang]
  const flags: Flag[] = []
  const add = (id: FlagId, text: string) =>
    flags.push({ id, text, rule: words.rules[id], question: words.questions[id] })

  const priceGap = priceAgainstArea(o)
  if (priceGap > THRESHOLDS.priceAboveArea) {
    add('F1', words.priceAboveArea(formatPct(priceGap)))
  }

  const rentGap = agentRentAgainstAreaRent(o)
  if (rentGap > THRESHOLDS.rentAboveArea) {
    add('F2', words.rentAboveArea(formatPct(rentGap)))
  }

  if (o.pctAfterHandover > 0) {
    add(
      'F3',
      words.dueAfterHandover(
        formatShare(o.pctAfterHandover),
        formatMoney(dueAfterHandover(o), LABELS[lang].unit.aed),
      ),
    )
  }

  if (o.devProjectsDelivered < THRESHOLDS.minProjectsDelivered) {
    add('F4', words.limitedRecord(o.devProjectsDelivered, o.devDeliveredOnTime))
  }
  if (o.devAvgDelayMonths > THRESHOLDS.maxAvgDelayMonths) {
    add('F4', words.lateOnAverage(o.devAvgDelayMonths))
  }

  return flags
}

/** Questions for the agent: one per flagged rule, then the two that are always asked. */
export function questionsFor(flags: Flag[], lang: Lang = 'en'): string[] {
  return [...new Set([...flags.map((f) => f.question), ...WORDS[lang].alwaysQuestions])]
}
