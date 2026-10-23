// Shared data for checklist.html and metric-plan.html
// ISO/IEC TR 24027 (applied): §6 bias sources and §7 metrics.

const ITEMS = {
  a: [
    { id:'a1', clause:'§6.2.2', q:'Does the team rely on AI outputs without questioning contradictory evidence?', sub:'Automation bias — humans favour automated decisions over correct manual observations.' },
    { id:'a2', clause:'§6.2.3', q:'Are individual users being treated based on group label rather than individual data?', sub:'Group attribution bias — generalising group observations to all members.' },
    { id:'a3', clause:'§6.2.4', q:'Are any design decisions unconsciously harder for certain user groups (UI, workflows, override mechanisms)?', sub:'Implicit bias — unstated stereotypes embedded in design without intent.' },
    { id:'a4', clause:'§6.2.5', q:'Does the training data confirm pre-existing assumptions rather than reflect ground truth?', sub:'Confirmation bias — model learns to reproduce historical patterns as clinical fact.' },
    { id:'a5', clause:'§6.2.6', q:'Were all affected user groups represented in the design and testing team?', sub:'In-group bias — out-group user needs invisible to the development team.' },
    { id:'a6', clause:'§6.2.7', q:'Does the system treat a heterogeneous group (e.g. elderly users) as if they were uniform?', sub:'Out-group homogeneity bias — ignoring variation within demographic groups.' },
    { id:'a7', clause:'§6.2.8', q:'Does the training data encode historical inequalities that the model will reproduce at scale?', sub:'Societal bias — automating existing inequities via historical records.' },
    { id:'a8', clause:'§6.2.9', q:'Were any hard-coded rules (thresholds, timeouts, eligibility criteria) tested across all user subgroups?', sub:'Rule-based system design bias — designer assumptions encoded in if-then logic.' },
    { id:'a9', clause:'§6.2.10', q:'Do the system’s non-functional requirements explicitly include fairness alongside performance, security, and reliability?', sub:'Requirements bias — fairness omitted by omission, not intention. Only 22% of API practitioners address this.' },
  ],
  b: [
    { id:'b1', clause:'§6.3.2', q:'Has the model been checked for systematic over- or under-estimation for any subgroup?', sub:'Statistical bias — consistent numerical offset from true value for specific groups.' },
    { id:'b2', clause:'§6.3.3', q:'Is the labelling process documented, consistent, and free from inter-labeller disagreement that affects subgroups differently?', sub:'Data labelling bias — labellers\' perspectives encoded as ground truth.' },
    { id:'b3', clause:'§6.3.4', q:'Does the training dataset adequately represent the full target population, not just the most accessible source?', sub:'Non-representative sampling — convenience sampling from one source deployed on another population.' },
    { id:'b4', clause:'§6.3.5', q:'Are all features relevant to the target population collected, including those specific to local or minority contexts?', sub:'Missing features — relevant signals absent because they were never collected.' },
    { id:'b5', clause:'§6.3.6', q:'Do data cleaning steps preserve atypical or edge-case records rather than removing them as outliers?', sub:'Data processing bias — outlier removal deletes cases the model most needs to learn.' },
    { id:'b6', clause:'§6.3.7', q:'Are aggregate accuracy metrics disaggregated by subgroup to detect hidden subgroup failures?', sub:'Simpson\'s paradox — strong overall performance can conceal poor subgroup performance.' },
    { id:'b7', clause:'§6.3.8', q:'Do aggregate statistics (averages, thresholds) mask meaningful distributional differences between subgroups?', sub:'Data aggregation bias — combining heterogeneous subgroups erases subgroup-level signals.' },
    { id:'b8', clause:'§6.3.9', q:'If training data comes from multiple sources, are quality, labelling standards, and collection protocols consistent across all sources?', sub:'Distributed training bias — inconsistent multi-source data creates site-level performance disparities.' },
  ],
  c: [
    { id:'c1', clause:'§6.4.2', q:'Have selected features been audited for proxy discrimination — neutral labels that encode protected attributes?', sub:'Feature engineering bias — e.g. postcode encodes ethnicity; insurance type encodes income.' },
    { id:'c2', clause:'§6.4.3', q:'Is the chosen algorithm capable of capturing data patterns for all subgroups, including minority and non-linear cases?', sub:'Algorithm selection bias — some architectures structurally under-represent minority patterns.' },
    { id:'c3', clause:'§6.4.4', q:'Were model thresholds and loss functions optimised for subgroup performance, not only aggregate metrics?', sub:'Hyperparameter tuning bias — aggregate optimisation hides minority subgroup degradation.' },
    { id:'c4', clause:'§6.4.5', q:'Has the model\'s feature importance been checked for indirect discrimination through highly-ranked proxy features?', sub:'Informativeness / proxy discrimination — top features may silently encode protected attributes.' },
    { id:'c5', clause:'§6.4.6', q:'Does the model architecture structurally support the type of variation present across all subgroups?', sub:'Model bias — inherent architectural constraints produce biased outputs regardless of data quality.' },
    { id:'c6', clause:'§6.4.7', q:'Where multiple models interact in a pipeline, has the combined output been tested for fairness at the system level?', sub:'Model interaction bias — individually fair models can compound into a systemically unfair pipeline.' },
  ]
};
const ALL_ITEMS = () => [...ITEMS.a, ...ITEMS.b, ...ITEMS.c];
const ITEM_BY_ID = id => ALL_ITEMS().find(i => i.id === id);
const BIAS_NAME = item => item.sub.split(' — ')[0];

// §7 metrics as implemented in metrics.html.
// needsRef: requires a reference label (proxy or validated ground truth).
const METRICS = {
  cm:  { clause:'§7.2', name:'Confusion matrix per group', needsRef:true,  measures:'TP/FP/FN/TN per group; base for the others' },
  eo:  { clause:'§7.3', name:'Equalized odds',             needsRef:true,  measures:'max(ΔTPR, ΔFPR) between groups' },
  eop: { clause:'§7.4', name:'Equality of opportunity',    needsRef:true,  measures:'ΔTPR: are true high-risk cases caught equally?' },
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
  a6:{process:false, metrics:['eo','cm'], hint:'Use a finer subgroup inside the group, e.g. age bands within elderly users.'},
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
const UNK_REASON = { no_info:'No information available', no_authority:'No authority to answer', not_investigated:'Not yet investigated' };

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
