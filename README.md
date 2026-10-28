# Standards-Based Bias & Fairness Toolkit (v2)

A browser-based toolkit that derives what bias to look for from ISO/IEC standards (TR 24027, with TS 12791 and 5259-2 by hybrid deductive–inductive coding), measures bias from case data, and keeps **measurement (magnitude)** separate from **judgement (verdict)**.

Live site: https://evared-code.github.io/bias-detection-framework-v2/

The toolkit is case-agnostic. The sample files (`example_data.csv`, `synthetic_test_data.csv`) come from one example case (exercise-risk scoring) and only illustrate the data format.

## Workflow

| Step | Page | Stage | Who | Output |
|---|---|---|---|---|
| A | — | Interpret standards (hybrid coding → checklist) | Researcher | Checklist items, each tagged with its source clause |
| 1 | `checklist.html` | B — confirm the bias list | Development team (API provider and/or consumer — whoever has the authority to know) | Status of each item: confirmed / not present / unknown, with evidence |
| 2 | `metric-plan.html` | C–E — measurable? → metric → customise | Researcher | Context, data description, §7 metric and subgroup per confirmed bias, decision and reference rules — **locked before results** |
| 3 | `magnitude.html` | F — compute magnitude | Researcher | Per subgroup and metric: n, rates, gap, ratio, bootstrap 95% CI, threshold sensitivity. Status: significant disparity / not distinguishable from 0 / indeterminate. No verdict |
| 4 | `verdict.html` | G — verdict | Domain expert | Tolerances set and locked **before** results are shown; then fair / unfair in context, or hidden-unfairness checks; outcome grid (biased × fair) plus indeterminate |

Indeterminate results (magnitude cannot be measured) are reported as findings in their own right, with the data or interface information that would be needed to measure them.

## Files

| File | Purpose |
|---|---|
| `index.html` | Overview and navigation |
| `checklist.html` | Step 1 |
| `metric-plan.html` | Step 2 |
| `magnitude.html` | Step 3 |
| `verdict.html` | Step 4 |
| `bias-data.js` | Shared clause list (§6), metric definitions (§7), storage helpers |
| `style.css` | Shared styling for steps 1–4 |
| `framework.png` · `methodology.png` | Conceptual framework and swim lane shown on `index.html` (same as the paper) |
| `example_data.csv` | 60-row sample from an example case (exercise-risk scoring) |
| `synthetic_test_data.csv` | 240-row synthetic set with a known sex bias, for checking the tool |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |

Steps 1–4 need `bias-data.js` and `style.css` in the same folder. Opening one HTML file on its own (for example in a file preview) shows an unstyled page without the checklist items.

## Deploy on GitHub Pages

1. Put all files in the root of the repository (the new `framework.png` replaces the old one).
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.
3. Open `https://<user>.github.io/<repo>/`.

No build step, server or external library is needed.

## Data format

One row per decision, any domain. Column names are set in the Metric plan: use **Read columns from my CSV** to pick them from your file's header, or **Load sample case (CareMove)** to fill in the settings of the sample file:

```
participant_id,age,sex,site,bodyRatio,gymbot_score
P001,68,F,D01,0.52,55
```

- Output: a raw score with a decision rule (sample: `gymbot_score < 60` = flagged), or a decision column with the value that counts as positive (e.g. `1`, `yes`, `approved`).
- Reference: none, a proxy rule (sample: `age >= 65 AND bodyRatio < 0.6`), or a validated label column. The proxy is a placeholder: when validated labels exist, switch the reference to the label column and recompute.
- Columns used to build the reference cannot be used as subgroups.

### Supported outputs

Following the classification and regression scope of ISO/IEC TS 12791, the output column is turned into a two-way decision, because the TR 24027 §7 metrics compare rates of positive / negative decisions:

- **Numeric output + threshold**: score, probability, rank or continuous value (regression), e.g. `score < 60`, `rank <= 10`, `amount >= 50000`.
- **Decision / category**: the value or values that count as positive, e.g. `approved`, or `high, medium`.

Not yet supported: regression-specific metrics (e.g. difference in mean output or mean error), planned after coding TS 12791; free text from an LLM must first be turned into a decision.

## Data and privacy

All processing happens in the browser. Nothing is uploaded. Work is kept in the browser's local storage (keys starting with `iso24027_`). When different people complete different steps, pass the work on with the JSON export / import buttons on each page:

checklist JSON → Metric plan → plan JSON → Magnitude and Verdict → magnitude JSON → Verdict

## Methods notes

- Gap = other group − reference group. Ratio = other / reference.
- 95% CI: percentile bootstrap, 1,000 resamples within each group, fixed seed (24027) so results are reproducible.
- “Significant disparity” = the 95% CI excludes 0. For equalized odds, TPR and FPR are bootstrapped separately; significant if either CI excludes 0. The gap shown is the larger component.
- §7.2 confusion matrix is summarised as the error-rate gap ((FP + FN) / n).
- A rate is undefined when its denominator is 0 (e.g. no reference positives in a group); the comparison is then indeterminate.
- Small groups (n below the plan's minimum) are flagged. With small n, or rates at exactly 0 or 1, bootstrap intervals are unreliable and “not distinguishable from 0” may only reflect limited data.
- Proxy-based results are exploratory and directional only until validated against clinical (PT-assessed) labels.
- The Magnitude page lists the **minimum case inputs** (output, raw score, groups, reference, reference positives, n, context, verdict owner) and what each missing input does to the results.
- To add checklist items from TS 12791 or 5259-2, add them to `ITEMS` in `bias-data.js` with a `doc` field (e.g. `doc:'TS 12791'`); the source tag and exports pick it up.
- ISO/IEC TR 24027 is a Technical Report; this toolkit applies it and does not claim compliance.

## Citation

Singjai, A. (2026). Standards-Based Bias & Fairness Toolkit (v2). CMU Software Engineering (CAMT), Chiang Mai University. https://evared-code.github.io/bias-detection-framework-v2/

## Acknowledgement

The sample case data come from the HarmonicAI project (EU Horizon 2020 Marie Skłodowska-Curie Grant No. 101131117).
