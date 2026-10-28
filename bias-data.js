// Shared data for all pages of the Standards-Based Bias & Fairness Toolkit.
// Checklist items: ISO/IEC TR 24027 §6 (applied). Items derived from ISO/IEC TS 12791
// and ISO/IEC 5259-2 by hybrid coding can be added with a `doc` field, e.g.
//   { id:'b9', doc:'TS 12791', clause:'§x.y', q:'...', sub:'Name — description' }
// Metrics: ISO/IEC TR 24027 §7.

const ITEMS = {
  a: [
    { id:'a1', clause:'§6.2.2', q:'Does the team accept AI outputs without questioning them, even when there is contradicting evidence?', sub:'Automation bias — humans favour automated decisions over correct manual observations.' },
    { id:'a2', clause:'§6.2.3', q:'Are users treated according to their group label rather than their individual data?', sub:'Group attribution bias — generalising group observations to all members.' },
    { id:'a3', clause:'§6.2.4', q:'Do any design decisions (UI, workflows, override mechanisms) make the system harder to use for certain user groups?', sub:'Implicit bias — unstated stereotypes embedded in design without intent.' },
    { id:'a4', clause:'§6.2.5', q:'Does the training data reproduce pre-existing assumptions rather than ground truth?', sub:'Confirmation bias — model learns to reproduce historical patterns as fact.' },
    { id:'a5', clause:'§6.2.6', q:'Are some affected user groups missing from the design and testing team?', sub:'In-group bias — out-group user needs invisible to the development team.' },
    { id:'a6', clause:'§6.2.7', q:'Does the system treat a heterogeneous group (e.g. a broad age group or region) as if it were uniform?', sub:'Out-group homogeneity bias — ignoring variation within demographic groups.' },
    { id:'a7', clause:'§6.2.8', q:'Does the training data encode historical inequalities that the model could reproduce at scale?', sub:'Societal bias — automating existing inequities via historical records.' },
    { id:'a8', clause:'§6.2.9', q:'Are there hard-coded rules (thresholds, timeouts, eligibility criteria) that have not been tested across all user subgroups?', sub:'Rule-based system design bias — designer assumptions encoded in if-then logic.' },
    { id:'a9', clause:'§6.2.10', q:'Is fairness missing from the system’s non-functional requirements (alongside performance, security and reliability)?', sub:'Requirements bias — fairness omitted by omission, not intention.' },
  ],
  b: [
    { id:'b1', clause:'§6.3.2', q:'Does the model systematically over- or under-estimate outcomes for any subgroup?', sub:'Statistical bias — consistent numerical offset from true value for specific groups.' },
    { id:'b2', clause:'§6.3.3', q:'Is the labelling process undocumented or inconsistent, or do labellers disagree in ways that affect subgroups differently?', sub:'Data labelling bias — labellers\' perspectives encoded as ground truth.' },
    { id:'b3', clause:'§6.3.4', q:'Does the training dataset under-represent parts of the target population (e.g. because it comes from the most accessible source)?', sub:'Non-representative sampling — convenience sampling from one source deployed on another population.' },
    { id:'b4', clause:'§6.3.5', q:'Are features that matter for the target population missing, including those specific to local or minority contexts?', sub:'Missing features — relevant signals absent because they were never collected.' },
    { id:'b5', clause:'§6.3.6', q:'Do data cleaning steps remove atypical or edge-case records as outliers?', sub:'Data processing bias — outlier removal deletes cases the model most needs to learn.' },
    { id:'b6', clause:'§6.3.7', q:'Is performance reported only in aggregate, so that failures in a subgroup could stay hidden?', sub:'Simpson\'s paradox — strong overall performance can conceal poor subgroup performance.' },
    { id:'b7', clause:'§6.3.8', q:'Do aggregate statistics (averages, thresholds) mask meaningful differences between subgroups?', sub:'Data aggregation bias — combining heterogeneous subgroups erases subgroup-level signals.' },
    { id:'b8', clause:'§6.3.9', q:'Does the training data come from multiple sources with inconsistent quality, labelling standards or collection protocols?', sub:'Distributed training bias — inconsistent multi-source data creates site-level performance disparities.' },
  ],
  c: [
    { id:'c1', clause:'§6.4.2', q:'Do any selected features act as proxies for protected attributes (e.g. postcode for ethnicity)?', sub:'Feature engineering bias — e.g. postcode encodes ethnicity; insurance type encodes income.' },
    { id:'c2', clause:'§6.4.3', q:'Is the chosen algorithm unable to capture data patterns for some subgroups, including minority or non-linear cases?', sub:'Algorithm selection bias — some architectures structurally under-represent minority patterns.' },
    { id:'c3', clause:'§6.4.4', q:'Were thresholds and loss functions optimised only for aggregate metrics rather than for subgroup performance?', sub:'Hyperparameter tuning bias — aggregate optimisation hides minority subgroup degradation.' },
    { id:'c4', clause:'§6.4.5', q:'Do highly ranked features indirectly encode protected attributes?', sub:'Informativeness / proxy discrimination — top features may silently encode protected attributes.' },
    { id:'c5', clause:'§6.4.6', q:'Does the model architecture structurally limit the variation it can represent across subgroups?', sub:'Model bias — inherent architectural constraints produce biased outputs regardless of data quality.' },
    { id:'c6', clause:'§6.4.7', q:'Where several models interact in a pipeline, does the combined output treat subgroups differently?', sub:'Model interaction bias — individually fair models can compound into a systemically unfair pipeline.' },
  ]
};
const TOOL_NAME = 'Standards-Based Bias & Fairness Toolkit';
// Source of a checklist item: standard + clause (default TR 24027)
const SRC = item => (item.doc || 'TR 24027') + ' ' + item.clause;
const ALL_ITEMS = () => [...ITEMS.a, ...ITEMS.b, ...ITEMS.c];
const ITEM_BY_ID = id => ALL_ITEMS().find(i => i.id === id);
const BIAS_NAME = item => item.sub.split(' — ')[0];

