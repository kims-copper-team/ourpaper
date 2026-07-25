/* ============== DATA ============== */
const JOURNALS = {
  mmi: {
    name:'Metals and Materials International', field:'금속·재료 전반 (한국재료연구원·Springer 공동 발행)', color:'#2C5F6B',
    citation:'번호 인용 (본문 [3] 형식, 참고문헌도 번호순 정렬)', pageLimit:'게재료 페이지당 KRW 40,000 (한국 외 기관 소속 저자는 한시적 면제)', abstractLimit:250,
    note:'그래픽 초록(Graphical Abstract) 제출 필수 — EPS/TIFF/PDF로 별도 파일 제출, 원고 파일은 docx 권장',
    sections:[
      {key:'abstract', label:'Abstract', guidance:'150~250단어. 정의되지 않은 약어나 출처가 불명확한 인용은 사용하지 않음', limit:250},
      {key:'keywords', label:'Keywords', guidance:'색인용 핵심어 4~6개', limit:null},
      {key:'graphical_abstract', label:'Graphical Abstract 기획', guidance:'실제로는 그림 파일로 별도 제출하지만, 여기서는 어떤 이미지로 연구 핵심을 한 장에 담을지 메모해두는 칸', limit:null},
      {key:'introduction', label:'Introduction', guidance:'연구 배경과 목적, 기존 연구 대비 novelty를 제시', limit:null},
      {key:'experimental', label:'Experimental', guidance:'재료 조성, 공정 조건, 시험 방법을 재현 가능하도록 기술', limit:null},
      {key:'results_discussion', label:'Results and Discussion', guidance:'결과 제시와 해석을 함께 서술 (제목 체계는 1., 1.1, 1.1.1의 3단계 십진 헤딩 사용)', limit:null},
      {key:'conclusions', label:'Conclusions', guidance:'핵심 결론을 간결히 정리', limit:null},
      {key:'declarations', label:'Statements and Declarations', guidance:'Funding, Competing Interests 등을 참고문헌 앞에 별도 항목으로 명시 (필수 항목, 누락 시 반려)', limit:null},
      {key:'references', label:'References', guidance:'본문 인용 순서대로 번호를 매기고, 가능하면 DOI를 전체 링크로 포함', limit:null},
    ]
  },
  jmrt: {
    name:'Journal of Materials Research and Technology (JMRT)', field:'재료 전반 · 가공-구조-물성-성능 관계 (Brazilian Metallurgical Association 발행, Elsevier)', color:'#4E7A3B',
    citation:'Elsevier 번호 인용', pageLimit:'전면 골드 오픈 액세스 저널 (구독 옵션 없음, APC 발생 — 면제국 정책 확인)', abstractLimit:250,
    note:'투고 시 잠재 심사위원 최대 4인 추천 필요, Highlights·Graphical Abstract·데이터 가용성 성명·CRediT 저자 기여 명시 필수',
    sections:[
      {key:'highlights', label:'Highlights', guidance:'불릿 3~5개, 각 항목 85자(공백 포함) 이내로 연구 핵심 성과를 요약', limit:null},
      {key:'abstract', label:'Abstract', guidance:'250단어 이내. 목적·핵심 결과·주요 결론을 간결하게', limit:250},
      {key:'keywords', label:'Keywords', guidance:'색인용 핵심어', limit:null},
      {key:'introduction', label:'Introduction', guidance:'연구 배경과 목적, 기존 연구와의 차별점 제시', limit:null},
      {key:'experimental', label:'Materials and Methods', guidance:'재료·공정·분석 조건을 재현 가능하도록 상세히 기술', limit:null},
      {key:'results', label:'Results', guidance:'processing–structure–property–performance 관계가 드러나도록 결과 제시', limit:null},
      {key:'discussion', label:'Discussion', guidance:'결과 해석 및 기존 문헌과의 비교', limit:null},
      {key:'conclusions', label:'Conclusions', guidance:'핵심 결론을 간결히 정리', limit:null},
      {key:'declarations', label:'Declarations', guidance:'Funding, Competing Interests, Data Availability, CRediT 저자 기여 명시', limit:null},
      {key:'references', label:'References', guidance:'Elsevier 번호 인용 스타일 준수', limit:null},
    ]
  },
  scripta_mat: {
    name:'Scripta Materialia', field:'속보(rapid communication) · 단신 연구', color:'#9A5B2E',
    citation:'Elsevier 번호 인용 (elsarticle-num)', pageLimit:'본문 2,500단어 이내(그림·표·참고문헌 제외), 그림 최대 5개', abstractLimit:150,
    sections:[
      {key:'abstract', label:'Abstract', guidance:'150단어를 넘지 않게, 연구 목적·핵심 결과·주요 결론만 압축', limit:150},
      {key:'body', label:'Main Text', guidance:'속보 형식이라 Introduction/Methods/Results를 별도 절로 나누지 않고 하나의 흐름으로 서술 가능 (소제목은 선택)', limit:null},
      {key:'references', label:'References', guidance:'번호 인용, 분량이 짧으므로 핵심 문헌 위주로 선별', limit:null},
    ]
  },
  jac: {
    name:'Journal of Alloys and Compounds', field:'합금·화합물의 합성·구조·물성', color:'#6B6558',
    citation:'Elsevier 번호 인용 (본문에 [숫자] 표기, 등장 순서대로 번호 부여)', pageLimit:'연구논문 통상 6,000~8,000단어 (심사 단계에서 확인 필요)', abstractLimit:250,
    note:'게재 범위 제외: 액체합금, 강(steel), 마모(wear)·크리프·용접/접합 단독 연구, 고분자·유기재료, 배위화학, 이온성 액체, 단독 촉매 연구, 생화학',
    sections:[
      {key:'abstract', label:'Abstract', guidance:'250단어 이내. 인용 없이 독립적으로 이해 가능하도록 작성', limit:250},
      {key:'keywords', label:'Keywords', guidance:'색인용 핵심어', limit:null},
      {key:'introduction', label:'Introduction', guidance:'합금/화합물 연구의 배경과 학문적 의의를 제시', limit:null},
      {key:'experimental', label:'Experimental', guidance:'합성·제조 공정, 분석 장비 및 조건을 구체적으로 기술', limit:null},
      {key:'results_discussion', label:'Results and Discussion', guidance:'상변화·미세구조·물성 분석 결과를 통합적으로 논의 (Results/Discussion을 합친 구성이 일반적)', limit:null},
      {key:'conclusions', label:'Conclusions', guidance:'핵심 성과를 간결히 요약', limit:null},
      {key:'references', label:'References', guidance:'등장 순서대로 번호를 매겨 인용', limit:null},
    ]
  },
  msea: {
    name:'Materials Science and Engineering: A', field:'재료의 조직–물성 관계, 기계적 거동', color:'#4A4E5A',
    citation:'Elsevier 번호 인용', pageLimit:'분량 제한은 편집자 재량 (Short Communication은 2,000단어·그림 6개 이내)', abstractLimit:250,
    sections:[
      {key:'abstract', label:'Abstract', guidance:'250단어 이내로 목적·결과·결론을 압축', limit:250},
      {key:'introduction', label:'Introduction', guidance:'연구 동기와 기존 연구 대비 novelty 제시', limit:null},
      {key:'materials_methods', label:'Materials and Methods', guidance:'재료 조성, 가공·열처리 이력, 시험 방법을 상세히 기술', limit:null},
      {key:'results', label:'Results', guidance:'미세조직 관찰 및 물성 시험 결과 제시', limit:null},
      {key:'discussion', label:'Discussion', guidance:'조직-물성 상관관계를 중심으로 결과 해석', limit:null},
      {key:'conclusions', label:'Conclusions', guidance:'연구 결론을 항목별로 정리', limit:null},
      {key:'references', label:'References', guidance:'번호 인용 스타일 준수', limit:null},
    ]
  },
  mmta: {
    name:'Metallurgical and Materials Transactions A', field:'물리야금학 · 재료공정과학 (TMS/ASM, Springer)', color:'#8A3B24',
    citation:'TMS 지정 번호 인용 스타일 (Non-superscripted Number)', pageLimit:'TMS Manuscript Preparation Guidelines 기준 확인 필요', abstractLimit:250,
    sections:[
      {key:'abstract', label:'Abstract', guidance:'150~250단어. 인용이나 정의되지 않은 약어 사용 금지', limit:250},
      {key:'introduction', label:'Introduction', guidance:'연구 배경과 목적, 기존 연구와의 차별점을 제시', limit:null},
      {key:'experimental', label:'Experimental Procedure', guidance:'합금 조성, 공정 변수, 시험 절차를 구체적으로 명시', limit:null},
      {key:'results', label:'Results', guidance:'실험 결과를 표·그림 중심으로 제시', limit:null},
      {key:'discussion', label:'Discussion', guidance:'공정-조직-물성 관계에 대한 해석 및 기존 문헌과의 비교', limit:null},
      {key:'conclusions', label:'Conclusions', guidance:'핵심 결론을 간결히 정리', limit:null},
      {key:'references', label:'References', guidance:'TMS 지정 스타일(저자명: 저널명, 연도, 권, 페이지)로 작성', limit:null},
    ]
  },
  custom: {
    name:'사용자 정의 템플릿', field:'직접 구성', color:'#8A8574',
    citation:'직접 지정', pageLimit:'직접 지정', abstractLimit:null,
    sections:[
      {key:'sec_abstract_default', label:'초록', guidance:'', limit:null},
    ]
  }
};

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
  realtimeChannel:null, presenceUsers:{}, pendingRemoteEdits:{}
};

