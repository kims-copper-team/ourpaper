/* ============== DATA ============== */
const JOURNALS = {
  materials_standard: {
    name:'기본 프레임', field:'Materials 분야 주요 저널 공통 구조', color:'#2C5F6B',
    sections:[
      // freeSection: true → 그림/표 순서 계산·삽입 감지에서 제외 (자유 작업 공간)
      {key:'highlights', label:'Highlights', guidance:'불릿 3~5개, 각 85자(공백 포함) 이내. 별도 파일로 제출하는 저널도 있으니 투고 전 가이드라인 확인', limit:null, freeSection:true},
      {key:'graphical_abstract', label:'Graphical Abstract', guidance:'연구 핵심을 한 장에 담을 이미지 계획 메모 — 실제 파일은 EPS/TIFF/PDF로 별도 제출. 여기 삽입한 그림은 본문 번호에 영향을 주지 않아요', limit:null, freeSection:true},
      {key:'abstract', label:'Abstract', guidance:'150~250단어. 정의되지 않은 약어·인용 사용 금지', limit:250},
      {key:'keywords', label:'Keywords', guidance:'색인용 핵심어 4~6개', limit:null},
      {key:'introduction', label:'1. Introduction', guidance:'연구 배경과 목적, 기존 연구 대비 novelty 제시', limit:null},
      {key:'materials_methods', label:'2. Materials and methods', guidance:'재료 조성, 공정 조건, 시험 방법을 재현 가능하도록 기술', limit:null},
      {key:'results_discussion', label:'3. Results and discussions', guidance:'결과 제시와 해석을 함께 서술', limit:null},
      {key:'conclusions', label:'4. Conclusions', guidance:'핵심 결론을 간결히 정리', limit:null},
      {key:'credit', label:'CRediT authorship contribution statement', guidance:'각 저자의 기여를 CRediT 분류(Conceptualization, Methodology, …)에 따라 기재', limit:null},
      {key:'competing_interest', label:'Declaration of competing interest', guidance:'이해충돌이 없으면 아래 기본 문구를 그대로 사용 가능', limit:null,
        defaultContent:'The authors declare that they have no known competing financial interests or personal relationships that could have appeared to influence the work reported in this paper.'},
      {key:'acknowledgments', label:'Acknowledgments', guidance:'연구비 지원 기관, 실험 협조자 등을 기재', limit:null},
      {key:'data_availability', label:'Data availability', guidance:'데이터 공개 방침을 기재. 공개 불가 시 문의처(corresponding author)를 명시', limit:null,
        defaultContent:'The data that support the findings of this study are available from the corresponding author upon reasonable request.'},
      {key:'references', label:'References', guidance:'본문 인용 순서대로 번호를 매기고, 가능하면 DOI 전체 링크 포함', limit:null},
    ]
  },
  custom: {
    name:'사용자 정의', field:'섹션을 직접 구성', color:'#8A8574',
    sections:[
      {key:'sec_abstract_default', label:'초록', guidance:'', limit:null},
    ]
  }
};

/* ============== SUBMISSION STATUS ============== */
const SUBMISSION_STAGES = [
  { key:'draft',              label:'작성 중',        color:'#6b7280', desc:'논문 원고를 작성하는 단계입니다.' },
  { key:'submitted',          label:'투고',           color:'#3b82f6', desc:'저널에 원고를 제출한 상태입니다.' },
  { key:'desk_review',        label:'데스크 리뷰',   color:'#8b5cf6', desc:'편집장이 저널 범위와 형식 적합성을 검토 중입니다.' },
  { key:'desk_rejected',      label:'Desk Reject',   color:'#ef4444', desc:'데스크 리뷰에서 거절됐습니다. 다른 저널을 고려해보세요.' },
  { key:'under_review',       label:'심사 중',        color:'#f59e0b', desc:'심사위원이 독창성·방법론·논리성 등을 평가 중입니다.' },
  { key:'major_revision',     label:'Major Revision', color:'#f97316', desc:'논리·데이터 보완이 필요합니다. 수정 후 재심사를 받습니다.' },
  { key:'minor_revision',     label:'Minor Revision', color:'#eab308', desc:'간단한 문구 수정이나 추가 설명 정도만 요구하는 긍정적인 단계입니다.' },
  { key:'rejected',           label:'Reject',         color:'#ef4444', desc:'게재가 거부됐습니다. 다른 저널을 찾아야 합니다.' },
  { key:'revision_submitted', label:'수정본 제출',   color:'#3b82f6', desc:'수정본을 제출해 재심사를 기다리는 중입니다.' },
  { key:'accepted',           label:'게재 승인',     color:'#10b981', desc:'모든 수정이 반영되어 편집장이 최종 게재를 승인했습니다.' },
  { key:'proofreading',       label:'교정',           color:'#0ea5e9', desc:'출판사 편집본을 검토 중입니다. 내용 수정은 불가합니다.' },
  { key:'online_first',       label:'Online First',  color:'#0ea5e9', desc:'DOI를 부여받아 온라인 선공개된 상태입니다.' },
  { key:'published',          label:'최종 출판',     color:'#10b981', desc:'정식 권·호에 포함되어 출판이 완료됐습니다.' },
];
const STAGE_MAP = Object.fromEntries(SUBMISSION_STAGES.map(s => [s.key, s]));
// 메인 선형 흐름 (분기 제외)
const MAIN_FLOW = ['draft','submitted','desk_review','under_review','major_revision','minor_revision','revision_submitted','accepted','proofreading','online_first','published'];

function getStage(project){
  return STAGE_MAP[(project.submissionStatus||{}).stage || 'draft'] || STAGE_MAP.draft;
}

/* ============== STATE ============== */
let state = {
  currentUser:null, authMode:'signin',
  tab:'dashboard', currentProjectId:null, currentSectionKey:null, saveTimer:null,
  figures:[], figureSaveTimer:null, figuresLoadFailed:false,
  references:[], refSaveTimer:null, referencesLoadFailed:false,
  authors:[], authorSaveTimer:null, authorsLoadFailed:false,
  authorDirectory:[], authorDirectoryLoaded:false,
  tables:[], tableSaveTimer:null, tablesLoadFailed:false,
  members:[], membersLoadFailed:false,
  highlights:[], highlightsLoadFailed:false, commentFilter:'open',
  itemComments:[],
  activeTextareaId:null, // 인용/그림/표 삽입 시 커서를 넣을 대상 textarea id
  openProject:null, // 현재 렌더링된 project 객체(실시간 브로드캐스트가 갱신할 대상)
  realtimeChannel:null, presenceUsers:{}, pendingRemoteEdits:{},
  followingUserId:null, // 화면 따라가기 대상 userId
  notifications:[] // 실시간 알림 목록 (최신순, 최대 60개)
};

const LEDGER_KEYS = ['__members__', '__authors__', '__figures__', '__refs__', '__tables__', '__comments__'];
function isLedgerKey(key){ return LEDGER_KEYS.includes(key); }

// 실시간 협업: 마지막으로 키를 입력한 시각 (sectionKey → timestamp)
const _lastTypedAt = {};
// selectionchange 리스너 참조 (removeEventListener용)
let _selectionChangeHandler = null;
// 채널 헬스체크 인터벌
let _realtimeHealthTimer = null;
// 내가 현재 섹션에 입장한 시각 (잠금 우선권 계산용)
let _mySectionAt = 0;

/* ============== STORAGE HELPERS (Supabase, 관계형) ==============
 * 예전에는 project/figures/refs/authors/tables가 각자 독립된 key-value
 * 레코드였다. 지금은 전부 projects 테이블 한 행(row)의 컬럼이고, RLS가
 * 프로젝트 멤버십으로 접근을 막아준다. 다만 이 파일의 나머지 코드는
 * 여전히 각각을 독립적으로 get/set하는 함수 이름과 반환 모양을 기대하므로,
 * 그 인터페이스는 그대로 유지한 채 내부 구현만 관계형 쿼리로 바꾼다.
 */
async function sbSelectWithRetry(table, columns, id, attempts=3){
  for(let i=0; i<attempts; i++){
    const { data, error } = await window.sb.from(table).select(columns).eq('id', id).maybeSingle();
    if(!error) return { data, failed:false };
    console.error(`${table} 조회 실패 (시도 ${i+1}/${attempts}):`, error);
    if(i < attempts-1) await new Promise(res => setTimeout(res, 400*(i+1)));
  }
  return { data:null, failed:true };
}
async function getProjectColumn(projectId, column, attempts=3){
  const { data, failed } = await sbSelectWithRetry('projects', column, projectId, attempts);
  if(failed) return { value:null, failed:true };
  return { value: data ? data[column] : null, failed:false };
}
async function setProjectColumn(projectId, column, value){
  const patch = { updated_at: new Date().toISOString() };
  patch[column] = value;
  const { error } = await window.sb.from('projects').update(patch).eq('id', projectId);
  if(error){ console.error(`projects.${column} 저장 실패:`, error); return false; }
  return true;
}

function computeProgressForRow(row){
  const project = { journalId: row.journal_id, customSections: row.custom_sections, content: row.content || {} };
  const secs = getSections(project);
  if(!secs.length) return 0;
  const filled = secs.filter(s => {
    if(isReferencesSection(s)) return (row.references_list || []).length > 0;
    return extractPlainText(project.content[s.key]).trim().length > 0;
  }).length;
  return Math.round((filled/secs.length)*100);
}

async function getIndex(){
  for(let i=0; i<3; i++){
    const { data, error } = await window.sb.from('projects')
      .select('id,title,journal_id,custom_sections,content,references_list,updated_at')
      .order('updated_at', { ascending:false });
    if(!error){
      const list = (data||[]).map(row => {
        const rawContent = row.content || {};
        return {
          id: row.id, title: row.title, journalId: row.journal_id,
          updatedAt: new Date(row.updated_at).getTime(),
          progress: computeProgressForRow(row),
          submissionStatus: rawContent.__submissionStatus__ || null
        };
      });
      return { list, failed:false };
    }
    console.error(`프로젝트 목록 조회 실패 (시도 ${i+1}/3):`, error);
    await new Promise(res => setTimeout(res, 400*(i+1)));
  }
  return { list:[], failed:true };
}

async function insertProject(p){
  const session = await getSession();
  if(!session) return { project:null, error:new Error('로그인이 필요합니다') };
  // id를 미리 만들어서 넣고 select()로 재조회하지 않는다: INSERT ... RETURNING은 반환되는
  // 행에 SELECT RLS 정책(is_project_member)도 함께 적용하는데, 그 정책이 "같은 문장 안에서
  // 막 삽입된 행"을 스스로 다시 조회해 확인하려다 보니 통과하지 못하는 Postgres RLS 엣지
  // 케이스가 있다. 별도 조회 없이 클라이언트가 이미 아는 값으로 결과를 직접 구성한다.
  const id = crypto.randomUUID();
  const initialContent = p.content || {};
  const row = {
    id, title: p.title, journal_id: p.journalId,
    custom_sections: p.journalId === 'custom' ? (p.customSections || []) : [],
    content: Object.keys(initialContent).length ? initialContent : {},
    owner_id: session.user.id
  };
  const { error } = await window.sb.from('projects').insert(row);
  if(error){ console.error('프로젝트 생성 실패:', error); return { project:null, error }; }
  const now = Date.now();
  return { project: mapProjectRow({
    id, title: row.title, journal_id: row.journal_id, custom_sections: row.custom_sections,
    content: row.content, editor_font_size: null, owner_id: row.owner_id,
    created_at: new Date(now).toISOString(), updated_at: new Date(now).toISOString()
  }), error:null };
}

function mapProjectRow(data){
  const raw = data.content || {};
  const submissionStatus = raw.__submissionStatus__ || null;
  const content = { ...raw };
  delete content.__submissionStatus__;
  return {
    id: data.id, title: data.title, journalId: data.journal_id,
    customSections: data.journal_id === 'custom' ? (data.custom_sections || []) : undefined,
    content, editorFontSize: data.editor_font_size || undefined,
    ownerId: data.owner_id, submissionStatus,
    createdAt: new Date(data.created_at).getTime(), updatedAt: new Date(data.updated_at).getTime()
  };
}

async function getProjectWithRetry(id, attempts=4){
  const { data, failed } = await sbSelectWithRetry(
    'projects', 'id,title,journal_id,custom_sections,content,editor_font_size,owner_id,created_at,updated_at', id, attempts
  );
  if(failed) return { project:null, failed:true };
  if(!data) return { project:null, failed:false };
  return { project: mapProjectRow(data), failed:false };
}
async function getProject(id){
  const { project } = await getProjectWithRetry(id, 3);
  return project;
}
async function setProject(p){
  // submissionStatus는 별도 컬럼 없이 content JSONB 안에 __submissionStatus__ 키로 보관
  const contentWithMeta = { ...(p.content || {}) };
  if(p.submissionStatus) contentWithMeta.__submissionStatus__ = p.submissionStatus;
  const patch = {
    title: p.title, journal_id: p.journalId,
    custom_sections: p.journalId === 'custom' ? (p.customSections || []) : [],
    content: contentWithMeta,
    editor_font_size: p.editorFontSize || null,
    updated_at: new Date().toISOString()
  };
  const { error } = await window.sb.from('projects').update(patch).eq('id', p.id);
  if(error){ console.error('프로젝트 저장 실패:', error); return false; }
  return true;
}
async function deleteProjectStorage(id){
  const { error } = await window.sb.from('projects').delete().eq('id', id);
  if(error){ console.error('프로젝트 삭제 실패:', error); return false; }
  return true;
}

async function getFigures(projectId){
  const { value, failed } = await getProjectColumn(projectId, 'figures');
  if(failed) return { figures:null, failed:true };
  return { figures: value || [], failed:false };
}
async function setFigures(projectId, figures){ return setProjectColumn(projectId, 'figures', figures); }
// figures는 이제 projects 행의 컬럼이라, 프로젝트 삭제(cascade) 시 함께 사라진다.
async function deleteFiguresStorage(){ return true; }

async function getTables(projectId){
  const { value, failed } = await getProjectColumn(projectId, 'tables');
  if(failed) return { tables:null, failed:true };
  return { tables: value || [], failed:false };
}
async function setTables(projectId, tables){ return setProjectColumn(projectId, 'tables', tables); }
async function deleteTablesStorage(){ return true; }

async function getReferences(projectId){
  const { value, failed } = await getProjectColumn(projectId, 'references_list');
  if(failed) return { references:null, failed:true };
  return { references: value || [], failed:false };
}
async function setReferences(projectId, refs){ return setProjectColumn(projectId, 'references_list', refs); }
async function deleteReferencesStorage(){ return true; }

async function getProjectAuthors(projectId){
  const { value, failed } = await getProjectColumn(projectId, 'authors');
  if(failed) return { authors:null, failed:true };
  return { authors: value || [], failed:false };
}
async function setProjectAuthors(projectId, authors){ return setProjectColumn(projectId, 'authors', authors); }
async function deleteProjectAuthorsStorage(){ return true; }

// 저자 주소록은 이제 로그인한 사용자 개인 소유(profiles.author_directory).
async function getAuthorDirectory(){
  const session = await getSession();
  if(!session) return { directory:[], failed:false };
  for(let i=0; i<3; i++){
    const { data, error } = await window.sb.from('profiles').select('author_directory').eq('id', session.user.id).maybeSingle();
    if(!error) return { directory: (data && data.author_directory) || [], failed:false };
    console.error(`author_directory 조회 실패 (시도 ${i+1}/3):`, error);
    await new Promise(res => setTimeout(res, 400*(i+1)));
  }
  return { directory:null, failed:true };
}
async function setAuthorDirectory(list){
  const { error } = await window.sb.rpc('update_my_author_directory', { new_list: list });
  if(error){ console.error('author_directory 저장 실패:', error); return false; }
  return true;
}


/* ============== UTIL ============== */
function fmtDate(ts){
  const d = new Date(ts);
  const date = d.getFullYear()+'.'+String(d.getMonth()+1).padStart(2,'0')+'.'+String(d.getDate()).padStart(2,'0');
  const time = String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')+':'+String(d.getSeconds()).padStart(2,'0');
  return date + ' ' + time;
}
function fmtChatTime(ts){
  const d = new Date(ts), now = new Date();
  const hh = String(d.getHours()).padStart(2,'0');
  const mm = String(d.getMinutes()).padStart(2,'0');
  const time = hh + ':' + mm;
  if(d.toDateString() === now.toDateString()) return time;
  return (d.getMonth()+1) + '.' + d.getDate() + ' ' + time;
}
function wordCount(text){
  if(!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}
// 구 journal ID → 새 ID 매핑 (이전 프로젝트 호환)
const JOURNAL_ALIAS = { mmi:'materials_standard', jmrt:'materials_standard', scripta_mat:'materials_standard', jac:'materials_standard', msea:'materials_standard', mmta:'materials_standard' };

function getSections(project){
  if(project.journalId === 'custom') return project.customSections || [];
  const id = JOURNAL_ALIAS[project.journalId] || project.journalId;
  return (JOURNALS[id] && JOURNALS[id].sections) || JOURNALS.materials_standard.sections;
}
function isReferencesSection(sec){
  return sec.key === 'references' || /reference|참고\s*문헌/i.test(sec.label || '');
}
function isKeywordsSection(sec){
  return sec.key === 'keywords' || /keyword|키워드/i.test(sec.label || '');
}
// Graphical Abstract는 원고 파일과 별도로 EPS/TIFF/PDF 등으로 제출하는 이미지
// 파일이라, 여기 적어둔 메모(어떤 이미지를 쓸지 계획해두는 칸)는 워드 원고에
// 합쳐 넣지 않는다.
function isGraphicalAbstractSection(sec){
  return sec.key === 'graphical_abstract' || /graphical\s*abstract|그래픽\s*초록/i.test(sec.label || '');
}
// 화면에서는 줄바꿈·쉼표 등 어떻게 입력하든 상관없지만, 내보내기에서는
// 논문 관례대로 "키워드1; 키워드2; 키워드3" 한 줄로 정리한다.
function formatKeywordsForExport(rawContent){
  if(!rawContent) return '';
  let plain;
  if(looksLikeHtml(rawContent)){
    // textContent는 <div> 줄 경계를 무시하고 그대로 이어붙이므로("A"+"B"가
    // "AB"가 됨), 최상위 자식 노드(줄)마다 직접 개행을 넣어준다.
    const tmp = document.createElement('div');
    tmp.innerHTML = rawContent;
    plain = Array.from(tmp.childNodes).map(node => node.textContent || '').join('\n');
  } else {
    plain = rawContent;
  }
  const tokens = plain.split(/[\n,;、，；]+/).map(s => s.trim()).filter(Boolean);
  return tokens.join('; ');
}
// Word 내보내기에서 번호(1., 2., ...)를 붙이지 않는 섹션들 — Abstract,
// Keywords, Highlights, Graphical Abstract, Declarations, References는
// 관례상 번호 없는 헤딩으로 쓰인다. Introduction/Experimental/Results/
// Conclusions 같은 본문 섹션만 번호가 매겨진다.
function isUnnumberedSection(sec){
  if(isReferencesSection(sec)) return true;
  if(isFreeSection(sec)) return true;
  if(['abstract','keywords','graphical_abstract','highlights','declarations','credit','competing_interest','acknowledgments','data_availability'].includes(sec.key)) return true;
  return /abstract|keyword|highlight|declaration|credit|acknowledgment|data\s*avail|초록|키워드|하이라이트|선언/i.test(sec.label || '');
}
function looksLikeHtml(str){
  return !!str && /<[a-z][\s\S]*>/i.test(str);
}

// Word(mso) HTML에서 스타일/클래스를 제거하고 의미론적 서식만 보존한다.
function cleanWordHtml(rawHtml) {
  let html = rawHtml
    .replace(/<!--\[if[^\]]*\][\s\S]*?<!\[endif\]-->/gi, '')  // Word 조건 주석
    .replace(/<\/?[a-zA-Z]+:[a-zA-Z\w]*[^>]*>/g, '');         // o:p, w:* 등 네임스페이스 태그

  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('style,meta,script,link').forEach(el => el.remove());

  function clean(node) {
    if (!node.parentNode) return;
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    Array.from(node.childNodes).forEach(clean);
    if (!node.parentNode) return;

    const tag = node.tagName.toLowerCase();

    if (['script','style','noscript','img','video','audio','iframe'].includes(tag)) {
      node.remove(); return;
    }

    if (tag === 'span') {
      const s = node.style;
      const fw = parseInt(s.fontWeight, 10) || 0;
      const bold = s.fontWeight === 'bold' || fw >= 700;
      const italic = s.fontStyle === 'italic';
      const underline = (s.textDecoration || '').includes('underline');
      const semTags = [];
      if (bold) semTags.push('strong');
      if (italic) semTags.push('em');
      if (underline) semTags.push('u');

      if (semTags.length) {
        let outer = doc.createElement(semTags[0]);
        let inner = outer;
        for (let i = 1; i < semTags.length; i++) {
          const next = doc.createElement(semTags[i]);
          inner.appendChild(next); inner = next;
        }
        while (node.firstChild) inner.appendChild(node.firstChild);
        node.parentNode.insertBefore(outer, node);
      } else {
        while (node.firstChild) node.parentNode.insertBefore(node.firstChild, node);
      }
      node.remove(); return;
    }

    const unwrap = new Set(['font','center','table','tbody','thead','tfoot','tr','fieldset','form']);
    if (unwrap.has(tag)) {
      while (node.firstChild) node.parentNode.insertBefore(node.firstChild, node);
      node.remove(); return;
    }

    if (tag === 'td' || tag === 'th') {
      const div = doc.createElement('div');
      while (node.firstChild) div.appendChild(node.firstChild);
      node.parentNode.insertBefore(div, node);
      node.remove(); return;
    }

    while (node.attributes.length) node.removeAttribute(node.attributes[0].name);
  }

  Array.from(doc.body.childNodes).forEach(clean);

  doc.body.querySelectorAll('p,div,li').forEach(el => {
    if (!el.textContent.replace(/[\s ]/g, '') && !el.querySelector('img,br')) el.remove();
  });

  return doc.body.innerHTML
    .replace(/&nbsp;/g, ' ')
    .replace(/ /g, ' ')
    .replace(/ {2,}/g, ' ')
    .trim();
}

function plainTextToEditableHtml(text){
  if(!text) return '';
  if(looksLikeHtml(text)) return text; // 이미 새 방식(그림 삽입 포함)으로 저장된 내용
  return escapeHtml(text).split('\n').map(line => `<div>${line || '<br>'}</div>`).join('');
}
function extractPlainText(html){
  if(!html) return '';
  if(!looksLikeHtml(html)) return html; // 예전 방식(순수 텍스트) 그대로 저장된 내용
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || '';
}
function isSectionFilled(project, sec){
  if(isReferencesSection(sec)) return (state.references || []).length > 0;
  return extractPlainText(project.content[sec.key]).trim().length > 0;
}
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(()=>t.classList.remove('show'), 1800);
}
function escapeHtml(s){
  return (s||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

/* ============== NAV ============== */
function goTab(tab){
  leaveProjectRealtime(); // 프로젝트 화면을 벗어나면 실시간 채널도 정리
  state.tab = tab;
  document.getElementById('tab-dashboard').classList.toggle('active', tab==='dashboard');
  document.getElementById('tab-library').classList.toggle('active', tab==='library');
  document.getElementById('tab-guide').classList.toggle('active', tab==='guide');
  document.getElementById('tab-admin').classList.toggle('active', tab==='admin');
  if(tab==='dashboard') renderDashboard();
  if(tab==='library') renderLibrary();
  if(tab==='guide') renderGuide();
  if(tab==='admin') renderAdminPanel();
}

/* ============== DASHBOARD ============== */
async function renderDashboard(){
  const main = document.getElementById('main-content');
  main.innerHTML = `<div class="page-head">
      <h1>내 프로젝트</h1>
      <p>투고할 논문을 프로젝트 단위로 관리하세요.</p>
    </div>
    <div id="dash-grid" class="grid-cards"><div style="grid-column:1/-1;color:var(--ink-faint);font-family:'Courier New', '맑은 고딕', monospace;font-size:12px;">불러오는 중…</div></div>`;

  const { list, failed } = await getIndex();
  const grid = document.getElementById('dash-grid');

  if(failed){
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:50px 20px;">
      <div style="font-family:'Times New Roman', '맑은 고딕', serif;font-size:17px;font-weight:600;margin-bottom:6px;">저장소에 잠깐 연결할 수 없어요</div>
      <div style="color:var(--ink-soft);font-size:13px;margin-bottom:18px;">일시적인 서버 오류예요. 프로젝트가 삭제된 것은 아니니 잠시 후 다시 시도해주세요.</div>
      <button class="btn small" onclick="renderDashboard()">다시 시도</button>
    </div>`;
    return;
  }

  if(list.length===0){
    grid.innerHTML = `<button class="new-card" onclick="openNewProjectModal()" style="grid-column:1/-1;min-height:220px;">
      <div class="plus">+</div><span>첫 프로젝트 만들기</span>
    </button>`;
    return;
  }

  // 저장된 순서 적용 (없으면 최근 수정 순)
  const userId = state.currentUser?.id || 'anon';
  const orderKey = `dash_order_${userId}`;
  const savedOrder = JSON.parse(localStorage.getItem(orderKey) || '[]');
  list.sort((a, b) => {
    const ai = savedOrder.indexOf(a.id);
    const bi = savedOrder.indexOf(b.id);
    if(ai === -1 && bi === -1) return b.updatedAt - a.updatedAt;
    if(ai === -1) return 1;
    if(bi === -1) return -1;
    return ai - bi;
  });

  function saveDashOrder(){
    const ids = Array.from(grid.querySelectorAll('.index-card[data-pid]')).map(el => el.dataset.pid);
    localStorage.setItem(orderKey, JSON.stringify(ids));
    // 카드 번호 갱신
    grid.querySelectorAll('.index-card[data-pid] .card-no').forEach((el, i) => {
      el.textContent = 'NO. ' + String(i+1).padStart(3,'0');
    });
  }

  function buildCardHtml(p, i){
    const j = JOURNALS[JOURNAL_ALIAS[p.journalId] || p.journalId] || JOURNALS.materials_standard;
    const progress = p.progress || 0;
    const submStage = getStage(p);
    const submKey = (p.submissionStatus||{}).stage || 'draft';
    let statusPill;
    if(submKey !== 'draft'){
      statusPill = `<span class="status-pill" style="background:${submStage.color}22;color:${submStage.color};border:1px solid ${submStage.color}44;">${submStage.label}</span>`;
    } else {
      let statusClass = 'status-none', statusLabel='시작 전';
      if(progress>0 && progress<100){ statusClass='status-doing'; statusLabel='작성 중'; }
      if(progress>=100){ statusClass='status-done'; statusLabel='완성'; }
      statusPill = `<span class="status-pill ${statusClass}">${statusLabel} · ${progress}%</span>`;
    }
    const targetJournal = (p.submissionStatus||{}).targetJournal || '';
    const submissionRow = submKey !== 'draft'
      ? `<div style="display:flex;align-items:center;gap:6px;margin-top:8px;">
           <span style="font-size:10px;color:var(--ink-faint);">투고 현황</span>
           <span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:6px;background:${submStage.color}22;color:${submStage.color};border:1px solid ${submStage.color}44;">${submStage.label}</span>
           ${targetJournal ? `<span style="font-size:10px;color:var(--ink-soft);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:90px;" title="${escapeHtml(targetJournal)}">${escapeHtml(targetJournal)}</span>` : ''}
         </div>` : '';
    return `<div class="index-card" draggable="true" data-pid="${p.id}" style="--spine:${j.color};position:relative;">
      <div style="position:absolute;top:8px;right:8px;display:flex;gap:4px;align-items:center;">
        <button class="card-action-btn" title="프로젝트 복사" onclick="event.stopPropagation();duplicateProject('${p.id}')">⧉</button>
        <div class="card-drag-handle" title="끌어서 순서 변경" onclick="event.stopPropagation()" style="position:static;">⋮⋮</div>
      </div>
      <div class="card-no">NO. ${String(i+1).padStart(3,'0')}</div>
      <div class="card-title">${escapeHtml(p.title || '제목 없음')}</div>
      <div class="card-journal">${escapeHtml(j.name)}</div>
      <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
      ${submissionRow}
      <div class="card-foot" style="margin-top:${submKey!=='draft'?'6px':''};">
        ${statusPill}
        <span class="card-date">${fmtDate(p.updatedAt)}</span>
      </div>
    </div>`;
  }

  let html = list.map((p, i) => buildCardHtml(p, i)).join('');
  html += `<button class="new-card" onclick="openNewProjectModal()"><div class="plus">+</div><span>새 프로젝트</span></button>`;
  grid.innerHTML = html;

  // 드래그 앤 드롭 순서 변경
  let dragSrcEl = null;
  grid.querySelectorAll('.index-card[data-pid]').forEach(card => {
    card.addEventListener('click', () => openWorkspace(card.dataset.pid));
    card.addEventListener('dragstart', e => {
      dragSrcEl = card;
      card.style.opacity = '0.45';
      e.dataTransfer.effectAllowed = 'move';
    });
    card.addEventListener('dragend', () => {
      card.style.opacity = '';
      grid.querySelectorAll('.index-card').forEach(c => c.classList.remove('drag-over'));
    });
    card.addEventListener('dragover', e => {
      e.preventDefault();
      if(dragSrcEl && dragSrcEl !== card) card.classList.add('drag-over');
    });
    card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
    card.addEventListener('drop', e => {
      e.preventDefault();
      card.classList.remove('drag-over');
      if(!dragSrcEl || dragSrcEl === card) return;
      // 드롭 위치에 삽입
      const cards = Array.from(grid.querySelectorAll('.index-card[data-pid]'));
      const srcIdx = cards.indexOf(dragSrcEl);
      const tgtIdx = cards.indexOf(card);
      if(srcIdx < tgtIdx) card.after(dragSrcEl);
      else card.before(dragSrcEl);
      saveDashOrder();
    });
  });
}

/* ============== NEW PROJECT MODAL ============== */
let newProjectSelectedJournal = null;

function openNewProjectModal(){
  newProjectSelectedJournal = null;
  const root = document.getElementById('modal-root');
  const journalCards = Object.keys(JOURNALS).map(id=>{
    const j = JOURNALS[id];
    return `<button class="journal-opt" style="border-left-color:${j.color}" data-id="${id}" onclick="selectJournalOpt('${id}')">
      <div class="jname">${escapeHtml(j.name)}</div>
    </button>`;
  }).join('');

  root.innerHTML = `<div class="modal-overlay" onclick="if(event.target===this) closeModal()">
    <div class="modal">
      <div class="modal-head"><h2>새 프로젝트</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="field">
          <label>논문(프로젝트) 제목</label>
          <input type="text" id="new-title" placeholder="예: Al-Mg-Si 합금의 시효 조건에 따른 미세조직 및 기계적 물성 변화" />
        </div>
        <div class="field">
          <label>형식 선택</label>
          <div class="journal-grid">${journalCards}</div>
        </div>
        <div class="modal-actions">
          <button class="btn secondary" onclick="closeModal()">취소</button>
          <button class="btn" id="create-btn" disabled onclick="submitNewProject()">프로젝트 만들기</button>
        </div>
      </div>
    </div>
  </div>`;
  document.getElementById('new-title').addEventListener('input', updateCreateBtn);
}
function selectJournalOpt(id){
  newProjectSelectedJournal = id;
  document.querySelectorAll('.journal-opt').forEach(el=>{
    el.classList.toggle('selected', el.dataset.id===id);
  });
  updateCreateBtn();
}
function updateCreateBtn(){
  const title = document.getElementById('new-title').value.trim();
  document.getElementById('create-btn').disabled = !(title && newProjectSelectedJournal);
}
function closeModal(){ document.getElementById('modal-root').innerHTML = ''; }

async function submitNewProject(){
  const title = document.getElementById('new-title').value.trim();
  if(!title || !newProjectSelectedJournal) return;
  // 기본 프레임은 defaultContent 가 있는 섹션을 미리 채워둔다
  const prefilledContent = {};
  if(newProjectSelectedJournal !== 'custom'){
    const jSecs = (JOURNALS[newProjectSelectedJournal] || {}).sections || [];
    jSecs.forEach(sec => {
      if(sec.defaultContent) prefilledContent[sec.key] = sec.defaultContent;
    });
  }
  const draft = {
    title, journalId:newProjectSelectedJournal,
    content: Object.keys(prefilledContent).length ? prefilledContent : undefined,
    customSections: newProjectSelectedJournal==='custom'
      ? [{key:'sec_'+Date.now()+'_'+Math.random().toString(36).slice(2,5), label:'초록', guidance:'', limit:null}]
      : undefined
  };

  const createBtn = document.getElementById('create-btn');
  if(createBtn){ createBtn.disabled = true; createBtn.textContent = '만드는 중…'; }

  // insert는 update와 달리 재시도하면 중복 생성될 위험이 있어 한 번만 시도한다.
  const { project } = await insertProject(draft);

  if(!project){
    showToast('프로젝트 저장에 실패했어요. 다시 시도해주세요');
    if(createBtn){ createBtn.disabled = false; createBtn.textContent = '프로젝트 만들기'; }
    return;
  }

  closeModal();
  openWorkspace(project.id);
}

async function duplicateProject(srcId){
  showToast('복사 중…');
  // 원본 프로젝트 + 참고문헌 + 저자 병렬 로드
  const [srcProject, { references: srcRefs }, { authors: srcAuthors }] = await Promise.all([
    getProject(srcId),
    getReferences(srcId),
    getProjectAuthors(srcId)
  ]);
  if(!srcProject){ showToast('원본 프로젝트를 불러오지 못했어요'); return; }

  // content에서 __submissionStatus__ 제거 (새 프로젝트는 초기 상태로)
  const newContent = { ...(srcProject.content || {}) };
  delete newContent.__submissionStatus__;

  const newProject = {
    title: (srcProject.title || '제목 없음') + ' (복사본)',
    journalId: srcProject.journalId,
    customSections: srcProject.customSections ? [...srcProject.customSections] : undefined,
    content: newContent
  };

  const { project } = await insertProject(newProject);
  if(!project){ showToast('복사에 실패했어요. 다시 시도해주세요'); return; }

  // 참고문헌 복사 (새 ID 부여)
  if(srcRefs && srcRefs.length){
    const newRefs = srcRefs.map(r => ({
      ...r,
      id: 'ref_' + Date.now() + '_' + Math.random().toString(36).slice(2,6)
    }));
    await setReferences(project.id, newRefs);
  }

  // 저자 복사 (새 ID 부여)
  if(srcAuthors && srcAuthors.length){
    const newAuthors = srcAuthors.map(a => ({
      ...a,
      id: 'author_' + Date.now() + '_' + Math.random().toString(36).slice(2,6)
    }));
    await setProjectAuthors(project.id, newAuthors);
  }

  showToast('복사 완료!');
  renderDashboard();
}

/* ============== GUIDE PAGE ============== */
function renderGuide(){
  const steps = [
    {t:'저널 선정', d:'연구 분야, 임팩트 팩터, 게재 범위(scope)를 확인하고 목표 저널을 2~3곳 후보로 정합니다. 최근 3년 게재 논문의 주제 경향을 살펴보는 것이 도움이 됩니다.'},
    {t:'투고 규정 확인', d:'저널 홈페이지의 "Author Guidelines"에서 원고 형식, 분량 제한, 인용 스타일, 그림/표 규정을 꼼꼼히 확인합니다.'},
    {t:'형식에 맞춰 원고 작성', d:'선택한 저널의 섹션 구성과 분량 제한에 맞춰 원고를 작성합니다. 이 사이트의 프로젝트 기능을 활용하면 섹션별로 정리하며 쓸 수 있습니다.'},
    {t:'커버레터 작성', d:'편집자에게 연구의 novelty와 저널 적합성을 짧고 명확하게 소개하는 커버레터를 준비합니다.'},
    {t:'온라인 투고 시스템 제출', d:'저널이 지정한 투고 시스템(예: Editorial Manager, ScholarOne)에 원고·그림·커버레터·저자정보를 업로드합니다.'},
    {t:'동료 심사 (Peer Review)', d:'보통 4~12주가 소요됩니다. 심사자는 방법론의 타당성, 결과의 신뢰성, 기여도를 평가합니다.'},
    {t:'수정 및 재심 (Revision)', d:'Major/Minor Revision 판정 시 심사자 코멘트에 항목별로 응답하는 Response Letter를 함께 제출합니다.'},
    {t:'게재 확정 및 교정', d:'Accept 후 최종 조판본(proof)을 확인하고 저작권 이양 동의서를 제출하면 게재가 완료됩니다.'},
  ];
  const main = document.getElementById('main-content');
  main.innerHTML = `<div class="page-head">
      <h1>투고 절차 가이드</h1>
      <p>저널마다 세부 절차는 다르지만, 대부분의 학술지 투고는 아래와 같은 흐름을 따릅니다.</p>
    </div>
    <div class="timeline">
      ${steps.map((s,i)=>`<div class="tl-item">
        <div class="tl-num">${String(i+1).padStart(2,'0')}</div>
        <div class="tl-body"><h3>${s.t}</h3><p>${s.d}</p></div>
      </div>`).join('')}
    </div>
    <div class="guide-note"><b>Tip.</b> 같은 연구라도 저널에 따라 요구하는 섹션 구성과 분량, 인용 스타일이 크게 다릅니다. 최종 투고 직전에는 반드시 최신 Author Guidelines를 다시 확인하세요. '프로젝트' 탭에서 저널을 선택하면 해당 저널의 표준 구성과 유의사항을 바로 확인할 수 있습니다.</div>`;
}

/* ============== WORKSPACE ============== */
function renderWorkspaceLoadError(id){
  const main = document.getElementById('main-content');
  main.innerHTML = `
    <button class="btn secondary small" style="margin-bottom:18px;" onclick="goTab('dashboard')">← 프로젝트 목록</button>
    <div class="editor-pane" style="text-align:center;padding:64px 24px;">
      <div style="font-family:'Times New Roman', '맑은 고딕', serif;font-size:19px;font-weight:600;margin-bottom:8px;">저장소에 잠깐 연결할 수 없어요</div>
      <div style="color:var(--ink-soft);font-size:13.5px;line-height:1.7;max-width:420px;margin:0 auto 22px;">
        일시적인 서버 오류로 원고를 불러오지 못했어요. 작성해두신 내용은 그대로 남아있을 가능성이 높으니, 삭제하거나 다시 만들지 말고 잠시 후 다시 시도해주세요.
      </div>
      <button class="btn" onclick="openWorkspace('${id}')">다시 시도</button>
    </div>
  `;
}

async function openWorkspace(id){
  state.currentProjectId = id;
  refFormOpen = false;
  const { project: fetched, failed } = await getProjectWithRetry(id);

  if(failed){
    renderWorkspaceLoadError(id);
    return;
  }

  let project = fetched;
  if(!project){
    // 서버 오류는 아니었지만 데이터가 없는 경우: 목록 카드 정보로 임시 화면만 구성 (자동 저장/덮어쓰기는 하지 않음)
    const { list } = await getIndex();
    const entry = list.find(p => p.id === id);
    if(entry){
      project = {
        id, title: entry.title || '제목 없음', journalId: entry.journalId || 'custom',
        customSections: entry.journalId === 'custom'
          ? [{key:'sec_abstract_default', label:'초록', guidance:'', limit:null}]
          : undefined,
        content:{}, createdAt: entry.updatedAt || Date.now(), updatedAt: Date.now()
      };
      showToast('저장된 원고 내용을 찾지 못해 빈 화면으로 열었어요');
    }
  }

  if(!project){ showToast('프로젝트를 찾을 수 없습니다'); goTab('dashboard'); return; }
  const { figures, failed: figuresFailed } = await getFigures(id);
  state.figuresLoadFailed = figuresFailed;
  if(figuresFailed){
    state.figures = [];
    showToast('그림 목록을 불러오지 못했어요 (일시적 오류)');
  } else {
    state.figures = figures;
  }
  const { references, failed: refsFailed } = await getReferences(id);
  state.referencesLoadFailed = refsFailed;
  if(refsFailed){
    state.references = [];
    showToast('참고문헌 목록을 불러오지 못했어요 (일시적 오류)');
  } else {
    state.references = references;
  }
  const { authors, failed: authorsFailed } = await getProjectAuthors(id);
  state.authorsLoadFailed = authorsFailed;
  if(authorsFailed){
    state.authors = [];
    showToast('저자 목록을 불러오지 못했어요 (일시적 오류)');
  } else {
    state.authors = authors;
  }
  const { tables, failed: tablesFailed } = await getTables(id);
  state.tablesLoadFailed = tablesFailed;
  if(tablesFailed){
    state.tables = [];
    showToast('표 목록을 불러오지 못했어요 (일시적 오류)');
  } else {
    state.tables = tables;
  }
  const { owner, members, failed: membersFailed } = await listProjectMembers(id, project.ownerId);
  state.membersLoadFailed = membersFailed;
  state.owner = membersFailed ? null : owner;
  state.members = membersFailed ? [] : members;
  const { highlights, failed: highlightsFailed } = await listHighlights(id);
  state.highlightsLoadFailed = highlightsFailed;
  state.highlights = highlightsFailed ? [] : highlights;
  const { itemComments } = await listItemComments(id);
  state.itemComments = itemComments || [];
  const secs = getSections(project);
  state.currentSectionKey = secs.length ? secs[0].key : null;
  joinProjectRealtime(id);
  renderWorkspace(project);
}

async function retryLoadFigures(){
  const { figures, failed } = await getFigures(state.currentProjectId);
  state.figuresLoadFailed = failed;
  if(failed){ showToast('아직도 불러오지 못했어요. 잠시 후 다시 시도해주세요'); }
  else { state.figures = figures; showToast('그림 목록을 다시 불러왔어요'); }
  const project = await getProject(state.currentProjectId);
  if(project) renderWorkspace(project);
}

async function retryLoadReferences(){
  const { references, failed } = await getReferences(state.currentProjectId);
  state.referencesLoadFailed = failed;
  if(failed){ showToast('아직도 불러오지 못했어요. 잠시 후 다시 시도해주세요'); }
  else { state.references = references; showToast('참고문헌 목록을 다시 불러왔어요'); }
  const project = await getProject(state.currentProjectId);
  if(project) renderWorkspace(project);
}

async function retryLoadAuthors(){
  const { authors, failed } = await getProjectAuthors(state.currentProjectId);
  state.authorsLoadFailed = failed;
  if(failed){ showToast('아직도 불러오지 못했어요. 잠시 후 다시 시도해주세요'); }
  else { state.authors = authors; showToast('저자 목록을 다시 불러왔어요'); }
  const project = await getProject(state.currentProjectId);
  if(project) renderWorkspace(project);
}

async function retryLoadTables(){
  const { tables, failed } = await getTables(state.currentProjectId);
  state.tablesLoadFailed = failed;
  if(failed){ showToast('아직도 불러오지 못했어요. 잠시 후 다시 시도해주세요'); }
  else { state.tables = tables; showToast('표 목록을 다시 불러왔어요'); }
  const project = await getProject(state.currentProjectId);
  if(project) renderWorkspace(project);
}

async function retryLoadMembers(){
  const project = await getProject(state.currentProjectId);
  if(!project){ showToast('아직도 불러오지 못했어요. 잠시 후 다시 시도해주세요'); return; }
  const { owner, members, failed } = await listProjectMembers(state.currentProjectId, project.ownerId);
  state.membersLoadFailed = failed;
  if(failed){ showToast('아직도 불러오지 못했어요. 잠시 후 다시 시도해주세요'); }
  else { state.owner = owner; state.members = members; showToast('팀원 목록을 다시 불러왔어요'); }
  renderWorkspace(project);
}

function renderWorkspace(project){
  teardownScrollSpy();
  state.openProject = project;
  const j = JOURNALS[JOURNAL_ALIAS[project.journalId] || project.journalId] || JOURNALS.materials_standard;
  const secs = getSections(project);
  const isCustom = project.journalId === 'custom';
  const figCount = (state.figures || []).length;
  const refCount = (state.references || []).length;
  const authorCount = (state.authors || []).length;
  const tableCount = (state.tables || []).length;
  const memberCount = 1 + (state.members || []).length; // owner + invited participants
  const openCommentCount = (state.highlights || []).filter(h => !h.resolvedAt).length + (state.itemComments || []).filter(c => !c.resolvedAt).length;

  const currentStage = getStage(project);
  const statusBtn = `<button class="toc-item toc-figures ${state.currentSectionKey==='__status__'?'active':''}" data-section-key="__status__" onclick="selectStatus()">
      <span class="toc-num">◈</span>
      <span style="flex:1;text-align:left;">투고 현황</span>
      <span style="font-size:10px;font-weight:600;padding:1px 6px;border-radius:8px;background:${currentStage.color}22;color:${currentStage.color};white-space:nowrap;">${currentStage.label}</span>
    </button>`;
  const membersBtn = `<button class="toc-item toc-figures ${state.currentSectionKey==='__members__'?'active':''}" data-section-key="__members__" onclick="selectMembers()">
      <span class="toc-num">☺</span>
      <span style="flex:1;text-align:left;">팀원${state.membersLoadFailed ? ' ⚠' : ` (${memberCount})`}</span>
      <span class="toc-dot" style="visibility:hidden;"></span>
    </button>`;
  const commentsBtn = `<button class="toc-item toc-figures ${state.currentSectionKey==='__comments__'?'active':''}" data-section-key="__comments__" onclick="selectComments()">
      <span class="toc-num">✎</span>
      <span style="flex:1;text-align:left;">댓글${state.highlightsLoadFailed ? ' ⚠' : (openCommentCount ? ` (${openCommentCount})` : '')}</span>
      <span class="toc-dot" style="visibility:hidden;"></span>
    </button>`;
  const authorsBtn = `<button class="toc-item toc-figures ${state.currentSectionKey==='__authors__'?'active':''}" data-section-key="__authors__" onclick="selectAuthors()">
      <span class="toc-num">✎</span>
      <span style="flex:1;text-align:left;">Author Ledger${state.authorsLoadFailed ? ' ⚠' : (authorCount ? ` (${authorCount})` : '')}</span>
      <span class="toc-dot" style="visibility:hidden;"></span>
    </button>`;
  const figuresBtn = `<button class="toc-item toc-figures ${state.currentSectionKey==='__figures__'?'active':''}" data-section-key="__figures__" onclick="selectFigures()">
      <span class="toc-num">▤</span>
      <span style="flex:1;text-align:left;">Fig Ledger${state.figuresLoadFailed ? ' ⚠' : (figCount ? ` (${figCount})` : '')}</span>
      <span class="toc-dot" style="visibility:hidden;"></span>
    </button>`;
  const tablesBtn = `<button class="toc-item toc-figures ${state.currentSectionKey==='__tables__'?'active':''}" data-section-key="__tables__" onclick="selectTables()">
      <span class="toc-num">▦</span>
      <span style="flex:1;text-align:left;">Table Ledger${state.tablesLoadFailed ? ' ⚠' : (tableCount ? ` (${tableCount})` : '')}</span>
      <span class="toc-dot" style="visibility:hidden;"></span>
    </button>`;
  const refsBtn = `<button class="toc-item toc-figures ${state.currentSectionKey==='__refs__'?'active':''}" data-section-key="__refs__" onclick="selectReferences()">
      <span class="toc-num">§</span>
      <span style="flex:1;text-align:left;">Ref Ledger${state.referencesLoadFailed ? ' ⚠' : (refCount ? ` (${refCount})` : '')}</span>
      <span class="toc-dot" style="visibility:hidden;"></span>
    </button>
    <div class="toc-divider"></div>`;

  const tocItems = secs.map((s,i)=>{
    const filled = isSectionFilled(project, s);
    return `<button class="toc-item ${s.key===state.currentSectionKey?'active':''} ${filled?'filled':''}" data-section-key="${s.key}" onclick="selectSection('${s.key}')">
      <span class="toc-num">${String(i+1).padStart(2,'0')}</span>
      <span style="flex:1;text-align:left;">${escapeHtml(s.label)}</span>
      <span class="toc-dot"></span>
    </button>`;
  }).join('');

  const main = document.getElementById('main-content');
  main.innerHTML = `
    <button class="btn secondary small" style="margin-bottom:18px;" onclick="goTab('dashboard')">← 프로젝트 목록</button>
    <div class="ws-header">
      <div style="flex:1;min-width:260px;">
        <input class="ws-title-input" id="ws-title" value="${escapeHtml(project.title)}" />
        <div class="ws-meta">
          <span class="journal-badge" style="background:${j.color}22;color:${j.color}">${escapeHtml(j.name)}</span>
          <span class="submission-stage-badge" onclick="selectStatus()" title="투고 현황 보기" style="cursor:pointer;font-size:11px;font-weight:600;padding:2px 8px;border-radius:8px;background:${currentStage.color}22;color:${currentStage.color};">${currentStage.label}</span>
          <span class="save-indicator" id="save-indicator">저장됨 · ${fmtDate(project.updatedAt)}</span>
          <span class="presence-bar" id="presence-bar"></span>
        </div>
      </div>
      <div class="ws-actions">
        <select class="btn secondary small" id="font-size-select" title="본문 글자 크기" style="padding:6px 10px;">
          <option value="13">가 작게</option>
          <option value="15">가 보통</option>
          <option value="17">가 크게</option>
          <option value="19">가 아주 크게</option>
        </select>
        <button class="btn secondary small" onclick="exportProject('${project.id}')">Word로 내보내기</button>
        ${project.ownerId === state.currentUser.id ? `<button class="btn danger small" onclick="confirmDeleteProject('${project.id}')">삭제</button>` : ''}
      </div>
    </div>

    <div class="ws-body" style="margin-top:22px;">
      <div class="toc">
        ${statusBtn}
        ${membersBtn}
        ${commentsBtn}
        ${authorsBtn}
        ${figuresBtn}
        ${tablesBtn}
        ${refsBtn}
        ${tocItems}
        ${isCustom ? `<button class="toc-add-btn" onclick="addCustomSection()">+ 섹션 추가</button>` : ''}
        <div class="toc-contact">개발 문의 : jiinhwang@kims.re.kr</div>
      </div>
      <div class="editor-pane" id="editor-pane"></div>
    </div>
  `;

  document.getElementById('ws-title').addEventListener('input', (e)=>{
    project.title = e.target.value;
    scheduleSave(project);
  });

  const fontSizeSelect = document.getElementById('font-size-select');
  const editorFontSize = project.editorFontSize || 15;
  fontSizeSelect.value = String(editorFontSize);
  document.getElementById('editor-pane').style.setProperty('--editor-font-size', editorFontSize + 'px');
  fontSizeSelect.addEventListener('change', (e) => {
    const size = Number(e.target.value) || 15;
    project.editorFontSize = size;
    document.getElementById('editor-pane').style.setProperty('--editor-font-size', size + 'px');
    scheduleSave(project);
  });

  if(state.currentSectionKey === '__status__'){
    renderStatusManager(project);
  } else if(state.currentSectionKey === '__members__'){
    renderMembersManager(project);
  } else if(state.currentSectionKey === '__comments__'){
    renderCommentsManager(project);
  } else if(state.currentSectionKey === '__authors__'){
    renderAuthorManager(project);
  } else if(state.currentSectionKey === '__figures__'){
    renderFigureManager(project);
  } else if(state.currentSectionKey === '__tables__'){
    renderTableManager(project);
  } else if(state.currentSectionKey === '__refs__'){
    renderRefManager(project);
  } else {
    renderManuscriptCanvas(project, isCustom);
    requestAnimationFrame(() => {
      if(state.currentSectionKey) scrollToSection(state.currentSectionKey, false);
      setupScrollSpy();
      applyResolvedMarkClasses();
    });
  }
  // renderWorkspace가 HTML을 통째로 교체하면 presence-bar가 빈 상태로 초기화됨.
  // 이미 알고 있는 presenceUsers로 즉시 복원한다.
  renderPresenceBar();
  refreshTocPresenceDots();
  applySectionLocks();
}

function referencesSectionInnerHtml(sec){
  const refs = state.references || [];
  const project = state.openProject;
  const citedNums = project ? computeRefCitedNumbers(project) : new Set();
  // 인용된 참고문헌만 순서대로 표시
  const citedList = refs.reduce((acc, r, i) => {
    if(citedNums.has(i+1)) acc.push({ ref: r, num: i+1 });
    return acc;
  }, []);
  const list = citedList.length
    ? citedList.map(({ ref: r, num }, ci) => `
        <p><span class="fig-label" style="margin-right:8px;">[${ci+1}]</span>${escapeHtml(r.text || '(내용 없음)')}</p>
      `).join('')
    : `<div style="color:var(--ink-faint);font-size:13px;text-align:center;padding:20px 0;">${
        refs.length ? '본문에 인용된 참고문헌이 없습니다' : '아직 등록한 참고문헌이 없습니다'
      }</div>`;
  return `
    <div class="editor-head"><h2>${escapeHtml(sec.label)}</h2></div>
    <div class="editor-guidance" style="border-left-color:var(--stamp-green);color:var(--stamp-green);">이 목록은 Ref Ledger에서 자동으로 생성돼요. 본문에서 인용된 참고문헌만 번호가 부여되며, 인용 순서에 따라 자동으로 정렬됩니다.</div>
    <button class="btn secondary small" style="margin-bottom:16px;" onclick="selectReferences()">Ref Ledger로 이동</button>
    <div style="font-family:'Times New Roman', '맑은 고딕', serif;font-size:15px;line-height:1.85;">${list}</div>
  `;
}

function initKeywordTagInput(sec, project){
  const chipsEl = document.getElementById('kw-chips-' + sec.key);
  const input   = document.getElementById('kw-input-'  + sec.key);
  if(!chipsEl || !input) return;

  function parseKws(raw){
    if(!raw) return [];
    const plain = looksLikeHtml(raw)
      ? (() => { const t = document.createElement('div'); t.innerHTML = raw; return Array.from(t.childNodes).map(n => n.textContent||'').join('\n'); })()
      : raw;
    return plain.split(/[\n,;、，；]+/).map(s => s.trim()).filter(Boolean);
  }

  let tags = parseKws(project.content[sec.key] || '');

  function renderChips(){
    chipsEl.innerHTML = tags.map((t, i) =>
      `<span class="kw-chip">${escapeHtml(t)}<button type="button" data-idx="${i}" tabindex="-1">✕</button></span>`
    ).join('');
    chipsEl.querySelectorAll('button[data-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        tags.splice(parseInt(btn.dataset.idx), 1);
        persist();
        input.focus();
      });
    });
  }

  function persist(){
    project.content[sec.key] = tags.join('; ');
    scheduleSave(project);
    refreshTocFilledState(sec.key, tags.length > 0);
    const wcEl = document.getElementById('wc-display-' + sec.key);
    if(wcEl){ wcEl.textContent = tags.length + '개 / 6개'; wcEl.classList.toggle('over', tags.length > 6); }
    renderChips();
  }

  function commitInput(){
    const val = input.value.trim().replace(/[,;]+$/, '').trim();
    if(!val) return;
    val.split(/[,;、，；]+/).map(s => s.trim()).filter(Boolean).forEach(t => {
      if(!tags.includes(t)) tags.push(t);
    });
    input.value = '';
    persist();
  }

  input.addEventListener('keydown', e => {
    if(e.key === 'Enter' || e.key === ','){ e.preventDefault(); commitInput(); }
    else if(e.key === 'Backspace' && !input.value && tags.length){ tags.pop(); persist(); }
  });
  input.addEventListener('blur', () => { if(input.value.trim()) commitInput(); });

  // Initial render (no save)
  renderChips();
  const wcEl = document.getElementById('wc-display-' + sec.key);
  if(wcEl){ wcEl.textContent = tags.length + '개 / 6개'; wcEl.classList.toggle('over', tags.length > 6); }
}

// 섹션을 한 번에 하나씩 보여주던 방식 대신, 전체 섹션을 한 캔버스에 이어서
// 렌더링해 스크롤만으로 원고를 죽 훑어볼 수 있게 한다. 각 섹션은 고유
// id(sec.key 접미사)를 가진 자기만의 편집 영역·삽입 버튼·단어 수를 유지한다.
function renderManuscriptCanvas(project, isCustom){
  const pane = document.getElementById('editor-pane');
  const secs = getSections(project);
  if(!secs.length){
    pane.innerHTML = `<div style="color:var(--ink-faint);font-size:13.5px;">아직 섹션이 없습니다. 왼쪽에서 섹션을 추가해보세요.</div>`;
    return;
  }

  pane.innerHTML = secs.map(sec => {
    if(isReferencesSection(sec)){
      return `<section class="ms-section" id="ms-section-${sec.key}" data-section-key="${sec.key}">${referencesSectionInnerHtml(sec)}</section>`;
    }
    const rawContent = project.content[sec.key] || '';
    const plainText = extractPlainText(rawContent);
    const wc = wordCount(plainText);
    const overLimit = sec.limit && wc > sec.limit;
    const isEmpty = plainText.trim().length === 0;

    let labelField = `<h2>${escapeHtml(sec.label)}</h2>`;
    if(isCustom){
      labelField = `<input type="text" id="sec-label-input-${sec.key}" value="${escapeHtml(sec.label)}" style="font-family:'Times New Roman', '맑은 고딕', serif;font-size:20px;font-weight:600;border:none;background:transparent;border-bottom:1px dashed var(--line-strong);padding:2px 0;flex:1;" />`;
    }

    return `<section class="ms-section" id="ms-section-${sec.key}" data-section-key="${sec.key}">
      <div class="editor-head">
        ${labelField}
        <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
          <button class="btn secondary small" onclick="addHighlightToSection('${sec.key}')">＋ 하이라이트</button>
          ${sec.limit ? `<span class="section-limit">권장 ${sec.limit}단어 이내</span>` : ''}
          ${isCustom ? `<button class="icon-btn" title="섹션 삭제" onclick="removeCustomSection('${sec.key}')">✕</button>` : ''}
        </div>
      </div>
      ${isCustom ? `<input type="text" id="sec-guidance-input-${sec.key}" placeholder="이 섹션에 무엇을 써야 하는지 메모 (선택)" value="${escapeHtml(sec.guidance||'')}" style="width:100%;border:none;background:transparent;font-family:'Times New Roman', '맑은 고딕', serif;font-style:italic;font-size:13px;color:var(--ink-soft);margin:8px 0 16px;padding:0;" />`
        : (sec.guidance ? `<div class="editor-guidance">${escapeHtml(sec.guidance)}</div>` : '')}
      ${isKeywordsSection(sec) ? `
      <div class="kw-tag-wrapper" id="kw-wrapper-${sec.key}">
        <div class="kw-chips" id="kw-chips-${sec.key}"></div>
        <input type="text" class="kw-input" id="kw-input-${sec.key}" placeholder="키워드를 입력하세요" autocomplete="off" />
        <div class="kw-hint">키워드 입력 후 콤마(,) 또는 Enter로 추가하세요. (권장 4~6개)</div>
      </div>
      ` : `<div class="editor-area ${isEmpty ? 'is-empty' : ''}" id="sec-content-input-${sec.key}" contenteditable="true" data-placeholder="내용을 작성하세요.">${plainTextToEditableHtml(rawContent)}</div>`}
      <div class="editor-foot">
        <span class="word-count ${overLimit?'over':''}" id="wc-display-${sec.key}">${wc}단어${sec.limit?(' / '+sec.limit):''}</span>
        <span class="save-indicator" id="editor-save-indicator"></span>
      </div>
    </section>`;
  }).join('');

  if(!state.activeTextareaId || !document.getElementById(state.activeTextareaId)){
    const firstEditable = secs.find(s => !isReferencesSection(s));
    if(firstEditable) state.activeTextareaId = 'sec-content-input-' + firstEditable.key;
  }

  initCursorToolbar();

  secs.forEach(sec => {
    if(isReferencesSection(sec)) return;
    if(isKeywordsSection(sec)){ initKeywordTagInput(sec, project); return; }
    const contentInput = document.getElementById('sec-content-input-' + sec.key);
    if(!contentInput) return;

    contentInput.addEventListener('focus', () => {
      state.activeTextareaId = 'sec-content-input-' + sec.key;
      updateMyPresenceSection(sec.key);
    });

    // 내가 이 섹션에 타이핑 중일 때 도착한 원격 수정은 즉시 반영하지 않고
    // 큐에 쌓아뒀다가(handleRemoteEdit 참고), 포커스를 벗어나는 시점에
    // 반영한다 — 타이핑 중간에 커서 아래 텍스트가 바뀌는 걸 막기 위함.
    contentInput.addEventListener('blur', () => {
      // 같은 섹션을 동시에 편집하다 blur했을 때 상대방 버전으로 내 글을 덮어쓰지 않는다.
      // 마지막으로 DB에 저장한 사람이 최종 버전이 되며, 상대방은 다음 broadcast에서 받는다.
      delete state.pendingRemoteEdits[sec.key];
    });

    const broadcastThrottled = throttleTrailing((html) => {
      broadcastSectionEdit(sec.key, html, getCaretCharOffset(contentInput));
    }, 150);

    contentInput.addEventListener('paste', (e) => {
      const cd = e.clipboardData || window.clipboardData;
      if (!cd) return;
      const htmlData = cd.getData('text/html');
      const textData = cd.getData('text/plain');
      // Word / 외부 앱 HTML만 정리 (내부 복붙은 브라우저에 맡김)
      const isWordOrExternal = /xmlns:|mso-|<o:|urn:schemas-microsoft-com/i.test(htmlData);
      if (!htmlData || !isWordOrExternal) return;
      e.preventDefault();
      let cleanHtml = cleanWordHtml(htmlData);
      if (!cleanHtml.trim() && textData) {
        cleanHtml = textData.split('\n')
          .map(line => `<div>${escapeHtml(line.trim()) || '<br>'}</div>`)
          .join('');
      }
      if (cleanHtml) document.execCommand('insertHTML', false, cleanHtml);
    });

    contentInput.addEventListener('input', ()=>{
      _lastTypedAt[sec.key] = Date.now();
      project.content[sec.key] = contentInput.innerHTML;
      const plain = contentInput.textContent || '';
      contentInput.classList.toggle('is-empty', plain.trim().length === 0);
      const w = wordCount(plain);
      const wcEl = document.getElementById('wc-display-' + sec.key);
      if(wcEl){
        wcEl.textContent = w + '단어' + (sec.limit ? (' / '+sec.limit) : '');
        wcEl.classList.toggle('over', sec.limit && w>sec.limit);
      }
      scheduleSave(project);
      refreshTocFilledState(sec.key, plain.trim().length > 0);
      broadcastThrottled(contentInput.innerHTML);
      // 하이라이트 원문이 수정됐으면 자동 제거 (현재 이벤트 처리 후 실행)
      setTimeout(() => _autoRemoveModifiedHighlights(contentInput, sec.key, project), 0);
      // 인용 토큰이 삭제돼 gap이 생겼으면 자동 재번호
      setTimeout(() => _resyncRefTokensAfterBodyEdit(contentInput, sec.key, project), 200);
    });

    // 그림(contenteditable=false 블록)을 클릭하면 브라우저가 블록 전체를
    // "선택"해버려 커서가 생기지 않는다. 클릭 위치가 그림의 위쪽 절반이면
    // 그림 앞, 아래쪽 절반이면 그림 뒤에 있는(없으면 새로 만드는) 빈 줄에
    // 커서를 놓아 Word처럼 그림 사이 어디를 눌러도 이어서 타이핑할 수 있게
    // 한다. 브라우저의 네이티브 선택 처리가 이 시점 이후에도 한 번 더
    // 개입해 커서를 지우므로, 그 처리가 끝난 다음 틱에 다시 적용해야
    // 유지된다. 또한 커서는 반드시 실제 텍스트 줄(요소와 요소 "사이"가
    // 아니라) 안에 있어야 타이핑이 씹히지 않는다.
    contentInput.addEventListener('mousedown', (e) => {
      const block = e.target.closest && e.target.closest('.inline-figure, .inline-table');
      if(!block || !contentInput.contains(block)) return;
      e.preventDefault();
      const clickY = e.clientY;
      setTimeout(() => {
        const rect = block.getBoundingClientRect();
        const after = (clickY - rect.top) > rect.height / 2;
        let target = after ? block.nextElementSibling : block.previousElementSibling;
        const isAtomicBlock = (el) => el && (el.classList.contains('inline-figure') || el.classList.contains('inline-table'));
        if(!target || isAtomicBlock(target)){
          target = document.createElement('div');
          target.innerHTML = '<br>';
          if(after){ block.after(target); } else { block.before(target); }
        }
        const range = document.createRange();
        range.selectNodeContents(target);
        range.collapse(true);
        contentInput.focus();
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }, 0);
    });

    contentInput.addEventListener('click', (e) => {
      const mark = e.target.closest('mark.hl');
      if(mark) openHighlightPopover(mark.dataset.hlId, mark);
      const refToken = e.target.closest('.body-ref-token');
      if(refToken) openCiteEditPopup(refToken);
      const figToken = e.target.closest('.body-fig-token');
      if(figToken){ jumpToInlineBlock('figure', figToken); return; }
      const tableToken = e.target.closest('.body-table-token');
      if(tableToken){ jumpToInlineBlock('table', tableToken); return; }
      const eqToken = e.target.closest('.body-eq-token');
      if(eqToken){ openEquationPanel(eqToken); return; }
    });

    if(isCustom){
      const labelInput = document.getElementById('sec-label-input-' + sec.key);
      if(labelInput){
        labelInput.addEventListener('input', (e)=>{
          sec.label = e.target.value;
          scheduleSave(project);
          refreshTocOnly(project);
        });
      }
      const guidanceInput = document.getElementById('sec-guidance-input-' + sec.key);
      if(guidanceInput){
        guidanceInput.addEventListener('input', (e)=>{
          sec.guidance = e.target.value;
          scheduleSave(project);
        });
      }
    }
  });
}

function scrollToSection(key, smooth){
  const target = document.getElementById('ms-section-' + key);
  if(!target) return;
  _scrollSpyPaused = true;
  target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'center' });
  // 스크롤이 완료된 뒤 스파이를 다시 활성화 (smooth는 좀 더 길게 대기)
  setTimeout(() => { _scrollSpyPaused = false; }, smooth ? 800 : 150);
}

function setActiveTocItem(key){
  document.querySelectorAll('.toc .toc-item').forEach(btn => btn.classList.remove('active'));
  const btn = document.querySelector(`.toc .toc-item[data-section-key="${key}"]`);
  if(btn) btn.classList.add('active');
}

function refreshTocFilledState(key, filled){
  const btn = document.querySelector(`.toc .toc-item[data-section-key="${key}"]`);
  if(btn) btn.classList.toggle('filled', filled);
}

let scrollSpyObserver = null;
let _scrollSpyPaused = false;
function teardownScrollSpy(){
  if(scrollSpyObserver){ scrollSpyObserver.disconnect(); scrollSpyObserver = null; }
}
// 스크롤 위치에 따라 사이드바 TOC의 활성 항목을 자동으로 갱신한다
// 감지 띠를 화면 중앙(40~60%) 기준으로 설정해 block:'center' 스크롤과 일치시킨다.
function setupScrollSpy(){
  teardownScrollSpy();
  if(typeof IntersectionObserver === 'undefined') return;
  const sections = document.querySelectorAll('.ms-section[data-section-key]');
  if(!sections.length) return;
  scrollSpyObserver = new IntersectionObserver((entries) => {
    if(_scrollSpyPaused) return;
    const visible = entries.filter(e => e.isIntersecting);
    if(!visible.length) return;
    visible.sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top);
    const key = visible[0].target.dataset.sectionKey;
    if(key && key !== state.currentSectionKey){
      state.currentSectionKey = key;
      setActiveTocItem(key);
    }
  }, { root:null, rootMargin:'-38% 0px -38% 0px', threshold:0 });
  sections.forEach(sec => scrollSpyObserver.observe(sec));
}

/* ============== 실시간 협업 (Supabase Realtime: broadcast + presence) ==============
 * 진짜 CRDT(Figma/Google Docs 수준의 무충돌 동시편집)는 아니고, 브로드캐스트
 * 기반의 "거의 실시간" 동기화다. 서로 다른 섹션을 동시에 편집하는 일반적인
 * 경우는 충돌 없이 실시간으로 보이고, 아주 드물게 같은 섹션을 동시에 타이핑
 *하면 나중에 도착한 쪽이 이긴다(마지막에 blur한 사람 기준). 이 정도 트레이드
 * 오프는 사용자와 합의된 범위.
 */
const PRESENCE_COLORS = ['#2F6F5E','#B98A2E','#9A3B2E','#2F4C6E','#5B4B8A','#4E7A3B','#8A3B24','#6B6558'];
function colorForUser(userId){
  let hash = 0;
  for(let i=0; i<userId.length; i++) hash = (hash*31 + userId.charCodeAt(i)) >>> 0;
  return PRESENCE_COLORS[hash % PRESENCE_COLORS.length];
}

function throttleTrailing(fn, wait){
  let timer = null, lastArgs = null, lastCall = 0;
  return function(...args){
    lastArgs = args;
    const now = Date.now();
    const remaining = wait - (now - lastCall);
    if(remaining <= 0){
      lastCall = now;
      fn(...lastArgs);
    } else if(!timer){
      timer = setTimeout(() => {
        lastCall = Date.now();
        timer = null;
        fn(...lastArgs);
      }, remaining);
    }
  };
}

function joinProjectRealtime(projectId){
  leaveProjectRealtime();
  if(!window.sb || !state.currentUser) return;
  const channel = window.sb.channel('project:' + projectId, {
    config: { broadcast: { self: false }, presence: { key: state.currentUser.id } }
  });
  channel.on('broadcast', { event:'edit' }, (msg) => handleRemoteEdit(msg.payload));
  channel.on('broadcast', { event:'cursor' }, (msg) => handleRemoteCursor(msg.payload));
  channel.on('broadcast', { event:'edit_request' }, (msg) => handleEditRequest(msg.payload));
  channel.on('broadcast', { event:'edit_grant' }, (msg) => handleEditGrant(msg.payload));
  channel.on('broadcast', { event:'edit_deny' }, (msg) => handleEditDeny(msg.payload));
  channel.on('broadcast', { event:'highlight' }, (msg) => handleRemoteHighlightEvent(msg.payload));
  channel.on('broadcast', { event:'item_comment' }, (msg) => handleRemoteItemCommentEvent(msg.payload));
  channel.on('broadcast', { event:'ledger_add' }, (msg) => handleRemoteLedgerAdd(msg.payload));
  channel.on('presence', { event:'sync' }, () => updatePresenceFromChannel(channel));
  channel.subscribe((status) => {
    if(status === 'SUBSCRIBED'){
      channel.track({
        userId: state.currentUser.id,
        email: state.currentUser.email,
        displayName: (state.currentUser.profile && state.currentUser.profile.display_name) || state.currentUser.email,
        color: colorForUser(state.currentUser.id),
        sectionKey: state.currentSectionKey || null,
        at: Date.now()
      });
      // track() 후 sync 이벤트가 비동기로 오는데, 이미 접속 중인 사람이 있으면
      // 즉시 한 번 더 읽어서 presence bar를 바로 채운다.
      updatePresenceFromChannel(channel);
    } else if(status === 'CHANNEL_ERROR' || status === 'TIMED_OUT'){
      // 채널이 에러/타임아웃으로 죽은 경우 2초 후 재접속
      setTimeout(() => {
        if(state.currentProjectId && state.realtimeChannel === channel){
          joinProjectRealtime(state.currentProjectId);
        }
      }, 2000);
    }
  });

  // 커서 위치를 100ms 간격으로 브로드캐스트 (너무 빠르면 rate limit)
  const broadcastCursorThrottled = throttleTrailing(() => {
    const activeEl = document.activeElement;
    if(!activeEl || !activeEl.id || !activeEl.id.startsWith('sec-content-input-')) return;
    const sectionKey = activeEl.id.replace('sec-content-input-', '');
    if(!state.currentUser) return;
    channel.send({
      type:'broadcast', event:'cursor',
      payload:{
        sectionKey,
        fromUserId: state.currentUser.id,
        color: colorForUser(state.currentUser.id),
        displayName: (state.currentUser.profile && state.currentUser.profile.display_name) || state.currentUser.email,
        cursorOffset: getCaretCharOffset(activeEl)
      }
    });
  }, 100);
  _selectionChangeHandler = broadcastCursorThrottled;
  document.addEventListener('selectionchange', _selectionChangeHandler);

  state.realtimeChannel = channel;

  // 20초마다 채널 상태 확인 → 죽어 있으면 재접속
  clearInterval(_realtimeHealthTimer);
  _realtimeHealthTimer = setInterval(() => {
    if(!state.currentProjectId || !state.currentUser) return;
    const ch = state.realtimeChannel;
    if(!ch || ch.state !== 'joined'){
      joinProjectRealtime(state.currentProjectId);
    }
  }, 20000);
}

function leaveProjectRealtime(){
  clearInterval(_realtimeHealthTimer);
  _realtimeHealthTimer = null;
  if(_selectionChangeHandler){
    document.removeEventListener('selectionchange', _selectionChangeHandler);
    _selectionChangeHandler = null;
  }
  if(state.realtimeChannel && window.sb){
    window.sb.removeChannel(state.realtimeChannel);
  }
  state.realtimeChannel = null;
  state.presenceUsers = {};
  state.pendingRemoteEdits = {};
  state.followingUserId = null;
  removeRemoteCursors();
  renderFollowBadge(); // 배지 제거
}

function updatePresenceFromChannel(channel){
  const raw = channel.presenceState();
  const users = {};
  Object.keys(raw).forEach(key => {
    const metas = raw[key];
    if(!metas || !metas.length) return;
    const m = metas[metas.length-1];
    if(!state.currentUser || m.userId === state.currentUser.id) return; // 나 자신은 제외
    users[m.userId] = m;
  });
  state.presenceUsers = users;
  renderPresenceBar();
  refreshTocPresenceDots();
  applySectionLocks();

  // 팔로우 중인 유저가 섹션을 이동하면 따라감
  if(state.followingUserId){
    const followed = users[state.followingUserId];
    if(followed && followed.sectionKey && !isLedgerKey(followed.sectionKey) &&
       followed.sectionKey !== state.currentSectionKey){
      state.currentSectionKey = followed.sectionKey;
      scrollToSection(followed.sectionKey, true);
      setActiveTocItem(followed.sectionKey);
      updateMyPresenceSection(followed.sectionKey, true);
    }
  }
  renderFollowBadge();
}

function updateMyPresenceSection(sectionKey, isFollowing){
  _mySectionAt = Date.now();
  if(!state.realtimeChannel || !state.currentUser) return;
  state.realtimeChannel.track({
    userId: state.currentUser.id,
    email: state.currentUser.email,
    displayName: (state.currentUser.profile && state.currentUser.profile.display_name) || state.currentUser.email,
    color: colorForUser(state.currentUser.id),
    sectionKey, following: !!isFollowing, at: _mySectionAt
  });
}

function broadcastLedgerAdd(type, preview){
  if(!state.realtimeChannel || !state.currentUser) return;
  const displayName = (state.currentUser.profile && state.currentUser.profile.display_name) || state.currentUser.email;
  state.realtimeChannel.send({
    type:'broadcast', event:'ledger_add',
    payload:{ type, preview, fromUserId: state.currentUser.id, displayName }
  });
}

const LEDGER_ADD_LABELS = { figure:'📷 그림', table:'📋 표', reference:'📄 참고문헌' };
const LEDGER_ADD_ACTIONS = { figure:{ type:'figure' }, table:{ type:'table' }, reference:{ type:'reference' } };

function handleRemoteLedgerAdd(payload){
  const { type, preview, fromUserId, displayName } = payload || {};
  if(!type || fromUserId === (state.currentUser && state.currentUser.id)) return;
  const author = displayName || '누군가';
  const label = LEDGER_ADD_LABELS[type] || type;
  const body = preview ? `"${preview}"` : `${label}이 추가됐어요`;
  addNotification({
    type: 'ledger', author, body,
    color: colorForUser(fromUserId),
    action: LEDGER_ADD_ACTIONS[type] || null
  });

  // 백그라운드로 해당 ledger 데이터를 즉시 갱신해 TOC 카운트와 삽입 팝업을 최신화
  const pid = state.currentProjectId;
  if(!pid) return;
  if(type === 'figure'){
    getFigures(pid).then(({ figures, failed }) => {
      if(!failed){ state.figures = figures; _refreshTocIfVisible(); }
    });
  } else if(type === 'table'){
    getTables(pid).then(({ tables, failed }) => {
      if(!failed){ state.tables = tables; _refreshTocIfVisible(); }
    });
  } else if(type === 'reference'){
    getReferences(pid).then(({ references, failed }) => {
      if(!failed){ state.references = references; _refreshTocIfVisible(); }
    });
  }
}

function _refreshTocIfVisible(){
  if(!state.openProject) return;
  const k = state.currentSectionKey;
  // 현재 해당 Ledger를 보고 있으면 내용까지 전체 갱신
  if(k === '__figures__' || k === '__tables__' || k === '__refs__'){
    renderWorkspace(state.openProject);
    return;
  }
  // 그 외(본문 편집 중 등)는 TOC 카운트만 조용히 업데이트 — 편집 포커스 유지
  const sectionMap = {
    '__figures__': (state.figures || []).length,
    '__tables__': (state.tables || []).length,
    '__refs__': (state.references || []).length
  };
  Object.entries(sectionMap).forEach(([key, count]) => {
    const btn = document.querySelector(`.toc-item[data-section-key="${key}"] span:nth-child(2)`);
    if(!btn) return;
    const label = key === '__figures__' ? 'Fig Ledger' : key === '__tables__' ? 'Table Ledger' : 'Ref Ledger';
    btn.textContent = count ? `${label} (${count})` : label;
  });
}

function broadcastSectionEdit(sectionKey, html, cursorOffset){
  if(!state.realtimeChannel || !state.currentUser) return;
  state.realtimeChannel.send({
    type:'broadcast', event:'edit',
    payload:{
      sectionKey, html,
      fromUserId: state.currentUser.id,
      color: colorForUser(state.currentUser.id),
      displayName: (state.currentUser.profile && state.currentUser.profile.display_name) || state.currentUser.email,
      cursorOffset,
      ts: Date.now()
    }
  });
}

function handleRemoteEdit(payload){
  const { sectionKey, html, fromUserId, cursorOffset, color, displayName } = payload || {};
  if(!sectionKey || fromUserId === (state.currentUser && state.currentUser.id)) return;
  // Ledger 뷰일 때도 메모리(openProject)는 항상 최신으로 유지
  if(state.openProject) state.openProject.content[sectionKey] = html;
  const el = document.getElementById('sec-content-input-' + sectionKey);
  if(!el) return;

  // 적극적으로 타이핑 중(1.5초 이내 입력)인 경우에만 덮어쓰기 건너뜀
  const activelyTyping = document.activeElement === el &&
    _lastTypedAt[sectionKey] && (Date.now() - _lastTypedAt[sectionKey]) < 1500;

  if(!activelyTyping){
    // 포커스가 있어도(읽는 중) 내 커서 위치를 기억했다가 복원
    const hasFocus = document.activeElement === el;
    let savedOffset = null;
    if(hasFocus) savedOffset = getCaretCharOffset(el);
    applyRemoteEditToSection(sectionKey, html);
    if(hasFocus && savedOffset !== null) restoreCaretPosition(el, savedOffset);
  }

  // 상대방 커서 표시
  if(cursorOffset != null) showRemoteCursor(sectionKey, fromUserId, cursorOffset, color, displayName);
}

function applyRemoteEditToSection(sectionKey, html){
  const el = document.getElementById('sec-content-input-' + sectionKey);
  if(!el) return;
  el.innerHTML = html;
  const plain = el.textContent || '';
  el.classList.toggle('is-empty', plain.trim().length === 0);
  if(state.openProject){
    state.openProject.content[sectionKey] = html;
    const sec = getSections(state.openProject).find(s => s.key === sectionKey);
    const wcEl = document.getElementById('wc-display-' + sectionKey);
    if(wcEl && sec){
      const w = wordCount(plain);
      wcEl.textContent = w + '단어' + (sec.limit ? (' / '+sec.limit) : '');
      wcEl.classList.toggle('over', sec.limit && w>sec.limit);
    }
  }
  refreshTocFilledState(sectionKey, plain.trim().length > 0);
}

/* ─── 커서 헬퍼 ─── */

// contenteditable el 안에서 캐럿의 텍스트 문자 오프셋 반환
function getCaretCharOffset(el){
  const sel = window.getSelection();
  if(!sel || sel.rangeCount === 0) return 0;
  const range = sel.getRangeAt(0);
  if(!el.contains(range.startContainer)) return 0;
  const pre = document.createRange();
  pre.selectNodeContents(el);
  pre.setEnd(range.startContainer, range.startOffset);
  return pre.toString().length;
}

// 텍스트 문자 오프셋 → DOM Range
function getRangeForCharOffset(el, offset){
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let remaining = offset;
  let node;
  while((node = walker.nextNode())){
    const len = node.textContent.length;
    if(remaining <= len){
      const r = document.createRange();
      r.setStart(node, remaining);
      r.collapse(true);
      return r;
    }
    remaining -= len;
  }
  const r = document.createRange();
  r.selectNodeContents(el);
  r.collapse(false);
  return r;
}

// 저장해 둔 오프셋으로 캐럿 복원
function restoreCaretPosition(el, offset){
  const range = getRangeForCharOffset(el, offset);
  const sel = window.getSelection();
  if(sel){ sel.removeAllRanges(); sel.addRange(range); }
}

// 상대방 커서를 뷰포트 위에 fixed 레이어로 표시
function showRemoteCursor(sectionKey, userId, charOffset, color, displayName){
  const el = document.getElementById('sec-content-input-' + sectionKey);
  if(!el) return;
  const range = getRangeForCharOffset(el, charOffset);
  const rects = range.getClientRects();
  const rect = rects.length ? rects[0] : range.getBoundingClientRect();
  if(!rect || rect.height === 0) return;

  const cursorId = 'rc-' + userId.replace(/[^a-zA-Z0-9]/g, '-');
  let cursor = document.getElementById(cursorId);
  if(!cursor){
    cursor = document.createElement('div');
    cursor.id = cursorId;
    cursor.className = 'remote-cursor';
    const label = document.createElement('div');
    label.className = 'remote-cursor-label';
    cursor.appendChild(label);
    document.body.appendChild(cursor);
  }
  const label = cursor.querySelector('.remote-cursor-label');
  if(label){
    label.textContent = displayName || '';
    label.style.backgroundColor = color || '#888';
  }
  cursor.style.setProperty('--cursor-color', color || '#888');
  cursor.style.left = rect.left + 'px';
  cursor.style.top = rect.top + 'px';
  cursor.style.height = (rect.height || 18) + 'px';
  cursor.style.display = 'block';
  clearTimeout(cursor._hideTimer);
  cursor._hideTimer = setTimeout(() => { if(cursor) cursor.style.display = 'none'; }, 4000);
}

// 채널 이탈 시 모든 원격 커서 제거
function removeRemoteCursors(){
  document.querySelectorAll('.remote-cursor').forEach(el => el.remove());
}

// cursor 브로드캐스트 수신 핸들러
function handleRemoteCursor(payload){
  const { sectionKey, fromUserId, cursorOffset, color, displayName } = payload || {};
  if(!sectionKey || !fromUserId) return;
  if(fromUserId === (state.currentUser && state.currentUser.id)) return;
  if(cursorOffset == null) return;
  showRemoteCursor(sectionKey, fromUserId, cursorOffset, color, displayName);
}

/* ─────────────────── */

function renderPresenceBar(){
  const el = document.getElementById('presence-bar');
  if(!el) return;
  const users = Object.values(state.presenceUsers || {});
  if(!users.length){ el.innerHTML = ''; return; }

  const secLabel = (key) => {
    if(!key || !state.openProject) return '';
    const secs = getSections(state.openProject);
    const found = secs.find(s => s.key === key);
    if(found) return found.label;
    const ledgerLabels = { '__members__':'멤버', '__authors__':'저자', '__figures__':'그림', '__refs__':'참고문헌', '__tables__':'표', '__comments__':'댓글' };
    return ledgerLabels[key] || key;
  };

  el.innerHTML = users.map(u => {
    const sec = secLabel(u.sectionKey);
    const tip = `${u.displayName || u.email || '?'}${sec ? ' · ' + sec + ' 섹션 보는 중' : ' · 접속 중'}`;
    return `<span class="presence-avatar" style="background:${u.color}22;color:${u.color};border-color:${u.color};" title="${escapeHtml(tip)}">${escapeHtml(((u.displayName || u.email || '?').trim()[0] || '?').toUpperCase())}</span>`;
  }).join('') + `<span class="presence-label" onclick="togglePresencePanel()" title="접속자 보기">▾</span>`;

  renderPresencePanel(users, secLabel);
}

function renderPresencePanel(users, secLabel){
  let panel = document.getElementById('presence-panel');
  if(!panel){
    panel = document.createElement('div');
    panel.id = 'presence-panel';
    panel.className = 'presence-panel';
    document.body.appendChild(panel);
    document.addEventListener('mousedown', (e) => {
      if(!e.target.closest('#presence-panel') && !e.target.closest('.presence-label') && !e.target.closest('.presence-avatar'))
        panel.classList.remove('open');
    }, true);
  }
  panel.innerHTML = `<div class="presence-panel-title">지금 함께 접속 중</div>` + users.map(u => {
    const sec = secLabel(u.sectionKey);
    const isFollowing = state.followingUserId === u.userId;
    return `<div class="presence-panel-row">
      <span class="presence-avatar" style="background:${u.color}22;color:${u.color};border-color:${u.color};width:26px;height:26px;font-size:11px;">${escapeHtml(((u.displayName || u.email || '?').trim()[0] || '?').toUpperCase())}</span>
      <div style="flex:1;min-width:0;">
        <div style="font-weight:600;font-size:12.5px;color:${u.color};">${escapeHtml(u.displayName || u.email || '?')}</div>
        ${sec ? `<div style="font-size:11px;color:var(--ink-faint);">${escapeHtml(sec)} 섹션 보는 중</div>` : ''}
      </div>
      <button class="btn ${isFollowing?'primary':'secondary'} small" onclick="toggleFollowUser('${u.userId}')" title="${isFollowing?'팔로우 중단':'화면 따라가기'}">
        ${isFollowing ? '팔로잉' : '따라가기'}
      </button>
    </div>`;
  }).join('');
}

function togglePresencePanel(){
  const panel = document.getElementById('presence-panel');
  if(!panel) return;
  const bar = document.getElementById('presence-bar');
  if(bar){
    const r = bar.getBoundingClientRect();
    panel.style.top = (r.bottom + 8) + 'px';
    panel.style.right = (window.innerWidth - r.right) + 'px';
  }
  panel.classList.toggle('open');
}

function refreshTocPresenceDots(){
  // TOC dot 초기화
  document.querySelectorAll('.toc-dot[data-presence]').forEach(dot => {
    dot.removeAttribute('data-presence');
    dot.style.removeProperty('background');
    dot.style.removeProperty('box-shadow');
    dot.title = '';
  });
  // 본문 섹션 글로우 초기화
  document.querySelectorAll('.ms-section.presence-glow').forEach(el => {
    el.classList.remove('presence-glow');
    el.style.removeProperty('--presence-color');
    el.title = '';
  });
  // 섹션별 첫 번째 접속자 색상으로 TOC dot + 본문 네온 글로우 적용
  const seen = new Set();
  Object.values(state.presenceUsers || {}).forEach(u => {
    if(!u.sectionKey || seen.has(u.sectionKey)) return;
    const label = (u.displayName || u.email || '') + ' 접속 중';

    // TOC dot
    const btn = document.querySelector(`.toc-item[data-section-key="${u.sectionKey}"]`);
    if(btn){
      const dot = btn.querySelector('.toc-dot');
      if(dot){
        dot.setAttribute('data-presence', '1');
        dot.style.background = u.color;
        dot.style.boxShadow = `0 0 5px 1px ${u.color}`;
        dot.title = label;
      }
    }

    // 본문 section glow
    const sec = document.getElementById('ms-section-' + u.sectionKey);
    if(sec){
      sec.style.setProperty('--presence-color', u.color);
      sec.classList.add('presence-glow');
      sec.title = label;
    }

    seen.add(u.sectionKey);
  });
}

/* ─── 섹션 잠금 & 편집 권한 요청 ─── */

function applySectionLocks(){
  // 자신을 제외한 다른 유저(팔로우 중 아닌)가 점유 중인 섹션 맵
  // 자신의 presence는 타임스탬프 경쟁 대상에서 제외 → 자기 자신에 의한 잠금 방지
  const myUserId = state.currentUser?.id;
  const lockedBy = {};
  Object.values(state.presenceUsers || {}).forEach(u => {
    if(u.userId === myUserId) return;
    if(u.sectionKey && !u.following) lockedBy[u.sectionKey] = u;
  });

  document.querySelectorAll('[id^="sec-content-input-"]').forEach(el => {
    const sectionKey = el.id.replace('sec-content-input-', '');
    const locker = lockedBy[sectionKey];
    const section = el.closest('.ms-section');
    if(!section) return;

    section.querySelector('.section-lock-banner')?.remove();

    let shouldLock = false;
    if(locker){
      if(state.currentSectionKey !== sectionKey){
        shouldLock = true; // 내가 이 섹션을 선택하지 않음
      } else {
        // 내가 이 섹션을 보고 있음 → 잠금은 locker가 나보다 먼저 들어온 경우만
        shouldLock = (locker.at || 0) < _mySectionAt;
      }
    }

    if(shouldLock){
      el.contentEditable = 'false';
      const banner = document.createElement('div');
      banner.className = 'section-lock-banner';
      banner.innerHTML = `
        <span class="lock-dot" style="background:${locker.color || '#888'}"></span>
        <span><strong>${escapeHtml(locker.displayName || locker.email || '')}</strong> 편집 중</span>
        <button class="btn secondary small lock-request-btn" onclick="requestSectionEdit('${sectionKey}','${locker.userId}')">편집 권한 요청</button>
      `;
      const header = section.querySelector('.ms-section-header');
      if(header) header.after(banner);
      else section.insertBefore(banner, el);
    } else {
      el.contentEditable = 'true';
    }
  });
}

function requestSectionEdit(sectionKey, toUserId){
  if(!state.realtimeChannel || !state.currentUser) return;
  state.realtimeChannel.send({
    type:'broadcast', event:'edit_request',
    payload:{
      sectionKey, toUserId,
      fromUserId: state.currentUser.id,
      fromDisplayName: (state.currentUser.profile && state.currentUser.profile.display_name) || state.currentUser.email
    }
  });
  showToast('편집 권한을 요청했어요');
}

function handleEditRequest(payload){
  const { sectionKey, toUserId, fromUserId, fromDisplayName } = payload || {};
  if(!toUserId || toUserId !== (state.currentUser && state.currentUser.id)) return;
  if(state.currentSectionKey !== sectionKey) return;

  const existingNotif = document.getElementById('edit-request-notif');
  if(existingNotif) existingNotif.remove();

  const notif = document.createElement('div');
  notif.id = 'edit-request-notif';
  notif.className = 'edit-request-notif';
  notif.innerHTML = `
    <div class="edit-request-notif-body">
      <strong>${escapeHtml(fromDisplayName || fromUserId || '누군가')}</strong>가 이 섹션의 편집 권한을 요청했어요
      <div class="edit-request-actions">
        <button class="btn primary small" onclick="grantSectionEdit('${sectionKey}','${fromUserId}',document.getElementById('edit-request-notif'))">수락</button>
        <button class="btn secondary small" onclick="denySectionEdit('${sectionKey}','${fromUserId}',document.getElementById('edit-request-notif'))">거절</button>
      </div>
    </div>
  `;
  document.body.appendChild(notif);
  setTimeout(() => { if(notif.parentNode) notif.remove(); }, 30000);
}

function grantSectionEdit(sectionKey, toUserId, notifEl){
  if(notifEl) notifEl.remove();
  if(!state.realtimeChannel || !state.currentUser) return;
  state.realtimeChannel.send({
    type:'broadcast', event:'edit_grant',
    payload:{ sectionKey, toUserId, fromUserId: state.currentUser.id }
  });
  // 내 잠금 해제 (현재 섹션을 null로)
  state.currentSectionKey = null;
  updateMyPresenceSection(null);
  applySectionLocks();
  showToast('편집 권한을 넘겼어요');
}

function denySectionEdit(sectionKey, toUserId, notifEl){
  if(notifEl) notifEl.remove();
  if(!state.realtimeChannel || !state.currentUser) return;
  state.realtimeChannel.send({
    type:'broadcast', event:'edit_deny',
    payload:{ sectionKey, toUserId, fromUserId: state.currentUser.id }
  });
}

function handleEditGrant(payload){
  const { sectionKey, toUserId, fromUserId } = payload || {};
  if(!toUserId || toUserId !== (state.currentUser && state.currentUser.id)) return;
  showToast('편집 권한을 받았어요! 이제 편집할 수 있어요');
  // 낙관적 잠금 해제
  if(fromUserId && state.presenceUsers[fromUserId]){
    state.presenceUsers[fromUserId].sectionKey = null;
  }
  _mySectionAt = Date.now();
  applySectionLocks();
}

function handleEditDeny(payload){
  const { sectionKey, toUserId } = payload || {};
  if(!toUserId || toUserId !== (state.currentUser && state.currentUser.id)) return;
  showToast('편집 요청이 거절됐어요');
}

/* ─── 팔로우(화면 따라가기) ─── */

function toggleFollowUser(userId){
  if(state.followingUserId === userId){
    state.followingUserId = null;
    updateMyPresenceSection(state.currentSectionKey, false);
  } else {
    state.followingUserId = userId;
    const followed = state.presenceUsers[userId];
    if(followed && followed.sectionKey && !isLedgerKey(followed.sectionKey)){
      state.currentSectionKey = followed.sectionKey;
      scrollToSection(followed.sectionKey, true);
      setActiveTocItem(followed.sectionKey);
      updateMyPresenceSection(followed.sectionKey, true);
    }
  }
  renderFollowBadge();
  renderPresenceBar();
  const panel = document.getElementById('presence-panel');
  if(panel && panel.classList.contains('open')) togglePresencePanel();
}

function renderFollowBadge(){
  const existing = document.getElementById('follow-badge');
  if(!state.followingUserId){
    if(existing) existing.remove();
    return;
  }
  const followed = state.presenceUsers[state.followingUserId];
  const name = followed ? (followed.displayName || followed.email || '?') : '?';
  const color = followed ? (followed.color || 'var(--brand)') : 'var(--brand)';
  const secLabel = (() => {
    if(!followed || !followed.sectionKey || !state.openProject) return '';
    const secs = getSections(state.openProject);
    const s = secs.find(x => x.key === followed.sectionKey);
    return s ? s.label : '';
  })();

  let badge = existing;
  if(!badge){
    badge = document.createElement('div');
    badge.id = 'follow-badge';
    badge.className = 'follow-badge';
    document.body.appendChild(badge);
  }
  badge.innerHTML = `
    <span class="follow-badge-dot" style="background:${color}"></span>
    <span><strong>${escapeHtml(name)}</strong> 따라가는 중${secLabel ? ' · ' + escapeHtml(secLabel) : ''}</span>
    <button class="follow-badge-stop" onclick="toggleFollowUser('${state.followingUserId}')">중단 ✕</button>
  `;
}

/* ─────────────────────────────── */

/* ============== 삽입 패널 (그림/인용 삽입) — 편집 영역 흐름 안에 직접 삽입/제거 ============== */
function buildFigureInsertPanel(){
  const mode = state.figInsertMode || 'embed';
  const figures = state.figures || [];
  const tabs = `
    <div class="insert-tabs">
      <button class="insert-tab ${mode==='embed'?'active':''}" onclick="setFigInsertMode('embed')">그림 파일 + 캡션</button>
      <button class="insert-tab ${mode==='cite'?'active':''}" onclick="setFigInsertMode('cite')">인용만 (Fig. N)</button>
    </div>`;
  let itemsHtml;
  if(state.figuresLoadFailed){
    itemsHtml = `<div class="insert-popover-empty">그림 목록을 불러오지 못했어요.<br>Fig Ledger에서 다시 시도해주세요.</div>`;
  } else if(figures.length === 0){
    itemsHtml = `<div class="insert-popover-empty">아직 업로드한 그림이 없어요.<br>Fig Ledger에서 먼저 추가해보세요.</div>`;
  } else {
    const project = state.openProject;
    const order = project ? computeFigureOrder(project, figures) : [];
    const embeddedIds = new Set(order);
    const numMap = new Map(order.map((id, i) => [id, i + 1]));
    const sorted = [
      ...order.map(id => figures.find(f => f.id === id)).filter(Boolean),
      ...figures.filter(f => !embeddedIds.has(f.id))
    ];
    itemsHtml = sorted.map(f => {
      const num = numMap.get(f.id);
      const label = num ? `Fig. ${num}` : 'Fig. — (미삽입)';
      return `
      <button class="insert-item" onclick="pickFigureInsert('${f.id}')">
        <span class="insert-thumb"><img src="${figureSrc(f)}" alt=""></span>
        <span class="insert-text">
          <div class="insert-primary">${label}</div>
          <div class="insert-secondary">${escapeHtml(f.caption || f.fileName)}</div>
        </span>
      </button>`;
    }).join('');
  }
  return tabs + itemsHtml;
}

function setFigInsertMode(mode){
  state.figInsertMode = mode;
  const panel = document.getElementById('inline-insert-picker');
  if(panel){
    const closeBtn = `<div class="picker-close-row"><button class="picker-close-btn" onmousedown="event.preventDefault()" onclick="closeInsertPicker()">✕ 닫기</button></div>`;
    panel.innerHTML = closeBtn + buildFigureInsertPanel();
  }
}

function buildRefInsertItemsHtml(){
  const refs = state.references || [];
  if(state.referencesLoadFailed){
    return `<div class="insert-popover-empty">참고문헌 목록을 불러오지 못했어요.<br>Ref Ledger에서 다시 시도해주세요.</div>`;
  }
  if(refs.length === 0){
    return `<div class="insert-popover-empty">아직 등록한 참고문헌이 없어요.<br>Ref Ledger에서 먼저 추가해보세요.</div>`;
  }
  const project = state.openProject;
  const citedNums = project ? computeRefCitedNumbers(project) : new Set();
  const items = refs.map((r,i) => {
    const num = i + 1;
    const isCited = citedNums.has(num);
    const numLabel = isCited ? `[${num}]` : '[—]';
    const numStyle = isCited ? '' : 'color:var(--ink-faint);';
    return `
    <label class="insert-item insert-item-check">
      <input type="checkbox" class="insert-ref-checkbox" value="${i}" onchange="updateRefInsertSubmit()" />
      <span class="insert-num" style="${numStyle}">${numLabel}</span>
      <span class="insert-text">
        <div class="insert-primary">${escapeHtml((r.text || '').slice(0, 80) || ('참고문헌 ' + num))}</div>
        <div class="insert-secondary">${r.doi ? escapeHtml(r.doi) : ''}</div>
      </span>
    </label>
  `;
  }).join('');
  return `
    <div class="insert-multi-bar">
      <span class="insert-multi-count" id="ref-insert-count">0개 선택됨 — 여러 개 고르면 [1-3]처럼 자동으로 묶어요</span>
      <button type="button" class="btn small" id="ref-insert-submit" disabled onclick="submitRefInsertPick()">삽입</button>
    </div>
    ${items}
  `;
}

function updateRefInsertSubmit(){
  const checked = document.querySelectorAll('.insert-ref-checkbox:checked');
  const btn = document.getElementById('ref-insert-submit');
  const count = document.getElementById('ref-insert-count');
  if(btn) btn.disabled = checked.length === 0;
  if(!count) return;
  if(!checked.length){ count.textContent = '0개 선택됨 — 여러 개 고르면 [1-3]처럼 자동으로 묶어요'; return; }
  const project = state.openProject;
  const citedNums = project ? computeRefCitedNumbers(project) : new Set();
  const citedSelected = [], uncitedCount = { n: 0 };
  Array.from(checked).forEach(el => {
    const num = parseInt(el.value, 10) + 1;
    if(citedNums.has(num)) citedSelected.push(num);
    else uncitedCount.n++;
  });
  let msg = `${checked.length}개 선택됨 → `;
  if(citedSelected.length && uncitedCount.n){
    msg += `[${compressRefNumbers(citedSelected)}] + 미인용 ${uncitedCount.n}개`;
  } else if(citedSelected.length){
    msg += `[${compressRefNumbers(citedSelected)}]`;
  } else {
    msg += `미인용 ${uncitedCount.n}개 (삽입 후 번호 자동 부여)`;
  }
  count.textContent = msg;
}

async function submitRefInsertPick(){
  const checked = Array.from(document.querySelectorAll('.insert-ref-checkbox:checked'));
  if(!checked.length) return;
  const nums = checked.map(el => parseInt(el.value,10)+1);
  insertInlineToken('body-ref-token', `[${compressRefNumbers(nums)}]`);
  // 인접/중첩 인용 괄호 자동 정리
  const el = state.activeTextareaId && document.getElementById(state.activeTextareaId);
  if(el){
    const cleaned = cleanupCitationsInHtml(el.innerHTML);
    if(cleaned !== el.innerHTML){
      el.innerHTML = cleaned;
      const sk = state.activeTextareaId.replace('sec-content-input-', '');
      if(state.openProject) state.openProject.content[sk] = cleaned;
    }
  }
  closeInsertPicker();
  // 삽입 후 body-order 기준으로 참고문헌 자동 정렬 + 본문 번호 갱신
  const project = state.openProject;
  const refs = state.references || [];
  if(project && refs.length){
    const changed = autoSortRefsByBodyOrder(project, refs);
    if(changed){
      await Promise.all([setProject(project), setReferences(state.currentProjectId, refs)]);
      renderWorkspace(project);
    }
  }
}

function _pickerOutsideClick(e){
  const p = document.getElementById('inline-insert-picker');
  if(!p){ document.removeEventListener('mousedown', _pickerOutsideClick); return; }
  if(!p.contains(e.target)){ closeInsertPicker(); document.removeEventListener('mousedown', _pickerOutsideClick); }
}

function _positionPickerPanel(panel){
  const tb = document.getElementById('cursor-toolbar');
  const W = window.innerWidth, H = window.innerHeight;
  const panelW = 320, GAP = 8, TOP_GUARD = 60;
  let anchorTop, anchorBottom, left;

  if(tb && tb.classList.contains('ctb-visible')){
    const r = tb.getBoundingClientRect();
    anchorTop = r.top; anchorBottom = r.bottom; left = r.left;
  } else {
    const sel = window.getSelection();
    const range = sel && sel.rangeCount ? sel.getRangeAt(0) : null;
    const r = range ? range.getBoundingClientRect() : null;
    if(r && r.bottom > 0){ anchorTop = r.top; anchorBottom = r.bottom; left = r.left; }
    else { anchorTop = 120; anchorBottom = 130; left = Math.max(GAP, Math.floor(W / 2) - panelW / 2); }
  }

  left = Math.max(GAP, Math.min(W - panelW - GAP, left));

  const spaceBelow = H - anchorBottom - GAP;
  const spaceAbove = anchorTop - TOP_GUARD - GAP;
  const PICKER_MAX_H = 320;

  let top, maxH;
  if(spaceBelow >= Math.min(PICKER_MAX_H, 160) || spaceBelow >= spaceAbove){
    // 아래 배치
    top = anchorBottom + GAP;
    maxH = Math.max(120, Math.min(PICKER_MAX_H, spaceBelow));
  } else {
    // 위로 뒤집기 — 위 공간 기준으로 패널 아래 끝을 anchor 위에 붙임
    maxH = Math.max(120, Math.min(PICKER_MAX_H, spaceAbove));
    top = anchorTop - GAP - maxH;
  }

  panel.style.top      = Math.max(TOP_GUARD, top) + 'px';
  panel.style.left     = left + 'px';
  panel.style.width    = panelW + 'px';
  panel.style.maxHeight = maxH + 'px';
}

function toggleInsertPicker(kind, sectionKey){
  const existing = document.getElementById('inline-insert-picker');
  if(existing){
    const wasKind = existing.dataset.kind;
    const wasSection = existing.dataset.sectionKey || '';
    existing.remove();
    document.removeEventListener('mousedown', _pickerOutsideClick);
    if(wasKind === kind && wasSection === (sectionKey || '')) return; // 같은 버튼을 다시 누르면 닫기만 함
  }
  // 열 때마다 embed 모드로 초기화 — 인용만(cite) 모드가 기본값으로 굳지 않도록
  if(kind === 'figures') state.figInsertMode = 'embed';
  if(kind === 'tables') state.tableInsertMode = 'embed';
  if(sectionKey){
    state.activeTextareaId = 'sec-content-input-' + sectionKey;
    // 팝오버 안의 체크박스/버튼을 클릭하면 본문이 포커스를 잃으면서 커서 위치가
    // 사라지는 경우가 있다(특히 여러 개를 고르는 참고문헌 다중 선택). 패널을 여는
    // 시점의 커서를 미리 저장해뒀다가 실제 삽입할 때 복원한다.
    const el = document.getElementById(state.activeTextareaId);
    const sel = window.getSelection();
    state.savedInsertRange = (el && sel.rangeCount && el.contains(sel.anchorNode)) ? sel.getRangeAt(0).cloneRange() : null;
  }
  const panel = document.createElement('div');
  panel.id = 'inline-insert-picker';
  panel.className = 'inline-insert-picker';
  panel.dataset.kind = kind;
  if(sectionKey) panel.dataset.sectionKey = sectionKey;
  const closeBtn = `<div class="picker-close-row"><button class="picker-close-btn" onmousedown="event.preventDefault()" onclick="closeInsertPicker()">✕ 닫기</button></div>`;
  panel.innerHTML = closeBtn + (kind === 'figures' ? buildFigureInsertPanel() : kind === 'tables' ? buildTableInsertPanel() : buildRefInsertItemsHtml());
  document.body.appendChild(panel); // flow 바깥(body)에 fixed로 붙여 레이아웃 영향 없음
  _positionPickerPanel(panel);
  setTimeout(() => document.addEventListener('mousedown', _pickerOutsideClick), 0);
}

function closeInsertPicker(){
  const existing = document.getElementById('inline-insert-picker');
  if(existing) existing.remove();
  document.removeEventListener('mousedown', _pickerOutsideClick);
  setTimeout(_onSelectionChange, 50);
}

/* ---- 수식 삽입/편집 ---- */

function openEquationPanel(spanEl){
  closeInsertPicker();
  state._editingEqSpan = spanEl || null;

  if(!spanEl){
    const sectionKey = _ctbKey();
    if(sectionKey){
      state.activeTextareaId = 'sec-content-input-' + sectionKey;
      const el = document.getElementById(state.activeTextareaId);
      const sel = window.getSelection();
      state.savedInsertRange = (el && sel.rangeCount && el.contains(sel.anchorNode)) ? sel.getRangeAt(0).cloneRange() : null;
    }
  }

  const preLatex = spanEl ? (spanEl.dataset.latex || '') : '';
  const isDisplay = spanEl ? spanEl.dataset.display === 'true' : false;

  const panel = document.createElement('div');
  panel.id = 'inline-insert-picker';
  panel.className = 'inline-insert-picker eq-picker-panel';
  panel.dataset.kind = 'equation';
  panel.innerHTML = buildEquationInsertPanel(preLatex, isDisplay, !!spanEl);
  document.body.appendChild(panel);

  const EQ_W = Math.min(500, window.innerWidth - 16);
  const EQ_MAX_H = Math.min(580, window.innerHeight - 70);
  if(spanEl){
    const rect = spanEl.getBoundingClientRect();
    const GAP = 8;
    const left = Math.max(GAP, Math.min(window.innerWidth - EQ_W - GAP, rect.left));
    const spaceBelow = window.innerHeight - rect.bottom - GAP;
    const top = spaceBelow >= 300 ? rect.bottom + GAP : Math.max(GAP, rect.top - EQ_MAX_H);
    panel.style.cssText += `top:${top}px;left:${left}px;width:${EQ_W}px;max-height:${EQ_MAX_H}px;`;
  } else {
    _positionPickerPanel(panel);
    const GAP = 8;
    const left = Math.max(GAP, Math.min(window.innerWidth - EQ_W - GAP, parseInt(panel.style.left) || 0));
    panel.style.width = EQ_W + 'px';
    panel.style.left = left + 'px';
    panel.style.maxHeight = EQ_MAX_H + 'px';
  }

  _initEquationPanel(panel);
  setTimeout(() => document.addEventListener('mousedown', _pickerOutsideClick), 0);
}

function buildEquationInsertPanel(preLatex, isDisplay, isEdit){
  const TEMPLATES = [
    { label:'에너지', latex:'E = mc^2' },
    { label:'분수', latex:'\\frac{a}{b}' },
    { label:'적분', latex:'\\int_a^b f(x)\\,dx', display:true },
    { label:'합', latex:'\\sum_{i=1}^{n} x_i', display:true },
    { label:'제곱근', latex:'\\sqrt{x}' },
    { label:'극한', latex:'\\lim_{x \\to 0} f(x)' },
    { label:'편미분', latex:'\\frac{\\partial f}{\\partial x}' },
    { label:'log', latex:'\\log_{a} b' },
    { label:'절댓값', latex:'\\left| x \\right|' },
    { label:'행렬', latex:'\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', display:true },
    { label:'cases', latex:'\\begin{cases} f(x) & x>0 \\\\ 0 & x \\leq 0 \\end{cases}', display:true },
  ];
  const GL = [['α','\\alpha'],['β','\\beta'],['γ','\\gamma'],['δ','\\delta'],['ε','\\varepsilon'],['ζ','\\zeta'],['η','\\eta'],['θ','\\theta'],['ι','\\iota'],['κ','\\kappa'],['λ','\\lambda'],['μ','\\mu'],['ν','\\nu'],['ξ','\\xi'],['π','\\pi'],['ρ','\\rho'],['σ','\\sigma'],['τ','\\tau'],['φ','\\varphi'],['χ','\\chi'],['ψ','\\psi'],['ω','\\omega']];
  const GU = [['Γ','\\Gamma'],['Δ','\\Delta'],['Θ','\\Theta'],['Λ','\\Lambda'],['Ξ','\\Xi'],['Π','\\Pi'],['Σ','\\Sigma'],['Υ','\\Upsilon'],['Φ','\\Phi'],['Ψ','\\Psi'],['Ω','\\Omega']];
  const OP = [['∑','\\sum'],['∏','\\prod'],['∫','\\int'],['∮','\\oint'],['∂','\\partial'],['∇','\\nabla'],['∞','\\infty'],['±','\\pm'],['×','\\times'],['÷','\\div'],['·','\\cdot'],['≤','\\leq'],['≥','\\geq'],['≠','\\neq'],['≈','\\approx'],['∝','\\propto'],['∈','\\in'],['⊂','\\subset'],['∪','\\cup'],['∩','\\cap']];
  const ST = [['a/b','\\frac{}{}'],['√','\\sqrt{}'],['xⁿ','{}^{}'],['xₙ','{}_{}'],['^n_m','{}^{}_{}'],['x̂','\\hat{}'],['x̄','\\bar{}'],['x⃗','\\vec{}'],['x̃','\\tilde{}'],['|a|','\\left|{}\\right|'],['‖a‖','\\left\\|{}\\right\\|'],['[ ]','\\begin{pmatrix} a & b \\\\\\\\ c & d \\end{pmatrix}'],['{…}','\\begin{cases}  &  \\\\\\\\  &  \\end{cases}']];
  const sb = ([sym, latex]) => `<button class="eq-sym-btn" data-latex="${escapeHtml(latex)}" onmousedown="event.preventDefault()" title="${escapeHtml(latex)}">${sym}</button>`;

  const tmplHtml = TEMPLATES.map(t => `
    <button class="eq-tmpl-btn" data-latex="${escapeHtml(t.latex)}" data-display="${!!t.display}" onmousedown="event.preventDefault()" title="${escapeHtml(t.latex)}">
      <span class="eq-tmpl-rendered">${_renderKatex(t.latex, false)}</span>
      <span class="eq-tmpl-label">${t.label}</span>
    </button>`).join('');

  return `
    <div class="picker-close-row"><button class="picker-close-btn" onmousedown="event.preventDefault()" onclick="closeInsertPicker()">✕ 닫기</button></div>
    <div class="eq-panel-inner">
      <div class="eq-mode-row">
        <label class="eq-mode-label"><input type="radio" name="eq-mode" value="inline" ${!isDisplay?'checked':''}> 인라인</label>
        <label class="eq-mode-label"><input type="radio" name="eq-mode" value="display" ${isDisplay?'checked':''}> 독립 수식 (블록)</label>
      </div>
      <div class="eq-tmpl-section">
        <div class="eq-sym-group-label" style="margin-bottom:5px;">자주 쓰는 수식</div>
        <div class="eq-tmpl-row">${tmplHtml}</div>
      </div>
      <div class="eq-edit-row">
        <div class="eq-input-col">
          <textarea id="eq-latex-input" class="eq-latex-input" placeholder="LaTeX 입력&#10;예: E = mc^2&#10;   \\frac{a}{b}" spellcheck="false">${escapeHtml(preLatex)}</textarea>
          <div class="eq-sym-groups">
            <div class="eq-sym-section"><div class="eq-sym-group-label">소문자 그리스</div><div class="eq-sym-row">${GL.map(sb).join('')}</div></div>
            <div class="eq-sym-section"><div class="eq-sym-group-label">대문자 그리스</div><div class="eq-sym-row">${GU.map(sb).join('')}</div></div>
            <div class="eq-sym-section"><div class="eq-sym-group-label">연산자</div><div class="eq-sym-row">${OP.map(sb).join('')}</div></div>
            <div class="eq-sym-section"><div class="eq-sym-group-label">구조</div><div class="eq-sym-row">${ST.map(sb).join('')}</div></div>
          </div>
        </div>
        <div class="eq-preview-col">
          <div class="eq-preview-label">미리보기</div>
          <div class="eq-preview" id="eq-preview"><span class="eq-preview-hint">↑ 수식 입력</span></div>
        </div>
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px;">
        <button class="btn small" id="eq-insert-btn" onmousedown="event.preventDefault()">${isEdit ? '수식 업데이트' : '삽입'}</button>
      </div>
    </div>`;
}

function _initEquationPanel(panel){
  const textarea = panel.querySelector('#eq-latex-input');
  const preview  = panel.querySelector('#eq-preview');
  const btn      = panel.querySelector('#eq-insert-btn');

  const _isDisplay = () => (panel.querySelector('input[name="eq-mode"]:checked') || {}).value === 'display';

  const _updatePreview = () => {
    const latex = textarea.value.trim();
    if(!latex){ preview.innerHTML = '<span class="eq-preview-hint">↑ 수식 입력</span>'; return; }
    const disp = _isDisplay();
    const rendered = _renderKatex(latex, disp);
    // 에러면 인라인도 디스플레이도 아닌 오류 메시지
    const isErr = rendered.includes('color:#c33');
    preview.innerHTML = rendered;
    preview.classList.toggle('eq-preview-error', isErr);
  };

  textarea.addEventListener('input', _updatePreview);
  panel.querySelectorAll('input[name="eq-mode"]').forEach(r => r.addEventListener('change', _updatePreview));

  // 심볼 버튼 클릭 → 커서 위치에 삽입
  panel.querySelectorAll('.eq-sym-btn').forEach(symBtn => {
    symBtn.addEventListener('click', () => {
      const ins = symBtn.dataset.latex;
      const s = textarea.selectionStart, e = textarea.selectionEnd;
      textarea.value = textarea.value.slice(0, s) + ins + textarea.value.slice(e);
      const bi = ins.indexOf('{}');
      const np = bi >= 0 ? s + bi + 1 : s + ins.length;
      textarea.setSelectionRange(np, np);
      textarea.focus();
      _updatePreview();
    });
  });

  // 템플릿 버튼 클릭 → textarea + 모드 자동 설정
  panel.querySelectorAll('.eq-tmpl-btn').forEach(tb => {
    tb.addEventListener('click', () => {
      textarea.value = tb.dataset.latex;
      const wantsDisplay = tb.dataset.display === 'true';
      const radio = panel.querySelector(`input[name="eq-mode"][value="${wantsDisplay ? 'display' : 'inline'}"]`);
      if(radio) radio.checked = true;
      _updatePreview();
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    });
  });

  btn.addEventListener('click', () => {
    const latex = textarea.value.trim();
    if(!latex){ showToast('수식을 입력해주세요'); return; }
    const disp = _isDisplay();
    if(state._editingEqSpan) _updateEquationToken(state._editingEqSpan, latex, disp);
    else insertEquationToken(latex, disp);
    state._editingEqSpan = null;
    closeInsertPicker();
  });

  if(textarea.value.trim()) _updatePreview();
  textarea.focus();
}

function _renderKatex(latex, isDisplay){
  if(typeof katex === 'undefined') return escapeHtml('[수식: ' + latex + ']');
  try {
    return katex.renderToString(latex, { displayMode: !!isDisplay, throwOnError: false });
  } catch(e) {
    return `<span style="color:#c33;font-size:12px;">${escapeHtml(e.message||'수식 오류')}</span>`;
  }
}

function insertEquationToken(latex, isDisplay){
  const el = document.getElementById(state.activeTextareaId);
  if(!el){ showToast('삽입할 위치를 찾지 못했어요. 본문을 한 번 클릭한 뒤 다시 시도해주세요'); return; }
  el.focus();
  const sel = window.getSelection();
  if(state.savedInsertRange && el.contains(state.savedInsertRange.startContainer)){
    sel.removeAllRanges();
    sel.addRange(state.savedInsertRange);
  } else if(!sel.rangeCount || !el.contains(sel.anchorNode)){
    const r = document.createRange(); r.selectNodeContents(el); r.collapse(false);
    sel.removeAllRanges(); sel.addRange(r);
  }
  state.savedInsertRange = null;

  const span = document.createElement('span');
  span.className = 'body-eq-token' + (isDisplay ? ' display' : '');
  span.setAttribute('contenteditable', 'false');
  span.dataset.latex = latex;
  if(isDisplay) span.dataset.display = 'true';
  span.innerHTML = _renderKatex(latex, isDisplay);

  const range = sel.getRangeAt(0);
  range.deleteContents();
  range.insertNode(span);

  let after = span.nextSibling;
  if(!after || after.nodeType !== Node.TEXT_NODE){ after = document.createTextNode(''); span.after(after); }
  const nr = document.createRange(); nr.setStart(after, 0); nr.collapse(true);
  sel.removeAllRanges(); sel.addRange(nr);
  el.dispatchEvent(new Event('input', { bubbles:true }));
}

function _updateEquationToken(spanEl, latex, isDisplay){
  spanEl.className = 'body-eq-token' + (isDisplay ? ' display' : '');
  spanEl.dataset.latex = latex;
  if(isDisplay) spanEl.dataset.display = 'true'; else delete spanEl.dataset.display;
  spanEl.innerHTML = _renderKatex(latex, isDisplay);
  const editorEl = spanEl.closest('.editor-area');
  if(editorEl) editorEl.dispatchEvent(new Event('input', { bubbles:true }));
}

/* ---- 인용 편집 팝업 ([1-3] 클릭 → 체크박스로 편집) ---- */
function openCiteEditPopup(spanEl){
  closeCiteEditPopup();
  const refs = state.references || [];
  if(!refs.length) return;
  const inner = (spanEl.textContent || '').replace(/^\[|\]$/g, '');
  const citedNums = expandRefNumbers(inner);
  if(!citedNums.length) return;

  // 팝업을 여는 시점의 편집기 섹션 파악
  const editorArea = spanEl.closest('.editor-area');
  if(editorArea) state.activeTextareaId = editorArea.id;

  const popup = document.createElement('div');
  popup.id = 'cite-edit-popup';
  popup.className = 'cite-edit-popup';
  const items = refs.map((r, i) => {
    const num = i + 1;
    const isCited = citedNums.includes(num);
    const fullText = r.text || '';
    const doi = r.doi || '';
    const doiHtml = doi ? `<span class="cite-edit-doi">${escapeHtml(doi)}</span>` : '';
    return `<label class="cite-edit-item ${isCited ? 'is-cited' : ''}"><input type="checkbox" class="cite-edit-cb" value="${num}" ${isCited ? 'checked' : ''}><div class="cite-edit-info"><span class="cite-edit-num">[${num}]</span><span class="cite-edit-text">${escapeHtml(fullText || `(내용 없음)`)}</span>${doiHtml}</div></label>`;
  }).join('');
  popup.innerHTML = `<div class="cite-edit-header">인용 편집 <span class="cite-edit-hint">— 체크 해제하면 제거</span></div>${items}<div class="cite-edit-done"><button onmousedown="event.preventDefault()" onclick="closeCiteEditPopup()">완료</button></div>`;

  const rect = spanEl.getBoundingClientRect();
  popup.style.top = (rect.bottom + 6) + 'px';
  popup.style.left = rect.left + 'px';
  document.body.appendChild(popup);

  // 팝업 오른쪽이 뷰포트 밖으로 나가면 왼쪽으로 당김
  const pRect = popup.getBoundingClientRect();
  if(pRect.right > window.innerWidth - 8) popup.style.left = Math.max(8, window.innerWidth - pRect.width - 8) + 'px';

  popup.querySelectorAll('.cite-edit-cb').forEach(cb => {
    cb.addEventListener('change', () => _applyCiteEdit(popup, spanEl));
  });
  setTimeout(() => document.addEventListener('mousedown', _citeEditOutsideClick), 0);
}

function _applyCiteEdit(popup, spanEl){
  const checkedNums = Array.from(popup.querySelectorAll('.cite-edit-cb:checked')).map(cb => parseInt(cb.value, 10));
  if(!checkedNums.length){
    spanEl.remove();
    closeCiteEditPopup();
  } else {
    spanEl.textContent = '[' + compressRefNumbers(checkedNums) + ']';
  }
  const edEl = state.activeTextareaId && document.getElementById(state.activeTextareaId);
  if(edEl) edEl.dispatchEvent(new Event('input', { bubbles: true }));
}

function _citeEditOutsideClick(e){
  const p = document.getElementById('cite-edit-popup');
  if(!p){ document.removeEventListener('mousedown', _citeEditOutsideClick); return; }
  if(!p.contains(e.target)){ closeCiteEditPopup(); }
}

function closeCiteEditPopup(){
  const p = document.getElementById('cite-edit-popup');
  if(p) p.remove();
  document.removeEventListener('mousedown', _citeEditOutsideClick);
}

/* ---- 커서 플로팅 삽입 툴바 ---- */
let _ctbListenerAdded = false;
let _presenceLastKey = null, _presenceLastAt = 0; // selectionchange 기반 presence throttle

function initCursorToolbar(){
  if(!document.getElementById('cursor-toolbar')){
    const tb = document.createElement('div');
    tb.id = 'cursor-toolbar';
    tb.className = 'cursor-toolbar';
    tb.innerHTML = `
      <button class="ctb-btn" id="ctb-fig">＋ 그림</button>
      <span class="ctb-sep"></span>
      <button class="ctb-btn" id="ctb-tbl">＋ 표</button>
      <span class="ctb-sep"></span>
      <button class="ctb-btn" id="ctb-ref">＋ 참고문헌</button>
      <span class="ctb-sep"></span>
      <button class="ctb-btn" id="ctb-eq">＋ 수식</button>
    `;
    tb.addEventListener('mousedown', e => e.preventDefault());
    tb.querySelector('#ctb-fig').addEventListener('click', () => { const k = _ctbKey(); if(k) toggleInsertPicker('figures', k); });
    tb.querySelector('#ctb-tbl').addEventListener('click', () => { const k = _ctbKey(); if(k) toggleInsertPicker('tables', k); });
    tb.querySelector('#ctb-ref').addEventListener('click', () => { const k = _ctbKey(); if(k) toggleInsertPicker('refs', k); });
    tb.querySelector('#ctb-eq').addEventListener('click', () => { state._editingEqSpan = null; openEquationPanel(null); });
    document.body.appendChild(tb);
  }
  if(!_ctbListenerAdded){
    _ctbListenerAdded = true;
    document.addEventListener('selectionchange', _onSelectionChange);
    document.addEventListener('scroll', _hideCursorToolbar, true);
  }
}

function _ctbKey(){
  const id = state.activeTextareaId || '';
  return id.startsWith('sec-content-input-') ? id.replace('sec-content-input-', '') : null;
}

function _hideCursorToolbar(){
  const tb = document.getElementById('cursor-toolbar');
  if(tb) tb.classList.remove('ctb-visible');
}

function _onSelectionChange(){
  const tb = document.getElementById('cursor-toolbar');
  if(!tb) return;

  const sel = window.getSelection();
  if(!sel || !sel.rangeCount || !sel.isCollapsed){
    tb.classList.remove('ctb-visible');
    return;
  }

  const range = sel.getRangeAt(0);
  const node = range.startContainer;
  const el = (node.nodeType === Node.TEXT_NODE ? node.parentElement : node);
  const editorEl = el && el.closest && el.closest('.editor-area');
  if(!editorEl){
    tb.classList.remove('ctb-visible');
    return;
  }

  // 열려 있는 insert picker가 있으면 툴바 숨김
  if(document.getElementById('inline-insert-picker')){
    tb.classList.remove('ctb-visible');
    return;
  }

  // 커서가 이동할 때마다 TOC 활성 탭 즉시 갱신 + presence 업데이트 (3초 throttle)
  // scrollToSection은 호출하지 않는다 — 본문 클릭 시 화면이 튀는 원인이 됨.
  // TOC 클릭처럼 명시적인 이동 요청에서만 스크롤한다.
  const secKey = editorEl.id ? editorEl.id.replace('sec-content-input-', '') : null;
  if(secKey && secKey !== state.currentSectionKey){
    state.currentSectionKey = secKey;
    setActiveTocItem(secKey);
  }
  if(secKey && (secKey !== _presenceLastKey || Date.now() - _presenceLastAt > 3000)){
    _presenceLastKey = secKey; _presenceLastAt = Date.now();
    updateMyPresenceSection(secKey);
  }

  const rect = range.getBoundingClientRect();
  let top, left;
  if(rect.width > 0 || rect.height > 0){
    top = rect.top - 44;
    left = rect.left + rect.width / 2;
  } else {
    // 빈 줄에서 range rect이 0 → 커서가 위치한 요소의 rect으로 폴백
    // (editor 최상단으로 점프하지 않고 실제 커서 근처에 툴바를 표시)
    const startNode = range.startContainer;
    const containerEl = startNode.nodeType === Node.ELEMENT_NODE
      ? startNode
      : startNode.parentElement;
    const cr = containerEl ? containerEl.getBoundingClientRect() : null;
    if(cr && cr.height > 0){
      top = cr.top - 44;
      left = cr.left;
    } else {
      const er = editorEl.getBoundingClientRect();
      top = er.top - 44;
      left = er.left + 60;
    }
  }

  const tbW = tb.offsetWidth || 190;
  left = Math.max(8, Math.min(window.innerWidth - tbW - 8, left - tbW / 2));
  if(top < 56) top = (rect.height > 0 ? rect.bottom : (range.startContainer.nodeType === Node.ELEMENT_NODE ? range.startContainer.getBoundingClientRect().bottom : 0) || top + 80) + 8;

  tb.style.top = top + 'px';
  tb.style.left = left + 'px';
  tb.classList.add('ctb-visible');
}

// contenteditable=false 인라인 토큰(Fig. N, Table N, [1-3])을 커서 위치에 삽입.
// execCommand('insertHTML')은 블록 끝에서 span을 새 div로 분리하는 버그가 있어서,
// Range API로 직접 삽입하고 span 뒤에 빈 텍스트 노드를 만들어 커서를 고정한다.
function insertInlineToken(className, text){
  const el = document.getElementById(state.activeTextareaId);
  if(!el){ showToast('삽입할 위치를 찾지 못했어요. 본문을 한 번 클릭한 뒤 다시 시도해주세요'); return; }
  el.focus();
  const sel = window.getSelection();
  if(state.savedInsertRange && el.contains(state.savedInsertRange.startContainer)){
    sel.removeAllRanges();
    sel.addRange(state.savedInsertRange);
  } else if(!sel.rangeCount || !el.contains(sel.anchorNode)){
    const r = document.createRange();
    r.selectNodeContents(el);
    r.collapse(false);
    sel.removeAllRanges();
    sel.addRange(r);
  }
  state.savedInsertRange = null;
  const range = sel.getRangeAt(0);
  range.deleteContents();
  const span = document.createElement('span');
  span.className = className;
  span.setAttribute('contenteditable', 'false');
  span.textContent = text;
  range.insertNode(span);
  // span 바로 뒤에 텍스트 노드가 없으면 하나 만들어 커서를 그 안에 놓는다.
  // 없으면 다음 키 입력 시 브라우저가 새 줄을 만들어버린다.
  let after = span.nextSibling;
  if(!after || after.nodeType !== Node.TEXT_NODE){
    after = document.createTextNode('');
    span.after(after);
  }
  const newRange = document.createRange();
  newRange.setStart(after, 0);
  newRange.collapse(true);
  sel.removeAllRanges();
  sel.addRange(newRange);
  el.dispatchEvent(new Event('input', { bubbles:true }));
}

// 본문(contenteditable) 커서 위치에 HTML 조각을 삽입
function insertContentAtCursor(html){
  const el = document.getElementById(state.activeTextareaId);
  if(!el){ showToast('삽입할 위치를 찾지 못했어요. 본문을 한 번 클릭한 뒤 다시 시도해주세요'); return; }
  el.focus();
  const sel = window.getSelection();
  if(state.savedInsertRange && el.contains(state.savedInsertRange.startContainer)){
    sel.removeAllRanges();
    sel.addRange(state.savedInsertRange);
  } else if(!sel.rangeCount || !el.contains(sel.anchorNode)){
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }
  state.savedInsertRange = null; // 한 번 쓰면 비워서 다음 삽입에 잘못 재사용되지 않게 한다
  try{
    document.execCommand('insertHTML', false, html);
  }catch(e){
    // 폴백: Range API로 직접 삽입
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const frag = range.createContextualFragment(html);
    const lastNode = frag.lastChild;
    range.insertNode(frag);
    if(lastNode){
      range.setStartAfter(lastNode);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
  el.dispatchEvent(new Event('input', { bubbles:true }));
}

// Fig. N / Table N 인용 토큰 클릭 시 본문 내 실제 삽입 위치로 스크롤 + 플래시
function jumpToInlineBlock(kind, tokenEl){
  const project = state.openProject;
  if(!project) return;
  const text = tokenEl.textContent.trim();
  const m = kind === 'figure' ? text.match(/Fig\.\s*(\d+)/i) : text.match(/Table\s*(\d+)/i);
  if(!m) return;
  const num = parseInt(m[1], 10);

  let targetEl = null;
  if(kind === 'figure'){
    const order = computeFigureOrder(project, state.figures || []);
    const embeddedIds = order.filter(id => isFigureEmbedded(project, id));
    const figId = embeddedIds[num - 1];
    if(figId) targetEl = document.querySelector(`.inline-figure[data-fig-id="${figId}"]`);
  } else {
    const order = computeTableOrder(project, state.tables || []);
    const embeddedIds = order.filter(id => isTableEmbedded(project, id));
    const tableId = embeddedIds[num - 1];
    if(tableId) targetEl = document.querySelector(`.inline-table[data-table-id="${tableId}"]`);
  }

  if(!targetEl){ showToast('본문에서 해당 ' + (kind === 'figure' ? '그림' : '표') + '을 찾을 수 없어요'); return; }
  targetEl.scrollIntoView({ behavior:'smooth', block:'center' });
  targetEl.classList.remove('inline-block-flash');
  void targetEl.offsetWidth; // reflow to restart animation
  targetEl.classList.add('inline-block-flash');
  setTimeout(() => targetEl.classList.remove('inline-block-flash'), 1400);
}

async function pickFigureInsert(figId){
  const figures = state.figures || [];
  const f = figures.find(x => x.id === figId);
  if(!f) return;
  const mode = state.figInsertMode || 'embed';
  const project = state.openProject;
  if(mode === 'embed'){
    const beforeOrder = project ? computeFigureOrder(project, figures) : [];
    const captionText = escapeHtml(f.caption || '(캡션 미작성)');
    // 임시 번호: 현재 embed된 그림 수 + 1 (삽입 위치를 모르므로 잠정값; resync로 정정됨)
    // '?' 대신 잠정 번호를 써서 어떤 타이밍에도 '?' 가 DB에 저장되지 않게 한다.
    const tentativeNum = project ? beforeOrder.filter(id => isFigureEmbedded(project, id)).length + 1 : 1;
    const html = `<div class="inline-figure" contenteditable="false" data-fig-id="${f.id}"><img src="${figureSrc(f)}" alt=""><div class="inline-figure-caption"><b>Fig. ${tentativeNum}.</b> ${captionText}</div></div><div><br></div>`;
    insertContentAtCursor(html);
    closeInsertPicker();
    if(project){
      const num = figureNumberById(project, figures, f.id);
      let changed = syncEmbeddedFigureCaption(project, f.id, num != null ? num : tentativeNum, f.caption);
      // 라이브 DOM도 즉시 정정 — await setProject 동안 잘못된 번호가 보이지 않도록
      const liveEl = document.getElementById(state.activeTextareaId);
      if(liveEl){
        const liveFig = liveEl.querySelector(`.inline-figure[data-fig-id="${f.id}"]`);
        if(liveFig){
          const liveCap = liveFig.querySelector('.inline-figure-caption');
          const finalNum = num != null ? num : tentativeNum;
          if(liveCap) liveCap.innerHTML = `<b>Fig. ${finalNum}.</b> ${escapeHtml(f.caption || '(캡션 미작성)')}`;
          const sk = state.activeTextareaId.replace('sec-content-input-', '');
          if(sk) project.content[sk] = liveEl.innerHTML;
        }
      }
      if(resyncFigureNumbering(beforeOrder, project, figures)) changed = true;
      if(changed){
        await setProject(project);
        renderWorkspace(project);
      }
    }
  } else {
    const num = project ? figureNumberById(project, figures, f.id) : null;
    if(num == null){ showToast('먼저 그림을 본문에 삽입한 후 인용 번호를 사용하세요'); return; }
    insertInlineToken('body-fig-token', `Fig. ${num}`);
    closeInsertPicker();
  }
}
function buildTableInsertPanel(){
  const mode = state.tableInsertMode || 'embed';
  const tables = state.tables || [];
  const tabs = `
    <div class="insert-tabs">
      <button class="insert-tab ${mode==='embed'?'active':''}" onclick="setTableInsertMode('embed')">표 전체 + 캡션</button>
      <button class="insert-tab ${mode==='cite'?'active':''}" onclick="setTableInsertMode('cite')">인용만 (Table N)</button>
    </div>`;
  let itemsHtml;
  if(state.tablesLoadFailed){
    itemsHtml = `<div class="insert-popover-empty">표 목록을 불러오지 못했어요.<br>Table Ledger에서 다시 시도해주세요.</div>`;
  } else if(tables.length === 0){
    itemsHtml = `<div class="insert-popover-empty">아직 만든 표가 없어요.<br>Table Ledger에서 먼저 추가해보세요.</div>`;
  } else {
    const project = state.openProject;
    const order = project ? computeTableOrder(project, tables) : [];
    const embeddedIds = new Set(order);
    const numMap = new Map(order.map((id, i) => [id, i + 1]));
    const sorted = [
      ...order.map(id => tables.find(t => t.id === id)).filter(Boolean),
      ...tables.filter(t => !embeddedIds.has(t.id))
    ];
    itemsHtml = sorted.map(t => {
      const num = numMap.get(t.id);
      const label = num != null ? `Table ${num}` : 'Table — (미삽입)';
      return `
        <button class="insert-item" onclick="pickTableInsert('${t.id}')">
          <span class="insert-num">${num != null ? 'T'+num : '—'}</span>
          <span class="insert-text">
            <div class="insert-primary">${label}</div>
            <div class="insert-secondary">${escapeHtml(t.caption || '(캡션 미작성)')}</div>
          </span>
        </button>
      `;
    }).join('');
  }
  return tabs + itemsHtml;
}

function setTableInsertMode(mode){
  state.tableInsertMode = mode;
  const panel = document.getElementById('inline-insert-picker');
  if(panel){
    const closeBtn = `<div class="picker-close-row"><button class="picker-close-btn" onmousedown="event.preventDefault()" onclick="closeInsertPicker()">✕ 닫기</button></div>`;
    panel.innerHTML = closeBtn + buildTableInsertPanel();
  }
}

function buildInlineTableHtml(t, num){
  const captionText = escapeHtml(t.caption || '(캡션 미작성)');
  const columns = t.columns || [];
  const rows = t.rows || [];
  const theadHtml = `<tr>${columns.map(c => `<th>${escapeHtml(c)}</th>`).join('')}</tr>`;
  const tbodyHtml = rows.map(row => `<tr>${columns.map((c,ci) => `<td>${escapeHtml(row[ci]||'')}</td>`).join('')}</tr>`).join('');
  return `<div class="inline-table" contenteditable="false" data-table-id="${t.id}">` +
    `<div class="inline-table-caption"><b>Table ${num}.</b> ${captionText}</div>` +
    `<table class="paper-table"><thead>${theadHtml}</thead><tbody>${tbodyHtml}</tbody></table>` +
    `</div><div><br></div>`;
}

async function pickTableInsert(tableId){
  const tables = state.tables || [];
  const t = tables.find(x => x.id === tableId);
  if(!t) return;
  const mode = state.tableInsertMode || 'embed';
  const project = state.openProject;
  if(mode === 'embed'){
    const beforeOrder = project ? computeTableOrder(project, tables) : [];
    // 삽입 후 위치가 정해지므로 임시 번호로 넣고 바로 재계산
    const tentativeNum = beforeOrder.length + 1;
    insertContentAtCursor(buildInlineTableHtml(t, tentativeNum));
    closeInsertPicker();
    if(project){
      const num = tableNumberById(project, tables, t.id);
      let changed = syncEmbeddedTableCaption(project, t.id, num != null ? num : tentativeNum, t.caption);
      if(resyncTableNumbering(beforeOrder, project, tables)) changed = true;
      if(changed){
        await setProject(project);
        renderWorkspace(project);
      }
    }
  } else {
    const num = project ? tableNumberById(project, tables, t.id) : null;
    if(num == null){ showToast('먼저 표를 본문에 삽입한 후 인용 번호를 사용하세요'); return; }
    insertInlineToken('body-table-token', `Table ${num}`);
    closeInsertPicker();
  }
}

/* ============== 순서 변경 시 본문 번호 자동 갱신 ============== */
function buildOldNewMapping(oldIds, newIds){
  const newIndexById = {};
  newIds.forEach((id,i) => { newIndexById[id] = i+1; });
  const mapping = [];
  oldIds.forEach((id,i) => {
    const oldNum = i+1;
    const newNum = newIndexById[id];
    if(newNum && newNum !== oldNum) mapping.push({ oldNum, newNum });
  });
  return mapping;
}

function renumberTokensInProject(project, mapping, buildMatcher, renderToken){
  if(!mapping.length) return false;
  let changed = false;
  const secs = getSections(project);
  secs.forEach(sec => {
    if(isReferencesSection(sec)) return; // References 섹션은 Ref Ledger에서 자동 생성되므로 대상 아님
    const original = project.content[sec.key] || '';
    if(!original) return;
    let text = original;
    // 1단계: 바뀌는 번호들을 임시 표식으로 치환 (자리 겹침 방지)
    mapping.forEach(({oldNum}, idx) => {
      text = text.replace(buildMatcher(oldNum), ` TKN${idx} `);
    });
    // 2단계: 임시 표식을 새 번호로 치환
    mapping.forEach(({newNum}, idx) => {
      text = text.split(` TKN${idx} `).join(renderToken(newNum));
    });
    if(text !== original){
      project.content[sec.key] = text;
      changed = true;
    }
  });
  return changed;
}

function refTokenMatcher(n){ return new RegExp('\\[' + n + '\\]', 'g'); }
function refTokenRender(n){ return `[${n}]`; }

// 인용 괄호 정리: 중첩된 [1,[2],3] → [1-3], 인접한 [1,3][2] → [1-3]
// span 래퍼가 있으면 먼저 벗기고 정리한 뒤 다시 씌운다
function cleanupCitationsInHtml(html){
  if(!html) return html;
  // span 래퍼 임시 제거
  html = html.replace(/<span[^>]*class="[^"]*body-ref-token[^"]*"[^>]*>(\[[^\]]*\])<\/span>/g, '$1');
  // 1단계: 중첩 괄호 [a,[b],c] → [a,b,c] (커서가 기존 괄호 안에 있을 때 삽입하면 발생)
  html = html.replace(/\[([^\[\]]*)\[([^\[\]]*)\]([^\[\]]*)\]/g, (_, pre, inner, post) => {
    const nums = expandRefNumbers([pre, inner, post].join(','));
    return nums.length ? '[' + compressRefNumbers(nums) + ']' : _;
  });
  // 2단계: 인접 괄호 반복 병합 [1,3][2] → [1-3]
  let prev;
  do {
    prev = html;
    html = html.replace(/\[([^\[\]]+)\](\s*)\[([^\[\]]+)\]/g, (_, a, sp, b) => {
      const numsA = expandRefNumbers(a), numsB = expandRefNumbers(b);
      if(!numsA.length || !numsB.length) return _;
      return '[' + compressRefNumbers([...numsA, ...numsB]) + ']';
    });
  } while(html !== prev);
  // 3단계: 숫자로만 이루어진 괄호를 styled span으로 래핑
  html = html.replace(/\[(\d[\d,\s\-–]*)\]/g, (match, inner) => {
    const nums = expandRefNumbers(inner);
    if(!nums.length) return match;
    return `<span class="body-ref-token" contenteditable="false">[${compressRefNumbers(nums)}]</span>`;
  });
  return html;
}

// 인용 번호 여러 개를 논문 스타일로 압축: [1,2,3] -> "1-3", [2,5,6,7] -> "2,5-7"
function compressRefNumbers(nums){
  const sorted = Array.from(new Set(nums)).filter(n => Number.isFinite(n)).sort((a,b) => a-b);
  const parts = [];
  let i = 0;
  while(i < sorted.length){
    let j = i;
    while(j+1 < sorted.length && sorted[j+1] === sorted[j]+1) j++;
    parts.push(j > i ? `${sorted[i]}-${sorted[j]}` : `${sorted[i]}`);
    i = j+1;
  }
  return parts.join(',');
}
// 압축된 인용 표기를 다시 개별 번호 배열로: "1-3,5" -> [1,2,3,5]
function expandRefNumbers(str){
  const nums = new Set();
  (str||'').split(',').forEach(part => {
    part = part.trim();
    const range = /^(\d+)\s*[-–]\s*(\d+)$/.exec(part);
    if(range){
      const a = parseInt(range[1],10), b = parseInt(range[2],10);
      for(let n = Math.min(a,b); n <= Math.max(a,b); n++) nums.add(n);
    } else if(/^\d+$/.test(part)){
      nums.add(parseInt(part,10));
    }
  });
  return Array.from(nums);
}
// 본문에 있는 인용 대괄호(단일 [3] 또는 압축된 [1-3,5] 모두)의 번호를 새 순서에
// 맞게 다시 매핑하고, 필요하면 범위 표기를 다시 압축해 넣는다.
function renumberRefCitationsInProject(project, mapping){
  if(!mapping.length) return false;
  const mapObj = {};
  mapping.forEach(({oldNum, newNum}) => { mapObj[oldNum] = newNum; });
  let changed = false;
  // span 래퍼 포함 또는 plain 인용 괄호 매칭
  const bracketRe = /(?:<span[^>]*class="[^"]*body-ref-token[^"]*"[^>]*>)?(\[\s*\d+(?:\s*[-–,]\s*\d+)*\s*\])(?:<\/span>)?/g;
  getSections(project).forEach(sec => {
    if(isReferencesSection(sec)) return;
    const original = project.content[sec.key] || '';
    if(!original) return;
    const text = original.replace(bracketRe, (whole, bracket) => {
      const nums = expandRefNumbers(bracket.slice(1,-1));
      if(!nums.length) return whole;
      let touched = false;
      const remapped = nums.map(n => {
        if(mapObj.hasOwnProperty(n)){ touched = true; return mapObj[n]; }
        return n;
      });
      if(!touched) return whole;
      return `<span class="body-ref-token" contenteditable="false">[${compressRefNumbers(remapped)}]</span>`;
    });
    if(text !== original){ project.content[sec.key] = text; changed = true; }
  });
  return changed;
}
// 본문에서 [N] 인용이 최초로 등장하는 순서대로 참고문헌을 정렬해 반환.
// 인용된 적 없는 참고문헌은 원래 상대 순서 유지(맨 뒤에 붙음).
function computeRefOrder(project, refs){
  const n = refs.length;
  if(!n) return [];
  const firstSeen = new Map(); // number(1-based) → scan position
  let pos = 0;
  getSections(project).forEach(sec => {
    if(isReferencesSection(sec)) return;
    const raw = project.content[sec.key] || '';
    if(!raw) return;
    const bracketRe = /\[\s*\d+(?:\s*[-–,]\s*\d+)*\s*\]/g;
    let m;
    while((m = bracketRe.exec(raw))){
      expandRefNumbers(m[0].slice(1,-1)).forEach(num => {
        if(num >= 1 && num <= n && !firstSeen.has(num)) firstSeen.set(num, pos++);
      });
    }
  });
  return Array.from({length: n}, (_, i) => i)
    .sort((a, b) => {
      const pa = firstSeen.has(a+1) ? firstSeen.get(a+1) : Infinity;
      const pb = firstSeen.has(b+1) ? firstSeen.get(b+1) : Infinity;
      return pa !== pb ? pa - pb : a - b; // 미인용은 원래 상대 순서 유지
    })
    .map(i => refs[i]);
}

// body-order 로 참고문헌을 정렬하고, 본문 [N] 인용 번호를 새 순서로 갱신.
// refs 배열을 in-place 로 변경하며, 변경이 있으면 true 반환.
function autoSortRefsByBodyOrder(project, refs){
  if(!refs.length) return false;
  const sorted = computeRefOrder(project, refs);
  const oldIds = refs.map(r => r.id);
  const newIds = sorted.map(r => r.id);
  if(oldIds.join(',') === newIds.join(',')) return false;
  const newPosById = {};
  newIds.forEach((id, i) => { newPosById[id] = i + 1; });
  const mapping = oldIds
    .map((id, i) => ({ oldNum: i + 1, newNum: newPosById[id] }))
    .filter(m => m.oldNum !== m.newNum);
  sorted.forEach((r, i) => { refs[i] = r; });
  return renumberRefCitationsInProject(project, mapping);
}

// 본문에 현재 인용 중인 참고문헌 번호(1-based)를 Set으로 반환
function computeRefCitedNumbers(project){
  const cited = new Set();
  getSections(project).forEach(sec => {
    if(isReferencesSection(sec)) return;
    const raw = project.content[sec.key] || '';
    if(!raw) return;
    const bracketRe = /\[\s*(\d[\d,\s\-–]*)\s*\]/g;
    let m;
    while((m = bracketRe.exec(raw))) expandRefNumbers(m[1]).forEach(n => cited.add(n));
  });
  return cited;
}

// 본문 편집 후 인용 번호에 gap이 생겼으면 자동으로 재번호 (커서 안전: span.textContent만 교체)
async function _resyncRefTokensAfterBodyEdit(contentEl, sectionKey, project){
  const refs = state.references;
  if(!refs || !refs.length) return;
  // 최신 DOM 상태로 project 업데이트
  project.content[sectionKey] = contentEl.innerHTML;
  const cited = computeRefCitedNumbers(project);
  if(!cited.size) return;
  const maxCited = Math.max(...cited);
  // gap이 없으면 (예: cited={1,2,3}, maxCited=3, size=3) 재번호 불필요
  if(maxCited <= refs.length && cited.size >= maxCited) return;
  // 새 정렬 계산
  const sorted = computeRefOrder(project, refs);
  const oldIds = refs.map(r => r.id);
  const newIds = sorted.map(r => r.id);
  if(oldIds.join(',') === newIds.join(',')) return;
  const newPosById = new Map(newIds.map((id,i) => [id, i+1]));
  const mapObj = {};
  oldIds.forEach((id,i) => {
    const np = newPosById.get(id);
    if(np !== undefined && np !== i+1) mapObj[i+1] = np;
  });
  // 현재 섹션 DOM 스팬 업데이트 (innerHTML 교체 없이 — 커서 위치 유지)
  if(Object.keys(mapObj).length){
    Array.from(contentEl.querySelectorAll('.body-ref-token')).forEach(sp => {
      const inner = (sp.textContent || '').replace(/^\[|\]$/g, '');
      const nums = expandRefNumbers(inner);
      const remapped = nums.map(n => mapObj[n] !== undefined ? mapObj[n] : n);
      const newText = '[' + compressRefNumbers(remapped) + ']';
      if(newText !== sp.textContent) sp.textContent = newText;
    });
    project.content[sectionKey] = contentEl.innerHTML;
  }
  // 다른 섹션들 HTML 문자열 업데이트
  const bracketRe = /(?:<span[^>]*class="[^"]*body-ref-token[^"]*"[^>]*>)?(\[\s*\d+(?:\s*[-–,]\s*\d+)*\s*\])(?:<\/span>)?/g;
  getSections(project).forEach(sec => {
    if(isReferencesSection(sec) || sec.key === sectionKey) return;
    const original = project.content[sec.key] || '';
    if(!original) return;
    const text = original.replace(bracketRe, (whole, bracket) => {
      const nums = expandRefNumbers(bracket.slice(1,-1));
      if(!nums.length) return whole;
      let touched = false;
      const remapped = nums.map(n => { if(mapObj[n] !== undefined){ touched=true; return mapObj[n]; } return n; });
      if(!touched) return whole;
      return `<span class="body-ref-token" contenteditable="false">[${compressRefNumbers(remapped)}]</span>`;
    });
    if(text !== original) project.content[sec.key] = text;
  });
  // refs 배열 재정렬
  sorted.forEach((r,i) => { refs[i] = r; });
  await Promise.all([setProject(project), setReferences(state.currentProjectId, refs)]);
  // 본문 캔버스의 References 섹션 실시간 업데이트
  const refSecEl = document.querySelector('.ms-section[data-section-key="references"]');
  if(refSecEl){
    const refSec = getSections(project).find(s => isReferencesSection(s));
    if(refSec) refSecEl.innerHTML = referencesSectionInnerHtml(refSec);
  }
}

function figTokenMatcher(n){
  return new RegExp(
    '<span[^>]*?class="[^"]*?body-fig-token[^"]*?"[^>]*?>Fig\\.\\s*' + n + '<\\/span>' +
    '|Fig\\.\\s*' + n + '(?!\\d)', 'g');
}
function figTokenRender(n){ return `<span class="body-fig-token" contenteditable="false">Fig. ${n}</span>`; }
function tableTokenMatcher(n){
  return new RegExp(
    '<span[^>]*?class="[^"]*?body-table-token[^"]*?"[^>]*?>Table\\s*' + n + '<\\/span>' +
    '|Table\\s*' + n + '(?!\\d)', 'g');
}
function tableTokenRender(n){ return `<span class="body-table-token" contenteditable="false">Table ${n}</span>`; }

// Fig 번호는 더 이상 Fig Ledger에 올린 순서로 고정하지 않는다 — 본문 어디에
// 먼저 삽입됐는지(섹션 순서 → 섹션 안에서의 등장 순서)로 매번 다시 계산한다.
// 아직 본문 어디에도 삽입 안 된 그림은 업로드 순서 그대로 뒤에 붙는다.
// 반환값: 그림 id 배열 (index+1이 곧 Fig 번호)
function isFreeSection(sec){ return !!sec.freeSection; }

function computeFigureOrder(project, figures){
  const knownIds = new Set((figures||[]).map(f => f.id));
  const seen = new Set();
  const ordered = [];
  getSections(project).forEach(sec => {
    if(isReferencesSection(sec) || isFreeSection(sec)) return;
    const raw = project.content[sec.key] || '';
    if(!raw) return;
    const re = /data-fig-id="([^"]+)"/g;
    let m;
    while((m = re.exec(raw))){
      const id = m[1];
      if(knownIds.has(id) && !seen.has(id)){ seen.add(id); ordered.push(id); }
    }
  });
  (figures||[]).forEach(f => { if(!seen.has(f.id)) ordered.push(f.id); });
  return ordered;
}
function figureNumberById(project, figures, id){
  if(!isFigureEmbedded(project, id)) return null; // 본문 미삽입 → 번호 없음
  const order = computeFigureOrder(project, figures);
  const idx = order.indexOf(id);
  return idx === -1 ? null : idx + 1;
}
function isFigureEmbedded(project, id){
  return getSections(project).some(sec => !isReferencesSection(sec) && !isFreeSection(sec) && (project.content[sec.key]||'').includes(`data-fig-id="${id}"`));
}

// 표 번호도 그림과 동일하게 본문 등장 순서로 계산
function computeTableOrder(project, tables){
  const knownIds = new Set((tables||[]).map(t => t.id));
  const seen = new Set();
  const ordered = [];
  getSections(project).forEach(sec => {
    if(isReferencesSection(sec) || isFreeSection(sec)) return;
    const raw = project.content[sec.key] || '';
    if(!raw) return;
    const re = /data-table-id="([^"]+)"/g;
    let m;
    while((m = re.exec(raw))){
      const id = m[1];
      if(knownIds.has(id) && !seen.has(id)){ seen.add(id); ordered.push(id); }
    }
  });
  (tables||[]).forEach(t => { if(!seen.has(t.id)) ordered.push(t.id); });
  return ordered;
}
function isTableEmbedded(project, id){
  return getSections(project).some(sec => !isReferencesSection(sec) && !isFreeSection(sec) && (project.content[sec.key]||'').includes(`data-table-id="${id}"`));
}
function tableNumberById(project, tables, id){
  if(!isTableEmbedded(project, id)) return null;
  const order = computeTableOrder(project, tables);
  const idx = order.indexOf(id);
  return idx === -1 ? null : idx + 1;
}
function resyncTableNumbering(beforeBodyOrder, project, tables){
  const afterBodyOrder = computeTableOrder(project, tables);
  // 순서가 바뀐 항목만 매핑하여 본문 텍스트 토큰 갱신
  const mapping = [];
  beforeBodyOrder.forEach((id, i) => {
    const oldNum = i + 1;
    const newIdx = afterBodyOrder.indexOf(id);
    if(newIdx !== -1 && (newIdx + 1) !== oldNum) mapping.push({ oldNum, newNum: newIdx + 1 });
  });
  let changed = mapping.length ? renumberTokensInProject(project, mapping, tableTokenMatcher, tableTokenRender) : false;
  // 본문 삽입된 모든 표 캡션을 body-order 번호로 동기화
  afterBodyOrder.forEach((id, i) => {
    const t = (tables||[]).find(tb => tb.id === id);
    if(t && syncEmbeddedTableCaption(project, id, i + 1, t.caption)) changed = true;
  });
  return changed;
}

// 그림 삽입/삭제로 본문상 순서가 바뀔 수 있는 동작 전에 beforeOrder를 찍어두고,
// 동작 후 이 함수를 호출하면: 번호가 실제로 바뀐 그림들만 골라 (1) 본문에 이미
// 삽입된 캡션의 "Fig. N."과 (2) "Fig. N"이라고 직접 언급한 본문 문장들까지
// 새 번호로 맞춰 갱신한다.
function resyncFigureNumbering(beforeOrder, project, figures){
  const afterOrder = computeFigureOrder(project, figures);
  const mapping = [];
  beforeOrder.forEach((id, i) => {
    const oldNum = i+1;
    const newIdx = afterOrder.indexOf(id);
    if(newIdx === -1) return; // 삭제된 그림
    const newNum = newIdx+1;
    if(newNum !== oldNum) mapping.push({ oldNum, newNum, id });
  });
  if(!mapping.length) return false;
  let changed = renumberTokensInProject(project, mapping.map(({oldNum,newNum}) => ({oldNum,newNum})), figTokenMatcher, figTokenRender);
  mapping.forEach(({ id, newNum }) => {
    const fig = (figures||[]).find(f => f.id === id);
    if(fig && syncEmbeddedFigureCaption(project, id, newNum, fig.caption)) changed = true;
  });
  return changed;
}

// Fig Ledger에서 그림을 삭제하면, 본문에 이미 삽입해둔 블록도 같이 지운다 —
// 안 그러면 Ledger에는 없는데 본문에만 남아 번호도 다시는 안 맞는 유령 그림이 된다.
function stripEmbeddedFigure(project, figureId){
  let changed = false;
  getSections(project).forEach(sec => {
    if(isReferencesSection(sec)) return;
    const raw = project.content[sec.key] || '';
    if(!raw || !looksLikeHtml(raw)) return;
    if(raw.indexOf(`data-fig-id="${figureId}"`) === -1) return;
    const tmp = document.createElement('div');
    tmp.innerHTML = raw;
    const target = tmp.querySelector(`.inline-figure[data-fig-id="${figureId}"]`);
    if(target){
      target.remove();
      project.content[sec.key] = tmp.innerHTML;
      changed = true;
    }
  });
  return changed;
}

// 본문에 실제로 삽입된(embed) 그림 블록의 <img src>를 새 URL로 동기화 (자르기 등
// 그림 자체가 바뀌었을 때, 본문에 이미 넣어둔 이미지도 같이 바뀌도록)
function syncEmbeddedFigureImage(project, figureId, newUrl){
  let changed = false;
  getSections(project).forEach(sec => {
    if(isReferencesSection(sec)) return;
    const raw = project.content[sec.key] || '';
    if(!raw || !looksLikeHtml(raw)) return;
    if(raw.indexOf(`data-fig-id="${figureId}"`) === -1) return;
    const tmp = document.createElement('div');
    tmp.innerHTML = raw;
    const imgs = tmp.querySelectorAll(`.inline-figure[data-fig-id="${figureId}"] img`);
    if(imgs.length){
      imgs.forEach(img => { img.src = newUrl; });
      project.content[sec.key] = tmp.innerHTML;
      changed = true;
    }
  });
  return changed;
}

// 본문에 실제로 삽입된(embed) 그림 블록의 캡션을 Fig Ledger 캡션과 동기화
function syncEmbeddedFigureCaption(project, figureId, figNum, newCaption){
  let changed = false;
  const secs = getSections(project);
  secs.forEach(sec => {
    if(isReferencesSection(sec)) return;
    const raw = project.content[sec.key] || '';
    if(!raw || !looksLikeHtml(raw)) return;
    if(raw.indexOf(`data-fig-id="${figureId}"`) === -1) return;
    const tmp = document.createElement('div');
    tmp.innerHTML = raw;
    const target = tmp.querySelector(`.inline-figure[data-fig-id="${figureId}"]`);
    if(target){
      const captionEl = target.querySelector('.inline-figure-caption');
      if(captionEl){
        captionEl.innerHTML = `<b>Fig. ${figNum}.</b> ${escapeHtml(newCaption || '(캡션 미작성)')}`;
        project.content[sec.key] = tmp.innerHTML;
        changed = true;
      }
    }
  });
  return changed;
}


const FIG_MAX_BYTES = 25_000_000; // Supabase Storage에 올라가는 원본 파일 크기 상한 (안전장치일 뿐, 화질 제한이 아님)

// 그림은 Supabase Storage에 올리고 URL만 저장한다(신규). 예전에 base64로
// 저장했던 그림(dataUrl)도 계속 보이도록 둘 다 지원한다.
function figureSrc(f){ return f.url || f.dataUrl; }

function renderFigureManager(project){
  const pane = document.getElementById('editor-pane');

  if(state.figuresLoadFailed){
    pane.innerHTML = `
      <div class="editor-head"><h2>Fig Ledger</h2></div>
      <div style="text-align:center;padding:56px 20px;">
        <div style="font-family:'Times New Roman','맑은 고딕',serif;font-size:17px;font-weight:600;margin-bottom:6px;">그림 목록을 불러오지 못했어요</div>
        <div style="color:var(--ink-soft);font-size:13px;line-height:1.7;max-width:360px;margin:0 auto 18px;">일시적인 저장소 서버 오류예요. 업로드하신 그림이 삭제된 게 아니니 안심하세요 — 잠시 후 다시 시도해주세요.</div>
        <button class="btn small" onclick="retryLoadFigures()">다시 시도</button>
      </div>
    `;
    return;
  }

  const figures = state.figures || [];
  const order = computeFigureOrder(project, figures);
  const byId = new Map(figures.map(f => [f.id, f]));
  const embeddedSet = new Set(figures.filter(f => isFigureEmbedded(project, f.id)).map(f => f.id));
  const embeddedOrder = order.filter(id => embeddedSet.has(id));
  const unplacedOrder = order.filter(id => !embeddedSet.has(id));

  function figCard(f, num, draggable){
    return `
    <div class="fig-card" data-fig-id="${f.id}"${draggable ? ' draggable="true"' : ''}>
      ${draggable ? '<div class="fig-drag-handle" title="드래그하여 순서 변경">⠿</div>' : ''}
      <div class="fig-thumb-wrap" onclick="openFigureLightbox('${f.id}')" title="클릭하여 확대"><img src="${figureSrc(f)}" alt="${escapeHtml(f.fileName)}" /></div>
      <div class="fig-body">
        <div class="fig-head-row">
          <span class="fig-label">${num != null ? `Fig. ${num}` : 'Fig. —'}</span>
          <span class="fig-embed-badge ${num != null ? 'is-embedded' : 'is-unplaced'}">${num != null ? '본문에 삽입됨' : '아직 미삽입'}</span>
          <div class="fig-actions">
            <button title="그림 교체" onclick="triggerReplaceFigure('${f.id}')">🔄</button>
            <button title="자르기" onclick="openFigureCropModal('${f.id}')">✂︎</button>
            <button class="fig-delete" title="삭제" onclick="removeFigure('${f.id}')">✕</button>
          </div>
        </div>
        <div class="fig-filename">${escapeHtml(f.fileName)}</div>
        <label class="fig-field-label">캡션 (본문·Word 내보내기에 포함)</label>
        <textarea class="fig-caption-input" data-fig-id="${f.id}" placeholder="캡션을 입력하세요 (예: 시효 조건에 따른 미세조직 변화)">${escapeHtml(f.caption||'')}</textarea>
        <label class="fig-field-label fig-field-label-note">팀 댓글</label>
        ${renderItemThreadHtml('figure', f.id)}
      </div>
    </div>`;
  }

  const embeddedCards = embeddedOrder.map((id, i) => figCard(byId.get(id), i + 1, false)).join('');
  const sep = (embeddedOrder.length > 0 && unplacedOrder.length > 0)
    ? '<div class="ledger-unplaced-sep">미삽입</div>' : '';
  const unplacedCards = unplacedOrder.map(id => figCard(byId.get(id), null, true)).join('');
  const cards = embeddedCards + sep + unplacedCards;

  pane.innerHTML = `
    <div class="editor-head"><h2>Fig Ledger</h2><span class="section-limit">${figures.length}개</span></div>
    <div class="editor-guidance" style="border-left-color:var(--stamp-green);color:var(--stamp-green);">그림을 업로드하고 본문 섹션에서 "＋ 그림 삽입"으로 원하는 위치에 넣으세요. Fig 번호는 순서를 직접 정하는 게 아니라 <b>본문에 실제로 삽입된 순서</b>대로 자동으로 매겨져요 — 본문 어디에 넣었는지가 곧 번호가 되니, 삽입 순서만 신경 쓰면 번호가 뒤바뀔 일이 없어요. 아직 본문에 안 넣은 그림은 목록 아래쪽에 "미삽입"으로 표시돼요. 그림 카드의 ✂︎로 자르면 본문에 삽입된 그림도 바로 함께 바뀝니다.</div>

    <label class="fig-upload-zone" id="fig-drop-zone" for="fig-file-input">
      <div class="fig-upload-icon">＋</div>
      클릭하거나 이미지를 끌어다 놓아 그림을 추가하세요<br>
      <span style="font-size:11px;color:var(--ink-faint);">PNG · JPG 등, 고화질 원본 그대로 업로드 가능 (파일당 25MB 이하)</span>
      <input type="file" id="fig-file-input" accept="image/*" multiple style="display:none;" />
    </label>

    <div class="fig-list" id="fig-list">${cards || `<div style="color:var(--ink-faint);font-size:13px;text-align:center;padding:20px 0;">아직 업로드한 그림이 없습니다</div>`}</div>
    <input type="file" id="fig-replace-input" accept="image/*" style="display:none;" />
  `;

  const fileInput = document.getElementById('fig-file-input');
  fileInput.addEventListener('change', (e) => { handleFigureFiles(e.target.files); fileInput.value = ''; });

  const replaceInput = document.getElementById('fig-replace-input');
  replaceInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    const figId = replaceInput.dataset.targetFigId;
    replaceInput.value = '';
    if(file && figId) replaceFigureWithFile(figId, file);
  });

  const dropZone = document.getElementById('fig-drop-zone');
  ['dragover','dragenter'].forEach(evt => dropZone.addEventListener(evt, (e)=>{
    if(e.dataTransfer && e.dataTransfer.types && e.dataTransfer.types.includes('Files')){ e.preventDefault(); dropZone.classList.add('dragover'); }
  }));
  ['dragleave'].forEach(evt => dropZone.addEventListener(evt, ()=> dropZone.classList.remove('dragover')));
  dropZone.addEventListener('drop', (e) => {
    if(e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length){
      e.preventDefault();
      dropZone.classList.remove('dragover');
      handleFigureFiles(e.dataTransfer.files);
    }
  });

  pane.querySelectorAll('.fig-caption-input').forEach(el => {
    el.addEventListener('input', (e) => {
      const figId = e.target.dataset.figId;
      const idx = (state.figures || []).findIndex(f => f.id === figId);
      if(idx === -1) return;
      state.figures[idx].caption = e.target.value;
      scheduleFigureSave();
      const num = figureNumberById(project, state.figures, figId);
      const changed = syncEmbeddedFigureCaption(project, figId, num, e.target.value);
      if(changed) scheduleSave(project);
    });
  });

  pane.querySelectorAll('.fig-note-input').forEach(el => {
    el.addEventListener('input', (e) => {
      const fig = (state.figures || []).find(f => f.id === e.target.dataset.figId);
      if(fig) fig.note = e.target.value;
      scheduleFigureSave();
    });
  });

  _initFigDragDrop(project);
}

function _initFigDragDrop(project){
  const list = document.getElementById('fig-list');
  if(!list) return;
  let dragId = null;
  list.querySelectorAll('.fig-card[draggable="true"]').forEach(card => {
    card.addEventListener('dragstart', e => {
      dragId = card.dataset.figId;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', dragId);
      setTimeout(() => card.classList.add('dragging'), 0);
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      list.querySelectorAll('.fig-card').forEach(c => c.classList.remove('drag-over'));
      dragId = null;
    });
    card.addEventListener('dragover', e => {
      if(!dragId || card.dataset.figId === dragId) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      list.querySelectorAll('.fig-card').forEach(c => c.classList.remove('drag-over'));
      card.classList.add('drag-over');
    });
    card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
    card.addEventListener('drop', e => {
      e.preventDefault();
      const targetId = card.dataset.figId;
      card.classList.remove('drag-over');
      if(!dragId || dragId === targetId) return;
      reorderUnplacedFigure(dragId, targetId, project);
      dragId = null;
    });
  });
}

async function reorderUnplacedFigure(dragId, targetId, project){
  const figures = state.figures || [];
  const fromIdx = figures.findIndex(f => f.id === dragId);
  const toIdx   = figures.findIndex(f => f.id === targetId);
  if(fromIdx === -1 || toIdx === -1) return;
  const next = [...figures];
  const [moved] = next.splice(fromIdx, 1);
  const insertAt = next.findIndex(f => f.id === targetId);
  next.splice(insertAt, 0, moved);
  state.figures = next;
  await setFigures(state.currentProjectId, state.figures);
  const fresh = await getProject(state.currentProjectId);
  if(fresh) renderWorkspace(fresh);
}

function handleFigureFiles(fileList){
  const files = Array.from(fileList || []).filter(f => f.type.startsWith('image/'));
  if(files.length === 0){ showToast('이미지 파일만 업로드할 수 있어요'); return; }
  const oversized = files.filter(f => f.size > FIG_MAX_BYTES);
  const valid = files.filter(f => f.size <= FIG_MAX_BYTES);
  if(oversized.length) showToast(`${oversized.length}개 파일이 너무 커서(25MB 초과) 제외됐어요`);
  valid.forEach(uploadAndAddFigure);
}

async function uploadAndAddFigure(file){
  const extMatch = /\.([a-zA-Z0-9]+)$/.exec(file.name || '');
  const ext = (extMatch ? extMatch[1] : 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
  const path = `${state.currentProjectId}/${Date.now()}_${Math.random().toString(36).slice(2,8)}.${ext}`;
  const { error: uploadError } = await window.sb.storage.from('figures').upload(path, file, { contentType: file.type || undefined });
  if(uploadError){ showToast(`"${file.name}" 업로드에 실패했어요: ${uploadError.message || '다시 시도해주세요'}`); return; }
  const { data: pub } = window.sb.storage.from('figures').getPublicUrl(path);

  state.figures = state.figures || [];
  state.figures.push({
    id: 'fig_' + Date.now() + '_' + Math.random().toString(36).slice(2,6),
    fileName: file.name,
    storagePath: path,
    url: pub.publicUrl,
    caption: '',
    note: '',
    addedAt: Date.now()
  });
  const ok = await setFigures(state.currentProjectId, state.figures);
  if(!ok) showToast('그림 저장에 실패했어요. 다시 시도해주세요');
  broadcastLedgerAdd('figure', file.name);
  const project = await getProject(state.currentProjectId);
  if(project) renderWorkspace(project);
}

// Fig 번호는 본문 삽입 순서로 자동 계산되므로(computeFigureOrder) Ledger에서
// 수동으로 순서를 바꾸는 기능은 없앴다 — moveFigure/reorderFigures 삭제.

/* ============== TABLE LEDGER (표 관리) ============== */
function makeEmptyTable(){
  return {
    id: 'tbl_' + Date.now() + '_' + Math.random().toString(36).slice(2,6),
    caption: '', note: '',
    columns: ['', ''],
    rows: [['', '']],
    addedAt: Date.now()
  };
}

function renderTableManager(project){
  const pane = document.getElementById('editor-pane');

  if(state.tablesLoadFailed){
    pane.innerHTML = `
      <div class="editor-head"><h2>Table Ledger</h2></div>
      <div style="text-align:center;padding:56px 20px;">
        <div style="font-family:'Times New Roman','맑은 고딕',serif;font-size:17px;font-weight:600;margin-bottom:6px;">표 목록을 불러오지 못했어요</div>
        <div style="color:var(--ink-soft);font-size:13px;line-height:1.7;max-width:360px;margin:0 auto 18px;">일시적인 저장소 서버 오류예요. 만들어두신 표가 삭제된 게 아니니 안심하세요 — 잠시 후 다시 시도해주세요.</div>
        <button class="btn small" onclick="retryLoadTables()">다시 시도</button>
      </div>
    `;
    return;
  }

  const tables = state.tables || [];
  const order = computeTableOrder(project, tables);
  const embeddedSet = new Set(tables.filter(t => isTableEmbedded(project, t.id)).map(t => t.id));
  const embeddedOrder = order.filter(id => embeddedSet.has(id));
  const unplacedOrder = order.filter(id => !embeddedSet.has(id));
  const tblById = new Map(tables.map(t => [t.id, t]));

  function tblCard(t, num, draggable){
    const columns = t.columns || [];
    const rows = t.rows || [];
    const headHtml = columns.map((c, ci) => `
      <th>
        <div style="display:flex;align-items:center;gap:2px;">
          <input class="tbl-cell-input" data-table-id="${t.id}" data-kind="col" data-ci="${ci}" value="${escapeHtml(c)}" placeholder="열 이름" style="font-weight:600;">
          ${columns.length > 1 ? `<button class="tbl-col-remove" title="열 삭제" onclick="removeTableColumn('${t.id}',${ci})">✕</button>` : ''}
        </div>
      </th>`).join('');
    const bodyHtml = rows.map((row, ri) => `
      <tr>
        ${columns.map((c, ci) => `<td><input class="tbl-cell-input" data-table-id="${t.id}" data-kind="cell" data-ri="${ri}" data-ci="${ci}" value="${escapeHtml(row[ci] || '')}"></td>`).join('')}
        <td class="tbl-grid-actions"><button title="행 삭제" onclick="removeTableRow('${t.id}',${ri})">✕</button></td>
      </tr>`).join('');
    return `
    <div class="tbl-card" data-table-id="${t.id}"${draggable ? ' draggable="true"' : ''}>
      <div class="tbl-card-head">
        ${draggable ? '<div class="tbl-drag-handle" title="드래그하여 순서 변경">⠿</div>' : ''}
        <span class="fig-label">${num != null ? `Table ${num}` : 'Table —'}</span>
        <span class="fig-embed-badge ${num != null ? 'is-embedded' : 'is-unplaced'}">${num != null ? '본문에 삽입됨' : '아직 미삽입'}</span>
        <div class="fig-actions" style="margin-left:auto;">
          <button class="fig-delete" title="삭제" onclick="removeTable('${t.id}')">✕</button>
        </div>
      </div>
      <label class="fig-field-label">캡션 (표 위에 표시됨, 본문·Word 내보내기에 포함)</label>
      <textarea class="fig-caption-input tbl-caption-input" data-table-id="${t.id}" placeholder="캡션을 입력하세요 (예: Chemistry composition of designed alloy, wt%.)">${escapeHtml(t.caption||'')}</textarea>
      <div class="tbl-grid-wrap">
        <table class="tbl-edit-grid">
          <thead><tr>${headHtml}<th class="tbl-grid-actions"><button title="열 추가" onclick="addTableColumn('${t.id}')">＋</button></th></tr></thead>
          <tbody>${bodyHtml || ''}</tbody>
        </table>
      </div>
      <button class="btn secondary small" style="margin-top:8px;align-self:flex-start;" onclick="addTableRow('${t.id}')">＋ 행 추가</button>
      <label class="fig-field-label fig-field-label-note" style="margin-top:12px;">팀 댓글</label>
      ${renderItemThreadHtml('table', t.id)}
    </div>`;
  }

  const embeddedCards = embeddedOrder.map((id, i) => tblCard(tblById.get(id), i + 1, false)).join('');
  const sep = (embeddedOrder.length > 0 && unplacedOrder.length > 0)
    ? '<div class="ledger-unplaced-sep">미삽입</div>' : '';
  const unplacedCards = unplacedOrder.map(id => tblCard(tblById.get(id), null, true)).join('');
  const cards = embeddedCards + sep + unplacedCards;

  pane.innerHTML = `
    <div class="editor-head"><h2>Table Ledger</h2><span class="section-limit">${tables.length}개</span></div>
    <div class="editor-guidance" style="border-left-color:var(--stamp-green);color:var(--stamp-green);">표를 만들고 캡션을 작성하세요. Table 번호는 <b>본문에 삽입된 순서</b>로 자동 계산되고, 아직 미삽입인 표는 ⠿ 핸들로 드래그해 순서를 바꿀 수 있어요. 본문 섹션에서는 "＋ 표 삽입" 버튼으로 표 전체 또는 "Table N" 인용만 삽입할 수 있어요. Word로 내보내면 3선(three-line) 표 형식으로 정리됩니다.</div>

    <button class="btn secondary small" style="margin-bottom:16px;" onclick="addNewTable()">＋ 표 추가</button>
    <div class="fig-list" id="tbl-list">${cards || `<div style="color:var(--ink-faint);font-size:13px;text-align:center;padding:20px 0;">아직 만든 표가 없습니다</div>`}</div>
  `;

  pane.querySelectorAll('.tbl-caption-input').forEach(el => {
    el.addEventListener('input', (e) => {
      const tableId = e.target.dataset.tableId;
      const idx = (state.tables || []).findIndex(t => t.id === tableId);
      if(idx === -1) return;
      state.tables[idx].caption = e.target.value;
      scheduleTableSave();
      getProject(state.currentProjectId).then(project => {
        if(!project) return;
        const num = tableNumberById(project, state.tables || [], tableId);
        const changed = num != null && syncEmbeddedTableCaption(project, tableId, num, e.target.value);
        if(changed) setProject(project);
      });
    });
  });
  pane.querySelectorAll('.tbl-note-input').forEach(el => {
    el.addEventListener('input', (e) => {
      const t = (state.tables || []).find(t => t.id === e.target.dataset.tableId);
      if(t) t.note = e.target.value;
      scheduleTableSave();
    });
  });
  pane.querySelectorAll('.tbl-cell-input').forEach(el => {
    el.addEventListener('input', (e) => {
      const t = (state.tables || []).find(t => t.id === e.target.dataset.tableId);
      if(!t) return;
      const kind = e.target.dataset.kind;
      if(kind === 'col'){
        const ci = Number(e.target.dataset.ci);
        t.columns[ci] = e.target.value;
      } else {
        const ri = Number(e.target.dataset.ri), ci = Number(e.target.dataset.ci);
        if(!t.rows[ri]) t.rows[ri] = [];
        t.rows[ri][ci] = e.target.value;
      }
      scheduleTableSave();
    });
  });

  // 드래그 앤 드롭 — 미삽입 표만 대상
  let dragSrcId = null;
  pane.querySelectorAll('.tbl-card[draggable="true"]').forEach(card => {
    card.addEventListener('dragstart', (e) => {
      dragSrcId = card.dataset.tableId;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', dragSrcId);
      setTimeout(() => card.classList.add('dragging'), 0);
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      pane.querySelectorAll('.tbl-card').forEach(c => c.classList.remove('drag-over'));
      dragSrcId = null;
    });
    card.addEventListener('dragover', (e) => {
      if(!dragSrcId || card.dataset.tableId === dragSrcId) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      pane.querySelectorAll('.tbl-card').forEach(c => c.classList.remove('drag-over'));
      card.classList.add('drag-over');
    });
    card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
    card.addEventListener('drop', (e) => {
      e.preventDefault();
      card.classList.remove('drag-over');
      const targetId = card.dataset.tableId;
      if(dragSrcId && dragSrcId !== targetId) reorderTables(dragSrcId, targetId);
      dragSrcId = null;
    });
  });
}

async function addNewTable(){
  state.tables = state.tables || [];
  state.tables.push(makeEmptyTable());
  const ok = await setTables(state.currentProjectId, state.tables);
  if(!ok) showToast('표 저장에 실패했어요. 다시 시도해주세요');
  broadcastLedgerAdd('table', `Table ${state.tables.length}`);
  const project = await getProject(state.currentProjectId);
  if(project) renderWorkspace(project);
}

async function removeTable(id){
  state.tables = (state.tables || []).filter(t => t.id !== id);
  const ok = await setTables(state.currentProjectId, state.tables);
  if(!ok) showToast('삭제 내용을 저장하지 못했어요');
  const project = await getProject(state.currentProjectId);
  if(project) renderWorkspace(project);
}

function addTableColumn(id){
  const t = (state.tables || []).find(t => t.id === id);
  if(!t) return;
  t.columns.push('');
  (t.rows || []).forEach(row => row.push(''));
  scheduleTableSave();
  getProject(state.currentProjectId).then(project => { if(project) renderWorkspace(project); });
}

function removeTableColumn(id, ci){
  const t = (state.tables || []).find(t => t.id === id);
  if(!t || t.columns.length <= 1) return;
  t.columns.splice(ci, 1);
  (t.rows || []).forEach(row => row.splice(ci, 1));
  scheduleTableSave();
  getProject(state.currentProjectId).then(project => { if(project) renderWorkspace(project); });
}

function addTableRow(id){
  const t = (state.tables || []).find(t => t.id === id);
  if(!t) return;
  t.rows = t.rows || [];
  t.rows.push(t.columns.map(()=>''));
  scheduleTableSave();
  getProject(state.currentProjectId).then(project => { if(project) renderWorkspace(project); });
}

function removeTableRow(id, ri){
  const t = (state.tables || []).find(t => t.id === id);
  if(!t) return;
  t.rows.splice(ri, 1);
  scheduleTableSave();
  getProject(state.currentProjectId).then(project => { if(project) renderWorkspace(project); });
}

async function moveTable(id, dir){
  const tables = state.tables || [];
  const idx = tables.findIndex(t => t.id === id);
  const target = idx + dir;
  if(idx < 0 || target < 0 || target >= tables.length) return;
  const oldIds = tables.map(t => t.id);
  [tables[idx], tables[target]] = [tables[target], tables[idx]];
  const newIds = tables.map(t => t.id);
  const ok = await setTables(state.currentProjectId, tables);
  if(!ok) showToast('순서 저장에 실패했어요');
  // 표 번호는 body-order 기준이므로 ledger 순서 변경은 본문 번호에 영향 없음
  const project = await getProject(state.currentProjectId);
  if(project) renderWorkspace(project);
}

async function reorderTables(srcId, targetId){
  const tables = state.tables || [];
  const srcIdx = tables.findIndex(t => t.id === srcId);
  const targetIdx = tables.findIndex(t => t.id === targetId);
  if(srcIdx === -1 || targetIdx === -1 || srcIdx === targetIdx) return;
  const [moved] = tables.splice(srcIdx, 1);
  tables.splice(targetIdx, 0, moved);
  const ok = await setTables(state.currentProjectId, tables);
  if(!ok) showToast('순서 저장에 실패했어요');
  const project = await getProject(state.currentProjectId);
  if(project) renderWorkspace(project);
}

function scheduleTableSave(){
  clearTimeout(state.tableSaveTimer);
  state.tableSaveTimer = setTimeout(async () => {
    await setTables(state.currentProjectId, state.tables || []);
  }, 500);
}

// 본문에 실제로 삽입된(embed) 표 블록의 캡션을 Table Ledger 캡션과 동기화
function syncEmbeddedTableCaption(project, tableId, tableNum, newCaption){
  let changed = false;
  const secs = getSections(project);
  secs.forEach(sec => {
    if(isReferencesSection(sec)) return;
    const raw = project.content[sec.key] || '';
    if(!raw || !looksLikeHtml(raw)) return;
    if(raw.indexOf(`data-table-id="${tableId}"`) === -1) return;
    const tmp = document.createElement('div');
    tmp.innerHTML = raw;
    const target = tmp.querySelector(`.inline-table[data-table-id="${tableId}"]`);
    if(target){
      const captionEl = target.querySelector('.inline-table-caption');
      if(captionEl){
        captionEl.innerHTML = `<b>Table ${tableNum}.</b> ${escapeHtml(newCaption || '(캡션 미작성)')}`;
        project.content[sec.key] = tmp.innerHTML;
        changed = true;
      }
    }
  });
  return changed;
}

/* ============== 팀원(멤버십) 관리 ============== */
async function listProjectMembers(projectId, ownerId){
  for(let i=0; i<3; i++){
    const [membersRes, ownerRes] = await Promise.all([
      window.sb.from('project_members')
        .select('user_id, invited_at, profiles(email, display_name)')
        .eq('project_id', projectId)
        .order('invited_at', { ascending:true }),
      ownerId
        ? window.sb.from('profiles').select('id,email,display_name').eq('id', ownerId).maybeSingle()
        : Promise.resolve({ data:null, error:null })
    ]);
    if(!membersRes.error && !ownerRes.error){
      const members = (membersRes.data||[]).map(row => ({
        userId: row.user_id, invitedAt: new Date(row.invited_at).getTime(),
        email: row.profiles ? row.profiles.email : '', displayName: row.profiles ? row.profiles.display_name : ''
      }));
      return { owner: ownerRes.data, members, failed:false };
    }
    console.error(`팀원 목록 조회 실패 (시도 ${i+1}/3):`, membersRes.error || ownerRes.error);
    await new Promise(res => setTimeout(res, 400*(i+1)));
  }
  return { owner:null, members:null, failed:true };
}

async function inviteMemberByEmail(projectId, email){
  const { data: profile, error: lookupError } = await window.sb.from('profiles').select('id,email').eq('email', email).maybeSingle();
  if(lookupError) return { error: lookupError };
  if(!profile) return { error: new Error('해당 이메일로 가입된 계정을 찾을 수 없어요') };
  const { error } = await window.sb.from('project_members').insert({ project_id: projectId, user_id: profile.id });
  if(error){
    if(error.code === '23505') return { error: new Error('이미 초대된 사용자예요') };
    return { error };
  }
  return { error:null };
}

async function removeMember(projectId, userId){
  const { error } = await window.sb.from('project_members').delete().eq('project_id', projectId).eq('user_id', userId);
  if(error){ showToast('제거에 실패했어요: ' + error.message); return false; }
  return true;
}

let inviteFormOpen = false;

/* ============== 팀 채팅 ============== */
function getChatMessages(){
  return (state.itemComments || []).filter(c => c.itemType === 'chat');
}

function _chatMsgHtml(m, myId){
  const color = colorForUser(m.userId);
  const isMine = m.userId === myId;
  const initials = ((m.displayName || m.email || '?').trim()[0] || '?').toUpperCase();
  const deleteBtn = isMine
    ? `<button class="chat-delete" title="삭제" onclick="deleteChatMessage('${m.id}')">✕</button>`
    : '';
  return `
    <div class="chat-msg${isMine ? ' chat-msg-mine' : ''}" data-chat-id="${m.id}">
      <span class="chat-avatar" style="background:${color}22;color:${color};border-color:${color};">${escapeHtml(initials)}</span>
      <div class="chat-bubble">
        <div class="chat-meta">
          <span class="chat-author" style="color:${color};">${escapeHtml(m.displayName || m.email || '?')}</span>
          <span class="chat-time">${fmtChatTime(m.createdAt)}</span>
          ${deleteBtn}
        </div>
        <div class="chat-text">${escapeHtml(m.content)}</div>
      </div>
    </div>`;
}

function refreshChatPanel(){
  const el = document.getElementById('chat-msg-list');
  if(!el) return;
  const msgs = getChatMessages();
  const myId = state.currentUser && state.currentUser.id;
  el.innerHTML = msgs.length
    ? msgs.map(m => _chatMsgHtml(m, myId)).join('')
    : '<div class="chat-empty">아직 메시지가 없어요. 팀원들에게 첫 메시지를 남겨보세요 👋</div>';
  el.scrollTop = el.scrollHeight;
}

async function sendChatMessage(){
  const input = document.getElementById('chat-input');
  if(!input) return;
  const content = input.value.trim();
  if(!content) return;
  input.value = '';
  input.style.height = '';
  const comment = await createItemComment(state.currentProjectId, 'chat', state.currentProjectId, content);
  if(!comment){ showToast('전송에 실패했어요'); return; }
  state.itemComments = state.itemComments || [];
  state.itemComments.push(comment);
  refreshChatPanel();
  broadcastItemCommentEvent('create', comment);
}

async function deleteChatMessage(id){
  const ok = await deleteItemCommentRow(id);
  if(!ok){ showToast('삭제에 실패했어요'); return; }
  state.itemComments = (state.itemComments || []).filter(c => c.id !== id);
  refreshChatPanel();
  broadcastItemCommentEvent('delete', { id, itemType:'chat', itemId: state.currentProjectId });
}

function _initChatInput(){
  const input = document.getElementById('chat-input');
  if(!input) return;
  input.addEventListener('keydown', e => {
    if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); sendChatMessage(); }
  });
  input.addEventListener('input', () => {
    input.style.height = '';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });
}

function renderMembersManager(project){
  const pane = document.getElementById('editor-pane');
  const isOwner = project.ownerId === state.currentUser.id;

  if(state.membersLoadFailed){
    pane.innerHTML = `
      <div class="editor-head"><h2>팀원</h2></div>
      <div style="text-align:center;padding:56px 20px;">
        <div style="font-family:'Times New Roman','맑은 고딕',serif;font-size:17px;font-weight:600;margin-bottom:6px;">팀원 목록을 불러오지 못했어요</div>
        <div style="color:var(--ink-soft);font-size:13px;line-height:1.7;max-width:360px;margin:0 auto 18px;">일시적인 저장소 서버 오류예요. 잠시 후 다시 시도해주세요.</div>
        <button class="btn small" onclick="retryLoadMembers()">다시 시도</button>
      </div>
    `;
    return;
  }

  const owner = state.owner;
  const members = state.members || [];

  const inviteForm = isOwner ? (inviteFormOpen ? `
    <div class="ref-add-form" id="invite-add-form">
      <input type="text" id="invite-email-input" placeholder="초대할 사람의 가입 이메일" />
      <div style="display:flex;gap:8px;justify-content:flex-end;">
        <button class="btn secondary small" onclick="cancelInviteMember()">취소</button>
        <button class="btn small" onclick="submitInviteMember()">초대</button>
      </div>
    </div>
  ` : `<button class="btn secondary small" style="margin-bottom:16px;" onclick="showInviteMemberForm()">＋ 팀원 초대</button>`) : '';

  const ownerCard = `
    <div class="ref-card">
      <div class="ref-num-badge">👑</div>
      <div class="ref-body">
        <div style="font-weight:600;font-size:13.5px;color:var(--ink);">${escapeHtml((owner && (owner.display_name || owner.email)) || '(알 수 없음)')}</div>
        <div style="font-size:11.5px;color:var(--ink-faint);font-family:'Courier New','맑은 고딕',monospace;">${escapeHtml((owner && owner.email) || '')} · 프로젝트 관리자(소유자)</div>
      </div>
    </div>`;

  const memberCards = members.map(m => `
    <div class="ref-card">
      <div class="ref-num-badge">✓</div>
      <div class="ref-body">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
          <div style="font-weight:600;font-size:13.5px;color:var(--ink);">${escapeHtml(m.displayName || m.email)}</div>
          ${isOwner ? `<button class="icon-btn" title="제거" onclick="submitRemoveMember('${m.userId}')">✕</button>` : ''}
        </div>
        <div style="font-size:11.5px;color:var(--ink-faint);font-family:'Courier New','맑은 고딕',monospace;">${escapeHtml(m.email)} · 참여자</div>
      </div>
    </div>`).join('');

  pane.innerHTML = `
    <div class="editor-head"><h2>팀원</h2><span class="section-limit">${1 + members.length}명</span></div>
    <div class="editor-guidance" style="border-left-color:var(--stamp-green);color:var(--stamp-green);">${isOwner ? '이메일로 참여자를 초대하세요. 초대받은 사람은 가입만 되어 있으면 바로 이 프로젝트를 함께 편집할 수 있어요.' : '이 프로젝트의 소유자와 참여자 목록이에요. 초대·제거는 소유자만 할 수 있어요.'}</div>
    ${inviteForm}
    <div class="fig-list" id="member-list">${ownerCard}${memberCards}</div>

    <div class="chat-section">
      <div class="chat-section-head">
        <span class="chat-section-title">💬 팀 채팅</span>
        <span style="font-size:11px;color:var(--ink-faint);">Enter로 전송 · Shift+Enter 줄바꿈</span>
      </div>
      <div class="chat-msg-list" id="chat-msg-list"></div>
      <div class="chat-input-row">
        <textarea class="chat-input" id="chat-input" placeholder="메시지를 입력하세요…" rows="1"></textarea>
        <button class="btn small" onclick="sendChatMessage()">전송</button>
      </div>
    </div>
  `;

  if(inviteFormOpen){
    const input = document.getElementById('invite-email-input');
    if(input) input.focus();
  }
  refreshChatPanel();
  _initChatInput();
}

function showInviteMemberForm(){
  inviteFormOpen = true;
  getProject(state.currentProjectId).then(p => { if(p) renderWorkspace(p); });
}
function cancelInviteMember(){
  inviteFormOpen = false;
  getProject(state.currentProjectId).then(p => { if(p) renderWorkspace(p); });
}

async function submitInviteMember(){
  const email = document.getElementById('invite-email-input').value.trim();
  if(!email){ showToast('이메일을 입력해주세요'); return; }
  const { error } = await inviteMemberByEmail(state.currentProjectId, email);
  if(error){ showToast(error.message); return; }
  inviteFormOpen = false;
  showToast('초대했어요');
  const project = await getProject(state.currentProjectId);
  if(!project) return;
  const { owner, members, failed } = await listProjectMembers(state.currentProjectId, project.ownerId);
  if(!failed){ state.owner = owner; state.members = members; state.membersLoadFailed = false; }
  renderWorkspace(project);
}

async function submitRemoveMember(userId){
  const ok = await removeMember(state.currentProjectId, userId);
  if(!ok) return;
  const project = await getProject(state.currentProjectId);
  if(!project) return;
  const { owner, members, failed } = await listProjectMembers(state.currentProjectId, project.ownerId);
  if(!failed){ state.owner = owner; state.members = members; state.membersLoadFailed = false; }
  renderWorkspace(project);
}

/* ============== 하이라이트 & 코멘트 ==============
 * 하이라이트된 구간은 <mark class="hl" data-hl-id="..."> 형태로 섹션 본문
 * HTML 안에 직접 삽입된다(그림/표와 같은 방식) — 색은 유저별로 결정적으로
 * 정해지고(colorForUser, Phase 2 실시간 프레즌스와 동일 팔레트 재사용),
 * 메타데이터(작성자·메모)는 highlights 테이블에 별도로 저장된다.
 */
function mapHighlightRow(row){
  return {
    id: row.id, sectionKey: row.section_key, userId: row.user_id,
    quoteText: row.quote_text, note: row.note || '',
    createdAt: new Date(row.created_at).getTime(),
    email: row.author ? row.author.email : '',
    displayName: row.author ? row.author.display_name : '',
    resolvedAt: row.resolved_at ? new Date(row.resolved_at).getTime() : null,
    resolvedBy: row.resolved_by || null,
    resolvedByName: row.resolver ? (row.resolver.display_name || '') : ''
  };
}

async function listHighlights(projectId){
  for(let i=0; i<3; i++){
    const { data, error } = await window.sb.from('highlights')
      .select('id,section_key,user_id,quote_text,note,created_at,resolved_at,resolved_by,author:user_id(email,display_name),resolver:resolved_by(display_name)')
      .eq('project_id', projectId)
      .order('created_at', { ascending:true });
    if(!error) return { highlights: (data||[]).map(mapHighlightRow), failed:false };
    console.error(`코멘트 목록 조회 실패 (시도 ${i+1}/3):`, error);
    await new Promise(res => setTimeout(res, 400*(i+1)));
  }
  return { highlights:null, failed:true };
}

async function createHighlightRow(projectId, sectionKey, quoteText){
  const session = await getSession();
  if(!session) return { highlight:null, error:new Error('로그인이 필요합니다') };
  const { data, error } = await window.sb.from('highlights').insert({
    project_id: projectId, section_key: sectionKey, user_id: session.user.id, quote_text: quoteText, note:'', resolved_at: null, resolved_by: null
  }).select('id,section_key,user_id,quote_text,note,created_at,resolved_at,resolved_by').single();
  if(error) return { highlight:null, error };
  const profile = state.currentUser && state.currentUser.profile;
  return { highlight: mapHighlightRow(Object.assign({}, data, { author: profile })), error:null };
}

async function updateHighlightNoteRow(id, note){
  const { error } = await window.sb.from('highlights').update({ note, updated_at:new Date().toISOString() }).eq('id', id);
  if(error){ console.error('코멘트 저장 실패:', error); return false; }
  return true;
}

async function deleteHighlightRow(id){
  const { error } = await window.sb.from('highlights').delete().eq('id', id);
  if(error){ console.error('코멘트 삭제 실패:', error); return false; }
  return true;
}

async function resolveHighlightRow(id){
  const session = await getSession();
  if(!session) return null;
  const now = new Date().toISOString();
  const { error } = await window.sb.from('highlights')
    .update({ resolved_at: now, resolved_by: session.user.id }).eq('id', id);
  if(error){ console.error('해결 처리 실패:', error); return null; }
  return { resolvedAt: new Date(now).getTime(), resolvedBy: session.user.id, resolvedByName: (state.currentUser?.profile?.display_name || state.currentUser?.email || '') };
}

async function unresolveHighlightRow(id){
  const { error } = await window.sb.from('highlights')
    .update({ resolved_at: null, resolved_by: null }).eq('id', id);
  if(error){ console.error('해결 취소 실패:', error); return false; }
  return true;
}

async function retryLoadHighlights(){
  const { highlights, failed } = await listHighlights(state.currentProjectId);
  state.highlightsLoadFailed = failed;
  if(failed){ showToast('아직도 불러오지 못했어요. 잠시 후 다시 시도해주세요'); }
  else { state.highlights = highlights; showToast('코멘트 목록을 다시 불러왔어요'); }
  const project = await getProject(state.currentProjectId);
  if(project) renderWorkspace(project);
}

function persistSectionAfterHighlightChange(sectionKey){
  const el = document.getElementById('sec-content-input-' + sectionKey);
  if(!el || !state.openProject) return;
  state.openProject.content[sectionKey] = el.innerHTML;
  scheduleSave(state.openProject);
  broadcastSectionEdit(sectionKey, el.innerHTML);
}

// 텍스트를 덮어쓰거나 삭제해서 하이라이트 원문이 바뀐 경우 mark를 자동 제거한다.
function _autoRemoveModifiedHighlights(contentEl, sectionKey, project){
  const marks = Array.from(contentEl.querySelectorAll('mark.hl[data-hl-id]'));
  if(!marks.length) return;
  const removed = [];
  marks.forEach(mark => {
    const id = mark.dataset.hlId;
    const h = (state.highlights || []).find(x => x.id === id);
    if(!contentEl.contains(mark)){
      // mark가 DOM에서 완전히 삭제된 경우
      removed.push({ id, h });
      return;
    }
    if(!h || mark.textContent !== h.quoteText){
      mark.replaceWith(...Array.from(mark.childNodes));
      removed.push({ id, h });
    }
  });
  if(!removed.length) return;
  const removedIds = new Set(removed.map(x => x.id));
  state.highlights = (state.highlights || []).filter(x => !removedIds.has(x.id));
  project.content[sectionKey] = contentEl.innerHTML;
  removed.forEach(({ id, h }) => {
    deleteHighlightRow(id);
    if(h) broadcastHighlightEvent('delete', h);
  });
  if(state.openProject) refreshTocOnly(state.openProject);
  if(state.currentSectionKey === '__comments__' && state.openProject) renderCommentsManager(state.openProject);
}

// 전자책 리더처럼: 본문에서 문구를 선택하면(마우스를 떼는 순간) 선택 영역
// 바로 위에 작은 "하이라이트" 버튼이 떠서, 상단 버튼까지 갈 필요가 없다.
let selectHighlightBtnEl = null;

function applyResolvedMarkClasses(){
  const resolved = new Set((state.highlights || []).filter(h => h.resolvedAt).map(h => h.id));
  document.querySelectorAll('mark.hl[data-hl-id]').forEach(mark => {
    mark.classList.toggle('hl-resolved', resolved.has(mark.dataset.hlId));
  });
}

function initSelectionHighlightUI(){
  document.addEventListener('mouseup', handleTextSelectionForHighlight);
  document.addEventListener('mousedown', (e) => {
    if(!e.target.closest || !e.target.closest('.select-highlight-btn')) removeSelectHighlightBtn();
  });
  document.addEventListener('selectionchange', () => {
    const sel = window.getSelection();
    if(!sel || sel.isCollapsed) removeSelectHighlightBtn();
  });
}

function handleTextSelectionForHighlight(e){
  if(e.target.closest && e.target.closest('.select-highlight-btn')) return; // 버튼 클릭 자체는 무시
  const sel = window.getSelection();
  if(!sel || sel.rangeCount === 0 || sel.isCollapsed || !sel.toString().trim()){ removeSelectHighlightBtn(); return; }
  const range = sel.getRangeAt(0);
  const startEl = range.startContainer.nodeType === 1 ? range.startContainer : range.startContainer.parentElement;
  const endEl = range.endContainer.nodeType === 1 ? range.endContainer : range.endContainer.parentElement;
  const editorArea = startEl && startEl.closest('.editor-area[id^="sec-content-input-"]');
  if(!editorArea || !endEl || !editorArea.contains(endEl)){ removeSelectHighlightBtn(); return; }
  const sectionKey = editorArea.id.slice('sec-content-input-'.length);
  showSelectHighlightBtn(range, sectionKey);
}

function removeSelectHighlightBtn(){
  if(selectHighlightBtnEl){ selectHighlightBtnEl.remove(); selectHighlightBtnEl = null; }
}

function showSelectHighlightBtn(range, sectionKey){
  removeSelectHighlightBtn();
  const rect = range.getBoundingClientRect();
  if(!rect || (rect.width === 0 && rect.height === 0)) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'select-highlight-btn';
  btn.innerHTML = '🖍 하이라이트';
  const showAbove = rect.top > 44;
  btn.style.top = (showAbove ? rect.top - 38 : rect.bottom + 8) + 'px';
  document.body.appendChild(btn); // 너비를 알아야 가로 위치를 잡을 수 있어 일단 붙인다
  const btnWidth = btn.offsetWidth || 100;
  btn.style.left = Math.max(8, Math.min(window.innerWidth - btnWidth - 8, rect.left + rect.width/2 - btnWidth/2)) + 'px';
  // mousedown에서 preventDefault를 안 하면 버튼을 누르는 순간 선택이 풀려버린다.
  btn.addEventListener('mousedown', (ev) => ev.preventDefault());
  btn.addEventListener('click', () => {
    removeSelectHighlightBtn();
    addHighlightToSection(sectionKey);
  });
  selectHighlightBtnEl = btn;
}

async function addHighlightToSection(sectionKey){
  const el = document.getElementById('sec-content-input-' + sectionKey);
  if(!el) return;
  const sel = window.getSelection();
  if(!sel.rangeCount || sel.isCollapsed || !el.contains(sel.anchorNode)){
    showToast('먼저 하이라이트할 문구를 본문에서 선택해주세요');
    return;
  }
  const range = sel.getRangeAt(0).cloneRange();
  const quoteText = range.toString();
  if(!quoteText.trim()){ showToast('먼저 하이라이트할 문구를 본문에서 선택해주세요'); return; }

  let mark;
  try{
    mark = document.createElement('mark');
    mark.className = 'hl';
    range.surroundContents(mark);
  }catch(e){
    showToast('이 범위는 하이라이트할 수 없어요. 한 문단 안에서 다시 선택해주세요');
    return;
  }
  mark.style.setProperty('--hl-color', colorForUser(state.currentUser.id));
  mark.dataset.hlUser = state.currentUser.id;
  sel.removeAllRanges();

  const { highlight, error } = await createHighlightRow(state.currentProjectId, sectionKey, quoteText);
  if(!highlight){
    mark.replaceWith(...mark.childNodes); // 저장 실패 시 표시만 롤백 (텍스트는 그대로 둠)
    showToast('하이라이트 저장에 실패했어요' + (error ? ': ' + error.message : ''));
    return;
  }
  mark.dataset.hlId = highlight.id;
  state.highlights = state.highlights || [];
  state.highlights.push(highlight);
  refreshTocOnly(state.openProject);

  persistSectionAfterHighlightChange(sectionKey);
  broadcastHighlightEvent('create', highlight);
  openHighlightPopover(highlight.id, mark);
}

function closeHighlightPopover(){
  const pop = document.getElementById('highlight-popover');
  if(pop) pop.remove();
  document.removeEventListener('mousedown', hlPopoverOutsideClick, true);
}

function hlPopoverOutsideClick(e){
  const pop = document.getElementById('highlight-popover');
  if(pop && !pop.contains(e.target)) closeHighlightPopover();
}

function openHighlightPopover(highlightId, markEl){
  closeHighlightPopover();
  const h = (state.highlights || []).find(x => x.id === highlightId);
  if(!h || !markEl) return;
  const rect = markEl.getBoundingClientRect();
  const isMine = h.userId === (state.currentUser && state.currentUser.id);
  const color = colorForUser(h.userId);
  const isResolved = !!h.resolvedAt;

  const resolvedBadge = isResolved
    ? `<div class="hl-resolved-badge">✓ 해결됨 · <span>${escapeHtml(h.resolvedByName || '누군가')}</span></div>`
    : '';
  const noteSection = isMine
    ? `<textarea class="hl-popover-note-input" id="hl-note-input" placeholder="댓글을 남겨보세요">${escapeHtml(h.note)}</textarea>`
    : `<div class="hl-popover-note">${h.note ? escapeHtml(h.note) : '<i style="color:var(--ink-faint)">댓글 없음</i>'}</div>`;
  const resolveBtn = isResolved
    ? `<button class="btn secondary small" onclick="unresolveHighlight('${h.id}')">해결 취소</button>`
    : `<button class="btn secondary small" style="color:var(--stamp-green);border-color:var(--stamp-green);" onclick="resolveHighlight('${h.id}')">✓ 해결 완료</button>`;
  const deleteBtn = isMine
    ? `<button class="btn danger small" onclick="deleteHighlightAndUnwrap('${h.id}')">삭제</button>` : '';
  const saveBtn = isMine
    ? `<button class="btn small" onclick="saveHighlightNote('${h.id}')">저장</button>` : '';

  const pop = document.createElement('div');
  pop.id = 'highlight-popover';
  pop.className = 'hl-popover' + (isResolved ? ' hl-popover-resolved' : '');
  pop.style.left = Math.max(8, Math.min(window.innerWidth - 292, rect.left + window.scrollX)) + 'px';
  pop.style.top = (rect.bottom + window.scrollY + 6) + 'px';
  pop.innerHTML = `
    <div class="hl-popover-head">
      <span class="hl-popover-author" style="color:${color}">${escapeHtml(h.displayName || h.email || '알 수 없음')}</span>
      <span class="hl-popover-date">${fmtDate(h.createdAt)}</span>
    </div>
    <div class="hl-popover-quote">${escapeHtml(h.quoteText)}</div>
    ${resolvedBadge}
    ${noteSection}
    <div class="hl-popover-actions">
      ${deleteBtn}
      <span style="flex:1"></span>
      ${resolveBtn}
      ${saveBtn}
    </div>
  `;
  document.body.appendChild(pop);
  if(isMine){ const ta = document.getElementById('hl-note-input'); if(ta) ta.focus(); }
  setTimeout(() => document.addEventListener('mousedown', hlPopoverOutsideClick, true), 0);
}

async function saveHighlightNote(id){
  const input = document.getElementById('hl-note-input');
  if(!input) return;
  const note = input.value;
  const ok = await updateHighlightNoteRow(id, note);
  if(!ok){ showToast('저장에 실패했어요'); return; }
  const h = (state.highlights || []).find(x => x.id === id);
  if(h){ h.note = note; broadcastHighlightEvent('update', h); }
  showToast('댓글을 저장했어요');
  closeHighlightPopover();
  if(state.currentSectionKey === '__comments__' && state.openProject) renderCommentsManager(state.openProject);
}

async function deleteHighlightAndUnwrap(id){
  const h = (state.highlights || []).find(x => x.id === id);
  if(!h) return;
  if(h.userId !== (state.currentUser && state.currentUser.id)){
    showToast('본인이 작성한 댓글만 삭제할 수 있어요'); return;
  }
  const ok = await deleteHighlightRow(id);
  if(!ok){ showToast('삭제에 실패했어요'); return; }
  state.highlights = (state.highlights || []).filter(x => x.id !== id);
  closeHighlightPopover();
  const mark = document.querySelector(`mark.hl[data-hl-id="${id}"]`);
  if(mark){
    mark.replaceWith(...mark.childNodes);
    persistSectionAfterHighlightChange(h.sectionKey);
  }
  broadcastHighlightEvent('delete', h);
  if(state.openProject) refreshTocOnly(state.openProject);
  showToast('댓글을 삭제했어요');
  if(state.currentSectionKey === '__comments__' && state.openProject) renderCommentsManager(state.openProject);
}

async function resolveHighlight(id){
  const result = await resolveHighlightRow(id);
  if(!result){ showToast('해결 처리에 실패했어요'); return; }
  const h = (state.highlights || []).find(x => x.id === id);
  if(h){
    h.resolvedAt = result.resolvedAt;
    h.resolvedBy = result.resolvedBy;
    h.resolvedByName = result.resolvedByName;
    const mark = document.querySelector(`mark.hl[data-hl-id="${id}"]`);
    if(mark) mark.classList.add('hl-resolved');
    broadcastHighlightEvent('resolve', h);
  }
  closeHighlightPopover();
  showToast('해결 완료로 표시했어요');
  if(state.currentSectionKey === '__comments__' && state.openProject) renderCommentsManager(state.openProject);
  else if(state.openProject) refreshTocOnly(state.openProject);
}

async function unresolveHighlight(id){
  const ok = await unresolveHighlightRow(id);
  if(!ok){ showToast('해결 취소에 실패했어요'); return; }
  const h = (state.highlights || []).find(x => x.id === id);
  if(h){
    h.resolvedAt = null; h.resolvedBy = null; h.resolvedByName = '';
    const mark = document.querySelector(`mark.hl[data-hl-id="${id}"]`);
    if(mark) mark.classList.remove('hl-resolved');
    broadcastHighlightEvent('unresolve', h);
  }
  closeHighlightPopover();
  showToast('해결 완료를 취소했어요');
  if(state.currentSectionKey === '__comments__' && state.openProject) renderCommentsManager(state.openProject);
  else if(state.openProject) refreshTocOnly(state.openProject);
}

async function jumpToHighlight(id){
  const h = (state.highlights || []).find(x => x.id === id);
  if(!h) return;
  await selectSection(h.sectionKey);
  await new Promise(res => setTimeout(res, 350));
  const mark = document.querySelector(`mark.hl[data-hl-id="${id}"]`);
  if(!mark){ showToast('본문에서 이 하이라이트를 찾지 못했어요'); return; }
  mark.scrollIntoView({ behavior:'smooth', block:'center' });
  mark.classList.add('hl-flash');
  setTimeout(() => mark.classList.remove('hl-flash'), 1500);
  openHighlightPopover(id, mark);
}

async function jumpToLedgerItem(itemType, itemId){
  const sectionKeyMap = { figure:'__figures__', table:'__tables__', reference:'__refs__' };
  const selectFnMap = { figure: selectFigures, table: selectTables, reference: selectReferences };
  const attrMap = { figure:`[data-fig-id="${itemId}"]`, table:`[data-table-id="${itemId}"]`, reference:`[data-ref-id="${itemId}"]` };
  const selectFn = selectFnMap[itemType];
  if(!selectFn) return;
  await selectFn();
  await new Promise(res => setTimeout(res, 300));
  const card = document.querySelector(attrMap[itemType]);
  if(!card){ showToast('해당 항목을 찾지 못했어요'); return; }
  card.scrollIntoView({ behavior:'smooth', block:'center' });
  card.classList.add('ledger-card-flash');
  setTimeout(() => card.classList.remove('ledger-card-flash'), 1400);
}

function _itemTypeLabel(itemType, itemId, project){
  if(itemType === 'figure'){
    const fig = (state.figures||[]).find(f => f.id === itemId);
    const num = fig ? ((state.figureOrder||[]).indexOf(fig.id)+1) : '?';
    return `그림 ${num}${fig && fig.caption ? ' · '+fig.caption.slice(0,20)+(fig.caption.length>20?'…':'') : ''}`;
  }
  if(itemType === 'table'){
    const tbl = (state.tables||[]).find(t => t.id === itemId);
    const num = tbl ? ((state.tables||[]).indexOf(tbl)+1) : '?';
    return `표 ${num}${tbl && tbl.caption ? ' · '+tbl.caption.slice(0,20)+(tbl.caption.length>20?'…':'') : ''}`;
  }
  if(itemType === 'reference'){
    const ref = (state.references||[]).find(r => r.id === itemId);
    const num = ref ? ((state.references||[]).indexOf(ref)+1) : '?';
    return `참고문헌 [${num}]${ref && ref.text ? ' · '+ref.text.slice(0,20)+(ref.text.length>20?'…':'') : ''}`;
  }
  return itemType;
}

function renderCommentsManager(project, filter){
  const pane = document.getElementById('editor-pane');
  if(!filter) filter = state.commentFilter || 'open';

  if(state.highlightsLoadFailed){
    pane.innerHTML = `
      <div class="editor-head"><h2>댓글</h2></div>
      <div style="text-align:center;padding:56px 20px;">
        <div style="font-family:'Times New Roman','맑은 고딕',serif;font-size:17px;font-weight:600;margin-bottom:6px;">댓글 목록을 불러오지 못했어요</div>
        <div style="color:var(--ink-soft);font-size:13px;line-height:1.7;max-width:360px;margin:0 auto 18px;">일시적인 저장소 서버 오류예요. 잠시 후 다시 시도해주세요.</div>
        <button class="btn small" onclick="retryLoadHighlights()">다시 시도</button>
      </div>
    `;
    return;
  }

  state.commentFilter = filter;
  const allHighlights = state.highlights || [];
  const allItemComments = state.itemComments || [];
  const secs = getSections(project);
  const labelFor = (key) => (secs.find(s => s.key === key) || {}).label || key;
  const myId = state.currentUser && state.currentUser.id;

  const totalOpen = allHighlights.filter(h => !h.resolvedAt).length + allItemComments.filter(c => !c.resolvedAt).length;
  const totalResolved = allHighlights.filter(h => !!h.resolvedAt).length + allItemComments.filter(c => !!c.resolvedAt).length;

  // highlight cards
  const hlList = filter === 'resolved' ? allHighlights.filter(h => !!h.resolvedAt) : allHighlights.filter(h => !h.resolvedAt);
  const hlCards = hlList.map(h => {
    const color = colorForUser(h.userId);
    const isMine = h.userId === myId;
    const isResolved = !!h.resolvedAt;
    const resolvedInfo = isResolved
      ? `<div class="hl-resolved-badge" style="margin:4px 0 0;">✓ 해결됨 · <span>${escapeHtml(h.resolvedByName || '누군가')}</span></div>` : '';
    const resolveBtn = isResolved
      ? `<button class="btn secondary small" onclick="unresolveHighlight('${h.id}')">해결 취소</button>`
      : `<button class="btn secondary small" style="color:var(--stamp-green);border-color:var(--stamp-green);" onclick="resolveHighlight('${h.id}')">✓ 해결</button>`;
    const deleteBtn = isMine ? `<button class="btn danger small" onclick="deleteHighlightAndUnwrap('${h.id}')">삭제</button>` : '';
    return `
    <div class="ref-card${isResolved ? ' hl-card-resolved' : ''}">
      <div class="ref-num-badge" style="background:${color}22;color:${color};border-color:${color};">✎</div>
      <div class="ref-body">
        <div style="display:flex;justify-content:space-between;gap:8px;align-items:center;flex-wrap:wrap;">
          <span style="font-weight:600;font-size:12.5px;color:${color};">${escapeHtml(h.displayName || h.email || '알 수 없음')}</span>
          <div style="display:flex;gap:4px;">
            ${resolveBtn}
            <button class="btn secondary small" onclick="jumpToHighlight('${h.id}')">본문에서 보기</button>
            ${deleteBtn}
          </div>
        </div>
        <div style="font-size:11.5px;color:var(--ink-faint);font-family:'Courier New', '맑은 고딕', monospace;margin:4px 0;">본문 · ${escapeHtml(labelFor(h.sectionKey))} · ${fmtDate(h.createdAt)}</div>
        <div style="font-family:'Times New Roman', '맑은 고딕', serif;font-size:13.5px;color:${isResolved?'var(--ink-faint)':'var(--ink)'};border-left:3px solid ${color};padding-left:8px;margin-bottom:${h.note?'6px':'0'};">${escapeHtml(h.quoteText)}</div>
        ${h.note ? `<div style="font-size:12.5px;color:var(--ink-soft);line-height:1.5;white-space:pre-wrap;">${escapeHtml(h.note)}</div>` : ''}
        ${resolvedInfo}
      </div>
    </div>`;
  });

  // item comment cards
  const icList = filter === 'resolved' ? allItemComments.filter(c => !!c.resolvedAt) : allItemComments.filter(c => !c.resolvedAt);
  const icCards = icList.map(c => {
    const color = colorForUser(c.userId);
    const isMine = c.userId === myId;
    const isResolved = !!c.resolvedAt;
    const resolvedInfo = isResolved
      ? `<div class="hl-resolved-badge" style="margin:4px 0 0;">✓ 해결됨 · <span>${escapeHtml(c.resolvedByName || '누군가')}</span></div>` : '';
    const resolveBtn = isResolved
      ? `<button class="btn secondary small" onclick="unresolveItemComment('${c.id}','${c.itemType}','${c.itemId}')">해결 취소</button>`
      : `<button class="btn secondary small" style="color:var(--stamp-green);border-color:var(--stamp-green);" onclick="resolveItemComment('${c.id}','${c.itemType}','${c.itemId}')">✓ 해결</button>`;
    const deleteBtn = isMine ? `<button class="btn danger small" onclick="deleteItemComment('${c.id}','${c.itemType}','${c.itemId}')">삭제</button>` : '';
    const gotoBtn = `<button class="btn secondary small" onclick="jumpToLedgerItem('${c.itemType}','${c.itemId}')">바로 가기</button>`;
    const typeIconMap = { figure:'🖼', table:'📊', reference:'📚' };
    const typeIcon = typeIconMap[c.itemType] || '💬';
    return `
    <div class="ref-card${isResolved ? ' hl-card-resolved' : ''}">
      <div class="ref-num-badge" style="background:${color}22;color:${color};border-color:${color};">${typeIcon}</div>
      <div class="ref-body">
        <div style="display:flex;justify-content:space-between;gap:8px;align-items:center;flex-wrap:wrap;">
          <span style="font-weight:600;font-size:12.5px;color:${color};">${escapeHtml(c.displayName || c.email || '알 수 없음')}</span>
          <div style="display:flex;gap:4px;">
            ${resolveBtn}
            ${gotoBtn}
            ${deleteBtn}
          </div>
        </div>
        <div style="font-size:11.5px;color:var(--ink-faint);font-family:'Courier New', '맑은 고딕', monospace;margin:4px 0;">${escapeHtml(_itemTypeLabel(c.itemType, c.itemId, project))} · ${fmtDate(c.createdAt)}</div>
        <div style="font-size:13px;color:${isResolved?'var(--ink-faint)':'var(--ink)'};border-left:3px solid ${color};padding-left:8px;white-space:pre-wrap;word-break:break-word;">${escapeHtml(c.content)}</div>
        ${resolvedInfo}
      </div>
    </div>`;
  });

  // merge & sort by createdAt
  const allCards = [
    ...hlList.map((h,i) => ({ t: h.createdAt, html: hlCards[i] })),
    ...icList.map((c,i) => ({ t: c.createdAt, html: icCards[i] }))
  ].sort((a,b) => a.t - b.t).map(x => x.html);

  pane.innerHTML = `
    <div class="editor-head"><h2>댓글</h2><span class="section-limit">${totalOpen+totalResolved}개</span></div>
    <div class="editor-guidance" style="border-left-color:var(--stamp-green);color:var(--stamp-green);">본문에서 문구를 드래그해 선택하면 "🖍 하이라이트" 버튼이 나타나요. 그림·표·참고문헌 카드의 팀 댓글도 여기에 모여요.</div>
    <div style="display:flex;gap:6px;margin-bottom:12px;">
      <button class="btn${filter==='open'?' primary':' secondary'} small" onclick="renderCommentsManager(state.openProject,'open')">미해결 (${totalOpen})</button>
      <button class="btn${filter==='resolved'?' primary':' secondary'} small" onclick="renderCommentsManager(state.openProject,'resolved')">해결됨 (${totalResolved})</button>
    </div>
    <div class="fig-list">${allCards.join('') || `<div style="color:var(--ink-faint);font-size:13px;text-align:center;padding:20px 0;">${filter==='resolved'?'해결된 댓글이 없습니다':'미해결 댓글이 없습니다'}</div>`}</div>
  `;
}

function broadcastHighlightEvent(action, highlight){
  if(!state.realtimeChannel || !state.currentUser) return;
  state.realtimeChannel.send({
    type:'broadcast', event:'highlight',
    payload:{ action, highlight, fromUserId: state.currentUser.id }
  });
}

function handleRemoteHighlightEvent(payload){
  const { action, highlight, fromUserId } = payload || {};
  if(!highlight || fromUserId === (state.currentUser && state.currentUser.id)) return;
  state.highlights = state.highlights || [];

  if(action === 'create'){
    const idx = state.highlights.findIndex(h => h.id === highlight.id);
    if(idx === -1) state.highlights.push(highlight); else state.highlights[idx] = highlight;
    const hlAuthor = highlight.displayName || highlight.email || '누군가';
    const hlQuote = (highlight.quoteText || '').slice(0, 60);
    addNotification({
      type: 'highlight', author: hlAuthor,
      body: hlQuote ? `"${hlQuote}"` : '새 하이라이트가 추가됐어요',
      color: colorForUser(highlight.userId),
      action: { type: 'highlight', id: highlight.id }
    });
  } else if(action === 'update'){
    const idx = state.highlights.findIndex(h => h.id === highlight.id);
    if(idx === -1) state.highlights.push(highlight); else state.highlights[idx] = highlight;
  } else if(action === 'resolve' || action === 'unresolve'){
    const idx = state.highlights.findIndex(h => h.id === highlight.id);
    if(idx !== -1){
      state.highlights[idx].resolvedAt = highlight.resolvedAt;
      state.highlights[idx].resolvedBy = highlight.resolvedBy;
      state.highlights[idx].resolvedByName = highlight.resolvedByName;
    }
    const mark = document.querySelector(`mark.hl[data-hl-id="${highlight.id}"]`);
    if(mark) mark.classList.toggle('hl-resolved', action === 'resolve');
  } else if(action === 'delete'){
    state.highlights = state.highlights.filter(h => h.id !== highlight.id);
  }

  if(state.currentSectionKey === '__comments__' && state.openProject) renderCommentsManager(state.openProject);
  else if(state.openProject) refreshTocOnly(state.openProject);
}

/* ============== 실시간 알림 센터 ============== */
const NOTIF_ICONS = { chat:'💬', comment:'🗨️', highlight:'✏️', ledger:'📁' };
const NOTIF_LABELS = { chat:'팀 채팅', comment:'댓글', highlight:'하이라이트', ledger:'자료 추가' };

function addNotification({ type, author, body, color, action }){
  const notif = {
    id: 'n_' + Date.now() + '_' + Math.random().toString(36).slice(2,5),
    type, author, body, color, action,
    createdAt: Date.now(), read: false
  };
  state.notifications.unshift(notif);
  if(state.notifications.length > 60) state.notifications.pop();
  _renderNotifBadge();
  _showNotifToast(notif);
  return notif;
}

function _renderNotifBadge(){
  const badge = document.getElementById('notif-badge');
  if(!badge) return;
  const unread = state.notifications.filter(n => !n.read).length;
  badge.textContent = unread > 9 ? '9+' : String(unread);
  badge.style.display = unread > 0 ? '' : 'none';
}

function _showNotifToast(notif){
  const el = document.createElement('div');
  el.className = 'notif-toast';
  el.innerHTML = `
    <div class="notif-toast-head">
      <span class="notif-toast-dot" style="background:${notif.color}"></span>
      <span class="notif-toast-type">${NOTIF_ICONS[notif.type] || ''} ${NOTIF_LABELS[notif.type] || ''}</span>
      <strong class="notif-toast-author" style="color:${notif.color};">${escapeHtml(notif.author)}</strong>
    </div>
    <div class="notif-toast-body">${escapeHtml(notif.body)}</div>
  `;
  el.addEventListener('click', () => { el.remove(); _executeNotifAction(notif); });
  document.body.appendChild(el);
  playNotificationSound();
  setTimeout(() => { el.classList.add('notif-toast-hide'); setTimeout(() => el.remove(), 400); }, 5000);
}

function toggleNotifPanel(){
  const panel = document.getElementById('notif-panel');
  if(!panel) return;
  const open = panel.classList.toggle('notif-panel-open');
  if(open){
    state.notifications.forEach(n => { n.read = true; });
    _renderNotifBadge();
    _renderNotifList();
  }
}

function _renderNotifList(){
  const el = document.getElementById('notif-list');
  if(!el) return;
  if(!state.notifications.length){
    el.innerHTML = '<div class="notif-empty">새 알림이 없어요</div>';
    return;
  }
  el.innerHTML = state.notifications.map(n => `
    <div class="notif-row" data-notif-id="${n.id}">
      <span class="notif-row-dot" style="background:${n.color}"></span>
      <div class="notif-row-content">
        <div class="notif-row-meta">
          <span class="notif-row-type">${NOTIF_ICONS[n.type] || ''} ${NOTIF_LABELS[n.type] || ''}</span>
          <span class="notif-row-author" style="color:${n.color};">${escapeHtml(n.author)}</span>
          <span class="notif-row-time">${fmtChatTime(n.createdAt)}</span>
        </div>
        <div class="notif-row-body">${escapeHtml(n.body)}</div>
      </div>
    </div>
  `).join('');
  el.querySelectorAll('.notif-row[data-notif-id]').forEach(row => {
    row.addEventListener('click', () => {
      const notif = state.notifications.find(n => n.id === row.dataset.notifId);
      if(!notif) return;
      document.getElementById('notif-panel').classList.remove('notif-panel-open');
      _executeNotifAction(notif);
    });
  });
}

function _executeNotifAction(notif){
  const a = notif.action;
  if(!a) return;
  if(a.type === 'chat' || a.type === 'members') selectMembers();
  else if(a.type === 'figure') selectFigures();
  else if(a.type === 'table') selectTables();
  else if(a.type === 'reference') selectReferences();
  else if(a.type === 'highlight') jumpToHighlight(a.id);
  else if(a.type === 'section'){
    const map = { '__refs__': selectReferences, '__figures__': selectFigures,
                  '__tables__': selectTables, '__comments__': selectComments, '__members__': selectMembers };
    if(map[a.key]) map[a.key]();
  }
}

function clearAllNotifs(){
  state.notifications = [];
  _renderNotifBadge();
  _renderNotifList();
}

// 패널 바깥 클릭 시 닫기
document.addEventListener('click', (e) => {
  const wrapper = document.getElementById('notif-wrapper');
  const panel = document.getElementById('notif-panel');
  if(panel && panel.classList.contains('notif-panel-open') && wrapper && !wrapper.contains(e.target)){
    panel.classList.remove('notif-panel-open');
  }
});

function showCommentNotification(h){
  const author = h.displayName || h.email || '누군가';
  const quote = (h.quoteText || '').slice(0, 40) + ((h.quoteText || '').length > 40 ? '…' : '');
  const color = colorForUser(h.userId);
  const el = document.createElement('div');
  el.className = 'comment-notif';
  el.innerHTML = `
    <div class="comment-notif-head">
      <span class="comment-notif-dot" style="background:${color}"></span>
      <strong>${escapeHtml(author)}</strong>가 새 댓글을 남겼어요
    </div>
    <div class="comment-notif-quote">"${escapeHtml(quote)}"</div>
  `;
  el.addEventListener('click', () => { el.remove(); jumpToHighlight(h.id); });
  document.body.appendChild(el);
  playNotificationSound();
  setTimeout(() => { el.classList.add('comment-notif-hide'); setTimeout(() => el.remove(), 400); }, 5000);
}

function playNotificationSound(){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [880, 1108, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine'; osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t); osc.stop(t + 0.25);
    });
    setTimeout(() => ctx.close(), 1500);
  }catch(e){}
}

/* ============== ITEM COMMENTS (그림·표·참고문헌 쓰레드 댓글) ============== */

function mapItemCommentRow(row){
  return {
    id: row.id, projectId: row.project_id,
    itemType: row.item_type, itemId: row.item_id,
    userId: row.user_id, content: row.content,
    createdAt: new Date(row.created_at).getTime(),
    displayName: row.profiles ? row.profiles.display_name : '',
    email: row.profiles ? row.profiles.email : '',
    resolvedAt: row.resolved_at ? new Date(row.resolved_at).getTime() : null,
    resolvedBy: row.resolved_by || null,
    resolvedByName: row.resolver ? row.resolver.display_name : null
  };
}

async function listItemComments(projectId){
  for(let i=0; i<3; i++){
    const { data, error } = await window.sb.from('item_comments')
      .select('id,project_id,item_type,item_id,user_id,content,created_at,resolved_at,resolved_by,profiles:user_id(display_name,email),resolver:resolved_by(display_name)')
      .eq('project_id', projectId)
      .order('created_at', { ascending:true });
    if(!error) return { itemComments: (data||[]).map(mapItemCommentRow) };
    await new Promise(res => setTimeout(res, 400*(i+1)));
  }
  return { itemComments: [] };
}

async function createItemComment(projectId, itemType, itemId, content){
  const session = await getSession();
  if(!session) return null;
  const { data, error } = await window.sb.from('item_comments').insert({
    project_id: projectId, item_type: itemType, item_id: itemId,
    user_id: session.user.id, content
  }).select('id,project_id,item_type,item_id,user_id,content,created_at').single();
  if(error){ console.error('댓글 추가 실패:', error); return null; }
  const profile = state.currentUser && state.currentUser.profile;
  return mapItemCommentRow(Object.assign({}, data, { profiles: profile }));
}

async function deleteItemCommentRow(id){
  const { error } = await window.sb.from('item_comments').delete().eq('id', id);
  if(error){ console.error('댓글 삭제 실패:', error); return false; }
  return true;
}

async function resolveItemCommentRow(id){
  const session = await getSession();
  if(!session) return null;
  const now = new Date().toISOString();
  const { data, error } = await window.sb.from('item_comments')
    .update({ resolved_at: now, resolved_by: session.user.id })
    .eq('id', id)
    .select('resolved_at,resolved_by,resolver:resolved_by(display_name)').single();
  if(error){ console.error('해결 처리 실패:', error); return null; }
  return { resolvedAt: new Date(data.resolved_at).getTime(), resolvedBy: data.resolved_by, resolvedByName: data.resolver ? data.resolver.display_name : null };
}

async function unresolveItemCommentRow(id){
  const { error } = await window.sb.from('item_comments')
    .update({ resolved_at: null, resolved_by: null }).eq('id', id);
  if(error){ console.error('해결 취소 실패:', error); return false; }
  return true;
}

async function resolveItemComment(id, itemType, itemId){
  const result = await resolveItemCommentRow(id);
  if(!result){ showToast('해결 처리에 실패했어요'); return; }
  const c = (state.itemComments||[]).find(x => x.id === id);
  if(c){ Object.assign(c, result); }
  refreshItemThread(itemType, itemId);
  if(state.currentSectionKey === '__comments__') renderCommentsManager(state.openProject);
  broadcastItemCommentEvent('resolve', { id, itemType, itemId, ...result });
}

async function unresolveItemComment(id, itemType, itemId){
  const ok = await unresolveItemCommentRow(id);
  if(!ok){ showToast('해결 취소에 실패했어요'); return; }
  const c = (state.itemComments||[]).find(x => x.id === id);
  if(c){ c.resolvedAt = null; c.resolvedBy = null; c.resolvedByName = null; }
  refreshItemThread(itemType, itemId);
  if(state.currentSectionKey === '__comments__') renderCommentsManager(state.openProject);
  broadcastItemCommentEvent('unresolve', { id, itemType, itemId });
}

function itemCommentsFor(itemType, itemId){
  return (state.itemComments || []).filter(c => c.itemType === itemType && c.itemId === itemId);
}

function _icRowHtml(c, itemType, itemId, myId){
  const color = colorForUser(c.userId);
  const isMine = c.userId === myId;
  const isResolved = !!c.resolvedAt;
  const resolveBtn = isResolved
    ? `<button class="ic-resolve-btn ic-resolved" title="해결 취소" onclick="unresolveItemComment('${c.id}','${itemType}','${itemId}')">✓</button>`
    : `<button class="ic-resolve-btn" title="해결로 표시" onclick="resolveItemComment('${c.id}','${itemType}','${itemId}')">✓</button>`;
  const deleteBtn = isMine ? `<button class="ic-delete-btn" title="삭제" onclick="deleteItemComment('${c.id}','${itemType}','${itemId}')">✕</button>` : '';
  const resolvedBadge = isResolved ? `<span class="ic-resolved-badge">해결됨 · ${escapeHtml(c.resolvedByName||'누군가')}</span>` : '';
  return `<div class="ic-row${isResolved?' ic-row-resolved':''}" data-ic-id="${c.id}">
    <span class="ic-avatar" style="background:${color}22;color:${color};border-color:${color};">${escapeHtml(((c.displayName||c.email||'?').trim()[0]||'?').toUpperCase())}</span>
    <div class="ic-body">
      <div class="ic-meta"><span class="ic-author" style="color:${color};">${escapeHtml(c.displayName||c.email||'알 수 없음')}</span><span class="ic-date">${fmtDate(c.createdAt)}</span>${resolvedBadge}</div>
      <div class="ic-text">${escapeHtml(c.content)}</div>
    </div>
    <div class="ic-actions">${resolveBtn}${deleteBtn}</div>
  </div>`;
}

function renderItemThreadHtml(itemType, itemId){
  const comments = itemCommentsFor(itemType, itemId);
  const myId = state.currentUser && state.currentUser.id;
  const rows = comments.map(c => _icRowHtml(c, itemType, itemId, myId)).join('');
  return `<div class="ic-thread" id="ic-thread-${itemType}-${itemId}">${rows || '<div class="ic-empty">아직 댓글이 없어요</div>'}</div>
    <div class="ic-input-row">
      <input type="text" class="ic-input" id="ic-input-${itemType}-${itemId}" placeholder="댓글 남기기…" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();submitItemComment('${itemType}','${itemId}');}"/>
      <button class="btn small" onclick="submitItemComment('${itemType}','${itemId}')">등록</button>
    </div>`;
}

async function submitItemComment(itemType, itemId){
  const input = document.getElementById(`ic-input-${itemType}-${itemId}`);
  if(!input) return;
  const content = input.value.trim();
  if(!content){ showToast('댓글 내용을 입력해주세요'); return; }
  input.value = '';
  const comment = await createItemComment(state.currentProjectId, itemType, itemId, content);
  if(!comment){ showToast('댓글 등록에 실패했어요'); return; }
  state.itemComments = state.itemComments || [];
  state.itemComments.push(comment);
  refreshItemThread(itemType, itemId);
  if(state.currentSectionKey === '__comments__') renderCommentsManager(state.openProject);
  broadcastItemCommentEvent('create', comment);
}

async function deleteItemComment(id, itemType, itemId){
  const ok = await deleteItemCommentRow(id);
  if(!ok){ showToast('댓글 삭제에 실패했어요'); return; }
  state.itemComments = (state.itemComments || []).filter(c => c.id !== id);
  refreshItemThread(itemType, itemId);
  if(state.currentSectionKey === '__comments__') renderCommentsManager(state.openProject);
  broadcastItemCommentEvent('delete', { id, itemType, itemId });
}

function refreshItemThread(itemType, itemId){
  const el = document.getElementById(`ic-thread-${itemType}-${itemId}`);
  if(!el) return;
  const comments = itemCommentsFor(itemType, itemId);
  const myId = state.currentUser && state.currentUser.id;
  el.innerHTML = comments.map(c => _icRowHtml(c, itemType, itemId, myId)).join('') || '<div class="ic-empty">아직 댓글이 없어요</div>';
}

function broadcastItemCommentEvent(action, comment){
  if(!state.realtimeChannel || !state.currentUser) return;
  state.realtimeChannel.send({
    type:'broadcast', event:'item_comment',
    payload:{ action, comment, fromUserId: state.currentUser.id }
  });
}

function handleRemoteItemCommentEvent(payload){
  const { action, comment, fromUserId } = payload || {};
  if(!comment || fromUserId === (state.currentUser && state.currentUser.id)) return;
  state.itemComments = state.itemComments || [];

  const isChat = comment.itemType === 'chat';

  if(action === 'create'){
    if(!state.itemComments.find(c => c.id === comment.id)) state.itemComments.push(comment);
    const _author = comment.displayName || comment.email || '누군가';
    const _color  = colorForUser(comment.userId);
    if(isChat){
      refreshChatPanel();
      addNotification({
        type: 'chat', author: _author,
        body: (comment.content || '').slice(0, 60),
        color: _color,
        action: { type: 'members' }
      });
    } else {
      refreshItemThread(comment.itemType, comment.itemId);
      addNotification({
        type: 'comment', author: _author,
        body: (comment.content || '').slice(0, 60),
        color: _color,
        action: { type: comment.itemType, id: comment.itemId }
      });
    }
  } else if(action === 'delete'){
    state.itemComments = state.itemComments.filter(c => c.id !== comment.id);
    if(isChat) refreshChatPanel();
    else refreshItemThread(comment.itemType, comment.itemId);
  } else if(action === 'resolve' || action === 'unresolve'){
    const c = state.itemComments.find(x => x.id === comment.id);
    if(c){
      c.resolvedAt = comment.resolvedAt || null;
      c.resolvedBy = comment.resolvedBy || null;
      c.resolvedByName = comment.resolvedByName || null;
      refreshItemThread(c.itemType, c.itemId);
    }
  }
  if(state.currentSectionKey === '__comments__') renderCommentsManager(state.openProject);
}

function showChatNotification(author, text, color){
  const el = document.createElement('div');
  el.className = 'chat-notif';
  el.innerHTML = `
    <div class="chat-notif-head">
      <span class="chat-notif-dot" style="background:${color}"></span>
      <strong>${escapeHtml(author)}</strong>
    </div>
    <div class="chat-notif-body">${escapeHtml(text)}</div>
  `;
  el.addEventListener('click', () => { el.remove(); selectMembers(); });
  document.body.appendChild(el);
  playNotificationSound();
  setTimeout(() => { el.classList.add('comment-notif-hide'); setTimeout(() => el.remove(), 400); }, 5000);
}

/* ============== REF LEDGER (참고문헌 관리) ============== */
let refFormOpen = false;

function renderRefManager(project){
  const pane = document.getElementById('editor-pane');

  if(state.referencesLoadFailed){
    pane.innerHTML = `
      <div class="editor-head"><h2>Ref Ledger</h2></div>
      <div style="text-align:center;padding:56px 20px;">
        <div style="font-family:'Times New Roman','맑은 고딕',serif;font-size:17px;font-weight:600;margin-bottom:6px;">참고문헌 목록을 불러오지 못했어요</div>
        <div style="color:var(--ink-soft);font-size:13px;line-height:1.7;max-width:360px;margin:0 auto 18px;">일시적인 저장소 서버 오류예요. 등록하신 참고문헌이 삭제된 게 아니니 안심하세요 — 잠시 후 다시 시도해주세요.</div>
        <button class="btn small" onclick="retryLoadReferences()">다시 시도</button>
      </div>
    `;
    return;
  }

  const refs = state.references || [];

  const addForm = refFormOpen ? `
    <div class="ref-add-form" id="ref-add-form">
      <textarea id="ref-new-text" placeholder="전체 참고문헌 텍스트를 붙여넣거나 직접 입력하세요 (예: H.J. Kim, et al., Microstructure evolution in Al-Mg-Si alloys, Acta Mater. 68 (2021) 112–120.)"></textarea>
      <input type="text" id="ref-new-doi" placeholder="DOI 또는 링크 (선택)" />
      <label class="fig-field-label" style="margin-top:4px;">메모 (선택)</label>
      <textarea id="ref-new-memo" class="ref-memo-input" placeholder="핵심 내용, 인용 이유 등 간단한 메모를 남겨보세요"></textarea>
      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:4px;">
        <button class="btn secondary small" onclick="cancelAddReference()">취소</button>
        <button class="btn small" onclick="submitReference()">추가</button>
      </div>
    </div>
  ` : `<button class="btn secondary small" style="margin-bottom:16px;" onclick="showAddReferenceForm()">＋ 참고문헌 추가</button>`;

  const citedNums = project ? computeRefCitedNumbers(project) : new Set();
  const totalUncited = refs.filter((r, i) => !citedNums.has(i + 1)).length;
  const citedCount = refs.length - totalUncited;
  let uncitedRankCounter = 0;

  const cards = refs.map((r, i) => {
    const num = i + 1;
    const isCited = citedNums.has(num);
    const badge = isCited ? `[${num}]` : '—';
    const badgeStyle = isCited ? '' : 'opacity:0.35;font-size:12px;letter-spacing:0;';

    let leftCol;
    if(isCited){
      leftCol = `<div class="fig-drag-handle" title="끌어서 순서 변경">⋮⋮</div>`;
    } else {
      uncitedRankCounter++;
      leftCol = `
        <div class="ref-left-col">
          <div class="fig-drag-handle" title="끌어서 순서 변경">⋮⋮</div>
          <input class="ref-pos-input" type="number" min="${citedCount + 1}" max="${citedCount + totalUncited}" value="${citedCount + uncitedRankCounter}" data-ref-id="${r.id}" data-cited-count="${citedCount}" title="전체 목록 기준 순서 — 인용된 ${citedCount}개 다음(${citedCount + 1}~${citedCount + totalUncited}) 범위에서 이동 (Enter)" />
        </div>`;
    }

    return `
    <div class="ref-card" draggable="true" data-ref-id="${r.id}">
      ${leftCol}
      <div class="ref-num-badge" style="${badgeStyle}">${badge}</div>
      <div class="ref-body">
        <div style="display:flex;justify-content:flex-end;align-items:center;gap:8px;margin-bottom:6px;">
          <div class="fig-actions">
            <button class="fig-delete" title="삭제" onclick="removeReference('${r.id}')">✕</button>
          </div>
        </div>
        <textarea class="ref-text-input" data-ref-id="${r.id}" data-field="text" placeholder="전체 참고문헌 텍스트">${escapeHtml(r.text||'')}</textarea>
        <input type="text" class="ref-doi-input" data-ref-id="${r.id}" data-field="doi" value="${escapeHtml(r.doi||'')}" placeholder="DOI 또는 링크 (선택)" />
        <label class="fig-field-label">메모</label>
        <textarea class="ref-memo-input" data-ref-id="${r.id}" data-field="memo" placeholder="이 논문에 대한 간단한 메모를 남겨보세요 (핵심 내용, 인용 이유 등)">${escapeHtml(r.memo||'')}</textarea>
        <label class="fig-field-label fig-field-label-note">팀 댓글</label>
        ${renderItemThreadHtml('reference', r.id)}
      </div>
    </div>
  `;}).join('');

  pane.innerHTML = `
    <div class="editor-head"><h2>Ref Ledger</h2><span class="section-limit">${refs.length}개</span></div>
    <div class="editor-guidance" style="border-left-color:var(--stamp-green);color:var(--stamp-green);">참고문헌을 등록하면 본문에 인용할 수 있어요. 본문 섹션에서 "＋ 인용 삽입" 버튼을 누르면 [번호] 형태로 삽입되며, <b>번호는 본문 첫 인용 순서에 따라 자동으로 부여됩니다.</b> 인용이 없는 참고문헌은 번호가 없어요 (—). 카드를 끌어다 놓아(⋮⋮) 미인용 항목의 순서를 정리할 수 있어요.</div>

    ${addForm}
    <div class="fig-list" id="ref-list">${cards || `<div style="color:var(--ink-faint);font-size:13px;text-align:center;padding:20px 0;">아직 등록한 참고문헌이 없습니다</div>`}</div>
  `;

  if(refFormOpen){
    document.getElementById('ref-new-text').focus();
  }

  pane.querySelectorAll('.ref-text-input, .ref-doi-input, .ref-memo-input').forEach(el => {
    el.addEventListener('input', (e) => {
      const ref = (state.references || []).find(r => r.id === e.target.dataset.refId);
      if(ref) ref[e.target.dataset.field] = e.target.value;
      scheduleRefSave();
      // 본문 References 섹션 실시간 업데이트 (text 필드 변경 시)
      if(e.target.dataset.field === 'text'){
        const refSecEl = document.querySelector('.ms-section[data-section-key="references"]');
        if(refSecEl && state.openProject){
          const refSec = getSections(state.openProject).find(s => isReferencesSection(s));
          if(refSec) refSecEl.innerHTML = referencesSectionInnerHtml(refSec);
        }
      }
    });
  });

  pane.querySelectorAll('.ref-pos-input').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if(e.key === 'Enter'){
        e.preventDefault();
        const cc = parseInt(input.dataset.citedCount, 10) || 0;
        const rank = parseInt(input.value, 10) - cc;
        if(!isNaN(rank) && rank >= 1) _moveUncitedRefToPosition(input.dataset.refId, rank);
      }
    });
  });

  // 드래그 앤 드롭 순서 변경
  let dragSrcId = null;
  pane.querySelectorAll('.ref-card').forEach(card => {
    card.addEventListener('dragstart', (e) => {
      dragSrcId = card.dataset.refId;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', card.dataset.refId);
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      if(card.dataset.refId !== dragSrcId) card.classList.add('drag-over');
    });
    card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
    card.addEventListener('drop', (e) => {
      e.preventDefault();
      card.classList.remove('drag-over');
      const targetId = card.dataset.refId;
      if(dragSrcId && dragSrcId !== targetId) reorderReferences(dragSrcId, targetId);
    });
  });
}

function showAddReferenceForm(){
  refFormOpen = true;
  getProject(state.currentProjectId).then(p => { if(p) renderWorkspace(p); });
}
function cancelAddReference(){
  refFormOpen = false;
  getProject(state.currentProjectId).then(p => { if(p) renderWorkspace(p); });
}

async function submitReference(){
  const text = document.getElementById('ref-new-text').value.trim();
  const doi = document.getElementById('ref-new-doi').value.trim();
  const memo = document.getElementById('ref-new-memo').value.trim();
  if(!text){ showToast('참고문헌 전체 텍스트를 입력해주세요'); return; }
  state.references = state.references || [];
  state.references.push({
    id: 'ref_' + Date.now() + '_' + Math.random().toString(36).slice(2,6),
    text, doi, memo, addedAt: Date.now()
  });
  broadcastLedgerAdd('reference', text.slice(0, 60));
  refFormOpen = false;
  const project = await getProject(state.currentProjectId);
  if(project){
    // 새 참고문헌 추가 후 body-order 정렬 (본문에 이미 인용된 번호가 있을 때 대응)
    const changed = autoSortRefsByBodyOrder(project, state.references);
    await Promise.all([
      setReferences(state.currentProjectId, state.references),
      changed ? setProject(project) : Promise.resolve()
    ]);
    renderWorkspace(project);
  } else {
    await setReferences(state.currentProjectId, state.references);
    showToast('참고문헌 저장에 실패했어요. 다시 시도해주세요');
  }
}

async function moveReference(id, dir){
  const refs = state.references || [];
  const idx = refs.findIndex(r => r.id === id);
  const target = idx + dir;
  if(idx < 0 || target < 0 || target >= refs.length) return;
  [refs[idx], refs[target]] = [refs[target], refs[idx]];
  const project = await getProject(state.currentProjectId);
  if(!project){ await setReferences(state.currentProjectId, refs); return; }
  const changed = autoSortRefsByBodyOrder(project, refs);
  await Promise.all([
    setReferences(state.currentProjectId, refs),
    changed ? setProject(project) : Promise.resolve()
  ]);
  renderWorkspace(project);
}

async function reorderReferences(srcId, targetId){
  const refs = state.references || [];
  const srcIdx = refs.findIndex(r => r.id === srcId);
  const targetIdx = refs.findIndex(r => r.id === targetId);
  if(srcIdx === -1 || targetIdx === -1 || srcIdx === targetIdx) return;
  const [moved] = refs.splice(srcIdx, 1);
  refs.splice(targetIdx, 0, moved);
  const project = await getProject(state.currentProjectId);
  if(!project){ await setReferences(state.currentProjectId, refs); return; }
  // 인용 번호는 본문 등장 순서로 자동 결정 — 드래그 후 재정렬
  const changed = autoSortRefsByBodyOrder(project, refs);
  await Promise.all([
    setReferences(state.currentProjectId, refs),
    changed ? setProject(project) : Promise.resolve()
  ]);
  renderWorkspace(project);
}

async function _moveUncitedRefToPosition(id, newRank){
  const refs = state.references || [];
  const project = state.openProject;
  const citedNums = project ? computeRefCitedNumbers(project) : new Set();

  const citedRefs = [];
  const uncitedRefs = [];
  refs.forEach((r, i) => {
    if(citedNums.has(i + 1)) citedRefs.push(r);
    else uncitedRefs.push(r);
  });

  const srcIdx = uncitedRefs.findIndex(r => r.id === id);
  if(srcIdx === -1) return;

  const targetIdx = Math.max(0, Math.min(newRank - 1, uncitedRefs.length - 1));
  if(srcIdx === targetIdx) return;

  const [moved] = uncitedRefs.splice(srcIdx, 1);
  uncitedRefs.splice(targetIdx, 0, moved);

  state.references = [...citedRefs, ...uncitedRefs];
  const ok = await setReferences(state.currentProjectId, state.references);
  if(!ok) showToast('저장하지 못했어요');

  const proj = await getProject(state.currentProjectId);
  renderWorkspace(proj || state.openProject);
}

async function removeReference(id){
  const refs = state.references || [];
  const idx = refs.findIndex(r => r.id === id);
  state.references = refs.filter(r => r.id !== id);
  const ok = await setReferences(state.currentProjectId, state.references);
  if(!ok) showToast('삭제 내용을 저장하지 못했어요');
  const project = await getProject(state.currentProjectId);
  if(!project){ renderWorkspace(state.openProject); return; }
  // 삭제된 참고문헌의 인용 토큰을 본문에서 제거하고, 남은 번호를 재정렬
  if(idx !== -1){
    const removedNum = idx + 1;
    let bodyChanged = false;
    const bracketRe = /(?:<span[^>]*class="[^"]*body-ref-token[^"]*"[^>]*>)?(\[\s*\d+(?:\s*[-–,]\s*\d+)*\s*\])(?:<\/span>)?/g;
    getSections(project).forEach(sec => {
      if(isReferencesSection(sec)) return;
      const original = project.content[sec.key] || '';
      if(!original) return;
      let touched = false;
      const text = original.replace(bracketRe, (whole, bracket) => {
        const nums = expandRefNumbers(bracket.slice(1,-1));
        const remapped = nums.filter(n => n !== removedNum).map(n => n > removedNum ? n-1 : n);
        if(remapped.length === nums.length && !nums.includes(removedNum)) return whole;
        touched = true;
        if(!remapped.length) return '';
        return `<span class="body-ref-token" contenteditable="false">[${compressRefNumbers(remapped)}]</span>`;
      });
      if(touched){ project.content[sec.key] = text; bodyChanged = true; }
    });
    if(bodyChanged){
      await setProject(project);
      showToast('인용 번호를 새 순서에 맞게 업데이트했어요');
    }
  }
  renderWorkspace(project);
}

function scheduleRefSave(){
  clearTimeout(state.refSaveTimer);
  state.refSaveTimer = setTimeout(async () => {
    await setReferences(state.currentProjectId, state.references || []);
  }, 500);
}

/* ============== References 섹션 (Ref Ledger 기반 자동 생성) ============== */
/* ============== AUTHOR LEDGER (저자 관리) ============== */
let authorFormOpen = false;
let newAuthorAffiliations = [];
let _editingDirectoryId = null;
let _editDirAffils = [];

// 소속이 여러 개인 저자를 지원한다. 예전 데이터는 단일 문자열 필드(affiliation)만
// 가지고 있을 수 있어 배열(affiliations)이 없으면 그걸로 대체한다.
function authorAffiliations(a){
  if(a.affiliations && a.affiliations.length) return a.affiliations;
  if(a.affiliation) return [a.affiliation];
  return [];
}

function renderAuthorManager(project){
  const pane = document.getElementById('editor-pane');

  if(state.authorsLoadFailed){
    pane.innerHTML = `
      <div class="editor-head"><h2>Author Ledger</h2></div>
      <div style="text-align:center;padding:56px 20px;">
        <div style="font-family:'Times New Roman','맑은 고딕',serif;font-size:17px;font-weight:600;margin-bottom:6px;">저자 목록을 불러오지 못했어요</div>
        <div style="color:var(--ink-soft);font-size:13px;line-height:1.7;max-width:360px;margin:0 auto 18px;">일시적인 저장소 서버 오류예요. 등록하신 저자 정보가 삭제된 게 아니니 안심하세요 — 잠시 후 다시 시도해주세요.</div>
        <button class="btn small" onclick="retryLoadAuthors()">다시 시도</button>
      </div>
    `;
    return;
  }

  const authors = state.authors || [];
  const directory = state.authorDirectory || [];

  const directoryHtml = directory.length ? directory.map(d => {
    if(d.id === _editingDirectoryId){
      const affilChips = _editDirAffils.length
        ? _editDirAffils.map((aff, i) => `<span class="affil-chip">${escapeHtml(aff)}<button type="button" onclick="removeEditDirAffil(${i})">✕</button></span>`).join('')
        : `<span class="affil-chip-empty">소속을 추가해주세요</span>`;
      return `
        <div class="author-directory-item adi-edit-form">
          <div style="flex:1;min-width:0;">
            <input type="text" id="edit-dir-name" value="${escapeHtml(d.name)}" placeholder="이름" style="width:100%;margin-bottom:6px;" />
            <div class="affil-chip-list" id="edit-dir-affil-chips" style="margin-bottom:6px;">${affilChips}</div>
            <div class="affil-add-row" style="margin-bottom:6px;">
              <input type="text" id="edit-dir-affil-input" placeholder="소속 입력 후 추가" />
              <button type="button" class="btn secondary small" onclick="addEditDirAffil()">＋ 소속</button>
            </div>
            <input type="text" id="edit-dir-email" value="${escapeHtml(d.email||'')}" placeholder="이메일 (선택)" style="width:100%;margin-bottom:6px;" />
            <input type="text" id="edit-dir-orcid" value="${escapeHtml(d.orcid||'')}" placeholder="ORCID (선택)" style="width:100%;margin-bottom:8px;" />
            <div style="display:flex;gap:8px;justify-content:flex-end;">
              <button class="btn secondary small" onclick="cancelEditDirectory()">취소</button>
              <button class="btn small" onclick="saveDirectoryEntry('${d.id}')">저장</button>
            </div>
          </div>
        </div>
      `;
    }
    return `
      <div class="author-directory-item">
        <div class="adi-info">
          <div class="adi-name">${escapeHtml(d.name)}</div>
          <div class="adi-affil">${escapeHtml(authorAffiliations(d).join('; '))}</div>
        </div>
        <button class="btn secondary small" onclick="addAuthorFromDirectory('${d.id}')">＋ 추가</button>
        <button class="icon-btn" title="편집" onclick="editDirectoryEntry('${d.id}')">✏</button>
        <button class="icon-btn" title="주소록에서 삭제" onclick="removeFromDirectory('${d.id}')">✕</button>
      </div>
    `;
  }).join('') : `<div class="author-directory-empty">저장된 저자가 없어요. 아래에서 새로 추가하면 주소록에도 저장할 수 있어요.</div>`;

  const newAuthorAffilChips = newAuthorAffiliations.length
    ? newAuthorAffiliations.map((aff, i) => `<span class="affil-chip">${escapeHtml(aff)}<button type="button" onclick="removeNewAuthorAffiliation(${i})">✕</button></span>`).join('')
    : `<span class="affil-chip-empty">소속이 여러 개면 하나씩 추가하세요</span>`;

  const addForm = authorFormOpen ? `
    <div class="author-add-form" id="author-add-form">
      <div style="font-size:12px;font-weight:600;color:var(--ink-soft);margin-bottom:8px;">주소록에서 선택</div>
      <div class="author-directory-list">${directoryHtml}</div>
      <div style="font-size:12px;font-weight:600;color:var(--ink-soft);margin:14px 0 8px;border-top:1px dashed var(--line);padding-top:12px;">새 저자 직접 입력</div>
      <input type="text" id="author-new-name" placeholder="이름 (예: Jiin Hwang)" />
      <div class="affil-chip-list" id="new-author-affil-chips">${newAuthorAffilChips}</div>
      <div class="affil-add-row" style="margin-bottom:8px;">
        <input type="text" id="author-new-affil-input" placeholder="소속 입력 후 추가 (예: Department of Materials Science, XYZ University)" />
        <button type="button" class="btn secondary small" onclick="addNewAuthorAffiliation()">＋ 소속 추가</button>
      </div>
      <input type="text" id="author-new-email" placeholder="이메일 (선택)" />
      <input type="text" id="author-new-orcid" placeholder="ORCID (선택)" />
      <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--ink-soft);margin-bottom:10px;">
        <input type="checkbox" id="author-new-save-directory" checked /> 주소록에도 저장해서 다음에 빠르게 추가하기
      </label>
      <div style="display:flex;gap:8px;justify-content:flex-end;">
        <button class="btn secondary small" onclick="cancelAddAuthor()">취소</button>
        <button class="btn small" onclick="submitNewAuthor()">추가</button>
      </div>
    </div>
  ` : `<button class="btn secondary small" style="margin-bottom:16px;" onclick="showAddAuthorForm()">＋ 저자 추가</button>`;

  const cards = authors.map((a, i) => `
    <div class="author-card" draggable="true" data-author-id="${a.id}">
      <div class="fig-drag-handle" title="끌어서 순서 변경">⋮⋮</div>
      <div class="ref-num-badge">${i+1}</div>
      <div class="author-body">
        <div class="author-row">
          <input type="text" class="author-name-input" data-author-id="${a.id}" data-field="name" value="${escapeHtml(a.name||'')}" placeholder="이름" style="flex:1;" />
        </div>
        <div class="author-affil-block">
          <div class="affil-chip-list" id="affil-chips-${a.id}">${
            authorAffiliations(a).length
              ? authorAffiliations(a).map((aff, ai) => `<span class="affil-chip">${escapeHtml(aff)}<button type="button" onclick="removeAuthorAffiliation('${a.id}', ${ai})">✕</button></span>`).join('')
              : `<span class="affil-chip-empty">소속 없음</span>`
          }</div>
          <input type="text" class="affil-add-input" data-author-id="${a.id}" placeholder="소속이 여러 개면 하나씩 입력 후 Enter" />
        </div>
        <div class="author-row author-contact-row">
          <input type="text" data-author-id="${a.id}" data-field="email" value="${escapeHtml(a.email||'')}" placeholder="이메일 (선택)" />
          <input type="text" data-author-id="${a.id}" data-field="orcid" value="${escapeHtml(a.orcid||'')}" placeholder="ORCID (선택)" />
        </div>
        <div class="author-flags">
          <label><input type="checkbox" data-author-id="${a.id}" data-flag="isCoFirst" ${a.isCoFirst?'checked':''}> 공동 1저자</label>
          <label><input type="checkbox" data-author-id="${a.id}" data-flag="isCorresponding" ${a.isCorresponding?'checked':''}> 교신저자</label>
        </div>
      </div>
      <div class="fig-actions" style="flex-direction:column;">
        <button title="위로" onclick="moveAuthor('${a.id}',-1)" ${i===0?'disabled style="opacity:.3;"':''}>↑</button>
        <button title="아래로" onclick="moveAuthor('${a.id}',1)" ${i===authors.length-1?'disabled style="opacity:.3;"':''}>↓</button>
        <button class="fig-delete" title="삭제" onclick="removeAuthor('${a.id}')">✕</button>
      </div>
    </div>
  `).join('');

  pane.innerHTML = `
    <div class="editor-head"><h2>Author Ledger</h2><span class="section-limit">${authors.length}명</span></div>
    <div class="editor-guidance" style="border-left-color:var(--stamp-green);color:var(--stamp-green);">저자를 추가하고 순서를 정하세요 (카드를 끌어다 놓거나(⋮⋮) 화살표 사용). "공동 1저자"와 "교신저자"는 순서와 별개로 체크할 수 있어요. Word로 내보낼 때 제목 아래 저자·소속·교신저자 안내가 자동으로 정리돼요.</div>
    ${addForm}
    <div class="fig-list" id="author-list">${cards || `<div style="color:var(--ink-faint);font-size:13px;text-align:center;padding:20px 0;">아직 등록한 저자가 없습니다</div>`}</div>
  `;

  if(authorFormOpen){
    const nameInput = document.getElementById('author-new-name');
    if(nameInput) nameInput.focus();
    const newAffilInput = document.getElementById('author-new-affil-input');
    if(newAffilInput) newAffilInput.addEventListener('keydown', (e) => {
      if(e.key === 'Enter'){ e.preventDefault(); addNewAuthorAffiliation(); }
    });
  }

  pane.querySelectorAll('.author-body input[data-field]').forEach(el => {
    el.addEventListener('input', (e) => {
      const author = (state.authors || []).find(a => a.id === e.target.dataset.authorId);
      if(author) author[e.target.dataset.field] = e.target.value;
      scheduleAuthorSave();
    });
  });
  pane.querySelectorAll('.affil-add-input').forEach(el => {
    el.addEventListener('keydown', (e) => {
      if(e.key === 'Enter'){ e.preventDefault(); addAuthorAffiliation(el.dataset.authorId, el); }
    });
  });
  pane.querySelectorAll('.author-flags input[type=checkbox]').forEach(el => {
    el.addEventListener('change', (e) => {
      const author = (state.authors || []).find(a => a.id === e.target.dataset.authorId);
      if(author) author[e.target.dataset.flag] = e.target.checked;
      scheduleAuthorSave();
    });
  });

  // 드래그 앤 드롭 순서 변경
  let dragSrcId = null;
  pane.querySelectorAll('.author-card').forEach(card => {
    card.addEventListener('dragstart', (e) => {
      dragSrcId = card.dataset.authorId;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', card.dataset.authorId);
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      if(card.dataset.authorId !== dragSrcId) card.classList.add('drag-over');
    });
    card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
    card.addEventListener('drop', (e) => {
      e.preventDefault();
      card.classList.remove('drag-over');
      const targetId = card.dataset.authorId;
      if(dragSrcId && dragSrcId !== targetId) reorderAuthors(dragSrcId, targetId);
    });
  });
}

function showAddAuthorForm(){
  authorFormOpen = true;
  newAuthorAffiliations = [];
  getProject(state.currentProjectId).then(p => { if(p) renderWorkspace(p); });
}
function cancelAddAuthor(){
  authorFormOpen = false;
  newAuthorAffiliations = [];
  getProject(state.currentProjectId).then(p => { if(p) renderWorkspace(p); });
}

function addNewAuthorAffiliation(){
  const input = document.getElementById('author-new-affil-input');
  const val = input.value.trim();
  if(!val) return;
  newAuthorAffiliations.push(val);
  input.value = '';
  const el = document.getElementById('new-author-affil-chips');
  if(el) el.innerHTML = newAuthorAffiliations.map((aff, i) => `<span class="affil-chip">${escapeHtml(aff)}<button type="button" onclick="removeNewAuthorAffiliation(${i})">✕</button></span>`).join('');
  input.focus();
}
function removeNewAuthorAffiliation(idx){
  newAuthorAffiliations.splice(idx, 1);
  const el = document.getElementById('new-author-affil-chips');
  if(el) el.innerHTML = newAuthorAffiliations.length
    ? newAuthorAffiliations.map((aff, i) => `<span class="affil-chip">${escapeHtml(aff)}<button type="button" onclick="removeNewAuthorAffiliation(${i})">✕</button></span>`).join('')
    : `<span class="affil-chip-empty">소속이 여러 개면 하나씩 추가하세요</span>`;
}

function renderAuthorAffilChips(authorId){
  const author = (state.authors || []).find(a => a.id === authorId);
  const el = document.getElementById('affil-chips-' + authorId);
  if(!author || !el) return;
  const list = authorAffiliations(author);
  el.innerHTML = list.length
    ? list.map((aff, i) => `<span class="affil-chip">${escapeHtml(aff)}<button type="button" onclick="removeAuthorAffiliation('${authorId}', ${i})">✕</button></span>`).join('')
    : `<span class="affil-chip-empty">소속 없음</span>`;
}
function addAuthorAffiliation(authorId, inputEl){
  const val = inputEl.value.trim();
  if(!val) return;
  const author = (state.authors || []).find(a => a.id === authorId);
  if(!author) return;
  author.affiliations = authorAffiliations(author);
  author.affiliations.push(val);
  delete author.affiliation;
  inputEl.value = '';
  renderAuthorAffilChips(authorId);
  scheduleAuthorSave();
}
function removeAuthorAffiliation(authorId, idx){
  const author = (state.authors || []).find(a => a.id === authorId);
  if(!author) return;
  author.affiliations = authorAffiliations(author);
  author.affiliations.splice(idx, 1);
  delete author.affiliation;
  renderAuthorAffilChips(authorId);
  scheduleAuthorSave();
}

async function addAuthorFromDirectory(directoryId){
  const entry = (state.authorDirectory || []).find(d => d.id === directoryId);
  if(!entry) return;
  state.authors = state.authors || [];
  state.authors.push({
    id: 'auth_' + Date.now() + '_' + Math.random().toString(36).slice(2,6),
    directoryId: entry.id,
    name: entry.name, affiliations: authorAffiliations(entry).slice(), email: entry.email, orcid: entry.orcid,
    isCoFirst:false, isCorresponding:false, addedAt: Date.now()
  });
  const ok = await setProjectAuthors(state.currentProjectId, state.authors);
  if(!ok) showToast('저자 저장에 실패했어요. 다시 시도해주세요');
  authorFormOpen = false;
  const project = await getProject(state.currentProjectId);
  if(project) renderWorkspace(project);
}

async function removeFromDirectory(directoryId){
  state.authorDirectory = (state.authorDirectory || []).filter(d => d.id !== directoryId);
  const ok = await setAuthorDirectory(state.authorDirectory);
  if(!ok) showToast('주소록 저장에 실패했어요');
  const panel = document.getElementById('author-add-form');
  if(panel){
    const project = await getProject(state.currentProjectId);
    if(project) renderWorkspace(project);
  }
}

function editDirectoryEntry(id){
  const entry = (state.authorDirectory || []).find(d => d.id === id);
  if(!entry) return;
  _editingDirectoryId = id;
  _editDirAffils = authorAffiliations(entry).slice();
  getProject(state.currentProjectId).then(p => { if(p) renderWorkspace(p); });
}

function cancelEditDirectory(){
  _editingDirectoryId = null;
  _editDirAffils = [];
  getProject(state.currentProjectId).then(p => { if(p) renderWorkspace(p); });
}

function addEditDirAffil(){
  const input = document.getElementById('edit-dir-affil-input');
  const val = input ? input.value.trim() : '';
  if(!val) return;
  _editDirAffils.push(val);
  if(input) input.value = '';
  const el = document.getElementById('edit-dir-affil-chips');
  if(el) el.innerHTML = _editDirAffils.map((aff, i) =>
    `<span class="affil-chip">${escapeHtml(aff)}<button type="button" onclick="removeEditDirAffil(${i})">✕</button></span>`
  ).join('') || `<span class="affil-chip-empty">소속을 추가해주세요</span>`;
}

function removeEditDirAffil(i){
  _editDirAffils.splice(i, 1);
  const el = document.getElementById('edit-dir-affil-chips');
  if(el) el.innerHTML = _editDirAffils.map((aff, j) =>
    `<span class="affil-chip">${escapeHtml(aff)}<button type="button" onclick="removeEditDirAffil(${j})">✕</button></span>`
  ).join('') || `<span class="affil-chip-empty">소속을 추가해주세요</span>`;
}

async function saveDirectoryEntry(id){
  const entry = (state.authorDirectory || []).find(d => d.id === id);
  if(!entry) return;
  const affilInput = document.getElementById('edit-dir-affil-input');
  if(affilInput && affilInput.value.trim()) _editDirAffils.push(affilInput.value.trim());
  const name = (document.getElementById('edit-dir-name') || {}).value?.trim() || entry.name;
  if(!name){ showToast('이름을 입력해주세요'); return; }
  entry.name = name;
  entry.affiliations = _editDirAffils.slice();
  delete entry.affiliation;
  entry.email = (document.getElementById('edit-dir-email') || {}).value?.trim() ?? entry.email;
  entry.orcid = (document.getElementById('edit-dir-orcid') || {}).value?.trim() ?? entry.orcid;
  const ok = await setAuthorDirectory(state.authorDirectory);
  if(!ok) showToast('주소록 저장에 실패했어요');
  _editingDirectoryId = null;
  _editDirAffils = [];
  const project = await getProject(state.currentProjectId);
  if(project) renderWorkspace(project);
}

async function submitNewAuthor(){
  const name = document.getElementById('author-new-name').value.trim();
  const affilInput = document.getElementById('author-new-affil-input');
  const pendingAffil = affilInput ? affilInput.value.trim() : '';
  if(pendingAffil) newAuthorAffiliations.push(pendingAffil); // 입력만 하고 추가 버튼을 안 눌렀어도 놓치지 않기
  const affiliations = newAuthorAffiliations.slice();
  const email = document.getElementById('author-new-email').value.trim();
  const orcid = document.getElementById('author-new-orcid').value.trim();
  const saveToDirectory = document.getElementById('author-new-save-directory').checked;
  if(!name){ showToast('저자 이름을 입력해주세요'); return; }

  let directoryId = null;
  if(saveToDirectory){
    directoryId = 'dir_' + Date.now() + '_' + Math.random().toString(36).slice(2,6);
    state.authorDirectory = state.authorDirectory || [];
    state.authorDirectory.push({ id: directoryId, name, affiliations, email, orcid, addedAt: Date.now() });
    const dirOk = await setAuthorDirectory(state.authorDirectory);
    if(!dirOk) showToast('주소록 저장에 실패했어요 (저자는 이번 프로젝트에는 추가돼요)');
  }

  state.authors = state.authors || [];
  state.authors.push({
    id: 'auth_' + Date.now() + '_' + Math.random().toString(36).slice(2,6),
    directoryId, name, affiliations, email, orcid,
    isCoFirst:false, isCorresponding:false, addedAt: Date.now()
  });
  const ok = await setProjectAuthors(state.currentProjectId, state.authors);
  if(!ok) showToast('저자 저장에 실패했어요. 다시 시도해주세요');
  authorFormOpen = false;
  newAuthorAffiliations = [];
  const project = await getProject(state.currentProjectId);
  if(project) renderWorkspace(project);
}

async function moveAuthor(id, dir){
  const authors = state.authors || [];
  const idx = authors.findIndex(a => a.id === id);
  const target = idx + dir;
  if(idx < 0 || target < 0 || target >= authors.length) return;
  [authors[idx], authors[target]] = [authors[target], authors[idx]];
  const ok = await setProjectAuthors(state.currentProjectId, authors);
  if(!ok) showToast('순서 저장에 실패했어요');
  const project = await getProject(state.currentProjectId);
  if(project) renderWorkspace(project);
}

async function reorderAuthors(srcId, targetId){
  const authors = state.authors || [];
  const srcIdx = authors.findIndex(a => a.id === srcId);
  const targetIdx = authors.findIndex(a => a.id === targetId);
  if(srcIdx === -1 || targetIdx === -1 || srcIdx === targetIdx) return;
  const [moved] = authors.splice(srcIdx, 1);
  authors.splice(targetIdx, 0, moved);
  const ok = await setProjectAuthors(state.currentProjectId, authors);
  if(!ok) showToast('순서 저장에 실패했어요');
  const project = await getProject(state.currentProjectId);
  if(project) renderWorkspace(project);
}

async function removeAuthor(id){
  state.authors = (state.authors || []).filter(a => a.id !== id);
  const ok = await setProjectAuthors(state.currentProjectId, state.authors);
  if(!ok) showToast('삭제 내용을 저장하지 못했어요');
  const project = await getProject(state.currentProjectId);
  if(project) renderWorkspace(project);
}

function scheduleAuthorSave(){
  clearTimeout(state.authorSaveTimer);
  state.authorSaveTimer = setTimeout(async () => {
    await setProjectAuthors(state.currentProjectId, state.authors || []);
  }, 500);
}

function openFigureLightbox(figId){
  const f = (state.figures || []).find(f => f.id === figId);
  if(!f) return;
  const src = figureSrc(f);
  if(!src) return;

  const lb = document.createElement('div');
  lb.className = 'fig-lightbox';
  lb.innerHTML = `
    <button class="fig-lightbox-close" title="닫기">✕</button>
    <img class="fig-lightbox-img" src="${src}" alt="${escapeHtml(f.fileName)}" />
    ${f.caption ? `<div class="fig-lightbox-caption">${escapeHtml(f.caption)}</div>` : ''}
  `;

  function close(){
    lb.classList.add('fig-lb-hide');
    setTimeout(() => lb.remove(), 200);
    document.removeEventListener('keydown', onKey);
  }

  lb.addEventListener('click', e => { if(e.target === lb) close(); });
  lb.querySelector('.fig-lightbox-close').addEventListener('click', close);

  function onKey(e){ if(e.key === 'Escape') close(); }
  document.addEventListener('keydown', onKey);

  document.body.appendChild(lb);
}

function triggerReplaceFigure(figId){
  const input = document.getElementById('fig-replace-input');
  if(!input) return;
  input.dataset.targetFigId = figId;
  input.click();
}

async function replaceFigureWithFile(figId, file){
  if(!file.type.startsWith('image/')){ showToast('이미지 파일만 선택해주세요'); return; }
  if(file.size > FIG_MAX_BYTES){ showToast('파일 크기가 25MB를 초과해요'); return; }

  const idx = (state.figures || []).findIndex(f => f.id === figId);
  if(idx === -1){ showToast('그림을 찾을 수 없어요'); return; }

  showToast('업로드 중…');

  const extMatch = /\.([a-zA-Z0-9]+)$/.exec(file.name || '');
  const ext = (extMatch ? extMatch[1] : 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
  const newPath = `${state.currentProjectId}/${Date.now()}_${Math.random().toString(36).slice(2,8)}.${ext}`;

  const { error: uploadError } = await window.sb.storage.from('figures').upload(newPath, file, { contentType: file.type || undefined });
  if(uploadError){ showToast('업로드에 실패했어요: ' + (uploadError.message || '다시 시도해주세요')); return; }

  const { data: pub } = window.sb.storage.from('figures').getPublicUrl(newPath);

  const oldPath = state.figures[idx].storagePath;
  state.figures[idx] = {
    ...state.figures[idx],
    fileName: file.name,
    storagePath: newPath,
    url: pub.publicUrl,
    cropData: undefined // 교체 시 이전 크롭은 초기화
  };

  const ok = await setFigures(state.currentProjectId, state.figures);
  if(!ok){ showToast('저장에 실패했어요. 다시 시도해주세요'); return; }

  if(oldPath) window.sb.storage.from('figures').remove([oldPath]).catch(() => {});

  showToast('그림이 교체됐어요');
  const project = await getProject(state.currentProjectId);
  if(project) renderWorkspace(project);
}

async function removeFigure(id){
  const beforeOrder = state.openProject ? computeFigureOrder(state.openProject, state.figures || []) : [];
  const removed = (state.figures || []).find(f => f.id === id);
  state.figures = (state.figures || []).filter(f => f.id !== id);
  const ok = await setFigures(state.currentProjectId, state.figures);
  if(!ok) showToast('삭제 내용을 저장하지 못했어요');
  if(removed && removed.storagePath){
    window.sb.storage.from('figures').remove([removed.storagePath]).catch(() => {}); // 실패해도 목록 삭제 자체는 이미 완료된 것으로 취급
  }
  const project = await getProject(state.currentProjectId);
  if(!project) return;
  const strippedBody = stripEmbeddedFigure(project, id);
  const renumbered = resyncFigureNumbering(beforeOrder, project, state.figures || []);
  if(strippedBody || renumbered){
    await setProject(project);
    if(renumbered) showToast('남은 그림 번호를 새 순서에 맞게 업데이트했어요');
  }
  renderWorkspace(project);
}

/* ============== 그림 자르기(Crop) ============== */
let cropState = null;

const CROP_HANDLES = ['nw','n','ne','e','se','s','sw','w'];
const CROP_MIN = 20; // px, 화면 표시 기준 최소 선택 크기

function openFigureCropModal(figureId){
  const fig = (state.figures || []).find(f => f.id === figureId);
  if(!fig) return;
  const root = document.getElementById('modal-root');
  const handlesHtml = CROP_HANDLES.map(h => `<div class="crop-handle crop-handle-${h}" data-handle="${h}"></div>`).join('');
  root.innerHTML = `<div class="modal-overlay" onclick="if(event.target===this) closeCropModal()">
    <div class="modal crop-modal">
      <div class="modal-head"><h2>그림 자르기</h2><button class="modal-close" onclick="closeCropModal()">✕</button></div>
      <div class="modal-body">
        <div class="crop-hint">기본으로 전체가 선택되어 있어요. 모서리나 가장자리의 점을 끌어서 남길 영역만 줄이세요. 본문에 이미 삽입돼 있다면 적용 즉시 그쪽도 같이 바뀝니다.</div>
        <div class="crop-stage" id="crop-stage">
          <img id="crop-img" src="${figureSrc(fig)}" crossorigin="anonymous" alt="" draggable="false" />
          <div class="crop-select" id="crop-select" style="display:none;">${handlesHtml}</div>
        </div>
        <div class="modal-actions">
          <button class="btn secondary" onclick="closeCropModal()">취소</button>
          <button class="btn" id="crop-apply-btn" disabled onclick="applyFigureCrop()">자르기 적용</button>
        </div>
      </div>
    </div>
  </div>`;

  const stage = document.getElementById('crop-stage');
  const img = document.getElementById('crop-img');
  const sel = document.getElementById('crop-select');

  cropState = {
    figureId, rect:null, dragMode:null, dragHandle:null,
    startPointerX:0, startPointerY:0, startRect:null, _cleanup:null
  };

  function renderSelection(){
    const r = cropState.rect;
    if(!r) return;
    sel.style.display = 'block';
    sel.style.left = r.x+'px'; sel.style.top = r.y+'px'; sel.style.width = r.w+'px'; sel.style.height = r.h+'px';
    const btn = document.getElementById('crop-apply-btn');
    if(btn) btn.disabled = false;
  }
  function initSelectionToFull(){
    cropState.rect = { x:0, y:0, w: stage.clientWidth, h: stage.clientHeight };
    renderSelection();
  }
  if(img.complete && img.naturalWidth) initSelectionToFull();
  else img.addEventListener('load', initSelectionToFull, { once:true });

  function pointerPos(e){
    const r = stage.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function clampRect(rect){
    const stageW = stage.clientWidth, stageH = stage.clientHeight;
    let { x, y, w, h } = rect;
    if(w < CROP_MIN) w = CROP_MIN;
    if(h < CROP_MIN) h = CROP_MIN;
    x = Math.min(Math.max(x, 0), stageW - w);
    y = Math.min(Math.max(y, 0), stageH - h);
    w = Math.min(w, stageW - x);
    h = Math.min(h, stageH - y);
    return { x, y, w, h };
  }

  const onHandleDown = (e) => {
    e.preventDefault(); e.stopPropagation();
    cropState.dragMode = 'resize';
    cropState.dragHandle = e.currentTarget.dataset.handle;
    const p = pointerPos(e);
    cropState.startPointerX = p.x; cropState.startPointerY = p.y;
    cropState.startRect = { ...cropState.rect };
  };
  const onSelectDown = (e) => {
    if(e.target.closest('.crop-handle')) return; // 핸들 클릭은 onHandleDown이 처리
    e.preventDefault();
    cropState.dragMode = 'move';
    const p = pointerPos(e);
    cropState.startPointerX = p.x; cropState.startPointerY = p.y;
    cropState.startRect = { ...cropState.rect };
  };
  const onMouseMove = (e) => {
    if(!cropState || !cropState.dragMode) return;
    const p = pointerPos(e);
    const dx = p.x - cropState.startPointerX;
    const dy = p.y - cropState.startPointerY;
    const s = cropState.startRect;
    let next = { ...s };
    if(cropState.dragMode === 'move'){
      next.x = s.x + dx; next.y = s.y + dy;
    } else {
      const h = cropState.dragHandle;
      if(h.includes('e')) next.w = s.w + dx;
      if(h.includes('s')) next.h = s.h + dy;
      if(h.includes('w')){ next.x = s.x + dx; next.w = s.w - dx; }
      if(h.includes('n')){ next.y = s.y + dy; next.h = s.h - dy; }
    }
    cropState.rect = clampRect(next);
    renderSelection();
  };
  const onMouseUp = () => { if(cropState) cropState.dragMode = null; };

  sel.querySelectorAll('.crop-handle').forEach(h => h.addEventListener('mousedown', onHandleDown));
  sel.addEventListener('mousedown', onSelectDown);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  cropState._cleanup = () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };
}

function closeCropModal(){
  if(cropState && cropState._cleanup) cropState._cleanup();
  cropState = null;
  document.getElementById('modal-root').innerHTML = '';
}

async function applyFigureCrop(){
  if(!cropState || !cropState.rect) return;
  const { figureId, rect } = cropState;
  const fig = (state.figures || []).find(f => f.id === figureId);
  const img = document.getElementById('crop-img');
  const btn = document.getElementById('crop-apply-btn');
  if(!fig || !img) return;
  if(!fig.storagePath){
    showToast('예전 방식으로 저장된 그림이라 자르기를 지원하지 않아요. 다시 업로드해주세요');
    return;
  }
  if(btn){ btn.disabled = true; btn.textContent = '자르는 중…'; }

  // 모달 위에 로딩 오버레이 표시
  const modalBox = document.querySelector('.crop-modal');
  let overlay = null;
  if(modalBox){
    overlay = document.createElement('div');
    overlay.className = 'crop-loading-overlay';
    overlay.innerHTML = '<div class="crop-spinner"></div><span>이미지 업로드 중…</span>';
    modalBox.appendChild(overlay);
  }
  const hideOverlay = () => { if(overlay) overlay.remove(); };

  const scaleX = img.naturalWidth / img.clientWidth;
  const scaleY = img.naturalHeight / img.clientHeight;
  const sx = Math.round(rect.x * scaleX);
  const sy = Math.round(rect.y * scaleY);
  const sw = Math.max(1, Math.round(rect.w * scaleX));
  const sh = Math.max(1, Math.round(rect.h * scaleY));

  const canvas = document.createElement('canvas');
  canvas.width = sw; canvas.height = sh;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

  canvas.toBlob(async (blob) => {
    if(!blob){
      hideOverlay();
      showToast('자르기에 실패했어요');
      if(btn){ btn.disabled = false; btn.textContent = '자르기 적용'; }
      return;
    }
    const { error: uploadError } = await window.sb.storage.from('figures').upload(fig.storagePath, blob, { contentType:'image/png', upsert:true });
    if(uploadError){
      hideOverlay();
      showToast('자르기 적용에 실패했어요: ' + (uploadError.message || '다시 시도해주세요'));
      if(btn){ btn.disabled = false; btn.textContent = '자르기 적용'; }
      return;
    }
    const { data: pub } = window.sb.storage.from('figures').getPublicUrl(fig.storagePath);
    // 저장 경로는 그대로라 URL 문자열이 같으면 브라우저가 예전 캐시를 보여줄 수
    // 있다 — 버전 쿼리를 붙여 강제로 새로 받아오게 한다.
    const newUrl = pub.publicUrl + (pub.publicUrl.includes('?') ? '&' : '?') + 'v=' + Date.now();
    fig.url = newUrl;
    const figOk = await setFigures(state.currentProjectId, state.figures);
    if(!figOk) showToast('그림 정보 저장에 실패했어요');

    const project = state.openProject;
    if(project && syncEmbeddedFigureImage(project, figureId, newUrl)){
      await setProject(project);
    }
    hideOverlay();
    closeCropModal();
    showToast('그림을 잘랐어요');
    const proj2 = await getProject(state.currentProjectId);
    if(proj2) renderWorkspace(proj2);
  }, 'image/png');
}

function scheduleFigureSave(){
  clearTimeout(state.figureSaveTimer);
  state.figureSaveTimer = setTimeout(async () => {
    await setFigures(state.currentProjectId, state.figures || []);
  }, 500);
}


function refreshTocOnly(project){
  const secs = getSections(project);
  const toc = document.querySelector('.toc');
  const isCustom = project.journalId === 'custom';
  const figCount = (state.figures || []).length;
  const refCount = (state.references || []).length;
  const authorCount = (state.authors || []).length;
  const tableCount = (state.tables || []).length;
  const memberCount = 1 + (state.members || []).length;
  const openCommentCount = (state.highlights || []).filter(h => !h.resolvedAt).length + (state.itemComments || []).filter(c => !c.resolvedAt).length;
  const membersBtn = `<button class="toc-item toc-figures ${state.currentSectionKey==='__members__'?'active':''}" data-section-key="__members__" onclick="selectMembers()">
      <span class="toc-num">☺</span>
      <span style="flex:1;text-align:left;">팀원${state.membersLoadFailed ? ' ⚠' : ` (${memberCount})`}</span>
      <span class="toc-dot" style="visibility:hidden;"></span>
    </button>`;
  const commentsBtn = `<button class="toc-item toc-figures ${state.currentSectionKey==='__comments__'?'active':''}" data-section-key="__comments__" onclick="selectComments()">
      <span class="toc-num">✎</span>
      <span style="flex:1;text-align:left;">댓글${state.highlightsLoadFailed ? ' ⚠' : (openCommentCount ? ` (${openCommentCount})` : '')}</span>
      <span class="toc-dot" style="visibility:hidden;"></span>
    </button>`;
  const authorsBtn = `<button class="toc-item toc-figures ${state.currentSectionKey==='__authors__'?'active':''}" data-section-key="__authors__" onclick="selectAuthors()">
      <span class="toc-num">✎</span>
      <span style="flex:1;text-align:left;">Author Ledger${state.authorsLoadFailed ? ' ⚠' : (authorCount ? ` (${authorCount})` : '')}</span>
      <span class="toc-dot" style="visibility:hidden;"></span>
    </button>`;
  const figuresBtn = `<button class="toc-item toc-figures ${state.currentSectionKey==='__figures__'?'active':''}" data-section-key="__figures__" onclick="selectFigures()">
      <span class="toc-num">▤</span>
      <span style="flex:1;text-align:left;">Fig Ledger${state.figuresLoadFailed ? ' ⚠' : (figCount ? ` (${figCount})` : '')}</span>
      <span class="toc-dot" style="visibility:hidden;"></span>
    </button>`;
  const tablesBtn = `<button class="toc-item toc-figures ${state.currentSectionKey==='__tables__'?'active':''}" data-section-key="__tables__" onclick="selectTables()">
      <span class="toc-num">▦</span>
      <span style="flex:1;text-align:left;">Table Ledger${state.tablesLoadFailed ? ' ⚠' : (tableCount ? ` (${tableCount})` : '')}</span>
      <span class="toc-dot" style="visibility:hidden;"></span>
    </button>`;
  const refsBtn = `<button class="toc-item toc-figures ${state.currentSectionKey==='__refs__'?'active':''}" data-section-key="__refs__" onclick="selectReferences()">
      <span class="toc-num">§</span>
      <span style="flex:1;text-align:left;">Ref Ledger${state.referencesLoadFailed ? ' ⚠' : (refCount ? ` (${refCount})` : '')}</span>
      <span class="toc-dot" style="visibility:hidden;"></span>
    </button>
    <div class="toc-divider"></div>`;
  const tocItems = secs.map((s,i)=>{
    const filled = isSectionFilled(project, s);
    return `<button class="toc-item ${s.key===state.currentSectionKey?'active':''} ${filled?'filled':''}" data-section-key="${s.key}" onclick="selectSection('${s.key}')">
      <span class="toc-num">${String(i+1).padStart(2,'0')}</span>
      <span style="flex:1;text-align:left;">${escapeHtml(s.label)}</span>
      <span class="toc-dot"></span>
    </button>`;
  }).join('');
  const currentStage2 = getStage(project);
  const statusBtn2 = `<button class="toc-item toc-figures ${state.currentSectionKey==='__status__'?'active':''}" data-section-key="__status__" onclick="selectStatus()">
      <span class="toc-num">◈</span>
      <span style="flex:1;text-align:left;">투고 현황</span>
      <span style="font-size:10px;font-weight:600;padding:1px 6px;border-radius:8px;background:${currentStage2.color}22;color:${currentStage2.color};white-space:nowrap;">${currentStage2.label}</span>
    </button>`;
  toc.innerHTML = statusBtn2 + membersBtn + commentsBtn + authorsBtn + figuresBtn + tablesBtn + refsBtn + tocItems + (isCustom ? `<button class="toc-add-btn" onclick="addCustomSection()">+ 섹션 추가</button>` : '');
}

async function selectSection(key){
  // 이미 원고 캔버스가 떠 있으면(이전 화면이 Ledger가 아니었으면) 다시
  // 그리지 않고 그냥 그 섹션으로 스크롤만 한다 — 다른 섹션에서 입력 중이던
  // 포커스/상태를 건드리지 않기 위함.
  const canvasAlreadyRendered = !isLedgerKey(state.currentSectionKey) && !!document.querySelector('.ms-section');
  state.currentSectionKey = key;
  updateMyPresenceSection(key);
  if(canvasAlreadyRendered){
    scrollToSection(key, true);
    setActiveTocItem(key);
    return;
  }
  // Ledger에서 돌아올 때: DB 재조회 대신 메모리(openProject) 우선 사용.
  // handleRemoteEdit이 Ledger 뷰에서도 openProject를 최신으로 유지하기 때문에
  // 브로드캐스트된 편집 내용이 DB 저장(500ms debounce) 전에도 반영된다.
  const project = state.openProject || await getProject(state.currentProjectId);
  if(!project){ showToast('일시적인 오류로 불러오지 못했어요. 다시 시도해주세요'); return; }
  renderWorkspace(project);
}

async function selectFigures(){
  state.currentSectionKey = '__figures__';
  updateMyPresenceSection('__figures__');
  const [project, { figures, failed: figFailed }] = await Promise.all([
    getProject(state.currentProjectId),
    getFigures(state.currentProjectId)
  ]);
  if(!project){ showToast('일시적인 오류로 불러오지 못했어요. 다시 시도해주세요'); return; }
  state.figuresLoadFailed = figFailed;
  if(!figFailed) state.figures = figures;
  renderWorkspace(project);
}

async function selectTables(){
  state.currentSectionKey = '__tables__';
  updateMyPresenceSection('__tables__');
  const [project, { tables, failed: tblFailed }] = await Promise.all([
    getProject(state.currentProjectId),
    getTables(state.currentProjectId)
  ]);
  if(!project){ showToast('일시적인 오류로 불러오지 못했어요. 다시 시도해주세요'); return; }
  state.tablesLoadFailed = tblFailed;
  if(!tblFailed) state.tables = tables;
  renderWorkspace(project);
}

async function selectStatus(){
  state.currentSectionKey = '__status__';
  updateMyPresenceSection('__status__');
  const project = await getProject(state.currentProjectId);
  if(!project){ showToast('일시적인 오류로 불러오지 못했어요. 다시 시도해주세요'); return; }
  renderWorkspace(project);
}

function renderStatusManager(project){
  const pane = document.getElementById('editor-pane');
  const ss = project.submissionStatus || {};
  const currentKey = ss.stage || 'draft';
  const currentStage = STAGE_MAP[currentKey] || STAGE_MAP.draft;
  const history = ss.history || [];
  const notes = ss.notes || '';
  const targetJournal = ss.targetJournal || '';

  // 타임라인: 메인 흐름 + 분기 단계
  const timelineSteps = [
    { key:'draft',              label:'작성 중',        sub:'원고 작성' },
    { key:'submitted',          label:'투고',           sub:'Submission' },
    { key:'desk_review',        label:'데스크 리뷰',   sub:'Desk Review' },
    { key:'desk_rejected',      label:'Desk Reject',   sub:'분기 · 재투고 필요', branch:true },
    { key:'under_review',       label:'심사 중',        sub:'Peer Review' },
    { key:'major_revision',     label:'Major Revision', sub:'대수정 요청', branch:true },
    { key:'minor_revision',     label:'Minor Revision', sub:'소수정 요청', branch:true },
    { key:'rejected',           label:'Reject',         sub:'분기 · 재투고 필요', branch:true },
    { key:'revision_submitted', label:'수정본 제출',   sub:'Revision Submission' },
    { key:'accepted',           label:'게재 승인',     sub:'Acceptance' },
    { key:'proofreading',       label:'교정',           sub:'Galley Proof' },
    { key:'online_first',       label:'Online First',  sub:'온라인 선공개' },
    { key:'published',          label:'최종 출판',     sub:'Final Publication' },
  ];

  const isBadTerminal = (currentKey === 'desk_rejected' || currentKey === 'rejected');
  const isGoodTerminal = (currentKey === 'published');

  const timelineHtml = timelineSteps.map(step => {
    const st = STAGE_MAP[step.key];
    const isCurrent = step.key === currentKey;
    const isDone = history.some(h => h.stage === step.key);
    const histEntry = history.find(h => h.stage === step.key);
    let dotStyle, rowStyle = '';
    if(isCurrent){
      dotStyle = `background:${st.color};box-shadow:0 0 0 3px ${st.color}33;`;
      rowStyle = `background:${st.color}11;border-radius:8px;`;
    } else if(isDone){
      dotStyle = `background:${st.color};opacity:0.7;`;
    } else {
      dotStyle = `background:var(--line-strong);opacity:0.3;`;
    }
    const dateStr = histEntry ? `<span style="font-size:11px;color:var(--ink-faint);margin-left:8px;">${fmtDate(histEntry.at)}</span>` : '';
    const noteStr = histEntry && histEntry.note ? `<div style="font-size:12px;color:var(--ink-soft);margin-top:2px;padding-left:28px;">${escapeHtml(histEntry.note)}</div>` : '';
    return `
      <div style="padding:6px 10px ${rowStyle ? ';'+rowStyle : ''}">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:12px;height:12px;border-radius:50%;flex-shrink:0;${dotStyle}"></div>
          <div style="flex:1;">
            <span style="font-size:14px;font-weight:${isCurrent?'700':'500'};color:${isCurrent?st.color:'var(--ink)'};font-family:'Times New Roman','맑은 고딕',serif;">${step.label}</span>
            <span style="font-size:11px;color:var(--ink-faint);margin-left:6px;">${step.sub}</span>
            ${dateStr}
          </div>
          ${isCurrent ? `<span style="font-size:10px;padding:2px 7px;border-radius:6px;background:${st.color};color:#fff;font-weight:600;">현재</span>` : ''}
        </div>
        ${noteStr}
      </div>
      ${step.branch ? '' : '<div style="width:1px;height:8px;background:var(--line-strong);opacity:0.25;margin-left:15px;"></div>'}
    `;
  }).join('');

  // 단계 선택 드롭다운
  const stageOptions = SUBMISSION_STAGES.map(s =>
    `<option value="${s.key}" ${s.key===currentKey?'selected':''}>${s.label}</option>`
  ).join('');

  // 히스토리 로그
  const historyHtml = history.length
    ? [...history].reverse().map(h => {
        const st = STAGE_MAP[h.stage] || {};
        return `<div style="display:flex;gap:10px;align-items:flex-start;padding:6px 0;border-bottom:1px solid var(--line);">
          <span style="font-size:11px;font-weight:600;padding:1px 7px;border-radius:6px;background:${(st.color||'#888')}22;color:${st.color||'#888'};white-space:nowrap;">${st.label||h.stage}</span>
          <div style="flex:1;">
            <div style="font-size:12px;color:var(--ink-soft);">${fmtDate(h.at)}</div>
            ${h.note ? `<div style="font-size:13px;color:var(--ink);margin-top:2px;">${escapeHtml(h.note)}</div>` : ''}
          </div>
        </div>`;
      }).join('')
    : `<div style="color:var(--ink-faint);font-size:13px;">아직 기록이 없습니다.</div>`;

  pane.innerHTML = `
    <div class="editor-head"><h2>투고 현황</h2>
      <span style="font-size:12px;font-weight:600;padding:3px 10px;border-radius:10px;background:${currentStage.color}22;color:${currentStage.color};">${currentStage.label}</span>
    </div>
    <div class="editor-guidance" style="border-left-color:${currentStage.color};color:var(--ink-soft);">${escapeHtml(currentStage.desc)}</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px;">
      <div>
        <label class="fig-field-label">투고 저널 (이 프로젝트에서 실제 제출할 저널)</label>
        <input type="text" id="status-journal" value="${escapeHtml(targetJournal)}" placeholder="예: Acta Materialia" style="width:100%;box-sizing:border-box;" />
      </div>
      <div>
        <label class="fig-field-label">현재 단계 변경</label>
        <div style="display:flex;gap:8px;">
          <select id="status-stage-select" style="flex:1;">${stageOptions}</select>
          <button class="btn small" onclick="applyStatusStageChange()">적용</button>
        </div>
      </div>
    </div>
    <div style="margin-bottom:8px;">
      <label class="fig-field-label">단계 변경 메모 (선택 — 날짜, 심사 의견 요약 등)</label>
      <input type="text" id="status-note-input" placeholder="예: Major revision 요청, 재심사 마감 2026.09.01" style="width:100%;box-sizing:border-box;" />
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:24px;">
      <div>
        <div style="font-size:13px;font-weight:600;margin-bottom:10px;color:var(--ink);">투고 프로세스</div>
        <div style="border:1px solid var(--line);border-radius:10px;padding:8px 4px;background:var(--bg-card);">${timelineHtml}</div>
      </div>
      <div>
        <div style="font-size:13px;font-weight:600;margin-bottom:10px;color:var(--ink);">변경 기록</div>
        <div style="border:1px solid var(--line);border-radius:10px;padding:12px;background:var(--bg-card);max-height:440px;overflow-y:auto;">${historyHtml}</div>
      </div>
    </div>

    <div style="margin-top:20px;">
      <label class="fig-field-label">전체 메모</label>
      <textarea id="status-notes-area" style="width:100%;box-sizing:border-box;min-height:80px;resize:vertical;" placeholder="심사 진행 상황, 리뷰어 코멘트 요약, 수정 사항 등 자유롭게 메모하세요">${escapeHtml(notes)}</textarea>
    </div>
  `;

  document.getElementById('status-journal').addEventListener('input', e => {
    if(!project.submissionStatus) project.submissionStatus = {};
    project.submissionStatus.targetJournal = e.target.value;
    scheduleSave(project);
  });
  document.getElementById('status-notes-area').addEventListener('input', e => {
    if(!project.submissionStatus) project.submissionStatus = {};
    project.submissionStatus.notes = e.target.value;
    scheduleSave(project);
  });
}

async function applyStatusStageChange(){
  const select = document.getElementById('status-stage-select');
  const noteInput = document.getElementById('status-note-input');
  if(!select) return;
  const newStage = select.value;
  const note = noteInput ? noteInput.value.trim() : '';
  const project = state.openProject;
  if(!project) return;
  if(!project.submissionStatus) project.submissionStatus = {};
  project.submissionStatus.stage = newStage;
  project.submissionStatus.history = project.submissionStatus.history || [];
  project.submissionStatus.history.push({ stage: newStage, at: Date.now(), note });
  await scheduleSave(project);
  // 저널 입력값도 함께 반영
  const journalInput = document.getElementById('status-journal');
  if(journalInput) project.submissionStatus.targetJournal = journalInput.value;
  const notesArea = document.getElementById('status-notes-area');
  if(notesArea) project.submissionStatus.notes = notesArea.value;
  renderWorkspace(project);
}

async function selectMembers(){
  state.currentSectionKey = '__members__';
  updateMyPresenceSection('__members__');
  const project = await getProject(state.currentProjectId);
  if(!project){ showToast('일시적인 오류로 불러오지 못했어요. 다시 시도해주세요'); return; }
  renderWorkspace(project);
}

async function selectComments(){
  state.currentSectionKey = '__comments__';
  updateMyPresenceSection('__comments__');
  const project = await getProject(state.currentProjectId);
  if(!project){ showToast('일시적인 오류로 불러오지 못했어요. 다시 시도해주세요'); return; }
  renderWorkspace(project);
}

async function selectReferences(){
  state.currentSectionKey = '__refs__';
  updateMyPresenceSection('__refs__');
  const [project, { references, failed: refFailed }] = await Promise.all([
    getProject(state.currentProjectId),
    getReferences(state.currentProjectId)
  ]);
  if(!project){ showToast('일시적인 오류로 불러오지 못했어요. 다시 시도해주세요'); return; }
  state.referencesLoadFailed = refFailed;
  if(!refFailed) state.references = references;
  renderWorkspace(project);
}

async function selectAuthors(){
  state.currentSectionKey = '__authors__';
  updateMyPresenceSection('__authors__');
  if(!state.authorDirectoryLoaded){
    const { directory, failed } = await getAuthorDirectory();
    if(!failed){ state.authorDirectory = directory; state.authorDirectoryLoaded = true; }
  }
  const project = await getProject(state.currentProjectId);
  if(!project){ showToast('일시적인 오류로 불러오지 못했어요. 다시 시도해주세요'); return; }
  renderWorkspace(project);
}

async function addCustomSection(){
  const project = await getProject(state.currentProjectId);
  if(!project){ showToast('일시적인 오류로 불러오지 못했어요. 다시 시도해주세요'); return; }
  const key = 'sec_' + Date.now();
  project.customSections = project.customSections || [];
  project.customSections.push({key, label:'새 섹션', guidance:'', limit:null});
  await setProject(project);
  state.currentSectionKey = key;
  renderWorkspace(project);
}
async function removeCustomSection(key){
  const project = await getProject(state.currentProjectId);
  if(!project){ showToast('일시적인 오류로 불러오지 못했어요. 다시 시도해주세요'); return; }
  project.customSections = (project.customSections||[]).filter(s=>s.key!==key);
  delete project.content[key];
  await setProject(project);
  const secs = getSections(project);
  state.currentSectionKey = secs.length ? secs[0].key : null;
  renderWorkspace(project);
}

function scheduleSave(project){
  project.updatedAt = Date.now();
  const ind = document.getElementById('save-indicator');
  if(ind) ind.textContent = '저장 중…';
  clearTimeout(state.saveTimer);
  state.saveTimer = setTimeout(async ()=>{
    const ok = await setProject(project);
    const ind2 = document.getElementById('save-indicator');
    if(ind2) ind2.textContent = ok ? ('저장됨 · ' + fmtDate(project.updatedAt)) : '저장 실패 · 다시 시도 중…';
  }, 500);
}

function confirmDeleteProject(id){
  const root = document.getElementById('modal-root');
  root.innerHTML = `<div class="modal-overlay" onclick="if(event.target===this) closeModal()">
    <div class="modal" style="max-width:420px;">
      <div class="modal-head"><h2>프로젝트 삭제</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <p style="font-size:13.5px;color:var(--ink-soft);line-height:1.6;">이 프로젝트와 작성한 모든 내용이 영구적으로 삭제됩니다. 계속할까요?</p>
        <div class="modal-actions">
          <button class="btn secondary" onclick="closeModal()">취소</button>
          <button class="btn danger" onclick="doDeleteProject('${id}')">삭제</button>
        </div>
      </div>
    </div>
  </div>`;
}
async function doDeleteProject(id){
  const ok = await deleteProjectStorage(id);
  if(!ok){
    closeModal();
    showToast('일시적인 서버 오류로 삭제하지 못했어요. 다시 시도해주세요');
    return;
  }
  closeModal();
  showToast('프로젝트를 삭제했습니다');
  goTab('dashboard');
}

function textToParagraphsHtml(text){
  if(!text || !text.trim()) return '<p style="color:#999999;"><i>(작성되지 않음)</i></p>';
  return text.split(/\n{2,}/).map(para =>
    '<p>' + escapeHtml(para).replace(/\n/g,'<br>') + '</p>'
  ).join('');
}

/* ============== 진짜 .docx 생성 (JSZip) ============== */
function xmlEscape(s){
  return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}
function dataUrlToBytes(dataUrl){
  const base64 = dataUrl.slice(dataUrl.indexOf(',')+1);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
function imageExtFromDataUrl(dataUrl){
  const m = /^data:image\/([a-zA-Z0-9+.-]+);/.exec(dataUrl || '');
  let ext = (m && m[1] || 'png').toLowerCase();
  if(ext === 'jpg') ext = 'jpeg';
  if(!['png','jpeg','gif','bmp'].includes(ext)) ext = 'png';
  return ext;
}
// Storage에 올라간 그림은 data: URL이 아니라 실제 URL이라 확장자를 경로에서 뽑는다.
function imageExtFromSrc(src){
  if(src && src.startsWith('data:')) return imageExtFromDataUrl(src);
  const m = /\.([a-zA-Z0-9]+)(?:\?.*)?$/.exec(src || '');
  let ext = (m && m[1] || 'png').toLowerCase();
  if(ext === 'jpg') ext = 'jpeg';
  if(!['png','jpeg','gif','bmp'].includes(ext)) ext = 'png';
  return ext;
}
async function urlToBytes(url){
  const resp = await fetch(url);
  if(!resp.ok) throw new Error('이미지를 불러오지 못했어요 (' + resp.status + ')');
  return new Uint8Array(await resp.arrayBuffer());
}
function loadImageNaturalSize(dataUrl){
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth || 800, h: img.naturalHeight || 600 });
    img.onerror = () => resolve({ w: 800, h: 600 });
    img.src = dataUrl;
  });
}

async function buildDocxBlob(project, journalMeta, secs, figures, references, embeddedFigureIds, authors, tables, embeddedTableIds){
  const zip = new JSZip();
  const mediaFiles = [];
  const docRels = [];
  let rIdCounter = 1;
  let picCounter = 1;

  const MAX_W_EMU = 5486400; // 6in
  const MAX_H_EMU = 6400800; // 7in
  function emuSize(nat){
    let w = MAX_W_EMU;
    let h = Math.round(w * (nat.h / nat.w));
    if(h > MAX_H_EMU){ h = MAX_H_EMU; w = Math.round(h * (nat.w / nat.h)); }
    return { cx:w, cy:h };
  }

  async function registerImage(src){
    const ext = imageExtFromSrc(src);
    const bytes = src.startsWith('data:') ? dataUrlToBytes(src) : await urlToBytes(src);
    const num = picCounter++;
    const fname = `image${num}.${ext}`;
    mediaFiles.push({ name: fname, bytes });
    const rId = 'rId' + (rIdCounter++);
    docRels.push({ id: rId, target: `media/${fname}` });
    const size = emuSize(await loadImageNaturalSize(src));
    return { rId, size, num };
  }

  function pImage(rId, size, num){
    return `<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:drawing>
<wp:inline distT="0" distB="0" distL="0" distR="0">
<wp:extent cx="${size.cx}" cy="${size.cy}"/>
<wp:effectExtent l="0" t="0" r="0" b="0"/>
<wp:docPr id="${num}" name="Picture ${num}"/>
<wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr>
<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
<pic:pic>
<pic:nvPicPr><pic:cNvPr id="0" name="Picture ${num}"/><pic:cNvPicPr/></pic:nvPicPr>
<pic:blipFill><a:blip r:embed="${rId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>
<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${size.cx}" cy="${size.cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>
</pic:pic>
</a:graphicData></a:graphic>
</wp:inline>
</w:drawing></w:r></w:p>`;
  }

  // 3선(three-line) 논문 표 스타일: 헤더 위/아래, 표 맨 아래에만 가로선.
  // 세로선·행 사이 선은 전혀 그리지 않는다.
  function tcBordersXml(top, bottom){
    const topXml = top ? '<w:top w:val="single" w:sz="8" w:space="0" w:color="000000"/>' : '<w:top w:val="nil"/>';
    const bottomXml = bottom ? '<w:bottom w:val="single" w:sz="8" w:space="0" w:color="000000"/>' : '<w:bottom w:val="nil"/>';
    return `<w:tcBorders>${topXml}<w:left w:val="nil"/>${bottomXml}<w:right w:val="nil"/></w:tcBorders>`;
  }
  function tableCellXml(text, opts){
    opts = Object.assign({ bold:false, topRule:false, bottomRule:false }, opts||{});
    const tcPr = `<w:tcPr>${tcBordersXml(opts.topRule, opts.bottomRule)}<w:tcMar><w:top w:w="60" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar></w:tcPr>`;
    const rPr = `<w:rPr>${opts.bold?'<w:b/>':''}<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="맑은 고딕"/><w:sz w:val="19"/><w:szCs w:val="19"/></w:rPr>`;
    const p = `<w:p><w:pPr><w:spacing w:after="0"/></w:pPr><w:r>${rPr}<w:t xml:space="preserve">${xmlEscape(text==null?'':String(text))}</w:t></w:r></w:p>`;
    return `<w:tc>${tcPr}${p}</w:tc>`;
  }
  function tableXml(t){
    const columns = t.columns || [];
    const rows = t.rows || [];
    const colCount = Math.max(columns.length, ...rows.map(r=>r.length), 1);
    const colWidth = Math.floor(9026 / colCount);
    const gridCols = Array.from({length: colCount}).map(()=>`<w:gridCol w:w="${colWidth}"/>`).join('');
    const headerRow = `<w:tr>${Array.from({length: colCount}).map((_,ci) =>
      tableCellXml(columns[ci]||'', { bold:true, topRule:true, bottomRule:true })).join('')}</w:tr>`;
    const bodyRows = rows.map((row, ri) => {
      const isLast = ri === rows.length - 1;
      return `<w:tr>${Array.from({length: colCount}).map((_,ci) =>
        tableCellXml(row[ci]||'', { bottomRule:isLast })).join('')}</w:tr>`;
    }).join('');
    return `<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:jc w:val="center"/><w:tblLayout w:type="autofit"/><w:tblLook w:val="0000" w:firstRow="0" w:lastRow="0" w:firstColumn="0" w:lastColumn="0" w:noHBand="0" w:noVBand="0"/></w:tblPr><w:tblGrid>${gridCols}</w:tblGrid>${headerRow}${bodyRows}</w:tbl>`;
  }
  function extractTableDataFromDom(tableEl){
    const columns = Array.from(tableEl.querySelectorAll('thead th')).map(th => th.textContent);
    const rows = Array.from(tableEl.querySelectorAll('tbody tr')).map(tr =>
      Array.from(tr.querySelectorAll('td')).map(td => td.textContent)
    );
    return { columns, rows };
  }

  function pText(text, opts){
    opts = Object.assign({ bold:false, italic:false, size:22, align:'left', after:160, lineSpacing:null }, opts||{});
    if(text == null || text === '') text = ' ';
    const rPr = `<w:rPr>${opts.bold?'<w:b/>':''}${opts.italic?'<w:i/>':''}<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="맑은 고딕"/><w:sz w:val="${opts.size}"/><w:szCs w:val="${opts.size}"/><w:lang w:eastAsia="ko-KR"/></w:rPr>`;
    // 끝에 빈 줄이 남으면 <w:br/> 뒤에 내용 없는 run이 생겨서, Word가 "이 줄 뒤에
    // 내용이 더 있다"고 오판해 실제 마지막 줄까지 양쪽 맞춤으로 늘려버릴 수 있다.
    const lines = String(text).split('\n');
    while(lines.length > 1 && lines[lines.length-1] === '') lines.pop();
    const runs = lines.map((line,idx) => (idx>0?'<w:br/>':'') + `<w:t xml:space="preserve">${xmlEscape(line)}</w:t>`).join('');
    const lineAttr = opts.lineSpacing ? ` w:line="${opts.lineSpacing}" w:lineRule="auto"` : '';
    return `<w:p><w:pPr><w:spacing w:after="${opts.after}"${lineAttr}/><w:jc w:val="${opts.align}"/></w:pPr><w:r>${rPr}${runs}</w:r></w:p>`;
  }

  function pHeading(text){
    return `<w:p><w:pPr><w:spacing w:before="320" w:after="160"/></w:pPr><w:r><w:rPr><w:b/><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="맑은 고딕"/><w:sz w:val="28"/><w:szCs w:val="28"/></w:rPr><w:t xml:space="preserve">${xmlEscape(text)}</w:t></w:r></w:p>`;
  }

  // 여러 서식(위첨자 등)이 섞인 한 문단을 여러 run으로 구성
  function pRuns(runs, opts){
    opts = Object.assign({ align:'center', after:120 }, opts||{});
    const runXml = runs.map(r => {
      const rPr = `<w:rPr>${r.bold?'<w:b/>':''}${r.italic?'<w:i/>':''}${r.superscript?'<w:vertAlign w:val="superscript"/>':''}<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="맑은 고딕"/><w:sz w:val="${r.size||22}"/><w:szCs w:val="${r.size||22}"/></w:rPr>`;
      return `<w:r>${rPr}<w:t xml:space="preserve">${xmlEscape(r.text)}</w:t></w:r>`;
    }).join('');
    return `<w:p><w:pPr><w:spacing w:after="${opts.after}"/><w:jc w:val="${opts.align}"/></w:pPr>${runXml}</w:p>`;
  }

  // 캡션이 "<b>Fig. N.</b> 나머지 설명" 구조일 때 앞의 굵은 표시(番号)만 bold로,
  // 나머지는 일반 텍스트로 분리해서 pRuns용 run 배열을 만든다.
  function captionRunsFromEl(captionEl, size){
    if(!captionEl) return [{ text:'', size }];
    const boldEl = captionEl.querySelector('b');
    if(!boldEl) return [{ text: captionEl.textContent || '', size }];
    const boldText = boldEl.textContent || '';
    const restText = (captionEl.textContent || '').slice(boldText.length);
    return [{ text: boldText, bold:true, size }, { text: restText, size }];
  }

  // 저자 라인(이름 + 위첨자 소속번호/기호) + 소속 목록 + 각주 문단 생성
  function buildAuthorBlock(authors){
    if(!authors || !authors.length) return '';
    const affNumbers = new Map();
    let nextAff = 1;
    authors.forEach(a => {
      authorAffiliations(a).forEach(aff => {
        aff = (aff || '').trim();
        if(aff && !affNumbers.has(aff)) affNumbers.set(aff, nextAff++);
      });
    });

    const nameRuns = [];
    authors.forEach((a, idx) => {
      if(idx > 0) nameRuns.push({ text: ', ', size:22 });
      nameRuns.push({ text: a.name || '(이름 없음)', size:22 });
      const affNums = authorAffiliations(a).map(aff => affNumbers.get((aff||'').trim())).filter(Boolean);
      let marks = affNums.join(',');
      if(a.isCoFirst) marks += '†';
      if(a.isCorresponding) marks += '*';
      if(marks) nameRuns.push({ text: marks, size:22, superscript:true });
    });

    let out = pRuns(nameRuns, { align:'center', after:100 });
    for(const [affText, num] of affNumbers.entries()){
      out += pRuns([{ text:String(num), size:18, superscript:true }, { text:' '+affText, size:18 }], { align:'center', after:40 });
    }
    const correspondingAuthors = authors.filter(a => a.isCorresponding);
    if(correspondingAuthors.length){
      const emails = correspondingAuthors.map(a => a.email).filter(Boolean).join('; ');
      out += pText(`*Corresponding author${correspondingAuthors.length>1?'s':''}${emails ? '. E-mail: '+emails : ''}`, { italic:true, size:18, align:'center', after:30 });
    }
    if(authors.some(a => a.isCoFirst)){
      out += pText('†These authors contributed equally to this work.', { italic:true, size:18, align:'center', after:30 });
    }
    out += pText('', { after:300 });
    return out;
  }

  // ── MathML → OMML 변환 (Word 수식 내보내기) ──────────────────────────────
  const _NARY_OPS = new Set(['∑','∏','∫','∮','∬','∭','⋂','⋃','⨀','⨁','⨂']);
  function _ommlEsc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function _mmlKids(n){ return Array.from(n.childNodes).map(_mmlToOmml).join(''); }
  function _mmlRowKids(n){
    const ch=Array.from(n.children); let res=''; let i=0;
    const naryTags=new Set(['munderover','munder','mover','msubsup','msub','msup']);
    while(i<ch.length){
      const c=ch[i]; const tag=(c.localName||'').toLowerCase();
      const baseT=((c.firstElementChild&&c.firstElementChild.textContent)||'').trim();
      if(naryTags.has(tag)&&_NARY_OPS.has(baseT)){ res+=_mmlNary(c, ch.slice(i+1).map(_mmlToOmml).join('')); break; }
      res+=_mmlToOmml(c); i++;
    }
    return res;
  }
  function _mmlNary(node, bodyXml){
    const tag=(node.localName||'').toLowerCase(); const ch=Array.from(node.children);
    const base=_ommlEsc((ch[0]&&ch[0].textContent||'').trim());
    let subEl, supEl;
    if(tag==='munderover'||tag==='msubsup'){ subEl=ch[1]; supEl=ch[2]; }
    else if(tag==='munder'||tag==='msub'){ subEl=ch[1]; }
    else if(tag==='mover'||tag==='msup'){ supEl=ch[1]; }
    const isUnder=tag==='munderover'||tag==='munder'||tag==='mover';
    const limLoc=isUnder?'undOvr':'subSup';
    const subXml=subEl?`<m:sub>${_mmlToOmml(subEl)}</m:sub>`:'<m:sub/>';
    const supXml=supEl?`<m:sup>${_mmlToOmml(supEl)}</m:sup>`:'<m:sup/>';
    const hideProps=(!subEl?'<m:subHide m:val="1"/>':'')+(!supEl?'<m:supHide m:val="1"/>':'');
    return `<m:nary><m:naryPr><m:chr m:val="${base}"/><m:limLoc m:val="${limLoc}"/>${hideProps}</m:naryPr>${subXml}${supXml}<m:e>${bodyXml}</m:e></m:nary>`;
  }
  function _mmlToOmml(node){
    if(!node) return '';
    if(node.nodeType===3){ const t=(node.textContent||'').replace(/[\r\n\t]+/g,' '); return t.trim()?`<m:r><m:t xml:space="preserve">${_ommlEsc(t)}</m:t></m:r>`:''; }
    if(node.nodeType!==1) return '';
    const tag=(node.localName||'').toLowerCase();
    switch(tag){
      case 'annotation': case 'annotation-xml': return '';
      case 'math': return _mmlKids(node);
      case 'semantics':{ const first=Array.from(node.children).find(c=>c.localName!=='annotation'&&c.localName!=='annotation-xml'); return first?_mmlToOmml(first):''; }
      case 'mrow': return _mmlRowKids(node);
      case 'mstyle': case 'mpadded': case 'merror': return _mmlKids(node);
      case 'mphantom': return `<m:phant><m:phantPr/><m:e>${_mmlKids(node)}</m:e></m:phant>`;
      case 'mi':{ const t=node.textContent||''; return `<m:r><m:rPr><m:sty m:val="${t.length===1?'i':'p'}"/></m:rPr><m:t>${_ommlEsc(t)}</m:t></m:r>`; }
      case 'mn': return `<m:r><m:rPr><m:sty m:val="n"/></m:rPr><m:t>${_ommlEsc(node.textContent||'')}</m:t></m:r>`;
      case 'mo': return `<m:r><m:rPr><m:sty m:val="p"/></m:rPr><m:t>${_ommlEsc(node.textContent||'')}</m:t></m:r>`;
      case 'mtext': return `<m:r><m:rPr><m:sty m:val="p"/><m:nor/></m:rPr><m:t>${_ommlEsc(node.textContent||'')}</m:t></m:r>`;
      case 'mspace': return '';
      case 'msup':{ const ch=Array.from(node.children); const bt=(ch[0]&&ch[0].textContent||'').trim(); if(_NARY_OPS.has(bt)) return _mmlNary(node,''); return `<m:sSup><m:e>${ch[0]?_mmlToOmml(ch[0]):''}</m:e><m:sup>${ch[1]?_mmlToOmml(ch[1]):''}</m:sup></m:sSup>`; }
      case 'msub':{ const ch=Array.from(node.children); const bt=(ch[0]&&ch[0].textContent||'').trim(); if(_NARY_OPS.has(bt)) return _mmlNary(node,''); return `<m:sSub><m:e>${ch[0]?_mmlToOmml(ch[0]):''}</m:e><m:sub>${ch[1]?_mmlToOmml(ch[1]):''}</m:sub></m:sSub>`; }
      case 'msubsup':{ const ch=Array.from(node.children); const bt=(ch[0]&&ch[0].textContent||'').trim(); if(_NARY_OPS.has(bt)) return _mmlNary(node,''); return `<m:sSubSup><m:e>${ch[0]?_mmlToOmml(ch[0]):''}</m:e><m:sub>${ch[1]?_mmlToOmml(ch[1]):''}</m:sub><m:sup>${ch[2]?_mmlToOmml(ch[2]):''}</m:sup></m:sSubSup>`; }
      case 'mfrac':{ const ch=Array.from(node.children); return `<m:f><m:num>${ch[0]?_mmlToOmml(ch[0]):''}</m:num><m:den>${ch[1]?_mmlToOmml(ch[1]):''}</m:den></m:f>`; }
      case 'msqrt': return `<m:rad><m:radPr><m:degHide m:val="1"/></m:radPr><m:deg/><m:e>${_mmlKids(node)}</m:e></m:rad>`;
      case 'mroot':{ const ch=Array.from(node.children); return `<m:rad><m:deg>${ch[1]?_mmlToOmml(ch[1]):''}</m:deg><m:e>${ch[0]?_mmlToOmml(ch[0]):''}</m:e></m:rad>`; }
      case 'munder':{ const ch=Array.from(node.children); const bt=(ch[0]&&ch[0].textContent||'').trim(); if(_NARY_OPS.has(bt)) return _mmlNary(node,''); return `<m:limLow><m:e>${ch[0]?_mmlToOmml(ch[0]):''}</m:e><m:lim>${ch[1]?_mmlToOmml(ch[1]):''}</m:lim></m:limLow>`; }
      case 'mover':{ const ch=Array.from(node.children); const bt=(ch[0]&&ch[0].textContent||'').trim(); if(_NARY_OPS.has(bt)) return _mmlNary(node,''); return `<m:limUpp><m:e>${ch[0]?_mmlToOmml(ch[0]):''}</m:e><m:lim>${ch[1]?_mmlToOmml(ch[1]):''}</m:lim></m:limUpp>`; }
      case 'munderover':{ const ch=Array.from(node.children); const bt=(ch[0]&&ch[0].textContent||'').trim(); if(_NARY_OPS.has(bt)) return _mmlNary(node,''); return `<m:limLow><m:e><m:limUpp><m:e>${ch[0]?_mmlToOmml(ch[0]):''}</m:e><m:lim>${ch[2]?_mmlToOmml(ch[2]):''}</m:lim></m:limUpp></m:e><m:lim>${ch[1]?_mmlToOmml(ch[1]):''}</m:lim></m:limLow>`; }
      case 'mtable':{
        const rows=Array.from(node.children).filter(c=>c.localName==='mtr'||c.localName==='mlabeledtr');
        const colCount=Math.max(1,rows.reduce((m,r)=>Math.max(m,r.children.length),0));
        const rowsXml=rows.map(r=>`<m:mr>${Array.from(r.children).filter(c=>c.localName==='mtd').map(c=>`<m:e>${_mmlKids(c)}</m:e>`).join('')}</m:mr>`).join('');
        return `<m:m><m:mPr><m:mcs><m:mc><m:mcPr><m:count m:val="${colCount}"/><m:mcJc m:val="center"/></m:mcPr></m:mc></m:mcs></m:mPr>${rowsXml}</m:m>`;
      }
      case 'mfenced':{
        const open=_ommlEsc(node.getAttribute('open')||'('), close=_ommlEsc(node.getAttribute('close')||')');
        const sep=_ommlEsc((node.getAttribute('separators')||',')[0]||',');
        const kids=Array.from(node.children);
        return `<m:d><m:dPr><m:begChr m:val="${open}"/><m:endChr m:val="${close}"/><m:sepChr m:val="${sep}"/></m:dPr>${kids.map(c=>`<m:e>${_mmlToOmml(c)}</m:e>`).join('')||'<m:e/>'}</m:d>`;
      }
      default: return _mmlKids(node);
    }
  }
  function latexToOmmlXml(latex, isDisplay){
    if(typeof katex==='undefined') return null;
    try{
      // \begin{equation}...\end{equation} 같은 LaTeX 환경 래퍼 제거 — KaTeX mathml 모드에서
      // 환경 래퍼를 그대로 넘기면 math 요소를 생성 못해 null이 반환된다.
      let src=(latex||'').trim();
      const envM=src.match(/^\\begin\{[^}]+\}([\s\S]*)\\end\{[^}]+\}$/);
      if(envM) src=envM[1].trim();
      const mmlHtml=katex.renderToString(src,{output:'mathml',displayMode:!!isDisplay,throwOnError:false});
      const doc=(new DOMParser()).parseFromString(mmlHtml,'text/html');
      const mathEl=doc.querySelector('math');
      if(!mathEl) return null;
      const inner=_mmlToOmml(mathEl);
      return isDisplay?`<m:oMathPara><m:oMath>${inner}</m:oMath></m:oMathPara>`:`<m:oMath>${inner}</m:oMath>`;
    }catch(e){ console.warn('OMML 변환 실패:',latex,e); return null; }
  }
  function _paragraphWithEquations(node){
    const bodyRpr=`<w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="맑은 고딕"/><w:sz w:val="20"/><w:szCs w:val="20"/><w:lang w:eastAsia="ko-KR"/></w:rPr>`;
    const tokens=node.querySelectorAll('.body-eq-token');
    // 수식 토큰을 제외한 나머지 텍스트만 추출 (직접 자식뿐 아니라 전체 서브트리에서 수식 제거 후 체크)
    const cloneForText=node.cloneNode(true);
    cloneForText.querySelectorAll('.body-eq-token').forEach(el=>el.remove());
    const nonEqText=(cloneForText.textContent||'').trim();
    if(tokens.length===1&&tokens[0].dataset.display==='true'&&!nonEqText){
      const latex=tokens[0].dataset.latex||'';
      const omml=latexToOmmlXml(latex,true);
      if(omml) return `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="200"/></w:pPr>${omml}</w:p>`;
      return pText(`[${latex}]`,{size:20,align:'center',after:200});
    }
    // 인라인 수식과 텍스트가 섞인 문단
    const pPr=`<w:pPr><w:spacing w:after="160" w:line="480" w:lineRule="auto"/><w:jc w:val="both"/></w:pPr>`;
    let inner=pPr;
    function walkMixed(n){
      if(n.nodeType===3){ const t=n.textContent||''; if(t.trim()) inner+=`<w:r>${bodyRpr}<w:t xml:space="preserve">${xmlEscape(t)}</w:t></w:r>`; return; }
      if(n.nodeType!==1) return;
      // aria-hidden 레이어는 KaTeX 시각 HTML — math 요소로 이미 변환하므로 건너뜀
      if(n.getAttribute&&n.getAttribute('aria-hidden')==='true') return;
      if(n.classList&&n.classList.contains('body-eq-token')){
        const isDisp=n.dataset.display==='true';
        const omml=latexToOmmlXml(n.dataset.latex||'',isDisp);
        if(omml){ inner+=omml; return; }
        // latexToOmmlXml 실패 시 내부 <math>에서 직접 변환 시도
        const mathFallback=n.querySelector('math');
        if(mathFallback){ const fi=_mmlToOmml(mathFallback); if(fi){ inner+= isDisp?`<m:oMathPara><m:oMath>${fi}</m:oMath></m:oMathPara>`:`<m:oMath>${fi}</m:oMath>`; return; } }
        inner+=`<w:r>${bodyRpr}<w:t xml:space="preserve">${xmlEscape('['+(n.dataset.latex||'')+']')}</w:t></w:r>`;
        return;
      }
      // body-eq-token 없이 바로 삽입된 naked KaTeX span — <math>에서 직접 OMML 변환
      if(n.classList&&(n.classList.contains('katex')||n.classList.contains('katex-display'))){
        const mathEl=n.querySelector('math');
        if(mathEl){ const ki=_mmlToOmml(mathEl); if(ki){ inner+=`<m:oMath>${ki}</m:oMath>`; return; } }
        return; // <math> 없으면 통째로 건너뜀 (KaTeX HTML 텍스트 누출 방지)
      }
      // katex-mathml 자체는 위 katex 처리에서 이미 흡수됨 — 개별로 오면 건너뜀
      if(n.classList&&n.classList.contains('katex-mathml')) return;
      if(n.localName==='br'){ inner+=`<w:r><w:br/></w:r>`; return; }
      Array.from(n.childNodes).forEach(walkMixed);
    }
    Array.from(node.childNodes).forEach(walkMixed);
    return `<w:p>${inner}</w:p>`;
  }
  // ──────────────────────────────────────────────────────────────────────────

  // 그림/표 삽입 시 커서 위치에 따라 브라우저가 .inline-figure/.inline-table를
  // 새 형제가 아니라 기존 <div> 문단 안쪽에 한 겹 더 감싸 넣는 경우가 있다(실제
  // 사용자 문서에서 확인됨). 최상위 자식만 보면 이 블록을 못 찾고 그냥 텍스트로
  // 뭉개버려 그림이 통째로 빠지므로, 재귀적으로 내려가며 찾는다.
  async function processContentNode(node){
    // node 자체가 body-eq-token span인 경우 — querySelector는 자기 자신을 못 찾으므로 별도 처리
    if(node.nodeType === 1 && node.classList && node.classList.contains('body-eq-token')){
      const isDisp = node.dataset.display === 'true';
      const omml = latexToOmmlXml(node.dataset.latex || '', isDisp);
      if(isDisp){
        if(omml) return `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="200"/></w:pPr>${omml}</w:p>`;
        return pText(`[${node.dataset.latex||''}]`,{size:20,align:'center',after:200});
      } else {
        if(omml) return `<w:p><w:pPr><w:spacing w:after="160" w:line="480" w:lineRule="auto"/><w:jc w:val="both"/></w:pPr>${omml}</w:p>`;
        return pText(`[${node.dataset.latex||''}]`,{size:20,align:'both',lineSpacing:480});
      }
    }
    if(node.nodeType === 1 && node.classList && node.classList.contains('inline-figure')){
      const img = node.querySelector('img');
      const captionEl = node.querySelector('.inline-figure-caption');
      let out = '';
      if(img && img.src){
        try{
          const { rId, size, num } = await registerImage(img.src);
          out += pImage(rId, size, num);
        }catch(e){
          console.error('그림을 내보내기에 포함하지 못했어요:', img.src, e);
          out += pText('[그림을 불러오지 못했어요]', { italic:true, size:18, align:'center', after:40 });
        }
        out += pRuns(captionRunsFromEl(captionEl, 20), { align:'center', after:280 });
      }
      return out;
    }
    if(node.nodeType === 1 && node.classList && node.classList.contains('inline-table')){
      const captionEl = node.querySelector('.inline-table-caption');
      const tableEl = node.querySelector('table');
      let out = pRuns(captionRunsFromEl(captionEl, 20), { align:'center', after:80 });
      if(tableEl){
        out += tableXml(extractTableDataFromDom(tableEl));
        out += pText('', { after:280 });
      }
      return out;
    }
    if(node.nodeType === 1 && node.querySelector && node.querySelector('.inline-figure, .inline-table')){
      // 이 노드 자신은 그림/표가 아니지만 자손 어딘가에 있다 — 자식마다 재귀 처리
      let out = '';
      for(const child of Array.from(node.childNodes)) out += await processContentNode(child);
      return out;
    }
    if(node.nodeType === 1 && node.querySelector && (node.querySelector('.body-eq-token') || node.querySelector('.katex'))){
      return _paragraphWithEquations(node);
    }
    const text = node.textContent || '';
    // 한 DOM 노드 안에 실제 줄바꿈 문자가 여러 개 박혀있는 경우(예전 형식의
    // 붙여넣기 등)까지 대비: 그대로 pText 하나에 넘기면 내부적으로 <w:br/>로만
    // 이어붙여져 한 문단으로 뭉쳐버리고, Word가 진짜 마지막 줄을 못 찾아 그
    // 안의 모든 줄을 양쪽 맞춤으로 늘려버린다. 문단마다 별도 <w:p>로 낸다.
    let out = '';
    text.split(/\n+/).forEach(par => {
      if(par.trim()) out += pText(par, { size:20, align:'both', lineSpacing:480 });
    });
    return out;
  }

  async function contentToParagraphs(raw){
    if(!raw || !extractPlainText(raw).trim()) return pText('(작성되지 않음)', { italic:true, size:20 });
    if(!looksLikeHtml(raw)){
      return raw.split(/\n+/).map(par => pText(par, { size:20, align:'both', lineSpacing:480 })).join('');
    }
    const tmp = document.createElement('div');
    tmp.innerHTML = raw;
    // 최상위에 블록 요소(div/p 등) 없이 text + inline eq-token이 flat하게 섞인 경우,
    // 전체를 하나의 혼합 문단으로 처리 — Chrome이 <div>를 생성하지 않은 상태 대응.
    const topNodes = Array.from(tmp.childNodes);
    const hasBlock = topNodes.some(n => n.nodeType === 1 && /^(div|p|h[1-6]|blockquote|ul|ol|li)$/i.test(n.localName||''));
    if(!hasBlock && (tmp.querySelector('.body-eq-token') || tmp.querySelector('.katex'))){
      return _paragraphWithEquations(tmp) || pText('(작성되지 않음)', { italic:true, size:20 });
    }
    let out = '';
    for(const node of topNodes) out += await processContentNode(node);
    return out || pText('(작성되지 않음)', { italic:true, size:20 });
  }

  let body = '';
  body += pText(project.title || '제목 없음', { bold:true, size:36, align:'center', after:120 });
  body += buildAuthorBlock(authors);

  let numberedIndex = 0;
  for(let i=0; i<secs.length; i++){
    const s = secs[i];
    if(isFreeSection(s)) continue; // freeSection(Highlights, Graphical Abstract 등)은 자유 작업 공간 — 원고에는 포함하지 않음
    if(isUnnumberedSection(s)){
      body += pHeading(s.label);
    } else {
      numberedIndex++;
      // 라벨에 이미 번호가 붙어 있으면(예: "1. Introduction") 제거하고 다시 붙인다
      const cleanLabel = s.label.replace(/^\d+[\.\s]+/, '').trim();
      body += pHeading(`${numberedIndex}. ${cleanLabel}`);
    }
    if(isReferencesSection(s)){
      const exportCitedNums = computeRefCitedNumbers(project);
      const exportCitedRefs = (references || []).filter((r,i) => exportCitedNums.has(i+1));
      if(exportCitedRefs.length){
        exportCitedRefs.forEach((r,ci) => {
          const doi = (r.doi||'').trim();
          const doiSuffix = doi ? `, ${doi}` : '';
          body += pText(`[${ci+1}] ${r.text||''}${doiSuffix}`, { size:20, after:120 });
        });
      } else if(references && references.length){
        body += pText('(본문에 인용된 참고문헌이 없습니다)', { italic:true, size:20 });
      } else {
        body += pText('(등록된 참고문헌 없음)', { italic:true, size:20 });
      }
    } else if(isKeywordsSection(s)){
      const formatted = formatKeywordsForExport(project.content[s.key]);
      body += formatted ? pText(formatted, { size:22 }) : pText('(작성되지 않음)', { italic:true, size:20 });
    } else {
      body += await contentToParagraphs(project.content[s.key]);
    }
  }

  const appendixTables = (tables||[]).map((t,i) => ({ ...t, num:i+1 })).filter(t => !embeddedTableIds.has(t.id));
  if(appendixTables.length){
    body += `<w:p><w:pPr><w:pageBreakBefore/></w:pPr></w:p>`;
    body += pHeading('Tables');
    for(const t of appendixTables){
      body += pRuns([{ text:`Table ${t.num}.`, bold:true, size:20 }, { text:' '+(t.caption || '(캡션 미작성)'), size:20 }], { align:'center', after:80 });
      body += tableXml(t);
      body += pText('', { after:280 });
    }
  }

  const figureOrder = computeFigureOrder(project, figures);
  const figureNumById = new Map(figureOrder.map((id, i) => [id, i+1]));
  const appendixFigures = (figures||[]).filter(f => !embeddedFigureIds.has(f.id)).map(f => ({ ...f, num: figureNumById.get(f.id) || 0 }));
  if(appendixFigures.length){
    body += `<w:p><w:pPr><w:pageBreakBefore/></w:pPr></w:p>`;
    body += pHeading('Figures');
    for(const f of appendixFigures){
      try{
        const { rId, size, num } = await registerImage(figureSrc(f));
        body += pImage(rId, size, num);
      }catch(e){
        console.error('그림을 내보내기에 포함하지 못했어요:', f.fileName, e);
        body += pText('[그림을 불러오지 못했어요: ' + (f.fileName||'') + ']', { italic:true, size:18, align:'center', after:40 });
      }
      body += pRuns([{ text:`Fig. ${f.num}.`, bold:true, size:20 }, { text:' '+(f.caption || '(캡션 미작성)'), size:20 }], { align:'center', after:280 });
    }
  }

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math">
<w:body>
${body}
<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1417" w:right="1417" w:bottom="1417" w:left="1417" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr>
</w:body>
</w:document>`;

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Default Extension="png" ContentType="image/png"/>
<Default Extension="jpeg" ContentType="image/jpeg"/>
<Default Extension="gif" ContentType="image/gif"/>
<Default Extension="bmp" ContentType="image/bmp"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
</Types>`;

  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
</Relationships>`;

  const coreXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>${xmlEscape(project.title||'')}</dc:title></cp:coreProperties>`;

  const docRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
${docRels.map(r => `<Relationship Id="${r.id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="${r.target}"/>`).join('\n')}
</Relationships>`;

  zip.file('[Content_Types].xml', contentTypesXml);
  zip.file('_rels/.rels', rootRelsXml);
  zip.file('docProps/core.xml', coreXml);
  zip.file('word/document.xml', documentXml);
  zip.file('word/_rels/document.xml.rels', docRelsXml);
  mediaFiles.forEach(m => zip.file(`word/media/${m.name}`, m.bytes));

  return zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  });
}

async function exportProject(id){
  if(typeof JSZip === 'undefined'){
    showToast('내보내기 라이브러리를 불러오지 못했어요. 인터넷 연결을 확인하고 다시 시도해주세요');
    return;
  }
  const project = await getProject(id);
  if(!project){ showToast('일시적인 오류로 원고를 불러오지 못했어요. 다시 시도해주세요'); return; }
  const { figures, failed: figuresFailed } = await getFigures(id);
  const { references, failed: referencesFailed } = await getReferences(id);
  const { authors, failed: authorsFailed } = await getProjectAuthors(id);
  const { tables, failed: tablesFailed } = await getTables(id);
  // 여기서 실패를 무시하고 빈 배열로 넘어가면 그림/표/저자/참고문헌이 통째로
  // 빠진 문서가 아무 경고 없이 만들어진다 — 반드시 알리고 중단한다.
  if(figuresFailed || referencesFailed || authorsFailed || tablesFailed){
    showToast('그림/표/저자/참고문헌을 불러오는 중 일시적인 오류가 발생했어요. 다시 시도해주세요');
    return;
  }
  const j = JOURNALS[JOURNAL_ALIAS[project.journalId] || project.journalId] || JOURNALS.materials_standard;
  const secs = getSections(project);

  // 본문 어딘가에 실제로 삽입된(embed) 그림/표 id는 부록에 중복으로 넣지 않음
  const embeddedFigureIds = new Set();
  const embeddedTableIds = new Set();
  secs.forEach(s => {
    const raw = project.content[s.key] || '';
    (raw.match(/data-fig-id="([^"]+)"/g) || []).forEach(m => {
      embeddedFigureIds.add(m.replace('data-fig-id="','').replace('"',''));
    });
    (raw.match(/data-table-id="([^"]+)"/g) || []).forEach(m => {
      embeddedTableIds.add(m.replace('data-table-id="','').replace('"',''));
    });
  });

  showToast('Word 문서를 만드는 중…');
  try{
    const blob = await buildDocxBlob(project, j, secs, figures || [], references || [], embeddedFigureIds, authors || [], tables || [], embeddedTableIds);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = (project.title || 'manuscript') + '.docx';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Word 문서로 내보냈습니다');
  }catch(e){
    console.error('docx 생성 실패:', e);
    showToast('Word 문서 생성 중 오류가 발생했어요. 다시 시도해주세요');
  }
}

/* ============== AUTH SCREEN ============== */
function renderAuthScreen(mode){
  state.authMode = mode || state.authMode || 'signin';
  const isSignup = state.authMode === 'signup';
  const root = document.getElementById('auth-screen');
  root.innerHTML = `
    <div class="auth-wrap">
      <div class="auth-card">
        <div class="brand">
          <div><div class="brand-name">논문 투고 워크스페이스</div></div>
        </div>
        <h1>${isSignup ? '계정 만들기' : '로그인'}</h1>
        <div id="auth-message"></div>
        <div class="field">
          <label>이메일</label>
          <input type="email" id="auth-email" placeholder="you@example.com" autocomplete="username" />
        </div>
        <div class="field">
          <label>비밀번호</label>
          <input type="password" id="auth-password" placeholder="6자 이상" autocomplete="${isSignup?'new-password':'current-password'}" />
        </div>
        <button class="btn" id="auth-submit-btn" onclick="${isSignup?'handleSignUp()':'handleSignIn()'}">${isSignup ? '가입하기' : '로그인'}</button>
        <div class="auth-switch">
          ${isSignup
            ? `이미 계정이 있으신가요? <a onclick="renderAuthScreen('signin')">로그인</a>`
            : `계정이 없으신가요? <a onclick="renderAuthScreen('signup')">가입하기</a>`}
        </div>
      </div>
    </div>
  `;
  const emailInput = document.getElementById('auth-email');
  const pwInput = document.getElementById('auth-password');
  emailInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') pwInput.focus(); });
  pwInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') document.getElementById('auth-submit-btn').click(); });
  emailInput.focus();
}

function setAuthMessage(text, kind){
  const el = document.getElementById('auth-message');
  if(!el) return;
  el.innerHTML = text ? `<div class="${kind==='error'?'auth-error':'auth-notice'}">${escapeHtml(text)}</div>` : '';
}

function showAuthScreen(mode){
  const app = document.getElementById('app');
  const auth = document.getElementById('auth-screen');
  if(app) app.style.display = 'none';
  if(auth) auth.style.display = 'block';
  renderAuthScreen(mode);
}
function showApp(){
  const app = document.getElementById('app');
  const auth = document.getElementById('auth-screen');
  if(auth) auth.style.display = 'none';
  if(app) app.style.display = 'flex';
}

async function handleSignIn(){
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  if(!email || !password){ setAuthMessage('이메일과 비밀번호를 입력해주세요', 'error'); return; }
  const btn = document.getElementById('auth-submit-btn');
  btn.disabled = true; btn.textContent = '로그인 중…';
  const { error } = await authSignIn(email, password);
  if(error){
    setAuthMessage(error.message === 'Invalid login credentials' ? '이메일 또는 비밀번호가 올바르지 않아요' : error.message, 'error');
    btn.disabled = false; btn.textContent = '로그인';
    return;
  }
  await bootAfterAuth();
}

async function handleSignUp(){
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  if(!email || !password){ setAuthMessage('이메일과 비밀번호를 입력해주세요', 'error'); return; }
  if(password.length < 6){ setAuthMessage('비밀번호는 6자 이상이어야 해요', 'error'); return; }
  const btn = document.getElementById('auth-submit-btn');
  btn.disabled = true; btn.textContent = '가입 처리 중…';
  const { error, session } = await authSignUp(email, password);
  if(error){
    setAuthMessage(error.message, 'error');
    btn.disabled = false; btn.textContent = '가입하기';
    return;
  }
  if(!session){
    // 이메일 확인이 켜져 있는 프로젝트는 가입 직후 세션이 바로 생기지 않는다.
    renderEmailVerifyScreen(email);
    return;
  }
  await bootAfterAuth();
}

function renderEmailVerifyScreen(email){
  const root = document.getElementById('auth-screen');
  root.innerHTML = `
    <div class="auth-wrap">
      <div class="auth-card" style="max-width:440px;text-align:center;">
        <div class="brand" style="justify-content:center;margin-bottom:20px;">
          <div><div class="brand-name">논문 투고 워크스페이스</div></div>
        </div>
        <div style="font-size:48px;margin-bottom:16px;">📬</div>
        <h1 style="font-size:20px;margin:0 0 10px;">이메일을 확인해주세요</h1>
        <p style="font-size:14px;color:rgba(237,238,240,0.7);line-height:1.7;margin:0 0 20px;">
          <b style="color:var(--brand);">${escapeHtml(email)}</b>로<br>
          인증 메일을 보냈습니다.<br>
          메일함을 열어 <b style="color:#fff;">「이메일 인증하기」 버튼</b>을 클릭하면<br>
          가입이 완료됩니다.
        </p>
        <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:14px 16px;margin-bottom:20px;text-align:left;">
          <div style="font-size:12px;color:rgba(237,238,240,0.5);margin-bottom:8px;font-weight:600;letter-spacing:0.4px;">확인 순서</div>
          <div style="font-size:13px;color:rgba(237,238,240,0.75);line-height:2;">
            ① 메일함에서 <b style="color:#fff;">no-reply@mail.app.supabase.io</b> 발신 메일 찾기<br>
            ② 메일 안의 <b style="color:var(--brand);">초록색 「이메일 인증하기」 버튼</b> 클릭<br>
            ③ 이 페이지로 돌아와서 로그인
          </div>
        </div>
        <div style="font-size:12px;color:rgba(237,238,240,0.45);margin-bottom:18px;">
          메일이 안 보이면 <b>스팸 메일함</b>도 확인해보세요.
        </div>
        <button class="btn" style="width:100%;margin-bottom:10px;" onclick="showAuthScreen('signin')">로그인 화면으로 이동</button>
        <button class="btn secondary" style="width:100%;color:var(--topbar-ink);border-color:rgba(237,238,240,0.25);" onclick="resendVerifyEmail('${escapeHtml(email).replace(/'/g,"&#39;")}')">인증 메일 다시 보내기</button>
      </div>
    </div>`;
}

async function resendVerifyEmail(email){
  const { error } = await window.sb.auth.resend({ type: 'signup', email });
  if(error){ alert('재발송 실패: ' + error.message); return; }
  alert('인증 메일을 다시 보냈습니다. 메일함을 확인해주세요.');
}

async function handleLogout(){
  leaveProjectRealtime();
  await authSignOut();
  state.currentUser = null;
  state.authorDirectory = [];
  state.authorDirectoryLoaded = false;
  showAuthScreen('signin');
}

async function bootAfterAuth(){
  const session = await getSession();
  if(!session){ showAuthScreen('signin'); return; }
  const profile = await getMyProfile();
  if(profile && profile.is_active === false){
    await authSignOut();
    state.currentUser = null;
    showAuthScreen('signin');
    setAuthMessage('비활성화된 계정이에요. 관리자에게 문의해주세요.', 'error');
    return;
  }
  state.currentUser = { id: session.user.id, email: session.user.email, profile };
  renderUserInfo();
  // 주소록을 로그인 시점에 미리 로드 — 프로젝트 전환과 무관하게 항상 동일한 주소록이 보임
  getAuthorDirectory().then(({ directory, failed }) => {
    if(!failed){ state.authorDirectory = directory; state.authorDirectoryLoaded = true; }
  });
  showApp();
  goTab('dashboard');
}

function renderUserInfo(){
  const el = document.getElementById('user-info');
  if(!el || !state.currentUser) return;
  const { email, profile } = state.currentUser;
  el.innerHTML = `
    <span class="user-email">${escapeHtml(email)}</span>
    ${profile && profile.is_admin ? '<span class="admin-badge">ADMIN</span>' : ''}
    <button class="btn secondary small" onclick="handleLogout()">로그아웃</button>
  `;
  const adminTab = document.getElementById('tab-admin');
  if(adminTab) adminTab.style.display = (profile && profile.is_admin) ? '' : 'none';
}

/* ============== ADMIN PANEL ============== */
async function renderAdminPanel(){
  const main = document.getElementById('main-content');
  if(!state.currentUser || !state.currentUser.profile || !state.currentUser.profile.is_admin){
    main.innerHTML = `<div class="page-head"><h1>관리자</h1><p>이 페이지는 관리자만 볼 수 있어요.</p></div>`;
    return;
  }
  main.innerHTML = `<div class="page-head">
      <h1>계정 관리</h1>
      <p>가입된 모든 계정을 확인하고, 관리자 권한이나 활성화 상태를 바꿀 수 있어요.</p>
    </div>
    <div id="admin-list" style="color:var(--ink-faint);font-family:'Courier New', '맑은 고딕', monospace;font-size:12px;">불러오는 중…</div>`;

  const { data, error } = await window.sb.from('profiles').select('*').order('created_at', { ascending:true });
  const listEl = document.getElementById('admin-list');
  if(error){
    listEl.innerHTML = `<div style="color:var(--brick);font-size:13px;">목록을 불러오지 못했어요: ${escapeHtml(error.message)}</div>`;
    return;
  }
  listEl.innerHTML = `<div style="display:flex;flex-direction:column;gap:10px;">
    ${data.map(p => `
      <div style="display:flex;align-items:center;gap:16px;background:var(--paper-card);border:1px solid var(--line);border-radius:var(--radius);padding:12px 16px;">
        <div style="flex:1;min-width:0;">
          <div style="font-size:13.5px;font-weight:600;color:var(--ink);">${escapeHtml(p.display_name || p.email)}</div>
          <div style="font-size:11.5px;color:var(--ink-faint);font-family:'Courier New', '맑은 고딕', monospace;">${escapeHtml(p.email)} · 가입 ${fmtDate(new Date(p.created_at).getTime())}</div>
        </div>
        <label style="display:flex;align-items:center;gap:5px;font-size:12px;color:var(--ink-soft);white-space:nowrap;">
          <input type="checkbox" ${p.is_admin?'checked':''} ${p.id===state.currentUser.id?'disabled':''} onchange="toggleProfileFlag('${p.id}','is_admin',this.checked)"> 관리자
        </label>
        <label style="display:flex;align-items:center;gap:5px;font-size:12px;color:var(--ink-soft);white-space:nowrap;">
          <input type="checkbox" ${p.is_active?'checked':''} ${p.id===state.currentUser.id?'disabled':''} onchange="toggleProfileFlag('${p.id}','is_active',this.checked)"> 활성 상태
        </label>
      </div>
    `).join('')}
  </div>`;
}

async function toggleProfileFlag(userId, field, value){
  const patch = {}; patch[field] = value;
  const { error } = await window.sb.from('profiles').update(patch).eq('id', userId);
  if(error){ showToast('변경에 실패했어요: ' + error.message); renderAdminPanel(); return; }
  showToast('변경했어요');
}

/* ============== LIBRARY (논문 라이브러리) ============== */
let libState = {
  papers: [], groups: [], selectedPaperId: null,
  filterGroupId: null, filterAlloy: '', searchQuery: '',
  chartYAxis: 'hardness', loaded: false
};

async function getLibraryPapers(){
  const { data, error } = await window.sb.from('library_papers')
    .select('*, library_paper_groups(group_id)')
    .order('updated_at', { ascending: false });
  if(error){ console.error('library_papers 조회 실패:', error); return []; }
  return (data||[]).map(p => ({
    ...p,
    groupIds: (p.library_paper_groups||[]).map(g => g.group_id),
    authors_json: p.authors_json||[], compositions: p.compositions||[],
    data_points: p.data_points||[], alloy_systems: p.alloy_systems||[]
  }));
}
async function insertLibraryPaper(paper){
  const row = { ...paper, user_id: state.currentUser.id };
  delete row.groupIds;
  const { data, error } = await window.sb.from('library_papers').insert(row).select().single();
  if(error){ console.error('library_papers 삽입 실패:', error); return null; }
  return data;
}
async function updateLibraryPaper(id, patch){
  const p = { ...patch, updated_at: new Date().toISOString() };
  delete p.groupIds; delete p.library_paper_groups;
  const { error } = await window.sb.from('library_papers').update(p).eq('id', id);
  if(error){ console.error('library_papers 수정 실패:', error); return false; }
  return true;
}
async function deleteLibraryPaper(id){
  const { error } = await window.sb.from('library_papers').delete().eq('id', id);
  if(error){ console.error('library_papers 삭제 실패:', error); return false; }
  return true;
}
async function getLibraryGroups(){
  const { data, error } = await window.sb.from('library_groups').select('*').order('created_at', { ascending: true });
  if(error){ console.error('library_groups 조회 실패:', error); return []; }
  return data||[];
}
async function insertLibraryGroup(name, color){
  const { data, error } = await window.sb.from('library_groups')
    .insert({ name, color, user_id: state.currentUser.id }).select().single();
  if(error){ console.error('library_groups 삽입 실패:', error); return null; }
  return data;
}
async function updateLibraryGroup(id, patch){
  const { error } = await window.sb.from('library_groups').update(patch).eq('id', id);
  if(error){ console.error('library_groups 수정 실패:', error); return false; }
  return true;
}
async function deleteLibraryGroup(id){
  const { error } = await window.sb.from('library_groups').delete().eq('id', id);
  if(error){ console.error('library_groups 삭제 실패:', error); return false; }
  return true;
}
async function setLibraryPaperGroups(paperId, groupIds){
  await window.sb.from('library_paper_groups').delete().eq('paper_id', paperId);
  if(!groupIds.length) return true;
  const { error } = await window.sb.from('library_paper_groups')
    .insert(groupIds.map(gid => ({ paper_id: paperId, group_id: gid })));
  if(error){ console.error('library_paper_groups 저장 실패:', error); return false; }
  return true;
}
async function fetchDOIMetadata(doi){
  try{
    const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi.trim())}`);
    if(!res.ok) return null;
    const { message: w } = await res.json();
    if(!w) return null;
    return {
      title: (w.title||[])[0]||'',
      authors: (w.author||[]).map(a => [a.family,a.given].filter(Boolean).join(', ')),
      journal: (w['container-title']||[])[0]||'',
      year: w.published?.['date-parts']?.[0]?.[0] || w['published-print']?.['date-parts']?.[0]?.[0] || null
    };
  }catch(e){ console.error('CrossRef API 실패:', e); return null; }
}

async function renderLibrary(){
  const main = document.getElementById('main-content');
  main.innerHTML = `<div style="padding:40px;color:var(--ink-faint);font-size:13px;">논문 라이브러리를 불러오는 중…</div>`;
  const [papers, groups] = await Promise.all([getLibraryPapers(), getLibraryGroups()]);
  libState.papers = papers; libState.groups = groups; libState.loaded = true;
  _renderLibraryLayout();
}

function _renderLibraryLayout(){
  const main = document.getElementById('main-content');
  const allAlloySystems = [...new Set(libState.papers.flatMap(p => p.alloy_systems||[]))].sort();
  main.innerHTML = `
  <div class="lib-page">
    <div class="lib-toolbar">
      <div style="display:flex;align-items:center;gap:8px;">
        <button class="btn small" onclick="openAddPaperModal()">+ 논문 추가</button>
        <button class="btn secondary small" onclick="openManageGroupsModal()">그룹 관리</button>
      </div>
      <input type="text" class="lib-search" id="lib-search" placeholder="제목 · 저자 · 저널 검색…" value="${escapeHtml(libState.searchQuery)}" oninput="libState.searchQuery=this.value;_reRenderLibList()">
    </div>
    <div class="lib-layout">
      <div class="lib-sidebar">
        <div class="lib-filter-section">
          <div class="lib-filter-label">그룹</div>
          <div class="lib-filter-options">
            <button class="lib-filter-btn ${!libState.filterGroupId?'active':''}" onclick="libState.filterGroupId=null;_reRenderLibList()">전체</button>
            ${libState.groups.map(g=>`<button class="lib-filter-btn ${libState.filterGroupId===g.id?'active':''}" style="${libState.filterGroupId===g.id?`background:${g.color};border-color:${g.color};color:#fff;`:''}" onclick="libState.filterGroupId='${g.id}';_reRenderLibList()">${escapeHtml(g.name)}</button>`).join('')}
          </div>
        </div>
        ${allAlloySystems.length?`
        <div class="lib-filter-section">
          <div class="lib-filter-label">합금계</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;">
            ${allAlloySystems.map(a=>`<button class="lib-alloy-tag ${libState.filterAlloy===a?'active':''}" onclick="libState.filterAlloy=libState.filterAlloy==='${escapeHtml(a).replace(/'/g,"\\'")}' ? '' : '${escapeHtml(a).replace(/'/g,"\\'")}';_reRenderLibList()">${escapeHtml(a)}</button>`).join('')}
          </div>
        </div>`:''}
        <div id="lib-list" class="lib-list"></div>
      </div>
      <div class="lib-detail" id="lib-detail">
        <div class="lib-detail-empty">
          <div style="font-size:40px;margin-bottom:12px;">📚</div>
          <div style="font-size:15px;font-weight:600;margin-bottom:6px;color:var(--ink);">논문을 선택하세요</div>
          <div style="font-size:13px;color:var(--ink-soft);">왼쪽 목록에서 논문을 클릭하면<br>상세 정보와 차트를 볼 수 있습니다.</div>
        </div>
      </div>
    </div>
  </div>`;
  _reRenderLibList();
  if(libState.selectedPaperId && libState.papers.find(p=>p.id===libState.selectedPaperId)){
    renderLibraryDetail(libState.selectedPaperId);
  }
}

function _libFilteredPapers(){
  return libState.papers.filter(p => {
    if(libState.filterGroupId && !(p.groupIds||[]).includes(libState.filterGroupId)) return false;
    if(libState.filterAlloy && !(p.alloy_systems||[]).includes(libState.filterAlloy)) return false;
    if(libState.searchQuery){
      const q = libState.searchQuery.toLowerCase();
      if(![p.title, p.journal, ...(p.authors_json||[])].join(' ').toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

function _reRenderLibList(){
  const listEl = document.getElementById('lib-list');
  if(!listEl) return;
  const papers = _libFilteredPapers();
  if(!papers.length){
    listEl.innerHTML = `<div style="padding:24px;text-align:center;color:var(--ink-faint);font-size:13px;">${libState.papers.length===0?`아직 논문이 없어요.<br><br><button class="btn small" onclick="openAddPaperModal()">첫 논문 추가하기</button>`:'검색 결과가 없어요.'}</div>`;
    return;
  }
  listEl.innerHTML = papers.map(p => {
    const stars = '★'.repeat(p.importance||3)+'☆'.repeat(5-(p.importance||3));
    const dots = (p.groupIds||[]).map(gid=>{ const g=libState.groups.find(x=>x.id===gid); return g?`<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${g.color};"></span>`:''; }).join('');
    return `<div class="lib-paper-card ${p.id===libState.selectedPaperId?'selected':''}" onclick="renderLibraryDetail('${p.id}')">
      <div class="lib-paper-card-head"><div style="display:flex;gap:3px;align-items:center;">${dots}</div><span class="lib-stars">${stars}</span></div>
      <div class="lib-paper-title">${escapeHtml(p.title||'(제목 없음)')}</div>
      <div class="lib-paper-meta">${[p.journal, p.year, (p.alloy_systems||[]).join(', ')].filter(Boolean).join(' · ')}</div>
    </div>`;
  }).join('');
}

function renderLibraryDetail(paperId){
  libState.selectedPaperId = paperId;
  document.querySelectorAll('.lib-paper-card').forEach(el => {
    el.classList.toggle('selected', el.getAttribute('onclick')?.includes(`'${paperId}'`));
  });
  const paper = libState.papers.find(p=>p.id===paperId);
  if(!paper) return;
  const detailEl = document.getElementById('lib-detail');
  if(!detailEl) return;
  const paperGroups = (paper.groupIds||[]).map(gid=>libState.groups.find(g=>g.id===gid)).filter(Boolean);
  const rawComps = paper.compositions;
  const cd = _libGetCompData(paper);
  const hasComps = cd.base || cd.others.length > 0;
  const dps = paper.data_points||[];
  const papersWithData = libState.papers.filter(p=>(p.data_points||[]).some(dp=>dp.conductivity!=null));

  detailEl.innerHTML = `
  <div class="lib-detail-inner">
    <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:16px;">
      <h2 class="lib-paper-detail-title" style="flex:1;">${escapeHtml(paper.title||'(제목 없음)')}</h2>
      <div style="display:flex;gap:6px;flex-shrink:0;">
        <button class="btn secondary small" onclick="openEditPaperModal('${paperId}')">편집</button>
        <button class="btn secondary small" style="color:var(--brick);" onclick="confirmDeleteLibraryPaper('${paperId}')">삭제</button>
      </div>
    </div>
    ${paper.doi?`<div style="font-size:12px;color:var(--brand);font-family:monospace;margin-bottom:12px;">DOI: ${escapeHtml(paper.doi)}</div>`:''}

    <div class="lib-pdf-bar">
      ${paper.pdf_path
        ? `<button class="btn small" onclick="openPdfViewer('${paperId}')">📄 PDF 보기</button>
           <button class="btn secondary small" onclick="uploadPaperPdf('${paperId}')">교체</button>`
        : `<button class="btn secondary small" onclick="uploadPaperPdf('${paperId}')">📎 PDF 업로드</button>`}
    </div>

    <div class="lib-section">
      <div style="display:flex;flex-wrap:wrap;gap:20px;font-size:13px;">
        ${paper.authors_json?.length?`<div><div class="lib-section-label">저자</div><div style="color:var(--ink-soft);">${escapeHtml(paper.authors_json.slice(0,3).join('; '))+(paper.authors_json.length>3?' et al.':'')}</div></div>`:''}
        ${paper.journal?`<div><div class="lib-section-label">저널</div><div style="color:var(--ink-soft);">${escapeHtml(paper.journal)}</div></div>`:''}
        ${paper.year?`<div><div class="lib-section-label">연도</div><div style="color:var(--ink-soft);">${paper.year}</div></div>`:''}
        <div><div class="lib-section-label">중요도</div><div style="color:var(--gold);">${'★'.repeat(paper.importance||3)}${'☆'.repeat(5-(paper.importance||3))}</div></div>
      </div>
    </div>

    <div class="lib-section">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <div class="lib-section-label" style="margin:0;">그룹</div>
        <button class="btn secondary small" onclick="openAssignGroupModal('${paperId}')">지정</button>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">
        ${paperGroups.map(g=>`<span class="lib-group-tag" style="background:${g.color}22;color:${g.color};border-color:${g.color}55;">${escapeHtml(g.name)}</span>`).join('')}
        ${!paperGroups.length?`<span style="font-size:12px;color:var(--ink-faint);">없음</span>`:''}
      </div>
    </div>

    <div class="lib-section">
      <div class="lib-section-label">합금계 태그</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">
        ${(paper.alloy_systems||[]).map(a=>`<span class="lib-alloy-tag active">${escapeHtml(a)}</span>`).join('')}
        ${!(paper.alloy_systems||[]).length?`<span style="font-size:12px;color:var(--ink-faint);">없음</span>`:''}
      </div>
    </div>

    ${hasComps?`<div class="lib-section">
      <div class="lib-section-label">합금 조성 (${escapeHtml(cd.unit||'wt%')})</div>
      <div class="lib-comp-table">
        ${cd.others.map(c=>`<div class="lib-comp-row"><span class="lib-comp-el">${escapeHtml(c.element||'')}</span><span class="lib-comp-val">${c.amount!=null?c.amount:''} ${escapeHtml(cd.unit||'wt%')}</span></div>`).join('')}
        ${cd.base?`<div class="lib-comp-row lib-comp-row-base"><span class="lib-comp-el">${escapeHtml(cd.base)}</span><span class="lib-comp-val">bal. ${cd.baseAmount!=null?cd.baseAmount:''} ${escapeHtml(cd.unit||'wt%')}</span></div>`:''}
      </div>
    </div>`:''}

    ${paper.novelty?`<div class="lib-section"><div class="lib-section-label">Novelty / 핵심 기여</div><div class="lib-text-content">${escapeHtml(paper.novelty)}</div></div>`:''}
    ${paper.cite_when?`<div class="lib-section"><div class="lib-section-label">인용 시점</div><div class="lib-text-content">${escapeHtml(paper.cite_when)}</div></div>`:''}

    <div class="lib-section">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <div class="lib-section-label" style="margin:0;">데이터 포인트 (전기전도도 · 경도 · 강도)</div>
        <button class="btn secondary small" onclick="openDataPointsModal('${paperId}')">편집</button>
      </div>
      ${dps.length?`<table class="lib-dp-table"><thead><tr><th>Label</th><th>전기전도도 (%IACS)</th><th>경도 (HV)</th><th>강도 (MPa)</th></tr></thead>
      <tbody>${dps.map(dp=>`<tr><td>${escapeHtml(dp.label||'')}</td><td>${dp.conductivity!=null?dp.conductivity:'-'}</td><td>${dp.hardness!=null?dp.hardness:'-'}</td><td>${dp.strength!=null?dp.strength:'-'}</td></tr>`).join('')}</tbody></table>`
      :`<div style="font-size:12px;color:var(--ink-faint);">데이터 없음 — "편집"을 눌러 추가하세요</div>`}
    </div>

    ${papersWithData.length?`<div class="lib-section" style="border-bottom:none;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
        <div class="lib-section-label" style="margin:0;">전기전도도 – 물성 맵 (전체 라이브러리)</div>
        <div style="display:flex;gap:6px;">
          <button class="btn secondary small ${libState.chartYAxis==='hardness'?'active':''}" onclick="libState.chartYAxis='hardness';renderLibraryDetail('${paperId}')">경도 (HV)</button>
          <button class="btn secondary small ${libState.chartYAxis==='strength'?'active':''}" onclick="libState.chartYAxis='strength';renderLibraryDetail('${paperId}')">강도 (MPa)</button>
        </div>
      </div>
      <div id="lib-chart-container" class="lib-chart-container"></div>
    </div>`:''}
  </div>`;

  if(papersWithData.length) setTimeout(()=>_renderConductivityChart(papersWithData, paperId), 0);
}

function _renderConductivityChart(papers, highlightId){
  const container = document.getElementById('lib-chart-container');
  if(!container) return;
  const yKey = libState.chartYAxis;
  const yLabel = yKey==='hardness'?'경도 (HV)':'강도 (MPa)';
  const allPts = [];
  papers.forEach(p => {
    const gc = (() => { if(!(p.groupIds||[]).length) return '#6b7280'; const g=libState.groups.find(x=>x.id===p.groupIds[0]); return g?g.color:'#6b7280'; })();
    (p.data_points||[]).forEach(dp => {
      if(dp.conductivity!=null && dp[yKey]!=null)
        allPts.push({ x:dp.conductivity, y:dp[yKey], label:dp.label||'', title:p.title||'', color:gc, hi:p.id===highlightId });
    });
  });
  if(!allPts.length){ container.innerHTML='<div style="padding:20px;color:var(--ink-faint);font-size:12px;text-align:center;">표시할 데이터가 없어요</div>'; return; }

  const W = Math.max(container.clientWidth||440, 300), H = 300;
  const pad = {top:24,right:24,bottom:52,left:58};
  const xs=allPts.map(p=>p.x), ys=allPts.map(p=>p.y);
  const xSpan=Math.max(...xs)-Math.min(...xs)||10, ySpan=Math.max(...ys)-Math.min(...ys)||50;
  const xMin=Math.min(...xs)-xSpan*0.1, xMax=Math.max(...xs)+xSpan*0.1;
  const yMin=Math.min(...ys)-ySpan*0.12, yMax=Math.max(...ys)+ySpan*0.12;
  const px=v=>pad.left+(v-xMin)/(xMax-xMin)*(W-pad.left-pad.right);
  const py=v=>pad.top+(yMax-v)/(yMax-yMin)*(H-pad.top-pad.bottom);
  const nTX=5, nTY=5;
  const txs=Array.from({length:nTX+1},(_,i)=>xMin+i*(xMax-xMin)/nTX);
  const tys=Array.from({length:nTY+1},(_,i)=>yMin+i*(yMax-yMin)/nTY);
  const grid=[...txs.map(v=>`<line x1="${px(v)}" y1="${pad.top}" x2="${px(v)}" y2="${H-pad.bottom}" stroke="var(--line)" stroke-width="1"/>`),
              ...tys.map(v=>`<line x1="${pad.left}" y1="${py(v)}" x2="${W-pad.right}" y2="${py(v)}" stroke="var(--line)" stroke-width="1"/>`)].join('');
  const xlabels=txs.map(v=>`<text x="${px(v)}" y="${H-pad.bottom+16}" text-anchor="middle" font-size="10" fill="var(--ink-faint)">${v.toFixed(1)}</text>`).join('');
  const ylabels=tys.map(v=>`<text x="${pad.left-7}" y="${py(v)+4}" text-anchor="end" font-size="10" fill="var(--ink-faint)">${Math.round(v)}</text>`).join('');
  const circles=allPts.map((pt,i)=>{
    const cx=px(pt.x),cy=py(pt.y),r=pt.hi?8:5;
    const safeTitle=pt.title.replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]));
    const safeLabel=pt.label.replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]));
    return pt.hi
      ? `<polygon points="${cx},${cy-r*1.3} ${cx+r*1.1},${cy+r*0.7} ${cx-r*1.1},${cy+r*0.7}" fill="${pt.color}" stroke="#fff" stroke-width="1.5" style="cursor:pointer;" data-title="${safeTitle}" data-label="${safeLabel}" data-x="${pt.x}" data-y="${pt.y}" onmouseenter="_libChartTip(this,'${escapeHtml(yLabel).replace(/'/g,"&#39;")}')" onmouseleave="_libChartHide()"/>`
      : `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${pt.color}99" stroke="${pt.color}" stroke-width="1" style="cursor:pointer;" data-title="${safeTitle}" data-label="${safeLabel}" data-x="${pt.x}" data-y="${pt.y}" onmouseenter="_libChartTip(this,'${escapeHtml(yLabel).replace(/'/g,"&#39;")}')" onmouseleave="_libChartHide()"/>`;
  }).join('');
  const legend=`<text x="${W-pad.right}" y="${pad.top-6}" text-anchor="end" font-size="10" fill="var(--ink-soft)">▲ 현재 선택 논문</text>`;

  container.innerHTML=`<div style="position:relative;">
    <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="display:block;width:100%;overflow:visible;">
      ${grid}${xlabels}${ylabels}${legend}
      <line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${H-pad.bottom}" stroke="var(--line-strong)" stroke-width="1.5"/>
      <line x1="${pad.left}" y1="${H-pad.bottom}" x2="${W-pad.right}" y2="${H-pad.bottom}" stroke="var(--line-strong)" stroke-width="1.5"/>
      <text x="${pad.left+(W-pad.left-pad.right)/2}" y="${H-4}" text-anchor="middle" font-size="11" fill="var(--ink-soft)">전기전도도 (%IACS)</text>
      <text transform="rotate(-90)" x="${-(pad.top+(H-pad.top-pad.bottom)/2)}" y="13" text-anchor="middle" font-size="11" fill="var(--ink-soft)">${yLabel}</text>
      ${circles}
    </svg>
    <div id="lib-tip" style="display:none;position:absolute;top:10px;left:50%;transform:translateX(-50%);background:var(--paper-card);border:1px solid var(--line);border-radius:var(--radius);padding:8px 12px;font-size:12px;line-height:1.6;pointer-events:none;box-shadow:var(--shadow-card);max-width:220px;white-space:pre-line;z-index:10;"></div>
  </div>`;
}
function _libChartTip(el, yLabel){
  const tip=document.getElementById('lib-tip');
  if(!tip) return;
  tip.style.display='block';
  tip.innerHTML=`<b>${el.dataset.title}</b>\n${el.dataset.label}\n전기전도도: ${el.dataset.x} %IACS\n${yLabel.split(' ')[0]}: ${el.dataset.y}`;
}
function _libChartHide(){ const t=document.getElementById('lib-tip'); if(t) t.style.display='none'; }

function openAddPaperModal(){ _openPaperModal(null); }
function openEditPaperModal(id){ _openPaperModal(id); }
const LIB_BASE_ELEMENTS = ['Al','Cu','Ni','Fe','Ti','Mg','Zn','Co','Ag','Au','Pt','Pb','Sn','Mo','W','Cr','Mn','V','Zr','Nb','Ta','Hf','Re','Ru','Ir','Pd','Rh'];

function _libGetCompData(paper){
  const c = paper?.compositions;
  if(!c) return { base:'', unit:'wt%', others:[] };
  if(Array.isArray(c)){
    // backward-compat: old flat array
    const baseEl = c.find(x=>x.isBase);
    return {
      base: baseEl?.element || '',
      unit: c[0]?.unit || 'wt%',
      others: c.filter(x=>!x.isBase).map(x=>({ element: x.element||'', amount: x.amount }))
    };
  }
  return { base: c.base||'', unit: c.unit||'wt%', others: c.others||[] };
}

function _openPaperModal(paperId){
  const paper=paperId?libState.papers.find(p=>p.id===paperId):null;
  const cd = _libGetCompData(paper);
  const modal=document.getElementById('modal-root');
  modal.innerHTML=`
  <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
    <div class="modal" style="max-width:620px;max-height:90vh;overflow-y:auto;">
      <div class="modal-head"><h3>${paper?'논문 수정':'논문 추가'}</h3><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="field-row" style="margin-bottom:16px;">
          <label>DOI (자동 채우기)</label>
          <div style="display:flex;gap:8px;">
            <input type="text" id="lm-doi" style="flex:1;" class="field-input" placeholder="10.1016/j.actamat.2022.118484" value="${escapeHtml(paper?.doi||'')}">
            <button class="btn secondary small" onclick="libModalFetchDOI()">자동 채우기</button>
          </div>
        </div>
        <div class="field-row"><label>제목 <span style="color:var(--brick)">*</span></label><input type="text" id="lm-title" class="field-input" value="${escapeHtml(paper?.title||'')}" placeholder="논문 제목"></div>
        <div class="field-row"><label>저자 (쉼표 구분)</label><input type="text" id="lm-authors" class="field-input" value="${escapeHtml((paper?.authors_json||[]).join(', '))}" placeholder="Kim, J., Lee, S."></div>
        <div style="display:grid;grid-template-columns:1fr 100px;gap:12px;">
          <div class="field-row"><label>저널</label><input type="text" id="lm-journal" class="field-input" value="${escapeHtml(paper?.journal||'')}" placeholder="Acta Materialia"></div>
          <div class="field-row"><label>연도</label><input type="number" id="lm-year" class="field-input" value="${paper?.year||''}" placeholder="2024"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 110px;gap:12px;">
          <div class="field-row"><label>합금계 태그 (쉼표 구분)</label><input type="text" id="lm-alloys" class="field-input" value="${escapeHtml((paper?.alloy_systems||[]).join(', '))}" placeholder="Al-Cu, Al-Mg-Si"></div>
          <div class="field-row"><label>중요도</label><select id="lm-imp" class="field-input">${[1,2,3,4,5].map(n=>`<option value="${n}" ${(paper?.importance||3)===n?'selected':''}>${'★'.repeat(n)}</option>`).join('')}</select></div>
        </div>

        <!-- 합금 조성 -->
        <div class="field-row">
          <label>합금 조성</label>
          <!-- Base 원소 + 단위 선택 -->
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:10px;flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:12px;color:var(--ink-soft);">Base 원소</span>
              <select id="lm-base-el" class="field-input" style="width:90px;padding:5px 8px;" onchange="_libUpdateBase()">
                <option value="">선택</option>
                ${LIB_BASE_ELEMENTS.map(el=>`<option value="${el}" ${cd.base===el?'selected':''}>${el}</option>`).join('')}
              </select>
            </div>
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:12px;color:var(--ink-soft);">단위</span>
              <div class="lib-unit-toggle">
                <button type="button" class="lib-unit-btn ${cd.unit!=='at%'?'active':''}" id="lm-unit-wt" onclick="_libSetUnit('wt%')">wt%</button>
                <button type="button" class="lib-unit-btn ${cd.unit==='at%'?'active':''}" id="lm-unit-at" onclick="_libSetUnit('at%')">at%</button>
              </div>
            </div>
          </div>
          <!-- 컬럼 헤더 -->
          <div style="display:grid;grid-template-columns:1fr 1fr 28px;gap:6px;margin-bottom:4px;padding:0 2px;">
            <span style="font-size:11px;color:var(--ink-faint);font-weight:600;">원소</span>
            <span style="font-size:11px;color:var(--ink-faint);font-weight:600;">함량</span>
            <span></span>
          </div>
          <div id="lm-comps" data-unit="${cd.unit||'wt%'}">
            ${cd.others.map((c,i)=>_libCompRow(c,i)).join('')}
            ${cd.others.length===0?_libCompRow({element:'',amount:null},0):''}
          </div>
          <button class="btn secondary small" onclick="libModalAddComp()" style="margin-top:6px;">+ 원소 추가</button>
          <!-- Base 자동 계산 표시 -->
          <div id="lm-base-display" class="lib-base-display"></div>
        </div>

        <div class="field-row"><label>Novelty / 핵심 기여</label><textarea id="lm-novelty" class="field-input" rows="3" placeholder="이 논문의 핵심 novelty는…">${escapeHtml(paper?.novelty||'')}</textarea></div>
        <div class="field-row"><label>인용 시점</label><textarea id="lm-cite" class="field-input" rows="2" placeholder="고온 크리프 논의 시, 시효 처리 효과 분석 시…">${escapeHtml(paper?.cite_when||'')}</textarea></div>

        <div class="field-row">
          <label>PDF 첨부</label>
          <div class="lib-pdf-upload-row" id="lm-pdf-row">
            ${paper?.pdf_path
              ? `<span class="lib-pdf-attached">📄 PDF 있음</span>
                 <label class="btn secondary small" style="cursor:pointer;">교체
                   <input type="file" id="lm-pdf-input" accept="application/pdf" style="display:none;" onchange="_lmPdfSelected(this)">
                 </label>`
              : `<label class="btn secondary small" style="cursor:pointer;">📎 PDF 선택
                   <input type="file" id="lm-pdf-input" accept="application/pdf" style="display:none;" onchange="_lmPdfSelected(this)">
                 </label>
                 <span id="lm-pdf-name" style="font-size:12px;color:var(--ink-faint);">선택 안 됨</span>`}
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn secondary" onclick="closeModal()">취소</button>
        <button class="btn" onclick="saveLibraryPaperFromModal('${paperId||''}')">저장</button>
      </div>
    </div>
  </div>`;
  // 초기 base 표시
  setTimeout(_libUpdateBase, 0);
}
function _libCompRow(c,i){
  return `<div class="lib-comp-edit-row">
    <input type="text" class="lib-comp-el-input" placeholder="예: Cu, Zr, Mg" value="${escapeHtml(c.element||'')}" oninput="_libUpdateBase()">
    <input type="number" class="lib-comp-amt-input" placeholder="0.00" step="0.001" min="0" value="${c.amount!=null?c.amount:''}" oninput="_libUpdateBase()">
    <button class="btn secondary small" onclick="this.closest('.lib-comp-edit-row').remove();_libUpdateBase()" style="padding:4px 6px;">✕</button>
  </div>`;
}
function libModalAddComp(){
  document.getElementById('lm-comps')?.insertAdjacentHTML('beforeend',_libCompRow({element:'',amount:null},0));
  _libUpdateBase();
}
function _libSetUnit(unit){
  document.getElementById('lm-unit-wt')?.classList.toggle('active', unit==='wt%');
  document.getElementById('lm-unit-at')?.classList.toggle('active', unit==='at%');
  const compsEl = document.getElementById('lm-comps');
  if(compsEl) compsEl.dataset.unit = unit;
  _libUpdateBase();
}
function _libUpdateBase(){
  const baseEl = document.getElementById('lm-base-el')?.value || '';
  const unit = document.getElementById('lm-comps')?.dataset.unit || 'wt%';
  const amts = Array.from(document.querySelectorAll('.lib-comp-amt-input')).map(i=>parseFloat(i.value)||0);
  const total = amts.reduce((s,v)=>s+v, 0);
  const balance = parseFloat((100 - total).toFixed(4));
  const display = document.getElementById('lm-base-display');
  if(!display) return;
  if(!baseEl){
    display.innerHTML = `<div style="font-size:12px;color:var(--ink-faint);margin-top:8px;">Base 원소를 선택하면 잔량이 자동 계산됩니다.</div>`;
    return;
  }
  const overWarn = total > 100 ? `<span style="color:var(--brick);font-size:11px;margin-left:8px;">⚠ 합계 ${total.toFixed(3)}% — 100%를 초과해요</span>` : '';
  display.innerHTML = `<div class="lib-base-row">
    <span class="lib-comp-el" style="font-size:13px;">${escapeHtml(baseEl)}</span>
    <span style="color:var(--ink-faint);font-size:12px;">bal.</span>
    <span style="font-weight:600;color:var(--ink);font-size:13px;">${balance > 0 ? balance : 0} ${unit}</span>
    ${overWarn}
  </div>`;
}
async function libModalFetchDOI(){
  const doi=document.getElementById('lm-doi')?.value.trim();
  if(!doi) return;
  showToast('DOI 검색 중…');
  const meta=await fetchDOIMetadata(doi);
  if(!meta){ showToast('DOI를 찾을 수 없어요. 직접 입력해주세요.'); return; }
  const s=(id,v)=>{ const e=document.getElementById(id); if(e) e.value=v; };
  s('lm-title',meta.title); s('lm-authors',meta.authors.join(', ')); s('lm-journal',meta.journal);
  if(meta.year) s('lm-year',meta.year);
  showToast('자동으로 채워졌어요!');
}
function _lmPdfSelected(input){
  const file = input.files[0];
  const nameEl = document.getElementById('lm-pdf-name');
  if(nameEl) nameEl.textContent = file ? file.name : '선택 안 됨';
}

async function saveLibraryPaperFromModal(paperId){
  const title=document.getElementById('lm-title')?.value.trim();
  if(!title){ showToast('제목을 입력해주세요'); return; }
  const baseEl = document.getElementById('lm-base-el')?.value.trim() || '';
  const unit = document.getElementById('lm-comps')?.dataset.unit || 'wt%';
  const others = Array.from(document.querySelectorAll('.lib-comp-edit-row')).map(r=>({
    element: r.querySelector('.lib-comp-el-input')?.value.trim()||'',
    amount: parseFloat(r.querySelector('.lib-comp-amt-input')?.value) ?? null
  })).filter(c=>c.element && c.amount!=null);
  const totalOthers = others.reduce((s,c)=>s+(c.amount||0), 0);
  const compositions = { base: baseEl, unit, others, baseAmount: parseFloat(Math.max(0, 100-totalOthers).toFixed(4)) };
  const pdfFile = document.getElementById('lm-pdf-input')?.files[0] || null;
  const patch={
    doi:document.getElementById('lm-doi')?.value.trim()||null,
    title,
    authors_json:(document.getElementById('lm-authors')?.value||'').split(',').map(s=>s.trim()).filter(Boolean),
    journal:document.getElementById('lm-journal')?.value.trim()||'',
    year:parseInt(document.getElementById('lm-year')?.value)||null,
    alloy_systems:(document.getElementById('lm-alloys')?.value||'').split(',').map(s=>s.trim()).filter(Boolean),
    importance:parseInt(document.getElementById('lm-imp')?.value)||3,
    compositions,
    novelty:document.getElementById('lm-novelty')?.value.trim()||'',
    cite_when:document.getElementById('lm-cite')?.value.trim()||''
  };
  closeModal();
  showToast(pdfFile ? '저장 및 PDF 업로드 중…' : '저장 중…');
  let savedId = paperId;
  if(paperId){
    const ok=await updateLibraryPaper(paperId,patch);
    if(!ok){ showToast('저장 실패'); return; }
    const idx=libState.papers.findIndex(p=>p.id===paperId);
    if(idx>=0) libState.papers[idx]={...libState.papers[idx],...patch};
  } else {
    const np=await insertLibraryPaper(patch);
    if(!np){ showToast('저장 실패'); return; }
    savedId = np.id;
    libState.papers.unshift({...np,groupIds:[],data_points:[]});
    libState.selectedPaperId=np.id;
  }
  // PDF 업로드 (파일이 선택된 경우)
  if(pdfFile && savedId){
    if(pdfFile.size > 50*1024*1024){ showToast('PDF 50MB 초과 — 저장은 완료됐어요'); }
    else {
      const path = `${state.currentUser.id}/${savedId}.pdf`;
      const { error } = await window.sb.storage.from('library-pdfs').upload(path, pdfFile, {upsert:true, contentType:'application/pdf'});
      if(error){ showToast('PDF 업로드 실패: '+error.message); }
      else {
        await window.sb.from('library_papers').update({pdf_path:path}).eq('id',savedId);
        const paper = libState.papers.find(p=>p.id===savedId);
        if(paper) paper.pdf_path = path;
        showToast('저장 및 PDF 업로드 완료!');
      }
    }
  } else {
    showToast('저장됐어요');
  }
  _renderLibraryLayout();
}
async function confirmDeleteLibraryPaper(paperId){
  if(!confirm('이 논문을 라이브러리에서 삭제할까요?')) return;
  showToast('삭제 중…');
  const ok=await deleteLibraryPaper(paperId);
  if(!ok){ showToast('삭제 실패'); return; }
  libState.papers=libState.papers.filter(p=>p.id!==paperId);
  libState.selectedPaperId=null;
  showToast('삭제됐어요'); _renderLibraryLayout();
}

function openDataPointsModal(paperId){
  const paper=libState.papers.find(p=>p.id===paperId);
  if(!paper) return;
  const dps=paper.data_points||[];
  document.getElementById('modal-root').innerHTML=`
  <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
    <div class="modal" style="max-width:580px;max-height:85vh;overflow-y:auto;">
      <div class="modal-head"><h3>데이터 포인트 편집</h3><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <p style="font-size:12.5px;color:var(--ink-soft);margin:0 0 14px;">각 처리 조건별로 전도도(%IACS) · 경도(HV) · 강도(MPa)를 입력하면 맵 차트에 표시됩니다.</p>
        <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr 30px;gap:6px;margin-bottom:4px;padding:0 2px;">
          <span style="font-size:11px;color:var(--ink-faint);font-weight:600;">Label</span>
          <span style="font-size:11px;color:var(--ink-faint);font-weight:600;">%IACS</span>
          <span style="font-size:11px;color:var(--ink-faint);font-weight:600;">HV</span>
          <span style="font-size:11px;color:var(--ink-faint);font-weight:600;">MPa</span>
          <span></span>
        </div>
        <div id="lm-dp-rows">${dps.map((dp,i)=>_libDpRow(dp,i)).join('')}${dps.length===0?_libDpRow({label:'',conductivity:'',hardness:'',strength:''},0):''}</div>
        <button class="btn secondary small" onclick="libAddDpRow()" style="margin-top:8px;">+ 포인트 추가</button>
      </div>
      <div class="modal-actions"><button class="btn secondary" onclick="closeModal()">취소</button><button class="btn" onclick="saveDpFromModal('${paperId}')">저장</button></div>
    </div>
  </div>`;
}
function _libDpRow(dp,i){
  return `<div class="lib-dp-edit-row">
    <input type="text" class="lm-dp-label" placeholder="As-cast, 200°C/2h…" value="${escapeHtml(dp.label||'')}">
    <input type="number" class="lm-dp-cond" placeholder="%IACS" step="0.1" value="${dp.conductivity!=null?dp.conductivity:''}">
    <input type="number" class="lm-dp-hv" placeholder="HV" step="0.1" value="${dp.hardness!=null?dp.hardness:''}">
    <input type="number" class="lm-dp-mpa" placeholder="MPa" step="1" value="${dp.strength!=null?dp.strength:''}">
    <button class="btn secondary small" onclick="this.closest('.lib-dp-edit-row').remove()" style="padding:4px 6px;flex-shrink:0;">✕</button>
  </div>`;
}
function libAddDpRow(){
  document.getElementById('lm-dp-rows')?.insertAdjacentHTML('beforeend',_libDpRow({label:'',conductivity:'',hardness:'',strength:''},0));
}
async function saveDpFromModal(paperId){
  const data_points=Array.from(document.querySelectorAll('.lib-dp-edit-row')).map(r=>({
    label:r.querySelector('.lm-dp-label')?.value.trim()||'',
    conductivity:parseFloat(r.querySelector('.lm-dp-cond')?.value)||null,
    hardness:parseFloat(r.querySelector('.lm-dp-hv')?.value)||null,
    strength:parseFloat(r.querySelector('.lm-dp-mpa')?.value)||null
  })).filter(dp=>dp.conductivity!=null||dp.hardness!=null||dp.strength!=null);
  closeModal(); showToast('저장 중…');
  const ok=await updateLibraryPaper(paperId,{data_points});
  if(!ok){ showToast('저장 실패'); return; }
  const idx=libState.papers.findIndex(p=>p.id===paperId);
  if(idx>=0) libState.papers[idx].data_points=data_points;
  showToast('저장됐어요'); renderLibraryDetail(paperId);
}

function openManageGroupsModal(){ _renderGroupsModal(); }
function _renderGroupsModal(){
  const GCOLS=['#6366f1','#3b82f6','#0ea5e9','#10b981','#f59e0b','#f97316','#ef4444','#8b5cf6','#ec4899','#6b7280'];
  document.getElementById('modal-root').innerHTML=`
  <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
    <div class="modal" style="max-width:420px;">
      <div class="modal-head"><h3>그룹 관리</h3><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div id="lm-group-list">${libState.groups.map(g=>`
          <div class="lib-group-row" data-gid="${g.id}">
            <span class="lib-group-dot" style="background:${g.color};"></span>
            <input type="text" class="lib-group-name-input" value="${escapeHtml(g.name)}" onchange="updateLibraryGroup('${g.id}',{name:this.value})">
            <button class="btn secondary small" style="color:var(--brick);padding:2px 8px;" onclick="libDeleteGroup('${g.id}')">삭제</button>
          </div>`).join('')}</div>
        <div style="display:flex;gap:8px;align-items:center;margin-top:14px;">
          <input type="text" id="lm-gnew" class="field-input" style="flex:1;" placeholder="새 그룹 이름">
          <input type="color" id="lm-gcol" value="${GCOLS[libState.groups.length%GCOLS.length]}" style="width:36px;height:32px;border:1px solid var(--line);border-radius:var(--radius);cursor:pointer;padding:2px;">
          <button class="btn small" onclick="libAddGroup()">추가</button>
        </div>
      </div>
      <div class="modal-actions"><button class="btn" onclick="closeModal();_renderLibraryLayout()">완료</button></div>
    </div>
  </div>`;
}
async function libAddGroup(){
  const name=document.getElementById('lm-gnew')?.value.trim();
  const color=document.getElementById('lm-gcol')?.value||'#6366f1';
  if(!name){ showToast('그룹 이름을 입력해주세요'); return; }
  const g=await insertLibraryGroup(name,color);
  if(!g){ showToast('그룹 추가 실패'); return; }
  libState.groups.push(g); showToast('그룹이 추가됐어요'); _renderGroupsModal();
}
async function libDeleteGroup(gid){
  if(!confirm('이 그룹을 삭제할까요?')) return;
  const ok=await deleteLibraryGroup(gid);
  if(!ok){ showToast('삭제 실패'); return; }
  libState.groups=libState.groups.filter(g=>g.id!==gid);
  libState.papers.forEach(p=>{ p.groupIds=(p.groupIds||[]).filter(id=>id!==gid); });
  showToast('그룹이 삭제됐어요'); _renderGroupsModal();
}
function openAssignGroupModal(paperId){
  const paper=libState.papers.find(p=>p.id===paperId);
  if(!paper) return;
  document.getElementById('modal-root').innerHTML=`
  <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
    <div class="modal" style="max-width:360px;">
      <div class="modal-head"><h3>그룹 지정</h3><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        ${!libState.groups.length?`<div style="color:var(--ink-faint);font-size:13px;">그룹이 없어요. "그룹 관리"에서 먼저 만들어주세요.</div>`:
          libState.groups.map(g=>`<label style="display:flex;align-items:center;gap:10px;padding:8px 0;cursor:pointer;border-bottom:1px solid var(--line);">
            <input type="checkbox" value="${g.id}" ${(paper.groupIds||[]).includes(g.id)?'checked':''}>
            <span style="width:12px;height:12px;border-radius:50%;background:${g.color};flex-shrink:0;"></span>
            <span style="font-size:13px;">${escapeHtml(g.name)}</span>
          </label>`).join('')}
      </div>
      <div class="modal-actions"><button class="btn secondary" onclick="closeModal()">취소</button><button class="btn" onclick="saveAssignGroups('${paperId}')">저장</button></div>
    </div>
  </div>`;
}
async function saveAssignGroups(paperId){
  const groupIds=Array.from(document.querySelectorAll('#modal-root input[type=checkbox]:checked')).map(c=>c.value);
  closeModal(); showToast('저장 중…');
  const ok=await setLibraryPaperGroups(paperId,groupIds);
  if(!ok){ showToast('저장 실패'); return; }
  const idx=libState.papers.findIndex(p=>p.id===paperId);
  if(idx>=0) libState.papers[idx].groupIds=groupIds;
  showToast('그룹이 업데이트됐어요'); renderLibraryDetail(paperId); _reRenderLibList();
}

/* ============== PDF VIEWER ============== */
let pdfState = {
  pdfDoc: null, totalPages: 0, scale: 1.5,
  annotations: [], paperId: null, _pendingSel: null,
  layout: 'single', fullscreen: false, zoom: 1.0
};

function _initPdfJs(){
  if(window.pdfjsLib)
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

async function uploadPaperPdf(paperId){
  const input = document.createElement('input');
  input.type='file'; input.accept='application/pdf';
  input.onchange = async () => {
    const file = input.files[0];
    if(!file) return;
    if(file.size > 50*1024*1024){ showToast('50MB 이하 PDF만 업로드 가능합니다.'); return; }
    showToast('PDF 업로드 중…');
    const path = `${state.currentUser.id}/${paperId}.pdf`;
    const { error } = await window.sb.storage.from('library-pdfs').upload(path, file, {upsert:true, contentType:'application/pdf'});
    if(error){ showToast('업로드 실패: '+error.message); return; }
    const { error: e2 } = await window.sb.from('library_papers').update({pdf_path:path}).eq('id',paperId);
    if(e2){ showToast('저장 실패: '+e2.message); return; }
    const paper = libState.papers.find(p=>p.id===paperId);
    if(paper) paper.pdf_path = path;
    showToast('PDF 업로드 완료!');
    renderLibraryDetail(paperId);
  };
  input.click();
}

async function openPdfViewer(paperId){
  const paper = libState.papers.find(p=>p.id===paperId);
  if(!paper?.pdf_path){ showToast('업로드된 PDF가 없습니다.'); return; }
  _initPdfJs();
  if(!window.pdfjsLib){ showToast('PDF.js를 로드할 수 없습니다.'); return; }

  pdfState.paperId = paperId;
  pdfState.pdfDoc = null;
  pdfState.annotations = [];
  pdfState._pendingSel = null;

  document.getElementById('modal-root').innerHTML = `
    <div class="pdf-viewer-overlay" onclick="if(event.target===this)closePdfViewer()">
      <div class="pdf-viewer-modal" onclick="event.stopPropagation()">
        <div class="pdf-viewer-topbar">
          <span class="pdf-viewer-title">${escapeHtml(paper.title||'PDF 뷰어')}</span>
          <div style="display:flex;gap:6px;align-items:center;">
            <div class="pdf-layout-toggle">
              <button id="pdf-btn-single" class="pdf-layout-btn active" onclick="_pdfSetLayout('single')" title="1페이지">▣</button>
              <button id="pdf-btn-double" class="pdf-layout-btn" onclick="_pdfSetLayout('double')" title="2페이지 나란히">⊞</button>
            </div>
            <div class="pdf-zoom-ctrl">
              <button class="pdf-zoom-btn" onclick="_pdfZoom(-0.1)" title="축소">−</button>
              <span id="pdf-zoom-label" class="pdf-zoom-label">100%</span>
              <button class="pdf-zoom-btn" onclick="_pdfZoom(+0.1)" title="확대">＋</button>
            </div>
            <button class="btn secondary small" id="pdf-fs-btn" onclick="_pdfToggleFullscreen()">전체화면</button>
            <button class="btn secondary small" onclick="uploadPaperPdf('${paperId}')">PDF 교체</button>
            <button class="btn secondary small" onclick="closePdfViewer()">닫기</button>
          </div>
        </div>
        <div class="pdf-viewer-body">
          <div class="pdf-pages-panel" id="pdf-pages-panel">
            <div style="padding:40px;text-align:center;color:var(--ink-faint);font-size:13px;">PDF 불러오는 중…</div>
          </div>
          <div class="pdf-ann-panel">
            <div class="pdf-ann-panel-header">
              <span style="font-weight:600;font-size:13px;">메모 · 번역</span>
              <span id="pdf-ann-count" style="font-size:12px;color:var(--ink-faint);"></span>
            </div>
            <div class="pdf-ann-list" id="pdf-ann-list">
              <div class="pdf-ann-empty">PDF 텍스트를 드래그해서<br>하이라이트를 추가하세요</div>
            </div>
          </div>
        </div>
        <div id="pdf-sel-popup" class="pdf-sel-popup" style="display:none;"></div>
      </div>
    </div>`;

  // Load annotations
  const { data: annsData } = await window.sb.from('library_annotations')
    .select('*').eq('paper_id', paperId).order('page_num');
  pdfState.annotations = annsData || [];
  _renderPdfAnnList();

  // Get signed URL
  const { data: urlData, error: urlErr } = await window.sb.storage
    .from('library-pdfs').createSignedUrl(paper.pdf_path, 7200);
  if(urlErr || !urlData?.signedUrl){
    document.getElementById('pdf-pages-panel').innerHTML =
      `<div style="padding:24px;color:var(--brick);">PDF URL 로드 실패: ${escapeHtml(urlErr?.message||'')}</div>`;
    return;
  }

  // Load PDF
  try {
    const pdf = await pdfjsLib.getDocument({
      url: urlData.signedUrl,
      cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
      cMapPacked: true
    }).promise;
    pdfState.pdfDoc = pdf;
    pdfState.totalPages = pdf.numPages;
    await _pdfRenderAllPages();
  } catch(err){
    document.getElementById('pdf-pages-panel').innerHTML =
      `<div style="padding:24px;color:var(--brick);">PDF 로드 실패: ${escapeHtml(err.message)}</div>`;
  }
}

function closePdfViewer(){ document.getElementById('modal-root').innerHTML=''; }

function _pdfToggleFullscreen(){
  pdfState.fullscreen = !pdfState.fullscreen;
  const overlay = document.querySelector('.pdf-viewer-overlay');
  const btn = document.getElementById('pdf-fs-btn');
  if(overlay) overlay.classList.toggle('pdf-fs', pdfState.fullscreen);
  if(btn) btn.textContent = pdfState.fullscreen ? '창 모드' : '전체화면';
}

async function _pdfSetLayout(layout){
  if(pdfState.layout === layout) return;
  pdfState.layout = layout;
  pdfState.scale = layout === 'double' ? 0.9 : 1.5;
  document.getElementById('pdf-btn-single')?.classList.toggle('active', layout==='single');
  document.getElementById('pdf-btn-double')?.classList.toggle('active', layout==='double');
  if(pdfState.pdfDoc) await _pdfRenderAllPages();
}

function _pdfZoom(delta){
  pdfState.zoom = Math.min(3.0, Math.max(0.3, parseFloat((pdfState.zoom + delta).toFixed(2))));
  const panel = document.getElementById('pdf-pages-panel');
  if(panel) panel.style.zoom = pdfState.zoom;
  const label = document.getElementById('pdf-zoom-label');
  if(label) label.textContent = Math.round(pdfState.zoom * 100) + '%';
}

async function _pdfRenderAllPages(){
  const panel = document.getElementById('pdf-pages-panel');
  if(!panel || !pdfState.pdfDoc) return;
  panel.innerHTML = '';
  panel.classList.toggle('two-col', pdfState.layout==='double');

  for(let pn=1; pn<=pdfState.totalPages; pn++){
    const wrap = document.createElement('div');
    wrap.className = 'pdf-page-wrap';
    wrap.innerHTML = `<div class="pdf-page-label">p. ${pn}</div>`;
    const cw = document.createElement('div');
    cw.className = 'pdf-canvas-wrap';
    cw.id = `pdf-cw-${pn}`;
    const cv = document.createElement('canvas'); cv.id = `pdf-cv-${pn}`;
    const tl = document.createElement('div'); tl.className='pdf-text-layer'; tl.id=`pdf-tl-${pn}`;
    const hl = document.createElement('div'); hl.className='pdf-hl-layer'; hl.id=`pdf-hl-${pn}`;
    cw.appendChild(cv); cw.appendChild(tl); cw.appendChild(hl);
    wrap.appendChild(cw); panel.appendChild(wrap);
    _pdfRenderPage(pn);
  }
}

async function _pdfRenderPage(pn){
  if(!pdfState.pdfDoc) return;
  const page = await pdfState.pdfDoc.getPage(pn);
  const vp = page.getViewport({scale: pdfState.scale});
  const cv = document.getElementById(`pdf-cv-${pn}`);
  const tl = document.getElementById(`pdf-tl-${pn}`);
  const hl = document.getElementById(`pdf-hl-${pn}`);
  const cw = document.getElementById(`pdf-cw-${pn}`);
  if(!cv || !tl) return;

  cv.width = vp.width; cv.height = vp.height;
  [cw, tl, hl].forEach(el=>{ if(el){ el.style.width=vp.width+'px'; el.style.height=vp.height+'px'; }});

  await page.render({canvasContext: cv.getContext('2d'), viewport: vp}).promise;

  const tc = await page.getTextContent();
  tl.innerHTML = '';
  try {
    const r = pdfjsLib.renderTextLayer({textContent:tc, container:tl, viewport:vp, textDivs:[]});
    if(r?.promise) await r.promise;
    else if(r?.render) await r.render();
  } catch(e){ /* some versions differ */ }

  tl.addEventListener('mouseup', e => _pdfOnSelectionUp(e, pn, cw, vp));
  _pdfDrawHighlights(pn, vp);
}

function _pdfDrawHighlights(pn, vp){
  const hl = document.getElementById(`pdf-hl-${pn}`);
  if(!hl) return;
  hl.innerHTML = '';
  const COLS = {yellow:'#f59e0b', pink:'#ec4899', green:'#10b981', blue:'#3b82f6'};
  pdfState.annotations.filter(a=>a.page_num===pn).forEach(ann=>{
    const col = COLS[ann.color||'yellow'];
    (ann.rects||[]).forEach(r=>{
      const d = document.createElement('div');
      d.style.cssText = `position:absolute;pointer-events:auto;cursor:pointer;`
        +`left:${r.x*vp.width}px;top:${r.y*vp.height}px;`
        +`width:${r.w*vp.width}px;height:${r.h*vp.height}px;`
        +`background:${col}40;border-bottom:2.5px solid ${col};`;
      d.title = ann.memo||ann.selected_text?.substring(0,60)||'';
      d.onclick = () => _pdfScrollToAnn(ann.id);
      hl.appendChild(d);
    });
  });
}

function _pdfOnSelectionUp(e, pn, cwEl, vp){
  const sel = window.getSelection();
  if(!sel || sel.isCollapsed || !sel.toString().trim()){
    document.getElementById('pdf-sel-popup').style.display='none';
    pdfState._pendingSel = null; return;
  }
  const txt = sel.toString().trim();
  if(!txt) return;

  const range = sel.getRangeAt(0);
  const cwRect = cwEl.getBoundingClientRect();
  const rects = [];
  const crs = range.getClientRects();
  for(let i=0; i<crs.length; i++){
    const cr = crs[i];
    if(cr.width<2||cr.height<2) continue;
    rects.push({
      x:(cr.left-cwRect.left)/cwRect.width, y:(cr.top-cwRect.top)/cwRect.height,
      w:cr.width/cwRect.width, h:cr.height/cwRect.height
    });
  }
  pdfState._pendingSel = {pn, txt, rects};

  const popup = document.getElementById('pdf-sel-popup');
  const modal = document.querySelector('.pdf-viewer-modal');
  const mr = modal?.getBoundingClientRect()||{top:0,left:0};
  const sr = range.getBoundingClientRect();
  popup.style.display='block';
  popup.style.top=(sr.bottom-mr.top+6)+'px';
  popup.style.left=Math.max(4,sr.left-mr.left)+'px';
  popup.innerHTML = `
    <div class="pdf-sel-text">"${escapeHtml(txt.substring(0,60))}${txt.length>60?'…':''}"</div>
    <div class="pdf-sel-colors">
      <button class="pdf-color-btn" style="background:#f59e0b;" onclick="_pdfAddHighlight('yellow')" title="노랑">●</button>
      <button class="pdf-color-btn" style="background:#ec4899;" onclick="_pdfAddHighlight('pink')" title="분홍">●</button>
      <button class="pdf-color-btn" style="background:#10b981;" onclick="_pdfAddHighlight('green')" title="초록">●</button>
      <button class="pdf-color-btn" style="background:#3b82f6;" onclick="_pdfAddHighlight('blue')" title="파랑">●</button>
    </div>
    <button class="pdf-sel-cancel" onclick="document.getElementById('pdf-sel-popup').style.display='none'">취소</button>`;
}

async function _pdfAddHighlight(color){
  document.getElementById('pdf-sel-popup').style.display='none';
  window.getSelection()?.removeAllRanges();
  const s = pdfState._pendingSel;
  if(!s) return;
  pdfState._pendingSel = null;

  const { data, error } = await window.sb.from('library_annotations').insert({
    paper_id: pdfState.paperId,
    user_id: state.currentUser.id,
    page_num: s.pn,
    selected_text: s.txt,
    rects: s.rects,
    memo: '', translation: '', color
  }).select().single();
  if(error){ showToast('저장 실패: '+error.message); return; }

  pdfState.annotations.push(data);
  _renderPdfAnnList();

  const page = await pdfState.pdfDoc.getPage(s.pn);
  const vp = page.getViewport({scale:pdfState.scale});
  _pdfDrawHighlights(s.pn, vp);
  setTimeout(()=>_pdfScrollToAnn(data.id), 150);
}

function _pdfScrollToAnn(annId){
  const el = document.getElementById(`pdf-ann-${annId}`);
  if(!el) return;
  el.scrollIntoView({behavior:'smooth', block:'center'});
  document.querySelectorAll('.pdf-ann-item').forEach(e=>e.classList.remove('pdf-ann-active'));
  el.classList.add('pdf-ann-active');
  const m = el.querySelector('textarea');
  if(m && !m.value) setTimeout(()=>m.focus(), 100);
}

function _renderPdfAnnList(){
  const listEl = document.getElementById('pdf-ann-list');
  const countEl = document.getElementById('pdf-ann-count');
  if(!listEl) return;
  const sorted = [...pdfState.annotations].sort((a,b)=>a.page_num-b.page_num);
  if(countEl) countEl.textContent = sorted.length?`${sorted.length}개`:'';
  if(!sorted.length){
    listEl.innerHTML = '<div class="pdf-ann-empty">PDF 텍스트를 드래그해서<br>하이라이트를 추가하세요</div>';
    return;
  }
  const COLS={yellow:'#f59e0b', pink:'#ec4899', green:'#10b981', blue:'#3b82f6'};
  listEl.innerHTML = sorted.map(ann=>{
    const col=COLS[ann.color||'yellow'];
    return `<div class="pdf-ann-item" id="pdf-ann-${ann.id}">
      <div class="pdf-ann-item-top">
        <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${col};flex-shrink:0;"></span>
        <span style="font-size:11px;color:var(--ink-faint);flex:1;">p.${ann.page_num}</span>
        <button class="pdf-ann-del-btn" onclick="_pdfDeleteAnn('${ann.id}',${ann.page_num})" title="삭제">×</button>
      </div>
      <div class="pdf-ann-excerpt">"${escapeHtml((ann.selected_text||'').substring(0,70))}${(ann.selected_text||'').length>70?'…':''}"</div>
      <label class="pdf-ann-label">메모</label>
      <textarea class="pdf-ann-input" rows="2" placeholder="메모를 입력하세요…"
        oninput="pdfState.annotations.find(a=>a.id==='${ann.id}')&&(pdfState.annotations.find(a=>a.id==='${ann.id}').memo=this.value)"
        onblur="_pdfSaveAnn('${ann.id}')">${escapeHtml(ann.memo||'')}</textarea>
      <label class="pdf-ann-label">번역</label>
      <textarea class="pdf-ann-input" rows="2" placeholder="번역을 입력하세요…"
        oninput="pdfState.annotations.find(a=>a.id==='${ann.id}')&&(pdfState.annotations.find(a=>a.id==='${ann.id}').translation=this.value)"
        onblur="_pdfSaveAnn('${ann.id}')">${escapeHtml(ann.translation||'')}</textarea>
    </div>`;
  }).join('');
}

async function _pdfSaveAnn(annId){
  const ann = pdfState.annotations.find(a=>a.id===annId);
  if(!ann) return;
  await window.sb.from('library_annotations').update({memo:ann.memo||'',translation:ann.translation||''}).eq('id',annId);
}

async function _pdfDeleteAnn(annId, pn){
  if(!confirm('이 하이라이트를 삭제할까요?')) return;
  await window.sb.from('library_annotations').delete().eq('id',annId);
  pdfState.annotations = pdfState.annotations.filter(a=>a.id!==annId);
  _renderPdfAnnList();
  if(pdfState.pdfDoc){
    const page = await pdfState.pdfDoc.getPage(pn);
    const vp = page.getViewport({scale:pdfState.scale});
    _pdfDrawHighlights(pn, vp);
  }
}

/* ============== INIT ============== */
onAuthStateChange((event) => {
  if(event === 'SIGNED_OUT'){
    state.currentUser = null;
    showAuthScreen('signin');
  }
});

window.addEventListener('beforeunload', () => { leaveProjectRealtime(); });

// 탭을 다시 활성화하거나 네트워크가 복구됐을 때 채널이 죽어 있으면 재접속
function maybeReconnectRealtime(){
  if(!state.currentProjectId || !state.currentUser) return;
  const ch = state.realtimeChannel;
  if(!ch || ch.state !== 'joined') joinProjectRealtime(state.currentProjectId);
}
document.addEventListener('visibilitychange', () => {
  if(document.visibilityState === 'visible') maybeReconnectRealtime();
});
window.addEventListener('online', maybeReconnectRealtime);

initSelectionHighlightUI();

(async function initApp(){
  const session = await getSession();
  if(!session){ showAuthScreen('signin'); return; }
  await bootAfterAuth();
})();
