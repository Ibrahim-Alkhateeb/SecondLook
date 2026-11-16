/** One off-plan offer, as listed by the agent, plus the area figures it is compared against. */
export interface Offer {
  id: string
  name: string
  area: string
  priceAED: number
  sizeSqft: number
  serviceChargePerSqftYear: number
  agentAnnualRent: number
  areaAnnualRent: number
  areaPricePerSqft: number
  agentPlanLabel: string
  pctBeforeHandover: number
  pctOnHandover: number
  pctAfterHandover: number
  statedHandover: string
  devProjectsDelivered: number
  devDeliveredOnTime: number
  devAvgDelayMonths: number
}
