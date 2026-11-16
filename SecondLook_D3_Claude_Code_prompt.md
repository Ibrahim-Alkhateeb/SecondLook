# Build SecondLook v1: a prototype for comparing 2-3 off-plan offers in Dubai

## 1. Goal

Build a small web app called **SecondLook**. It helps an investor compare 2-3 off-plan property offers on the same basis, see where every number comes from, and end with a short decision note.

**The person.** Fawzi is a first-time international investor exploring off-plan property in Dubai. He has the figures for a few offers, scattered across listings and decks, and he does not fully trust the figures an agent hands him.

**The moment.** He has 2-3 offers in front of him and must pick one, or none.

**What the app must make possible.** Fawzi should be able to answer three questions in his own words:

1. **Why this one?** Why this offer and not the others, on the same basis.
2. **What could go wrong?** The risk he is accepting.
3. **What do I still have to check?** The figures he has not verified and the questions for the agent.

"None of these" is a valid outcome when he can say why.

The app never decides for him. It gives no score, no ranking and no recommendation.

## 2. What to build: three screens

### Screen 1: Offers

- Show the six offers from the data file as cards: name, area, price (AED), size (sqft).
- Fawzi ticks 2 or 3 cards.
- A "Compare" button is enabled only when 2 or 3 offers are ticked. A fourth offer cannot be ticked. Next to the button, show a short hint: "Select 2 or 3 offers to compare."

### Screen 2: Compare

- One column per selected offer, one block per number. The six numbers, in this order:

| Row | What it shows | Source tag |
|---|---|---|
| Price per sqft | Price per sqft; area price per sqft; price against area (signed %) | Calculated; Area figure (mock); Calculated |
| Rental yield | "Agent's yield" and "Estimated yield after service charges"; the agent's annual rent and the area annual rent they use | Agent figure; Calculated; Agent figure; Area figure (mock) |
| Service charges | Rate (AED/sqft/yr) and service charges per year (AED) | Agent figure; Calculated |
| Payment plan | Agent's label; "Before handover" / "On handover" / "After handover" shares; "Cash needed before handover (includes 4% registration fee)"; amount due on handover; amount due after handover | Agent figure; Agent figure; Calculated; Calculated; Calculated |
| Handover | "Stated handover" | Agent figure |
| Developer record | Projects delivered, delivered on time, average delay; on-time share (only with 3 or more delivered) | Agent figure; Calculated |

- Also show price (AED) and size (sqft) at the top of each column, tagged "Agent figure".
- Under the yield row, show this note exactly: "Uses the area rent minus service charges only. Does not include management fees, empty months, repairs or furnishing. An estimate, not a promise."
- **Source tags.** Every number carries one tag: "Agent figure", "Area figure (mock)" or "Calculated". Tapping or focusing a tag opens a small panel:
  - Agent figure: "From the agent's listing (mock data)."
  - Area figure (mock): "Illustrative area figure. Mock data, not a real market figure."
  - Calculated: the formula in words, then the same formula with this offer's values, for example "Price / size = 1,050,000 / 780 = 1,346 AED per sqft".
- **Neutral markers.** Where the selected offers differ, mark the highest and lowest value in these rows: price per sqft, estimated yield after service charges, service charges per year, cash needed before handover. Mark the earliest and latest in stated handover. Use only the words "Highest", "Lowest", "Earliest", "Latest". If all values in a row are equal, show no marker.
- **Flags.** Under each column, list that offer's flags in plain words (section 5). If it has none, show "No flags from the four rules." Each flag shows the rule behind it on tap, for example "Rule: price per sqft more than 10% above the area figure."
- A button "Decide" goes to screen 3. A link goes back to screen 1 and keeps the selection.

### Screen 3: Decide

- One "My pick" button per compared offer, plus one "None of these" button.
- After a choice, show the **decision note** with four sections, in this order:
  1. **What stands out**: for the picked offer, its neutral markers written as sentences, for example "Highest estimated yield after service charges" or "Lowest cash needed before handover". If it has none, "No highest or lowest values among the compared offers."
  2. **Watch-outs**: the flag texts for the picked offer. If it has none, "No flags from the four rules."
  3. **Questions for the agent**: the question linked to each of its flags, then the two questions that are always shown (section 5).
  4. **Not checked by this tool**: this fixed text exactly: "Real market prices and rents. Management fees, empty months and repairs. Future price changes. Mortgage, tax and currency."
