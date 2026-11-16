/**
 * Every word SecondLook shows lives here, in English and Arabic (flag texts
 * and questions sit with their rules in flags.ts). Change wording in this
 * file only.
 */

export type Lang = 'en' | 'ar'
export type Dir = 'ltr' | 'rtl'

const en = {
  dir: 'ltr' as Dir,
  appName: 'SecondLook',
  tagline: 'Compare off-plan offers on the same basis.',
  notice: 'Illustrative mock data. Not real market figures. Not investment advice.',

  /** The language switch shows the other language, written in that language. */
  switchTo: { lang: 'ar' as Lang, label: 'العربية' },

  screen: {
    offers: 'Offers',
    compare: 'Compare',
    decide: 'Decide',
  },

  // ---- Source tags ----
  sourceTag: {
    agent: 'Agent figure',
    area: 'Area figure (mock)',
    calculated: 'Calculated',
  },
  sourceDetail: {
    agent: "From the agent's listing (mock data).",
    area: 'Illustrative area figure. Mock data, not a real market figure.',
  },
  sourceTagName: (tag: string, figure: string): string => `${tag}, source for ${figure}`,

  // ---- Units and number wording ----
  unit: {
    aed: 'AED',
    sqft: 'sqft',
    perSqft: 'AED per sqft',
    perSqftYear: 'AED per sqft per year',
  },
  times: 'x',
  months: (count: number): string => `${count} ${count === 1 ? 'month' : 'months'}`,
  handover: (quarter: number, year: number): string => `Q${quarter} ${year}`,
  /** Keeps a signed value such as "+3.6%" in reading order inside right-to-left text. */
  isolate: (value: string): string => value,

  // ---- Screen 1: Offers ----
  offers: {
    intro:
      'Six one-bedroom off-plan apartments. Tick 2 or 3 to see them side by side, with the source of every number.',
    price: 'Price',
    size: 'Size',
    compareButton: 'Compare',
    hint: 'Select 2 or 3 offers to compare.',
    selectedCount: (count: number): string => `${count} of 3 selected`,
    limitReached: 'Three offers is the limit. Untick one to choose another.',
  },

  // ---- Screen 2: Compare ----
  compare: {
    intro:
      'Same six numbers for each offer. Select a source tag to see where a number comes from. Select a flag to see the rule behind it.',
    tableCaption: 'Selected offers side by side',
    numberColumn: 'Number',
    backToOffers: 'Back to offers',
    decideButton: 'Decide',
    flags: 'Flags',
    noFlags: 'No flags from the four rules.',
  },

  row: {
    pricePerSqft: 'Price per sqft',
    rentalYield: 'Rental yield',
    serviceCharges: 'Service charges',
    paymentPlan: 'Payment plan',
    handover: 'Handover',
    developerRecord: 'Developer record',
  },

  field: {
    price: 'Price',
    size: 'Size',
    pricePerSqft: 'Price per sqft',
    areaPricePerSqft: 'Area price per sqft',
    priceAgainstArea: 'Price against area',
    agentYield: "Agent's yield",
    estimatedYield: 'Estimated yield after service charges',
    agentAnnualRent: "Agent's annual rent",
    areaAnnualRent: 'Area annual rent',
    serviceChargeRate: 'Service charge rate',
    serviceChargesPerYear: 'Service charges per year',
    planLabel: "Agent's label",
    beforeHandover: 'Before handover',
    onHandover: 'On handover',
    afterHandover: 'After handover',
    cashBeforeHandover: 'Cash needed before handover (includes 4% registration fee)',
    dueOnHandover: 'Due on handover',
    dueAfterHandover: 'Due after handover',
    statedHandover: 'Stated handover',
    projectsDelivered: 'Projects delivered',
    deliveredOnTime: 'Delivered on time',
    averageDelay: 'Average delay',
    onTimeShare: 'On-time share',
  },

  yieldNote:
    'Uses the area rent minus service charges only. Does not include management fees, empty months, repairs or furnishing. An estimate, not a promise.',

  /** One-line developer record. `onTimePct` is null when fewer than 3 projects were delivered. */
  developerRecord: (
    delivered: number,
    onTime: number,
    onTimePct: string | null,
    avgDelayMonths: number,
  ): string =>
    onTimePct === null
      ? `Limited track record: ${delivered} delivered, ${onTime} on time`
      : `Developer record: ${delivered} delivered - ${onTimePct} on time - ${
          avgDelayMonths === 0 ? 'no delay' : `average delay ${en.months(avgDelayMonths)}`
        }`,

  // ---- Formulas in words (shown behind "Calculated" tags) ----
  formula: {
    pricePerSqft: 'Price / size',
    priceAgainstArea: '(Price per sqft - area price per sqft) / area price per sqft',
    estimatedYield: '(Area annual rent - service charges per year) / price',
    serviceChargesPerYear: 'Service charge rate x size',
    cashBeforeHandover: (feeRate: string): string =>
      `Price x share before handover + ${feeRate} registration fee`,
    dueOnHandover: 'Price x share on handover',
    dueAfterHandover: 'Price x share after handover',
    onTimeShare: 'Delivered on time / projects delivered',
  },

  // ---- Neutral markers ----
  marker: {
    highest: 'Highest',
    lowest: 'Lowest',
    earliest: 'Earliest',
    latest: 'Latest',
  },
  markerSubject: {
    pricePerSqft: 'price per sqft',
    estimatedYield: 'estimated yield after service charges',
    serviceChargesPerYear: 'service charges per year',
    cashBeforeHandover: 'cash needed before handover',
    statedHandover: 'stated handover',
  },
  markerSentence: (marker: string, subject: string): string => `${marker} ${subject}`,

  // ---- Screen 3: Decide ----
  decide: {
    intro:
      'Choose one offer, or none of them. Your decision note appears below, and you can change your choice at any time.',
    choices: 'Your choice',
    myPick: 'My pick',
    myPickName: (name: string): string => `My pick: ${name}`,
    noneOfThese: 'None of these',
    backToCompare: 'Back to compare',
    noteHeading: 'Decision note',
    noChoiceYet: 'Choose an offer or "None of these" to see your decision note.',
  },

  noteSection: {
    standsOut: 'What stands out',
    watchOuts: 'Watch-outs',
    questions: 'Questions for the agent',
    notChecked: 'Not checked by this tool',
  },
  noMarkers: 'No highest or lowest values among the compared offers.',
  notChecked:
    'Real market prices and rents. Management fees, empty months and repairs. Future price changes. Mortgage, tax and currency.',
}