const LEDGER_KEYS = ['__members__', '__authors__', '__figures__', '__refs__', '__tables__', '__comments__'];
function isLedgerKey(key){ return LEDGER_KEYS.includes(key); }

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
      const list = (data||[]).map(row => ({
        id: row.id, title: row.title, journalId: row.journal_id,
        updatedAt: new Date(row.updated_at).getTime(),
        progress: computeProgressForRow(row)
      }));
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
  const row = {
    id, title: p.title, journal_id: p.journalId,
    custom_sections: p.journalId === 'custom' ? (p.customSections || []) : [],
    owner_id: session.user.id
  };
  const { error } = await window.sb.from('projects').insert(row);
  if(error){ console.error('프로젝트 생성 실패:', error); return { project:null, error }; }
  const now = Date.now();
  return { project: mapProjectRow({
    id, title: row.title, journal_id: row.journal_id, custom_sections: row.custom_sections,
    content: {}, editor_font_size: null, owner_id: row.owner_id,
    created_at: new Date(now).toISOString(), updated_at: new Date(now).toISOString()
  }), error:null };
}

function mapProjectRow(data){
  return {
    id: data.id, title: data.title, journalId: data.journal_id,
    customSections: data.journal_id === 'custom' ? (data.custom_sections || []) : undefined,
    content: data.content || {}, editorFontSize: data.editor_font_size || undefined,
    ownerId: data.owner_id,
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
  const patch = {
    title: p.title, journal_id: p.journalId,
    custom_sections: p.journalId === 'custom' ? (p.customSections || []) : [],
    content: p.content || {},
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
  return d.getFullYear()+'.'+String(d.getMonth()+1).padStart(2,'0')+'.'+String(d.getDate()).padStart(2,'0');
}
function wordCount(text){
  if(!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}
function getSections(project){
  if(project.journalId === 'custom') return project.customSections || [];
  return (JOURNALS[project.journalId] && JOURNALS[project.journalId].sections) || [];
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
  if(['abstract','keywords','graphical_abstract','highlights','declarations'].includes(sec.key)) return true;
  return /abstract|keyword|highlight|declaration|초록|키워드|하이라이트|선언/i.test(sec.label || '');
}
function looksLikeHtml(str){
  return !!str && /<[a-z][\s\S]*>/i.test(str);
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
  document.getElementById('tab-guide').classList.toggle('active', tab==='guide');
  document.getElementById('tab-admin').classList.toggle('active', tab==='admin');
  if(tab==='dashboard') renderDashboard();
  if(tab==='guide') renderGuide();
  if(tab==='admin') renderAdminPanel();
}

/* ============== DASHBOARD ============== */
async function renderDashboard(){
  const main = document.getElementById('main-content');
  main.innerHTML = `<div class="page-head">
      <h1>내 프로젝트</h1>
      <p>투고할 논문을 프로젝트 단위로 관리하세요. 저널을 정하면 해당 저널의 구성 형식에 맞춰 바로 집필을 시작할 수 있습니다.</p>
    </div>
    <div id="dash-grid" class="grid-cards"><div style="grid-column:1/-1;color:var(--ink-faint);font-family:'Courier New', '맑은 고딕', monospace;font-size:12px;">불러오는 중…</div></div>`;

  const { list, failed } = await getIndex();
  list.sort((a,b)=>b.updatedAt-a.updatedAt);
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

  let html = '';
  list.forEach((p, i) => {
    const j = JOURNALS[p.journalId] || JOURNALS.custom;
    const progress = p.progress || 0;
    let statusClass = 'status-none', statusLabel='시작 전';
    if(progress>0 && progress<100){ statusClass='status-doing'; statusLabel='작성 중'; }
    if(progress>=100){ statusClass='status-done'; statusLabel='완성'; }
    html += `<div class="index-card" style="--spine:${j.color}" onclick="openWorkspace('${p.id}')">
      <div class="card-no">NO. ${String(i+1).padStart(3,'0')}</div>
      <div class="card-title">${escapeHtml(p.title || '제목 없음')}</div>
      <div class="card-journal">${escapeHtml(j.name)}</div>
      <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
      <div class="card-foot">
        <span class="status-pill ${statusClass}">${statusLabel} · ${progress}%</span>
        <span class="card-date">${fmtDate(p.updatedAt)}</span>
      </div>
    </div>`;
  });
  html += `<button class="new-card" onclick="openNewProjectModal()"><div class="plus">+</div><span>새 프로젝트</span></button>`;
  grid.innerHTML = html;
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
          <label>투고할 저널 / 형식 선택</label>
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
  const draft = {
    title, journalId:newProjectSelectedJournal,
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
  const j = JOURNALS[project.journalId] || JOURNALS.custom;
  const secs = getSections(project);
  const isCustom = project.journalId === 'custom';
  const figCount = (state.figures || []).length;
  const refCount = (state.references || []).length;
  const authorCount = (state.authors || []).length;
  const tableCount = (state.tables || []).length;
  const memberCount = 1 + (state.members || []).length; // owner + invited participants
  const openCommentCount = (state.highlights || []).filter(h => !h.resolvedAt).length;

  const membersBtn = `<button class="toc-item toc-figures ${state.currentSectionKey==='__members__'?'active':''}" data-section-key="__members__" onclick="selectMembers()">
      <span class="toc-num">☺</span>
      <span class="toc-dot" style="visibility:hidden;"></span>
      <span style="flex:1;text-align:left;">팀원${state.membersLoadFailed ? ' ⚠' : ` (${memberCount})`}</span>
    </button>`;
  const commentsBtn = `<button class="toc-item toc-figures ${state.currentSectionKey==='__comments__'?'active':''}" data-section-key="__comments__" onclick="selectComments()">
      <span class="toc-num">✎</span>
      <span class="toc-dot" style="visibility:hidden;"></span>
      <span style="flex:1;text-align:left;">댓글${state.highlightsLoadFailed ? ' ⚠' : (openCommentCount ? ` (${openCommentCount})` : '')}</span>
    </button>`;
  const authorsBtn = `<button class="toc-item toc-figures ${state.currentSectionKey==='__authors__'?'active':''}" data-section-key="__authors__" onclick="selectAuthors()">
      <span class="toc-num">✎</span>
      <span class="toc-dot" style="visibility:hidden;"></span>
      <span style="flex:1;text-align:left;">Author Ledger${state.authorsLoadFailed ? ' ⚠' : (authorCount ? ` (${authorCount})` : '')}</span>
    </button>`;
  const figuresBtn = `<button class="toc-item toc-figures ${state.currentSectionKey==='__figures__'?'active':''}" data-section-key="__figures__" onclick="selectFigures()">
      <span class="toc-num">▤</span>
      <span class="toc-dot" style="visibility:hidden;"></span>
      <span style="flex:1;text-align:left;">Fig Ledger${state.figuresLoadFailed ? ' ⚠' : (figCount ? ` (${figCount})` : '')}</span>
    </button>`;
  const tablesBtn = `<button class="toc-item toc-figures ${state.currentSectionKey==='__tables__'?'active':''}" data-section-key="__tables__" onclick="selectTables()">
      <span class="toc-num">▦</span>
      <span class="toc-dot" style="visibility:hidden;"></span>
      <span style="flex:1;text-align:left;">Table Ledger${state.tablesLoadFailed ? ' ⚠' : (tableCount ? ` (${tableCount})` : '')}</span>
    </button>`;
  const refsBtn = `<button class="toc-item toc-figures ${state.currentSectionKey==='__refs__'?'active':''}" data-section-key="__refs__" onclick="selectReferences()">
      <span class="toc-num">§</span>
      <span class="toc-dot" style="visibility:hidden;"></span>
      <span style="flex:1;text-align:left;">Ref Ledger${state.referencesLoadFailed ? ' ⚠' : (refCount ? ` (${refCount})` : '')}</span>
    </button>
    <div class="toc-divider"></div>`;

  const tocItems = secs.map((s,i)=>{
    const filled = isSectionFilled(project, s);
    return `<button class="toc-item ${s.key===state.currentSectionKey?'active':''} ${filled?'filled':''}" data-section-key="${s.key}" onclick="selectSection('${s.key}')">
      <span class="toc-num">${String(i+1).padStart(2,'0')}</span>
      <span class="toc-dot"></span>
      <span style="flex:1;text-align:left;">${escapeHtml(s.label)}</span>
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
        ${membersBtn}
        ${commentsBtn}
        ${authorsBtn}
        ${figuresBtn}
        ${tablesBtn}
        ${refsBtn}
        ${tocItems}
        ${isCustom ? `<button class="toc-add-btn" onclick="addCustomSection()">+ 섹션 추가</button>` : ''}
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

  if(state.currentSectionKey === '__members__'){
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
}

function referencesSectionInnerHtml(sec){
  const refs = state.references || [];
  const list = refs.length ? refs.map((r,i) => `
    <p><span class="fig-label" style="margin-right:8px;">[${i+1}]</span>${escapeHtml(r.text || '(내용 없음)')}</p>
  `).join('') : `<div style="color:var(--ink-faint);font-size:13px;text-align:center;padding:20px 0;">아직 등록한 참고문헌이 없습니다</div>`;
  return `
    <div class="editor-head"><h2>${escapeHtml(sec.label)}</h2></div>
    <div class="editor-guidance" style="border-left-color:var(--stamp-green);color:var(--stamp-green);">이 목록은 Ref Ledger에서 자동으로 생성돼요. 순서를 바꾸거나 항목을 추가·삭제하려면 Ref Ledger로 이동하세요.</div>
    <button class="btn secondary small" style="margin-bottom:16px;" onclick="selectReferences()">Ref Ledger로 이동</button>
    <div style="font-family:'Times New Roman', '맑은 고딕', serif;font-size:15px;line-height:1.85;">${list}</div>
  `;
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
          <button class="btn secondary small" onclick="toggleInsertPicker('figures','${sec.key}')">＋ 그림 삽입</button>
          <button class="btn secondary small" onclick="toggleInsertPicker('tables','${sec.key}')">＋ 표 삽입</button>
          <button class="btn secondary small" onclick="toggleInsertPicker('refs','${sec.key}')">＋ 인용 삽입</button>
          <button class="btn secondary small" onclick="addHighlightToSection('${sec.key}')">＋ 하이라이트</button>
          ${sec.limit ? `<span class="section-limit">권장 ${sec.limit}단어 이내</span>` : ''}
          ${isCustom ? `<button class="icon-btn" title="섹션 삭제" onclick="removeCustomSection('${sec.key}')">✕</button>` : ''}
        </div>
      </div>
      ${isCustom ? `<input type="text" id="sec-guidance-input-${sec.key}" placeholder="이 섹션에 무엇을 써야 하는지 메모 (선택)" value="${escapeHtml(sec.guidance||'')}" style="width:100%;border:none;background:transparent;font-family:'Times New Roman', '맑은 고딕', serif;font-style:italic;font-size:13px;color:var(--ink-soft);margin:8px 0 16px;padding:0;" />`
        : (sec.guidance ? `<div class="editor-guidance">${escapeHtml(sec.guidance)}</div>` : '')}
      <div class="editor-area ${isEmpty ? 'is-empty' : ''} ${isKeywordsSection(sec) ? 'compact' : ''}" id="sec-content-input-${sec.key}" contenteditable="true" data-placeholder="여기에 ${escapeHtml(sec.label)} 내용을 작성하세요…">${plainTextToEditableHtml(rawContent)}</div>
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

  secs.forEach(sec => {
    if(isReferencesSection(sec)) return;
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
      const pending = state.pendingRemoteEdits[sec.key];
      if(pending !== undefined){
        delete state.pendingRemoteEdits[sec.key];
        applyRemoteEditToSection(sec.key, pending);
      }
    });

    const broadcastThrottled = throttleTrailing((html) => broadcastSectionEdit(sec.key, html), 150);

    contentInput.addEventListener('input', ()=>{
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
  target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
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
function teardownScrollSpy(){
  if(scrollSpyObserver){ scrollSpyObserver.disconnect(); scrollSpyObserver = null; }
}
// 스크롤 위치에 따라 사이드바 TOC의 활성 항목을 자동으로 갱신한다
// (화면 상단 근처 띠에 걸쳐 있는 섹션 중 가장 위에 있는 것을 "현재"로 표시).
function setupScrollSpy(){
  teardownScrollSpy();
  if(typeof IntersectionObserver === 'undefined') return;
  const sections = document.querySelectorAll('.ms-section[data-section-key]');
  if(!sections.length) return;
  scrollSpyObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter(e => e.isIntersecting);
    if(!visible.length) return;
    visible.sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top);
    const key = visible[0].target.dataset.sectionKey;
    if(key && key !== state.currentSectionKey){
      state.currentSectionKey = key;
      setActiveTocItem(key);
    }
  }, { root:null, rootMargin:'-15% 0px -70% 0px', threshold:0 });
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
  channel.on('broadcast', { event:'highlight' }, (msg) => handleRemoteHighlightEvent(msg.payload));
  channel.on('broadcast', { event:'item_comment' }, (msg) => handleRemoteItemCommentEvent(msg.payload));
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
    }
  });
  state.realtimeChannel = channel;
}

function leaveProjectRealtime(){
  if(state.realtimeChannel && window.sb){
    window.sb.removeChannel(state.realtimeChannel);
  }
  state.realtimeChannel = null;
  state.presenceUsers = {};
  state.pendingRemoteEdits = {};
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
}

function updateMyPresenceSection(sectionKey){
  if(!state.realtimeChannel || !state.currentUser) return;
  state.realtimeChannel.track({
    userId: state.currentUser.id,
    email: state.currentUser.email,
    displayName: (state.currentUser.profile && state.currentUser.profile.display_name) || state.currentUser.email,
    color: colorForUser(state.currentUser.id),
    sectionKey, at: Date.now()
  });
}

function broadcastSectionEdit(sectionKey, html){
  if(!state.realtimeChannel || !state.currentUser) return;
  state.realtimeChannel.send({
    type:'broadcast', event:'edit',
    payload:{ sectionKey, html, fromUserId: state.currentUser.id, ts: Date.now() }
  });
}

function handleRemoteEdit(payload){
  const { sectionKey, html, fromUserId } = payload || {};
  if(!sectionKey || fromUserId === (state.currentUser && state.currentUser.id)) return;
  const el = document.getElementById('sec-content-input-' + sectionKey);
  if(!el) return; // 지금 다른 화면(Ledger 등)을 보고 있으면 그냥 무시 — 저장은 상대방이 알아서 함
  if(document.activeElement === el){
    state.pendingRemoteEdits[sectionKey] = html; // 내가 타이핑 중이면 blur 때까지 보류
    return;
  }
  applyRemoteEditToSection(sectionKey, html);
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
    return `<div class="presence-panel-row">
      <span class="presence-avatar" style="background:${u.color}22;color:${u.color};border-color:${u.color};width:26px;height:26px;font-size:11px;">${escapeHtml(((u.displayName || u.email || '?').trim()[0] || '?').toUpperCase())}</span>
      <div>
        <div style="font-weight:600;font-size:12.5px;color:${u.color};">${escapeHtml(u.displayName || u.email || '?')}</div>
        ${sec ? `<div style="font-size:11px;color:var(--ink-faint);">${escapeHtml(sec)} 섹션 보는 중</div>` : ''}
      </div>
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
  document.querySelectorAll('.toc-presence').forEach(el => el.remove());
  Object.values(state.presenceUsers || {}).forEach(u => {
    if(!u.sectionKey) return;
    const btn = document.querySelector(`.toc-item[data-section-key="${u.sectionKey}"]`);
    if(!btn) return;
    const dot = document.createElement('span');
    dot.className = 'toc-presence';
    dot.style.background = u.color;
    dot.title = (u.displayName || u.email || '') + ' 편집 중';
    btn.appendChild(dot);
  });
}

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
    itemsHtml = figures.map((f,i) => `
      <button class="insert-item" onclick="pickFigureInsert(${i})">
        <span class="insert-thumb"><img src="${figureSrc(f)}" alt=""></span>
        <span class="insert-text">
          <div class="insert-primary">Fig. ${project ? figureNumberById(project, figures, f.id) : i+1}${project && !isFigureEmbedded(project, f.id) ? ' (미삽입)' : ''}</div>
          <div class="insert-secondary">${escapeHtml(f.caption || f.fileName)}</div>
        </span>
      </button>
    `).join('');
  }
  return tabs + itemsHtml;
}

function setFigInsertMode(mode){
  state.figInsertMode = mode;
  const panel = document.getElementById('inline-insert-picker');
  if(panel) panel.innerHTML = buildFigureInsertPanel();
}

function buildRefInsertItemsHtml(){
  const refs = state.references || [];
  if(state.referencesLoadFailed){
    return `<div class="insert-popover-empty">참고문헌 목록을 불러오지 못했어요.<br>Ref Ledger에서 다시 시도해주세요.</div>`;
  }
  if(refs.length === 0){
    return `<div class="insert-popover-empty">아직 등록한 참고문헌이 없어요.<br>Ref Ledger에서 먼저 추가해보세요.</div>`;
  }
  const items = refs.map((r,i) => `
    <label class="insert-item insert-item-check">
      <input type="checkbox" class="insert-ref-checkbox" value="${i}" onchange="updateRefInsertSubmit()" />
      <span class="insert-num">[${i+1}]</span>
      <span class="insert-text">
        <div class="insert-primary">${escapeHtml(r.label || ('참고문헌 ' + (i+1)))}</div>
        <div class="insert-secondary">${escapeHtml(r.text || '')}</div>
      </span>
    </label>
  `).join('');
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
  if(count) count.textContent = checked.length
    ? `${checked.length}개 선택됨 → [${compressRefNumbers(Array.from(checked).map(el => parseInt(el.value,10)+1))}]`
    : '0개 선택됨 — 여러 개 고르면 [1-3]처럼 자동으로 묶어요';
}

function submitRefInsertPick(){
  const checked = Array.from(document.querySelectorAll('.insert-ref-checkbox:checked'));
  if(!checked.length) return;
  const nums = checked.map(el => parseInt(el.value,10)+1);
  insertContentAtCursor(escapeHtml(`[${compressRefNumbers(nums)}]`));
  closeInsertPicker();
}

function toggleInsertPicker(kind, sectionKey){
  const existing = document.getElementById('inline-insert-picker');
  if(existing){
    const wasKind = existing.dataset.kind;
    const wasSection = existing.dataset.sectionKey || '';
    existing.remove();
    if(wasKind === kind && wasSection === (sectionKey || '')) return; // 같은 버튼을 다시 누르면 닫기만 함
  }
  if(sectionKey){
    state.activeTextareaId = 'sec-content-input-' + sectionKey;
    // 팝오버 안의 체크박스/버튼을 클릭하면 본문이 포커스를 잃으면서 커서 위치가
    // 사라지는 경우가 있다(특히 여러 개를 고르는 참고문헌 다중 선택). 패널을 여는
    // 시점의 커서를 미리 저장해뒀다가 실제 삽입할 때 복원한다.
    const el = document.getElementById(state.activeTextareaId);
    const sel = window.getSelection();
    state.savedInsertRange = (el && sel.rangeCount && el.contains(sel.anchorNode)) ? sel.getRangeAt(0).cloneRange() : null;
  }
  const container = sectionKey ? document.getElementById('ms-section-' + sectionKey) : document.querySelector('.editor-pane');
  const head = container ? container.querySelector('.editor-head') : document.querySelector('.editor-head');
  if(!head){ showToast('삽입 패널을 열 위치를 찾지 못했어요'); return; }
  const panel = document.createElement('div');
  panel.id = 'inline-insert-picker';
  panel.className = 'inline-insert-picker';
  panel.dataset.kind = kind;
  if(sectionKey) panel.dataset.sectionKey = sectionKey;
  panel.innerHTML = kind === 'figures' ? buildFigureInsertPanel() : kind === 'tables' ? buildTableInsertPanel() : buildRefInsertItemsHtml();
  head.insertAdjacentElement('afterend', panel);
}

function closeInsertPicker(){
  const existing = document.getElementById('inline-insert-picker');
  if(existing) existing.remove();
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

async function pickFigureInsert(index){
  const figures = state.figures || [];
  const f = figures[index];
  if(!f) return;
  const mode = state.figInsertMode || 'embed';
  const project = state.openProject;
  if(mode === 'embed'){
    const beforeOrder = project ? computeFigureOrder(project, figures) : [];
    const captionText = escapeHtml(f.caption || '(캡션 미작성)');
    // 정확한 번호는 삽입된 위치를 봐야 알 수 있으니 일단 넣고 바로 계산해서 고쳐 쓴다.
    const html = `<div class="inline-figure" contenteditable="false" data-fig-id="${f.id}"><img src="${figureSrc(f)}" alt=""><div class="inline-figure-caption"><b>Fig. ?.</b> ${captionText}</div></div><div><br></div>`;
    insertContentAtCursor(html);
    closeInsertPicker();
    if(project){
      const num = figureNumberById(project, figures, f.id);
      let changed = syncEmbeddedFigureCaption(project, f.id, num, f.caption);
      if(resyncFigureNumbering(beforeOrder, project, figures)) changed = true;
      if(changed){
        await setProject(project);
        renderWorkspace(project);
      }
    }
  } else {
    const num = project ? figureNumberById(project, figures, f.id) : index+1;
    insertContentAtCursor(escapeHtml(`Fig. ${num}`));
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
    itemsHtml = tables.map((t,i) => `
      <button class="insert-item" onclick="pickTableInsert(${i})">
        <span class="insert-num">T${i+1}</span>
        <span class="insert-text">
          <div class="insert-primary">Table ${i+1}</div>
          <div class="insert-secondary">${escapeHtml(t.caption || '(캡션 미작성)')}</div>
        </span>
      </button>
    `).join('');
  }
  return tabs + itemsHtml;
}

function setTableInsertMode(mode){
  state.tableInsertMode = mode;
  const panel = document.getElementById('inline-insert-picker');
  if(panel) panel.innerHTML = buildTableInsertPanel();
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

function pickTableInsert(index){
  const tables = state.tables || [];
  const t = tables[index];
  if(!t) return;
  const mode = state.tableInsertMode || 'embed';
  if(mode === 'embed'){
    insertContentAtCursor(buildInlineTableHtml(t, index+1));
  } else {
    insertContentAtCursor(escapeHtml(`Table ${index+1}`));
  }
  closeInsertPicker();
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
  const bracketRe = /\[\s*\d+(?:\s*[-–,]\s*\d+)*\s*\]/g;
  getSections(project).forEach(sec => {
    if(isReferencesSection(sec)) return; // References 섹션은 Ref Ledger에서 자동 생성되므로 대상 아님
    const original = project.content[sec.key] || '';
    if(!original) return;
    const text = original.replace(bracketRe, (whole) => {
      const nums = expandRefNumbers(whole.slice(1,-1));
      if(!nums.length) return whole;
      let touched = false;
      const remapped = nums.map(n => {
        if(mapObj.hasOwnProperty(n)){ touched = true; return mapObj[n]; }
        return n;
      });
      if(!touched) return whole;
      return '[' + compressRefNumbers(remapped) + ']';
    });
    if(text !== original){ project.content[sec.key] = text; changed = true; }
  });
  return changed;
}
function figTokenMatcher(n){ return new RegExp('Fig\\.\\s*' + n + '(?!\\d)', 'g'); }
function figTokenRender(n){ return `Fig. ${n}`; }
function tableTokenMatcher(n){ return new RegExp('Table\\s*' + n + '(?!\\d)', 'g'); }
function tableTokenRender(n){ return `Table ${n}`; }

// Fig 번호는 더 이상 Fig Ledger에 올린 순서로 고정하지 않는다 — 본문 어디에
// 먼저 삽입됐는지(섹션 순서 → 섹션 안에서의 등장 순서)로 매번 다시 계산한다.
// 아직 본문 어디에도 삽입 안 된 그림은 업로드 순서 그대로 뒤에 붙는다.
// 반환값: 그림 id 배열 (index+1이 곧 Fig 번호)
function computeFigureOrder(project, figures){
  const knownIds = new Set((figures||[]).map(f => f.id));
  const seen = new Set();
  const ordered = [];
  getSections(project).forEach(sec => {
    if(isReferencesSection(sec)) return;
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
  const order = computeFigureOrder(project, figures);
  const idx = order.indexOf(id);
  return idx === -1 ? order.length + 1 : idx + 1;
}
function isFigureEmbedded(project, id){
  return getSections(project).some(sec => !isReferencesSection(sec) && (project.content[sec.key]||'').includes(`data-fig-id="${id}"`));
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
  const orderedFigures = order.map(id => byId.get(id)).filter(Boolean);

  const cards = orderedFigures.map((f, i) => {
    const embedded = isFigureEmbedded(project, f.id);
    return `
    <div class="fig-card" data-fig-id="${f.id}">
      <div class="fig-thumb-wrap"><img src="${figureSrc(f)}" alt="${escapeHtml(f.fileName)}" /></div>
      <div class="fig-body">
        <div class="fig-head-row">
          <span class="fig-label">Fig. ${i+1}</span>
          <span class="fig-embed-badge ${embedded ? 'is-embedded' : 'is-unplaced'}">${embedded ? '본문에 삽입됨' : '아직 미삽입'}</span>
          <div class="fig-actions">
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
    </div>
  `;
  }).join('');

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
  `;

  const fileInput = document.getElementById('fig-file-input');
  fileInput.addEventListener('change', (e) => { handleFigureFiles(e.target.files); fileInput.value = ''; });

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

  const cards = tables.map((t, i) => {
    const columns = t.columns || [];
    const rows = t.rows || [];
    const headHtml = columns.map((c, ci) => `
      <th>
        <div style="display:flex;align-items:center;gap:2px;">
          <input class="tbl-cell-input" data-table-id="${t.id}" data-kind="col" data-ci="${ci}" value="${escapeHtml(c)}" placeholder="열 이름" style="font-weight:600;">
          ${columns.length > 1 ? `<button class="tbl-col-remove" title="열 삭제" onclick="removeTableColumn('${t.id}',${ci})">✕</button>` : ''}
        </div>
      </th>
    `).join('');
    const bodyHtml = rows.map((row, ri) => `
      <tr>
        ${columns.map((c, ci) => `<td><input class="tbl-cell-input" data-table-id="${t.id}" data-kind="cell" data-ri="${ri}" data-ci="${ci}" value="${escapeHtml(row[ci] || '')}"></td>`).join('')}
        <td class="tbl-grid-actions"><button title="행 삭제" onclick="removeTableRow('${t.id}',${ri})">✕</button></td>
      </tr>
    `).join('');

    return `
    <div class="tbl-card" draggable="true" data-table-id="${t.id}">
      <div class="tbl-card-head">
        <div class="fig-drag-handle" title="끌어서 순서 변경">⋮⋮</div>
        <span class="fig-label">Table ${i+1}</span>
        <div class="fig-actions" style="margin-left:auto;">
          <button title="위로" onclick="moveTable('${t.id}',-1)" ${i===0?'disabled style="opacity:.3;"':''}>↑</button>
          <button title="아래로" onclick="moveTable('${t.id}',1)" ${i===tables.length-1?'disabled style="opacity:.3;"':''}>↓</button>
          <button class="fig-delete" title="삭제" onclick="removeTable('${t.id}')">✕</button>
        </div>
      </div>
      <label class="fig-field-label">캡션 (표 위에 표시됨, 본문·Word 내보내기에 포함)</label>
      <textarea class="fig-caption-input tbl-caption-input" data-table-id="${t.id}" placeholder="캡션을 입력하세요 (예: Chemistry composition of designed alloy, wt%.)">${escapeHtml(t.caption||'')}</textarea>
      <label class="fig-field-label fig-field-label-note">팀 댓글</label>
      ${renderItemThreadHtml('table', t.id)}
      <div class="tbl-grid-wrap">
        <table class="tbl-edit-grid">
          <thead><tr>${headHtml}<th class="tbl-grid-actions"><button title="열 추가" onclick="addTableColumn('${t.id}')">＋</button></th></tr></thead>
          <tbody>${bodyHtml || ''}</tbody>
        </table>
      </div>
      <button class="btn secondary small" style="margin-top:8px;align-self:flex-start;" onclick="addTableRow('${t.id}')">＋ 행 추가</button>
    </div>`;
  }).join('');

  pane.innerHTML = `
    <div class="editor-head"><h2>Table Ledger</h2><span class="section-limit">${tables.length}개</span></div>
    <div class="editor-guidance" style="border-left-color:var(--stamp-green);color:var(--stamp-green);">표를 만들고 캡션을 작성하세요. 만든 순서대로 Table 1, 2, 3…으로 번호가 매겨지고, 카드를 끌어다 놓거나(⋮⋮) 화살표로 순서를 바꿀 수 있어요. 본문 섹션에서는 "＋ 표 삽입" 버튼으로 표 전체를 캡션과 함께 커서 위치에 넣거나, 표는 다른 곳에 두고 "Table N" 인용만 넣을 수 있어요. 순서를 바꾸면 본문의 "Table N" 표기도 자동으로 업데이트돼요. Word로 내보내면 3선(three-line) 표 형식으로 정리됩니다.</div>

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
        const changed = syncEmbeddedTableCaption(project, tableId, idx+1, e.target.value);
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

  // 드래그 앤 드롭 순서 변경
  let dragSrcId = null;
  pane.querySelectorAll('.tbl-card').forEach(card => {
    card.addEventListener('dragstart', (e) => {
      dragSrcId = card.dataset.tableId;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', card.dataset.tableId);
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      if(card.dataset.tableId !== dragSrcId) card.classList.add('drag-over');
    });
    card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
    card.addEventListener('drop', (e) => {
      e.preventDefault();
      card.classList.remove('drag-over');
      const targetId = card.dataset.tableId;
      if(dragSrcId && dragSrcId !== targetId) reorderTables(dragSrcId, targetId);
    });
  });
}

async function addNewTable(){
  state.tables = state.tables || [];
  state.tables.push(makeEmptyTable());
  const ok = await setTables(state.currentProjectId, state.tables);
  if(!ok) showToast('표 저장에 실패했어요. 다시 시도해주세요');
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
  const project = await getProject(state.currentProjectId);
  if(!project) return;
  const mapping = buildOldNewMapping(oldIds, newIds);
  const changed = renumberTokensInProject(project, mapping, tableTokenMatcher, tableTokenRender);
  if(changed){
    await setProject(project);
    showToast('본문의 표 번호를 새 순서에 맞게 업데이트했어요');
  }
  renderWorkspace(project);
}

async function reorderTables(srcId, targetId){
  const tables = state.tables || [];
  const srcIdx = tables.findIndex(t => t.id === srcId);
  const targetIdx = tables.findIndex(t => t.id === targetId);
  if(srcIdx === -1 || targetIdx === -1 || srcIdx === targetIdx) return;
  const oldIds = tables.map(t => t.id);
  const [moved] = tables.splice(srcIdx, 1);
  tables.splice(targetIdx, 0, moved);
  const newIds = tables.map(t => t.id);
  const ok = await setTables(state.currentProjectId, tables);
  if(!ok) showToast('순서 저장에 실패했어요');
  const project = await getProject(state.currentProjectId);
  if(!project) return;
  const mapping = buildOldNewMapping(oldIds, newIds);
  const changed = renumberTokensInProject(project, mapping, tableTokenMatcher, tableTokenRender);
  if(changed){
    await setProject(project);
    showToast('본문의 표 번호를 새 순서에 맞게 업데이트했어요');
  }
  renderWorkspace(project);
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
  `;

  if(inviteFormOpen){
    const input = document.getElementById('invite-email-input');
    if(input) input.focus();
  }
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
  return { highlight: mapHighlightRow(Object.assign({}, data, { profiles: profile })), error:null };
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
    showCommentNotification(highlight);
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
  if(action === 'create'){
    if(!state.itemComments.find(c => c.id === comment.id)) state.itemComments.push(comment);
    refreshItemThread(comment.itemType, comment.itemId);
  } else if(action === 'delete'){
    state.itemComments = state.itemComments.filter(c => c.id !== comment.id);
    refreshItemThread(comment.itemType, comment.itemId);
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
      <input type="text" id="ref-new-label" placeholder="짧은 표시 이름 (예: Kim et al. 2021)" />
      <textarea id="ref-new-text" placeholder="전체 참고문헌 텍스트를 붙여넣거나 직접 입력하세요 (예: H.J. Kim, et al., Microstructure evolution in Al-Mg-Si alloys, Acta Mater. 68 (2021) 112–120.)"></textarea>
      <input type="text" id="ref-new-doi" placeholder="DOI 또는 링크 (선택)" />
      <div style="display:flex;gap:8px;justify-content:flex-end;">
        <button class="btn secondary small" onclick="cancelAddReference()">취소</button>
        <button class="btn small" onclick="submitReference()">추가</button>
      </div>
    </div>
  ` : `<button class="btn secondary small" style="margin-bottom:16px;" onclick="showAddReferenceForm()">＋ 참고문헌 추가</button>`;

  const cards = refs.map((r, i) => `
    <div class="ref-card" draggable="true" data-ref-id="${r.id}">
      <div class="fig-drag-handle" title="끌어서 순서 변경">⋮⋮</div>
      <div class="ref-num-badge">${i+1}</div>
      <div class="ref-body">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
          <input type="text" class="ref-label-input" data-ref-id="${r.id}" data-field="label" value="${escapeHtml(r.label||'')}" placeholder="표시 이름" />
          <div class="fig-actions">
            <button title="위로" onclick="moveReference('${r.id}',-1)" ${i===0?'disabled style="opacity:.3;"':''}>↑</button>
            <button title="아래로" onclick="moveReference('${r.id}',1)" ${i===refs.length-1?'disabled style="opacity:.3;"':''}>↓</button>
            <button class="fig-delete" title="삭제" onclick="removeReference('${r.id}')">✕</button>
          </div>
        </div>
        <textarea class="ref-text-input" data-ref-id="${r.id}" data-field="text" placeholder="전체 참고문헌 텍스트">${escapeHtml(r.text||'')}</textarea>
        <input type="text" class="ref-doi-input" data-ref-id="${r.id}" data-field="doi" value="${escapeHtml(r.doi||'')}" placeholder="DOI 또는 링크 (선택)" />
        <label class="fig-field-label fig-field-label-note">팀 댓글</label>
        ${renderItemThreadHtml('reference', r.id)}
      </div>
    </div>
  `).join('');

  pane.innerHTML = `
    <div class="editor-head"><h2>Ref Ledger</h2><span class="section-limit">${refs.length}개</span></div>
    <div class="editor-guidance" style="border-left-color:var(--stamp-green);color:var(--stamp-green);">참고문헌을 등록하면 번호가 자동으로 매겨져요. 본문 섹션에서 "＋ 인용 삽입" 버튼을 누르면 커서 위치에 [번호] 형태로 바로 삽입되고, References 섹션에는 이 목록이 순서대로 자동 정리돼요. 카드를 끌어다 놓거나(⋮⋮) 화살표로 순서를 바꾸면, 본문에 이미 넣어둔 [번호] 표기도 새 순서에 맞게 자동으로 업데이트돼요.</div>

    ${addForm}
    <div class="fig-list" id="ref-list">${cards || `<div style="color:var(--ink-faint);font-size:13px;text-align:center;padding:20px 0;">아직 등록한 참고문헌이 없습니다</div>`}</div>
  `;

  if(refFormOpen){
    document.getElementById('ref-new-label').focus();
  }

  pane.querySelectorAll('.ref-label-input, .ref-text-input, .ref-doi-input').forEach(el => {
    el.addEventListener('input', (e) => {
      const ref = (state.references || []).find(r => r.id === e.target.dataset.refId);
      if(ref) ref[e.target.dataset.field] = e.target.value;
      scheduleRefSave();
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
  const label = document.getElementById('ref-new-label').value.trim();
  const text = document.getElementById('ref-new-text').value.trim();
  const doi = document.getElementById('ref-new-doi').value.trim();
  if(!text){ showToast('참고문헌 전체 텍스트를 입력해주세요'); return; }
  state.references = state.references || [];
  state.references.push({
    id: 'ref_' + Date.now() + '_' + Math.random().toString(36).slice(2,6),
    label, text, doi, addedAt: Date.now()
  });
  const ok = await setReferences(state.currentProjectId, state.references);
  if(!ok) showToast('참고문헌 저장에 실패했어요. 다시 시도해주세요');
  refFormOpen = false;
  const project = await getProject(state.currentProjectId);
  if(project) renderWorkspace(project);
}

async function moveReference(id, dir){
  const refs = state.references || [];
  const idx = refs.findIndex(r => r.id === id);
  const target = idx + dir;
  if(idx < 0 || target < 0 || target >= refs.length) return;
  const oldIds = refs.map(r => r.id);
  [refs[idx], refs[target]] = [refs[target], refs[idx]];
  const newIds = refs.map(r => r.id);
  const ok = await setReferences(state.currentProjectId, refs);
  if(!ok) showToast('순서 저장에 실패했어요');
  const project = await getProject(state.currentProjectId);
  if(!project) return;
  const mapping = buildOldNewMapping(oldIds, newIds);
  const changed = renumberRefCitationsInProject(project, mapping);
  if(changed){
    await setProject(project);
    showToast('본문의 인용 번호를 새 순서에 맞게 업데이트했어요');
  }
  renderWorkspace(project);
}

async function reorderReferences(srcId, targetId){
  const refs = state.references || [];
  const srcIdx = refs.findIndex(r => r.id === srcId);
  const targetIdx = refs.findIndex(r => r.id === targetId);
  if(srcIdx === -1 || targetIdx === -1 || srcIdx === targetIdx) return;
  const oldIds = refs.map(r => r.id);
  const [moved] = refs.splice(srcIdx, 1);
  refs.splice(targetIdx, 0, moved);
  const newIds = refs.map(r => r.id);
  const ok = await setReferences(state.currentProjectId, refs);
  if(!ok) showToast('순서 저장에 실패했어요');
  const project = await getProject(state.currentProjectId);
  if(!project) return;
  const mapping = buildOldNewMapping(oldIds, newIds);
  const changed = renumberRefCitationsInProject(project, mapping);
  if(changed){
    await setProject(project);
    showToast('본문의 인용 번호를 새 순서에 맞게 업데이트했어요');
  }
  renderWorkspace(project);
}

async function removeReference(id){
  state.references = (state.references || []).filter(r => r.id !== id);
  const ok = await setReferences(state.currentProjectId, state.references);
  if(!ok) showToast('삭제 내용을 저장하지 못했어요');
  const project = await getProject(state.currentProjectId);
  if(project) renderWorkspace(project);
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

  const directoryHtml = directory.length ? directory.map(d => `
    <div class="author-directory-item">
      <div class="adi-info">
        <div class="adi-name">${escapeHtml(d.name)}</div>
        <div class="adi-affil">${escapeHtml(authorAffiliations(d).join('; '))}</div>
      </div>
      <button class="btn secondary small" onclick="addAuthorFromDirectory('${d.id}')">＋ 추가</button>
      <button class="icon-btn" title="주소록에서 삭제" onclick="removeFromDirectory('${d.id}')">✕</button>
    </div>
  `).join('') : `<div class="author-directory-empty">저장된 저자가 없어요. 아래에서 새로 추가하면 주소록에도 저장할 수 있어요.</div>`;

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
  const openCommentCount = (state.highlights || []).filter(h => !h.resolvedAt).length;
  const membersBtn = `<button class="toc-item toc-figures ${state.currentSectionKey==='__members__'?'active':''}" data-section-key="__members__" onclick="selectMembers()">
      <span class="toc-num">☺</span>
      <span class="toc-dot" style="visibility:hidden;"></span>
      <span style="flex:1;text-align:left;">팀원${state.membersLoadFailed ? ' ⚠' : ` (${memberCount})`}</span>
    </button>`;
  const commentsBtn = `<button class="toc-item toc-figures ${state.currentSectionKey==='__comments__'?'active':''}" data-section-key="__comments__" onclick="selectComments()">
      <span class="toc-num">✎</span>
      <span class="toc-dot" style="visibility:hidden;"></span>
      <span style="flex:1;text-align:left;">댓글${state.highlightsLoadFailed ? ' ⚠' : (openCommentCount ? ` (${openCommentCount})` : '')}</span>
    </button>`;
  const authorsBtn = `<button class="toc-item toc-figures ${state.currentSectionKey==='__authors__'?'active':''}" data-section-key="__authors__" onclick="selectAuthors()">
      <span class="toc-num">✎</span>
      <span class="toc-dot" style="visibility:hidden;"></span>
      <span style="flex:1;text-align:left;">Author Ledger${state.authorsLoadFailed ? ' ⚠' : (authorCount ? ` (${authorCount})` : '')}</span>
    </button>`;
  const figuresBtn = `<button class="toc-item toc-figures ${state.currentSectionKey==='__figures__'?'active':''}" data-section-key="__figures__" onclick="selectFigures()">
      <span class="toc-num">▤</span>
      <span class="toc-dot" style="visibility:hidden;"></span>
      <span style="flex:1;text-align:left;">Fig Ledger${state.figuresLoadFailed ? ' ⚠' : (figCount ? ` (${figCount})` : '')}</span>
    </button>`;
  const tablesBtn = `<button class="toc-item toc-figures ${state.currentSectionKey==='__tables__'?'active':''}" data-section-key="__tables__" onclick="selectTables()">
      <span class="toc-num">▦</span>
      <span class="toc-dot" style="visibility:hidden;"></span>
      <span style="flex:1;text-align:left;">Table Ledger${state.tablesLoadFailed ? ' ⚠' : (tableCount ? ` (${tableCount})` : '')}</span>
    </button>`;
  const refsBtn = `<button class="toc-item toc-figures ${state.currentSectionKey==='__refs__'?'active':''}" data-section-key="__refs__" onclick="selectReferences()">
      <span class="toc-num">§</span>
      <span class="toc-dot" style="visibility:hidden;"></span>
      <span style="flex:1;text-align:left;">Ref Ledger${state.referencesLoadFailed ? ' ⚠' : (refCount ? ` (${refCount})` : '')}</span>
    </button>
    <div class="toc-divider"></div>`;
  const tocItems = secs.map((s,i)=>{
    const filled = isSectionFilled(project, s);
    return `<button class="toc-item ${s.key===state.currentSectionKey?'active':''} ${filled?'filled':''}" data-section-key="${s.key}" onclick="selectSection('${s.key}')">
      <span class="toc-num">${String(i+1).padStart(2,'0')}</span>
      <span class="toc-dot"></span>
      <span style="flex:1;text-align:left;">${escapeHtml(s.label)}</span>
    </button>`;
  }).join('');
  toc.innerHTML = membersBtn + commentsBtn + authorsBtn + figuresBtn + tablesBtn + refsBtn + tocItems + (isCustom ? `<button class="toc-add-btn" onclick="addCustomSection()">+ 섹션 추가</button>` : '');
}

async function selectSection(key){
  // 이미 원고 캔버스가 떠 있으면(이전 화면이 Ledger가 아니었으면) 다시
  // 그리지 않고 그냥 그 섹션으로 스크롤만 한다 — 다른 섹션에서 입력 중이던
  // 포커스/상태를 건드리지 않기 위함.
  const canvasAlreadyRendered = !isLedgerKey(state.currentSectionKey) && !!document.querySelector('.ms-section');
  state.currentSectionKey = key;
  if(canvasAlreadyRendered){
    scrollToSection(key, true);
    setActiveTocItem(key);
    return;
  }
  const project = await getProject(state.currentProjectId);
  if(!project){ showToast('일시적인 오류로 불러오지 못했어요. 다시 시도해주세요'); return; }
  renderWorkspace(project);
}

async function selectFigures(){
  state.currentSectionKey = '__figures__';
  const project = await getProject(state.currentProjectId);
  if(!project){ showToast('일시적인 오류로 불러오지 못했어요. 다시 시도해주세요'); return; }
  renderWorkspace(project);
}

async function selectTables(){
  state.currentSectionKey = '__tables__';
  const project = await getProject(state.currentProjectId);
  if(!project){ showToast('일시적인 오류로 불러오지 못했어요. 다시 시도해주세요'); return; }
  renderWorkspace(project);
}

async function selectMembers(){
  state.currentSectionKey = '__members__';
  const project = await getProject(state.currentProjectId);
  if(!project){ showToast('일시적인 오류로 불러오지 못했어요. 다시 시도해주세요'); return; }
  renderWorkspace(project);
}

async function selectComments(){
  state.currentSectionKey = '__comments__';
  const project = await getProject(state.currentProjectId);
  if(!project){ showToast('일시적인 오류로 불러오지 못했어요. 다시 시도해주세요'); return; }
  renderWorkspace(project);
}

async function selectReferences(){
  state.currentSectionKey = '__refs__';
  const project = await getProject(state.currentProjectId);
  if(!project){ showToast('일시적인 오류로 불러오지 못했어요. 다시 시도해주세요'); return; }
  renderWorkspace(project);
}

async function selectAuthors(){
  state.currentSectionKey = '__authors__';
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

  // 그림/표 삽입 시 커서 위치에 따라 브라우저가 .inline-figure/.inline-table를
  // 새 형제가 아니라 기존 <div> 문단 안쪽에 한 겹 더 감싸 넣는 경우가 있다(실제
  // 사용자 문서에서 확인됨). 최상위 자식만 보면 이 블록을 못 찾고 그냥 텍스트로
  // 뭉개버려 그림이 통째로 빠지므로, 재귀적으로 내려가며 찾는다.
  async function processContentNode(node){
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
    let out = '';
    for(const node of Array.from(tmp.childNodes)) out += await processContentNode(node);
    return out || pText('(작성되지 않음)', { italic:true, size:20 });
  }

  let body = '';
  body += pText(project.title || '제목 없음', { bold:true, size:36, align:'center', after:120 });
  body += buildAuthorBlock(authors);

  let numberedIndex = 0;
  for(let i=0; i<secs.length; i++){
    const s = secs[i];
    if(isGraphicalAbstractSection(s)) continue; // 별도 파일로 제출하는 항목이라 원고에는 안 넣는다
    if(isUnnumberedSection(s)){
      body += pHeading(s.label);
    } else {
      numberedIndex++;
      body += pHeading(`${numberedIndex}. ${s.label}`);
    }
    if(isReferencesSection(s)){
      if(references && references.length){
        references.forEach((r,ri) => { body += pText(`[${ri+1}] ${r.text||''}`, { size:20, after:120 }); });
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
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
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
  const j = JOURNALS[project.journalId] || JOURNALS.custom;
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
    renderAuthScreen('signin');
    setAuthMessage('가입 확인 이메일을 보냈어요. 메일함을 확인한 뒤 로그인해주세요.', 'notice');
    return;
  }
  await bootAfterAuth();
}

async function handleLogout(){
  leaveProjectRealtime();
  await authSignOut();
  state.currentUser = null;
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

/* ============== INIT ============== */
onAuthStateChange((event) => {
  if(event === 'SIGNED_OUT'){
    state.currentUser = null;
    showAuthScreen('signin');
  }
});

window.addEventListener('beforeunload', () => { leaveProjectRealtime(); });
initSelectionHighlightUI();

(async function initApp(){
  const session = await getSession();
  if(!session){ showAuthScreen('signin'); return; }
  await bootAfterAuth();
})();