- With "None of these", the note shows sections 1 to 3 for every compared offer, grouped under the offer's name, then section 4 once.
- Fawzi can change his choice; the note updates.

### On every screen

Show this notice, always visible: **"Illustrative mock data. Not real market figures. Not investment advice."**

## 3. Data

Put this JSON, unchanged, in one file: `src/data/offers.json`. All names and figures are invented. All units are one-bedroom apartments. Currency is AED. Sizes are in sqft.

```json
[
  {
    "id": "palm-grove",
    "name": "Palm Grove Heights",
    "area": "JVC",
    "priceAED": 1050000,
    "sizeSqft": 780,
    "serviceChargePerSqftYear": 14,
    "agentAnnualRent": 88000,
    "areaAnnualRent": 78000,
    "areaPricePerSqft": 1300,
    "agentPlanLabel": "60/40",
    "pctBeforeHandover": 60,
    "pctOnHandover": 40,
    "pctAfterHandover": 0,
    "statedHandover": "Q4 2027",
    "devProjectsDelivered": 12,
    "devDeliveredOnTime": 10,
    "devAvgDelayMonths": 2
  },
  {
    "id": "aurora",
    "name": "Aurora Sky Tower",
    "area": "Arjan",
    "priceAED": 980000,
    "sizeSqft": 700,
    "serviceChargePerSqftYear": 21,
    "agentAnnualRent": 93000,
    "areaAnnualRent": 70000,
    "areaPricePerSqft": 1150,
    "agentPlanLabel": "50/10/40",
    "pctBeforeHandover": 50,
    "pctOnHandover": 10,
    "pctAfterHandover": 40,
    "statedHandover": "Q1 2028",
    "devProjectsDelivered": 2,
    "devDeliveredOnTime": 0,
    "devAvgDelayMonths": 14
  },
  {
    "id": "southgate",
    "name": "Southgate Terraces",
    "area": "Dubai South",
    "priceAED": 890000,
    "sizeSqft": 800,
    "serviceChargePerSqftYear": 12,
    "agentAnnualRent": 62000,
    "areaAnnualRent": 60000,
    "areaPricePerSqft": 1100,
    "agentPlanLabel": "60/40",
    "pctBeforeHandover": 60,
    "pctOnHandover": 40,
    "pctAfterHandover": 0,
    "statedHandover": "Q4 2028",
    "devProjectsDelivered": 8,
    "devDeliveredOnTime": 6,
    "devAvgDelayMonths": 4
  },
  {
    "id": "canal-view",
    "name": "Canal View One",
    "area": "Business Bay",
    "priceAED": 1750000,
    "sizeSqft": 820,
    "serviceChargePerSqftYear": 22,
    "agentAnnualRent": 115000,
    "areaAnnualRent": 110000,
    "areaPricePerSqft": 2050,
    "agentPlanLabel": "70/30",
    "pctBeforeHandover": 70,
    "pctOnHandover": 30,
    "pctAfterHandover": 0,
    "statedHandover": "Q2 2027",
    "devProjectsDelivered": 25,
    "devDeliveredOnTime": 23,
    "devAvgDelayMonths": 1
  },
  {
    "id": "greenfield",
    "name": "Greenfield Park Residences",
    "area": "Dubai Hills Estate",
    "priceAED": 1650000,
    "sizeSqft": 760,
    "serviceChargePerSqftYear": 17,
    "agentAnnualRent": 105000,
    "areaAnnualRent": 100000,
    "areaPricePerSqft": 2100,
    "agentPlanLabel": "80/20",
    "pctBeforeHandover": 80,
    "pctOnHandover": 20,
    "pctAfterHandover": 0,
    "statedHandover": "Q3 2027",
    "devProjectsDelivered": 40,
    "devDeliveredOnTime": 38,
    "devAvgDelayMonths": 0
  },
  {
    "id": "harbour",
    "name": "Harbour Lights",
    "area": "Dubai Creek Harbour",
    "priceAED": 1900000,
    "sizeSqft": 740,
    "serviceChargePerSqftYear": 19,
    "agentAnnualRent": 110000,
    "areaAnnualRent": 108000,
    "areaPricePerSqft": 2450,
    "agentPlanLabel": "70/30",
    "pctBeforeHandover": 70,
    "pctOnHandover": 30,
    "pctAfterHandover": 0,
    "statedHandover": "Q1 2028",
    "devProjectsDelivered": 18,
    "devDeliveredOnTime": 16,
    "devAvgDelayMonths": 2
  }
]
```

## 4. Calculations

