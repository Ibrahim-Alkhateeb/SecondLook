/**
 * Builds the comparison for one offer: the six numbers, each figure with its
 * display value and its source (where it came from, or the formula with this
 * offer's values).
 */
import type { Offer } from '../types'
import {
  REGISTRATION_FEE_RATE,
  agentYield,
  cashBeforeHandover,
  dueAfterHandover,
  dueOnHandover,
  estimatedYieldAfterServiceCharges,
  formatMoney,
  formatPct,
  formatShare,
  formatSignedPct,
  formatWhole,
  formatWholePct,
  handoverParts,
  onTimeShare,
  priceAgainstArea,
  pricePerSqft,
  registrationFee,
  serviceChargesPerYear,
} from './calc'
import { LABELS, type Labels, type Lang, type SourceKind } from './labels'
import type { MarkerKey } from './markers'

export interface Source {
  kind: SourceKind
  detail: string
}

export interface Figure {
  key: string
  label: string
  value: string
  source: Source
  /** Set when this figure can carry a neutral marker. */
  markerKey?: MarkerKey
}

export interface Row {
  key: keyof Labels['row']
  title: string
  figures: Figure[]
  /** A one-line summary shown above the figures. */
  summary?: string
  /** A note shown under the row, across all columns. */
  note?: string
}

const calculated = (formula: string, withValues: string, result: string): Source => ({
  kind: 'calculated',
  detail: `${formula} = ${withValues} = ${result}`,
})

/** Price and size, shown at the top of each column. */
export function headlineFigures(o: Offer, lang: Lang = 'en'): Figure[] {
  const L = LABELS[lang]
  const agent: Source = { kind: 'agent', detail: L.sourceDetail.agent }
  return [
    {
      key: 'price',
      label: L.field.price,
      value: formatMoney(o.priceAED, L.unit.aed),
      source: agent,
    },
    {
      key: 'size',
      label: L.field.size,
      value: `${formatWhole(o.sizeSqft)} ${L.unit.sqft}`,
      source: agent,
    },
  ]
}