// §7 metrics as implemented in metrics.html.
// needsRef: requires a reference label (proxy or validated ground truth).
const METRICS = {
  cm:  { clause:'§7.2', name:'Confusion matrix per group', needsRef:true,  measures:'TP/FP/FN/TN per group; base for the others' },
  eo:  { clause:'§7.3', name:'Equalized odds',             needsRef:true,  measures:'max(ΔTPR, ΔFPR) between groups' },
  eop: { clause:'§7.4', name:'Equality of opportunity',    needsRef:true,  measures:'ΔTPR: are true positives caught equally?' },
  dp:  { clause:'§7.5', name:'Demographic parity',         needsRef:false, measures:'Δ positive (flag) rate between groups' },
  pe:  { clause:'§7.6', name:'Predictive equality',        needsRef:true,  measures:'ΔFPR: are groups over-flagged equally?' },
};

// Suggestions only — the team decides.
// process:true = usually a process finding (lives in people or requirements, not in the outputs).
const SUGGEST = {
  a1:{process:true,  metrics:[]},
  a2:{process:false, metrics:['dp','eo']},
  a3:{process:true,  metrics:[]},
  a4:{process:false, metrics:['eo','eop']},
  a5:{process:true,  metrics:[]},
  a6:{process:false, metrics:['eo','cm'], hint:'Use a finer subgroup inside the group, e.g. finer bands within a broad group.'},
  a7:{process:false, metrics:['dp','eo']},
  a8:{process:false, metrics:['eop','pe'], hint:'Also run threshold sensitivity.'},
  a9:{process:true,  metrics:[]},
  b1:{process:false, metrics:['cm']},
  b2:{process:false, metrics:['eo'], hint:'Label quality limits every reference-based metric.'},
  b3:{process:false, metrics:['cm','dp'], hint:'Report n per subgroup alongside every metric.'},
  b4:{process:false, metrics:['eop']},
  b5:{process:false, metrics:['cm']},
  b6:{process:false, metrics:['cm','eo']},
  b7:{process:false, metrics:['dp','cm']},
  b8:{process:false, metrics:['eo','cm'], hint:'Subgroup is usually the data source or site.'},
  c1:{process:false, metrics:['dp','eo']},
  c2:{process:false, metrics:['eo']},
  c3:{process:false, metrics:['eop','pe']},
  c4:{process:false, metrics:['dp']},
  c5:{process:false, metrics:['eo']},
  c6:{process:false, metrics:['dp','eo'], hint:'Measure on the final pipeline output, not on each model.'},
};

const STATUS = { confirmed:'Confirmed', not_present:'Not present', unknown:'Unknown' };
const UNK_REASON = { no_info:'No information available', no_authority:'No authority to answer (e.g. API consumer cannot see training data)', not_investigated:'Not yet investigated' };

// Storage keys shared across pages (same origin on GitHub Pages)
const CHECKLIST_KEY = 'iso24027_checklist_v2';
const PLAN_STATE_KEY = 'iso24027_metric_plan_state_v1';
const PLAN_KEY = 'iso24027_metric_plan';
const MAG_KEY = 'iso24027_magnitude';
const VERDICT_KEY = 'iso24027_verdict_state_v1';

// Read a JSON export chosen in an <input type="file"> and pass it to cb
function readJSONFile(input, cb) {
  const f = input.files && input.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => { try { cb(JSON.parse(r.result)); } catch (e) { alert('Could not read file: ' + e.message); } input.value = ''; };
  r.readAsText(f);
}
const OPS = { '<':(a,b)=>a<b, '<=':(a,b)=>a<=b, '>':(a,b)=>a>b, '>=':(a,b)=>a>=b, '=':(a,b)=>String(a)===String(b) };

function lsGet(key) { try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
function lsSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function downloadFile(name, text, type) {
  const blob = new Blob([text], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name; a.click();
}
function csvCell(s) { return '"' + String(s == null ? '' : s).replace(/"/g, '""') + '"'; }
