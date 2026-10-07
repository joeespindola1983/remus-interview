# REMUS QUESTIONNAIRE — Data Dictionary

Version: `2026-10-07.v2`

This instrument records declared market-research responses. It does not create telemetry, sporting measurements, athlete profiles, activities, workouts, lineups, equipment records or evidence that a product capability exists.

Canonical sporting language comes from the Remus dictionaries. Research-only segmentation fields remain local to this instrument and must not be promoted into product-domain contracts without first being added to the applicable canonical terminology catalog.

## Canonical domain mappings

| Questionnaire field | Values | Canonical relationship |
|---|---|---|
| `sportDiscipline` | `rowing`, `vaa`, `rowing_and_vaa`, `other` | `rowing` and `vaa` reuse the canonical sport concepts. `rowing_and_vaa` is a research response meaning both selections, not a new sport discipline. |
| `rowingDiscipline` | `sculling`, `sweep`, `sculling_and_sweep`, `not_sure` | Maps to `rowingDiscipline: sculling` and `rowingDiscipline: sweep`. UI labels use “Palamenta dupla” and “Palamenta simples”. |
| `vaaTrainingContext` | `one_paddler`, `crew_craft`, `both`, `not_sure` | Coarse research segmentation only. It does not infer `boatClassSystem`, `outriggerBoatClassCode`, `paddlerCapacity`, `crewSize` or a ruleset. |
| `currentTracking=rowerg` | `rowerg` | Refers specifically to the Concept2 `concept2DeviceType: rowerg` context. It does not mean PM5; the PM5 is a performance monitor and is not the ergometer. |
| `primaryReviewer=crew` | `crew` | Reuses the canonical human-context entity `crew`; Brazilian rowing UI may say “equipe ou guarnição”. |
| `mostUsefulOutcome=training_plan_comparison` | `training_plan_comparison` | Refers to comparison between a canonical `trainingPlan`/prescribed `workoutSession` and performed evidence. It does not assert that this capability exists. |

## Research-only fields

| Field | Meaning |
|---|---|
| `participantRole` | Respondent's self-declared primary market role. It does not create an account role, access grant or onboard role. |
| `experienceLevel` | Coarse self-declared time involved with the selected sport. |
| `weeklyTrainingFrequency` | Number of workouts personally performed by an athlete or oriented by a coach in a usual week. The wording is role-specific; it never combines training frequency with recording or analysis frequency. |
| `participationContext` | Self-declared recreational, fitness, amateur competition, high-performance or professional context. It is not a federation category. |
| `workoutRecordingFrequency` | Self-declared frequency with which some information is recorded during or after workouts. It is separate from workout frequency and from later consultation. |
| `workoutRecordingTools` | Multi-select list of tools reportedly used. It does not prove that a source was present in a particular activity. `speedcoach` is a source-product category; `rowerg_pm5` explicitly names the RowErg plus its PM5 monitor. |
| `recordedWorkoutInformation` | Multi-select list of information the respondent says they records or consults. Labels reuse canonical metric language where applicable; the response is not a `metricObservation`. |
| `workoutReviewMoment` | When the respondent reports consulting recorded information. It is separate from capture time and does not create a `liveMetricPresentation`. |
| `workoutDataUse` | What the respondent reports doing with recorded information. Sharing with a coach, athlete, crew or club does not imply an `accessGrant`. |
| `workoutTrackingNeed`, `currentTrackingGap` | Declared need and unmet need around workout follow-up. These are market-research responses, not diagnoses or measured quality. |
| `mostUsefulOutcome`, `desiredTiming`, `primaryBarrier` | Product-value and adoption preferences. They do not establish product capability or technical feasibility. |
| `likelyBuyer`, `purchaseIntent`, `monthlyPrice`, `pilotInterest` | Commercial research responses. They are not qualified leads, paid orders, deposits or advocacy signals by themselves. Qualification still follows the Q4 OKR evidence definitions. |

## Explicitly rejected modeling

- “Remo na água” is not a discipline or canonical label. Use `rowing` / “Remo”.
- RowErg is not a sport discipline parallel to Remo or Va'a.
- PM5 is not an ergometer.
- V, OC and W class systems are never silently converted into one another.
- A declared interest in technique review is not a `techniqueObservationCode` and is not evidence that Remus detects technique.
- A questionnaire response is not a recorded `activity`, `workoutSession`, `metricObservation`, purchase or product-use event.