/** The six numbers for one offer, in display order. */
export function buildRows(o: Offer, lang: Lang = 'en'): Row[] {
  const L = LABELS[lang]
  const F = L.field
  const agent: Source = { kind: 'agent', detail: L.sourceDetail.agent }
  const area: Source = { kind: 'area', detail: L.sourceDetail.area }
  const money = (value: number) => formatMoney(value, L.unit.aed)

  const price = formatWhole(o.priceAED)
  const size = formatWhole(o.sizeSqft)
  const perSqft = `${formatWhole(pricePerSqft(o))} ${L.unit.perSqft}`
  const againstArea = L.isolate(formatSignedPct(priceAgainstArea(o)))
  const charges = serviceChargesPerYear(o)
  const share = onTimeShare(o)
  const sharePct = share === null ? null : formatPct(share)
  const handover = handoverParts(o.statedHandover)

  const developerFigures: Figure[] = [
    {
      key: 'projectsDelivered',
      label: F.projectsDelivered,
      value: formatWhole(o.devProjectsDelivered),
      source: agent,
    },
    {
      key: 'deliveredOnTime',
      label: F.deliveredOnTime,
      value: formatWhole(o.devDeliveredOnTime),
      source: agent,
    },
    {
      key: 'averageDelay',
      label: F.averageDelay,
      value: L.months(o.devAvgDelayMonths),
      source: agent,
    },
  ]
  if (sharePct !== null) {
    developerFigures.push({
      key: 'onTimeShare',
      label: F.onTimeShare,
      value: sharePct,
      source: calculated(
        L.formula.onTimeShare,
        `${o.devDeliveredOnTime} / ${o.devProjectsDelivered}`,
        sharePct,
      ),
    })
  }

  return [
    {
      key: 'pricePerSqft',
      title: L.row.pricePerSqft,
      figures: [
        {
          key: 'pricePerSqft',
          label: F.pricePerSqft,
          value: perSqft,
          source: calculated(L.formula.pricePerSqft, `${price} / ${size}`, perSqft),
          markerKey: 'pricePerSqft',
        },
        {
          key: 'areaPricePerSqft',
          label: F.areaPricePerSqft,
          value: `${formatWhole(o.areaPricePerSqft)} ${L.unit.perSqft}`,
          source: area,
        },
        {
          key: 'priceAgainstArea',
          label: F.priceAgainstArea,
          value: againstArea,
          source: calculated(
            L.formula.priceAgainstArea,
            `(${formatWhole(pricePerSqft(o))} - ${formatWhole(o.areaPricePerSqft)}) / ${formatWhole(o.areaPricePerSqft)}`,
            againstArea,
          ),
        },
      ],
    },
    {
      key: 'rentalYield',
      title: L.row.rentalYield,
      note: L.yieldNote,
      figures: [
        { key: 'agentYield', label: F.agentYield, value: formatPct(agentYield(o)), source: agent },
        {
          key: 'estimatedYield',
          label: F.estimatedYield,
          value: formatPct(estimatedYieldAfterServiceCharges(o)),
          source: calculated(
            L.formula.estimatedYield,
            `(${formatWhole(o.areaAnnualRent)} - ${formatWhole(charges)}) / ${price}`,
            formatPct(estimatedYieldAfterServiceCharges(o)),
          ),
          markerKey: 'estimatedYield',
        },
        {
          key: 'agentAnnualRent',
          label: F.agentAnnualRent,
          value: money(o.agentAnnualRent),
          source: agent,
        },
        {
          key: 'areaAnnualRent',
          label: F.areaAnnualRent,
          value: money(o.areaAnnualRent),
          source: area,
        },
      ],
    },
    {
      key: 'serviceCharges',
      title: L.row.serviceCharges,
      figures: [
        {
          key: 'serviceChargeRate',
          label: F.serviceChargeRate,
          value: `${formatWhole(o.serviceChargePerSqftYear)} ${L.unit.perSqftYear}`,
          source: agent,
        },
        {
          key: 'serviceChargesPerYear',
          label: F.serviceChargesPerYear,
          value: money(charges),
          source: calculated(
            L.formula.serviceChargesPerYear,
            `${formatWhole(o.serviceChargePerSqftYear)} ${L.times} ${size}`,
            money(charges),
          ),
          markerKey: 'serviceChargesPerYear',
        },
      ],
    },
    {
      key: 'paymentPlan',
      title: L.row.paymentPlan,
      figures: [
        {
          key: 'planLabel',
          label: F.planLabel,
          value: L.isolate(o.agentPlanLabel),
          source: agent,
        },
        {
          key: 'beforeHandover',
          label: F.beforeHandover,
          value: formatShare(o.pctBeforeHandover),
          source: agent,
        },
        {
          key: 'onHandover',
          label: F.onHandover,
          value: formatShare(o.pctOnHandover),
          source: agent,
        },
        {
          key: 'afterHandover',
          label: F.afterHandover,
          value: formatShare(o.pctAfterHandover),
          source: agent,
        },
        {
          key: 'cashBeforeHandover',
          label: F.cashBeforeHandover,
          value: money(cashBeforeHandover(o)),
          source: calculated(
            L.formula.cashBeforeHandover(formatWholePct(REGISTRATION_FEE_RATE)),
            `${price} ${L.times} ${formatShare(o.pctBeforeHandover)} + ${formatWhole(registrationFee(o))}`,
            money(cashBeforeHandover(o)),
          ),
          markerKey: 'cashBeforeHandover',
        },
        {
          key: 'dueOnHandover',
          label: F.dueOnHandover,
          value: money(dueOnHandover(o)),
          source: calculated(
            L.formula.dueOnHandover,
            `${price} ${L.times} ${formatShare(o.pctOnHandover)}`,
            money(dueOnHandover(o)),
          ),
        },
        {
          key: 'dueAfterHandover',
          label: F.dueAfterHandover,
          value: money(dueAfterHandover(o)),
          source: calculated(
            L.formula.dueAfterHandover,
            `${price} ${L.times} ${formatShare(o.pctAfterHandover)}`,
            money(dueAfterHandover(o)),
          ),
        },
      ],
    },
    {
      key: 'handover',
      title: L.row.handover,
      figures: [
        {
          key: 'statedHandover',
          label: F.statedHandover,
          value: L.handover(handover.quarter, handover.year),
          source: agent,
          markerKey: 'statedHandover',
        },
      ],
    },
    {
      key: 'developerRecord',
      title: L.row.developerRecord,
      summary: L.developerRecord(
        o.devProjectsDelivered,
        o.devDeliveredOnTime,
        sharePct,
        o.devAvgDelayMonths,
      ),
      figures: developerFigures,
    },
  ]
}