Write these as pure functions in one file: `src/lib/calc.ts`. No other file computes a number.

| Value | Formula | Source tag |
|---|---|---|
| Price per sqft | price / size | Calculated |
| Price against area | (price per sqft - area price per sqft) / area price per sqft | Calculated |
| Agent's yield | agent's annual rent / price | Agent figure |
| Yield at area rent (Phase 2, S2 only) | area annual rent / price | Calculated |
| Service charges per year | service charge rate x size | Calculated |
| Estimated yield after service charges | (area annual rent - service charges per year) / price | Calculated |
| Agent's rent against area rent | (agent's annual rent - area annual rent) / area annual rent | Calculated |
| Registration fee | 4% x price | Calculated |
| Cash needed before handover | price x share before handover + registration fee | Calculated |
| Due on handover | price x share on handover | Calculated |
| Due after handover | price x share after handover | Calculated |
| On-time share | delivered on time / delivered. Only when 3 or more projects were delivered. | Calculated |

**Rounding.** Round only for display. Money and price per sqft: nearest AED, with halves rounded up (so 1,112.5 shows as 1,113). Yields and other percentages: one decimal place. Apply every flag threshold to the unrounded value. Write money as "980,000 AED". Show "price against area" and "rent against area rent" with a sign: "+21.7%".

**Expected results.** Write Vitest tests in `src/lib/calc.test.ts` that check every value below, after display rounding:

| Offer | Price/sqft | Against area | Agent's yield | Yield at area rent | Service charges/yr | Est. yield after service charges | Agent's rent against area rent | Registration fee | Cash before handover | Due after handover |
|---|---|---|---|---|---|---|---|---|---|---|
| Palm Grove Heights | 1,346 | +3.6% | 8.4% | 7.4% | 10,920 | 6.4% | +12.8% | 42,000 | 672,000 | 0 |
| Aurora Sky Tower | 1,400 | +21.7% | 9.5% | 7.1% | 14,700 | 5.6% | +32.9% | 39,200 | 529,200 | 392,000 |
| Southgate Terraces | 1,113 | +1.1% | 7.0% | 6.7% | 9,600 | 5.7% | +3.3% | 35,600 | 569,600 | 0 |
| Canal View One | 2,134 | +4.1% | 6.6% | 6.3% | 18,040 | 5.3% | +4.5% | 70,000 | 1,295,000 | 0 |
| Greenfield Park Residences | 2,171 | +3.4% | 6.4% | 6.1% | 12,920 | 5.3% | +5.0% | 66,000 | 1,386,000 | 0 |
| Harbour Lights | 2,568 | +4.8% | 5.8% | 5.7% | 14,060 | 4.9% | +1.9% | 76,000 | 1,406,000 | 0 |

## 5. Flag rules

Flags are observations, not verdicts. Put the rules in `src/lib/flags.ts`. The thresholds are prototype settings, not market rules.

| ID | Rule | Text shown (fill in the values) | Question added to the decision note |
|---|---|---|---|
| F1 | Price per sqft is more than 10% above the area figure | "Price per sqft is {x}% above the area figure." | "Which recent sales nearby support this price per sqft?" |
| F2 | The agent's rent is more than 10% above the area rent | "The agent's yield assumes a rent {x}% above the area figure." | "Which similar units rent at that level today? Is your yield before or after service charges?" |
| F3 | Any share of the price is due after handover | "{after}% of the price ({amount} AED) is still due after handover." | "Over how long is it paid, and what happens if I miss a payment?" |
| F4 | Fewer than 3 projects delivered, or average delay above 6 months | "Limited track record: {delivered} delivered, {onTime} on time." when fewer than 3 delivered, and "Past projects were {avgDelay} months late on average." when the average delay is above 6 months. Show one or both. | "Which projects has this developer handed over, and how late was each one?" |

**Always shown in "Questions for the agent":**

- "Is the 4% registration fee included in the price, waived, or on top?"
- "Who confirmed the service charge rate, and can it change after handover?"

**Expected flags (test these in `src/lib/flags.test.ts`, with the exact texts):**

| Offer | Flags |
|---|---|
| Palm Grove Heights | F2: "The agent's yield assumes a rent 12.8% above the area figure." |
| Aurora Sky Tower | F1: "Price per sqft is 21.7% above the area figure." F2: "The agent's yield assumes a rent 32.9% above the area figure." F3: "40% of the price (392,000 AED) is still due after handover." F4: "Limited track record: 2 delivered, 0 on time." and "Past projects were 14 months late on average." |
| Southgate Terraces | none |
| Canal View One | none |
| Greenfield Park Residences | none |
| Harbour Lights | none |