export type Labels = typeof en

const QUARTERS_AR = ['الأول', 'الثاني', 'الثالث', 'الرابع']

const monthsAr = (count: number): string => {
  if (count === 1) return 'شهر واحد'
  if (count === 2) return 'شهران'
  if (count >= 3 && count <= 10) return `${count} أشهر`
  return `${count} شهراً`
}

const ar: Labels = {
  dir: 'rtl',
  appName: 'SecondLook',
  tagline: 'قارن عروض العقارات على الخارطة على الأساس نفسه.',
  notice: 'بيانات افتراضية للتوضيح. ليست أرقام سوق حقيقية. ليست نصيحة استثمارية.',

  switchTo: { lang: 'en', label: 'English' },

  screen: {
    offers: 'العروض',
    compare: 'المقارنة',
    decide: 'القرار',
  },

  sourceTag: {
    agent: 'رقم الوسيط',
    area: 'رقم المنطقة (افتراضي)',
    calculated: 'محسوب',
  },
  sourceDetail: {
    agent: 'من إعلان الوسيط (بيانات افتراضية).',
    area: 'رقم توضيحي للمنطقة. بيانات افتراضية، وليس رقماً حقيقياً من السوق.',
  },
  sourceTagName: (tag, figure) => `${tag}، مصدر ${figure}`,

  unit: {
    aed: 'درهم',
    sqft: 'قدم مربعة',
    perSqft: 'درهم للقدم المربعة',
    perSqftYear: 'درهم للقدم المربعة سنوياً',
  },
  times: '×',
  months: monthsAr,
  handover: (quarter, year) => `الربع ${QUARTERS_AR[quarter - 1]} ${year}`,
  isolate: (value) => `⁦${value}⁩`,

  offers: {
    intro:
      'ست شقق بغرفة نوم واحدة على الخارطة. حدّد عرضين أو ثلاثة لتراها جنباً إلى جنب، مع مصدر كل رقم.',
    price: 'السعر',
    size: 'المساحة',
    compareButton: 'قارن',
    hint: 'اختر عرضين أو ثلاثة للمقارنة.',
    selectedCount: (count) => `المحدد: ${count} من 3`,
    limitReached: 'ثلاثة عروض هي الحد الأقصى. ألغِ تحديد أحدها لاختيار غيره.',
  },

  compare: {
    intro:
      'الأرقام الستة نفسها لكل عرض. اختر وسم المصدر لترى من أين جاء الرقم، واختر التنبيه لترى القاعدة التي وراءه.',
    tableCaption: 'العروض المحددة جنباً إلى جنب',
    numberColumn: 'الرقم',
    backToOffers: 'العودة إلى العروض',
    decideButton: 'قرّر',
    flags: 'تنبيهات',
    noFlags: 'لا تنبيهات من القواعد الأربع.',
  },

  row: {
    pricePerSqft: 'سعر القدم المربعة',
    rentalYield: 'العائد الإيجاري',
    serviceCharges: 'رسوم الخدمات',
    paymentPlan: 'خطة السداد',
    handover: 'التسليم',
    developerRecord: 'سجل المطوّر',
  },

  field: {
    price: 'السعر',
    size: 'المساحة',
    pricePerSqft: 'سعر القدم المربعة',
    areaPricePerSqft: 'سعر القدم المربعة في المنطقة',
    priceAgainstArea: 'السعر مقارنةً بالمنطقة',
    agentYield: 'عائد الوسيط',
    estimatedYield: 'العائد التقديري بعد رسوم الخدمات',
    agentAnnualRent: 'الإيجار السنوي بحسب الوسيط',
    areaAnnualRent: 'إيجار المنطقة السنوي',
    serviceChargeRate: 'سعر رسوم الخدمات',
    serviceChargesPerYear: 'رسوم الخدمات السنوية',
    planLabel: 'تسمية الوسيط',
    beforeHandover: 'قبل التسليم',
    onHandover: 'عند التسليم',
    afterHandover: 'بعد التسليم',
    cashBeforeHandover: 'النقد المطلوب قبل التسليم (يشمل رسوم التسجيل 4%)',
    dueOnHandover: 'المستحق عند التسليم',
    dueAfterHandover: 'المستحق بعد التسليم',
    statedHandover: 'موعد التسليم المعلن',
    projectsDelivered: 'المشاريع المسلَّمة',
    deliveredOnTime: 'المسلَّمة في الموعد',
    averageDelay: 'متوسط التأخير',
    onTimeShare: 'نسبة التسليم في الموعد',
  },

  yieldNote:
    'يعتمد على إيجار المنطقة مطروحاً منه رسوم الخدمات فقط. لا يشمل رسوم الإدارة ولا أشهر الشغور ولا الإصلاحات ولا التأثيث. تقدير وليس وعداً.',

  developerRecord: (delivered, onTime, onTimePct, avgDelayMonths) =>
    onTimePct === null
      ? `سجل محدود: المشاريع المسلَّمة ${delivered}، منها في الموعد ${onTime}`
      : `سجل المطوّر: المشاريع المسلَّمة ${delivered} - في الموعد ${onTimePct} - ${
          avgDelayMonths === 0 ? 'بلا تأخير' : `متوسط التأخير ${monthsAr(avgDelayMonths)}`
        }`,

  formula: {
    pricePerSqft: 'السعر / المساحة',
    priceAgainstArea:
      '(سعر القدم المربعة - سعر القدم المربعة في المنطقة) / سعر القدم المربعة في المنطقة',
    estimatedYield: '(إيجار المنطقة السنوي - رسوم الخدمات السنوية) / السعر',
    serviceChargesPerYear: 'سعر رسوم الخدمات × المساحة',
    cashBeforeHandover: (feeRate) => `السعر × نسبة ما قبل التسليم + رسوم التسجيل ${feeRate}`,
    dueOnHandover: 'السعر × نسبة ما عند التسليم',
    dueAfterHandover: 'السعر × نسبة ما بعد التسليم',
    onTimeShare: 'المسلَّمة في الموعد / المشاريع المسلَّمة',
  },

  marker: {
    highest: 'الأعلى',
    lowest: 'الأدنى',
    earliest: 'الأقرب',
    latest: 'الأبعد',
  },
  markerSubject: {
    pricePerSqft: 'سعر القدم المربعة',
    estimatedYield: 'العائد التقديري بعد رسوم الخدمات',
    serviceChargesPerYear: 'رسوم الخدمات السنوية',
    cashBeforeHandover: 'النقد المطلوب قبل التسليم',
    statedHandover: 'موعد التسليم المعلن',
  },
  markerSentence: (marker, subject) => `${marker} في ${subject}`,

  decide: {
    intro:
      'اختر عرضاً واحداً، أو لا تختر أياً منها. تظهر مذكرة قرارك أدناه، ويمكنك تغيير اختيارك في أي وقت.',
    choices: 'اختيارك',
    myPick: 'اختياري',
    myPickName: (name) => `اختياري: ${name}`,
    noneOfThese: 'لا شيء منها',
    backToCompare: 'العودة إلى المقارنة',
    noteHeading: 'مذكرة القرار',
    noChoiceYet: 'اختر عرضاً أو "لا شيء منها" لترى مذكرة قرارك.',
  },

  noteSection: {
    standsOut: 'ما يلفت النظر',
    watchOuts: 'نقاط الحذر',
    questions: 'أسئلة للوسيط',
    notChecked: 'ما لم تتحقق منه هذه الأداة',
  },
  noMarkers: 'لا قيم عليا أو دنيا بين العروض المقارَنة.',
  notChecked:
    'أسعار السوق والإيجارات الحقيقية. رسوم الإدارة وأشهر الشغور والإصلاحات. تغيّرات الأسعار مستقبلاً. التمويل العقاري والضرائب والعملة.',
}

export const LABELS: Record<Lang, Labels> = { en, ar }

export type SourceKind = keyof Labels['sourceTag']