## 6. Labels

Use these labels exactly. Keep them in one file: `src/lib/labels.ts`.

| Where | Exact label |
|---|---|
| Source tags | "Agent figure" - "Area figure (mock)" - "Calculated". "Your input" is added only in Phase 2 (S1). |
| Yield row | "Agent's yield" and "Estimated yield after service charges" |
| Handover row | "Stated handover" plus "Developer record: {delivered} delivered - {onTimePct}% on time - average delay {avgDelay} months". When the average delay is 0, write "no delay" instead of "average delay 0 months". With fewer than 3 delivered: "Limited track record: {delivered} delivered, {onTime} on time", with no percentage. |
| Payment row | "Before handover" - "On handover" - "After handover", then "Cash needed before handover (includes 4% registration fee)" |
| Neutral markers | "Highest" / "Lowest", "Earliest" / "Latest" |
| Decide screen | "My pick" for each offer, and "None of these" |
| Decision note sections | "What stands out" - "Watch-outs" - "Questions for the agent" - "Not checked by this tool" |

**Words that must not appear anywhere in the interface:** "buy", "best deal", "recommended", "guaranteed", "net yield", "score", "likely handover", "best", "worst", "strongest", "weakest". Add a test that scans the rendered text of all three screens for these words, case-insensitive.

**Describe SecondLook as a real product everywhere**: interface, code, comments, file names, tests and README. Never describe it as practice, a sample or a task.

## 7. Build order

**Phase 1: Musts only.**

- M1 Shortlist: six offers, select 2 or 3.
- M2 Side-by-side comparison of the six numbers on the same basis.
- M3 Source tag on every number, with the source or formula on tap.
- M4 Flags from the four fixed rules.
- M5 Decision note: pick one or "None of these", then the four sections.

Then run the acceptance checks in section 10, report the result of each check, and **stop**. Do not start Phase 2 until I say go.

**Phase 2: Shoulds, only when I say go.**

- S1 Edit the expected rent for an offer and see the estimated yield and F2 update. The edited rent carries a fourth tag, "Your input".
- S2 Show the yield gap in steps: agent's yield, then yield at area rent, then estimated yield after service charges.
- S3 Copy or print the decision note.

**Could items** (handover "what if" as an illustration, a rent range of plus or minus 10%, home-currency prices, an Arabic right-to-left interface): build only if I ask for one by name.

## 8. Do not build

- Real area data from any official source (W1).
- Entering or uploading your own offer (W2).
- Any single score, ranking or recommendation (W3).
- Market search, filters, maps or photos (W4).
- Price growth forecasts (W5).
- Mortgage, tax or home-currency maths (W6).
- A predicted or "likely" handover date (W7).
- Login, saving or accounts (W8).
- An AI chat assistant (W9).
- Contacting agents, reserving a unit or payment (W10).
- Comparing more than three offers (W11).

If something is not listed in this prompt, ask before adding it.

## 9. Technical limits

- A single-page web app. No backend, no login, no external API, no tracking, no analytics.
- Designed for a laptop screen. Usable, not polished, on a phone.
- Meaning is never carried by colour alone: markers and flags always have words.
- Every control works by keyboard and has a visible label or an accessible name. Source tag panels open on click, Enter and Space, and close with Escape.
- Stack: Vite, React, TypeScript, Tailwind CSS. Vitest for the calculation, flag and wording tests.
- It must build to static files (`npm run build`) so it can be published as a link. I choose the host.

## 10. Acceptance checks

1. Compare cannot open with fewer than 2 or more than 3 offers selected.
2. Compare shows all six numbers for each selected offer, in the same units.
3. Every number carries a source tag. Tapping a tag shows where the number came from, or the formula with this offer's values.
4. The calculation tests pass against the expected results in section 4.
5. Flags match the expected flags in section 5, with the exact texts.
6. Fawzi can choose one offer or "None of these", and the decision note shows its four sections.
7. The mock-data notice is visible on every screen.
8. None of the banned interface words appear.

## 11. Done means

- It runs locally with one command (`npm install && npm run dev`).
- `npm test` passes.
- A short README explains how to run, test, build and publish the static files.
- The README states that all figures are illustrative mock data and that the app is not investment advice.
- The code, comments, file names, tests and README describe SecondLook as a real product, never as practice, a sample or a task.
