# 논문 투고 워크스페이스

저널별 섹션 구성에 맞춰 여러 사람이 함께 논문 원고를 작성하고, 그림·표·참고문헌·저자 정보를 관리하다가 Word(.docx)로 내보낼 수 있는 협업 워크스페이스입니다.

## 실행 방법

빌드 과정이 없는 정적 사이트입니다. 아무 정적 서버로 `index.html`을 열면 됩니다.

```bash
python3 -m http.server 8000
# http://localhost:8000 접속
```

## Supabase 설정 (최초 1회)

[Supabase 대시보드](https://supabase.com/dashboard) → 해당 프로젝트 → **SQL Editor**에서 아래 파일들을 **이 순서대로** 실행합니다.

1. `supabase/schema.sql` — (레거시) 초기 단일 사용자 KV 테이블. 지금은 앱이 쓰지 않지만 참고용으로 둡니다.
2. `supabase/002_auth_and_membership.sql` — 계정(`profiles`), 프로젝트(`projects`), 프로젝트 멤버십(`project_members`) 및 RLS 정책. **Authentication → Providers → Email**이 켜져 있어야 합니다(신규 프로젝트는 기본 활성화).
3. `supabase/003_highlights.sql` — 하이라이트/코멘트 테이블 및 RLS 정책.

`js/supabase-config.js`에 프로젝트 URL과 anon(publishable) key가 이미 채워져 있습니다. 다른 프로젝트로 바꾸려면 이 파일만 수정하면 됩니다. anon key는 클라이언트에 노출되어도 안전하도록 설계된 키이며, 실제 접근 제어는 Row Level Security(계정별·프로젝트 멤버십 기준)로 이루어집니다.

## 계정 및 권한

- **가입**: 누구나 이메일/비밀번호로 자유롭게 가입합니다.
- **어드민**: `profiles.is_admin`이 켜진 계정. 관리자 탭에서 전체 계정 목록을 보고 관리자 권한·활성화 상태를 바꿀 수 있습니다. 최초 관리자는 SQL Editor에서 직접 지정해야 합니다: `update public.profiles set is_admin = true where email = '...';`
- **프로젝트 소유자**: 프로젝트를 만든 사람. 참여자를 초대/제거하고 프로젝트를 삭제할 수 있는 유일한 사람입니다.
- **참여자**: 소유자가 이메일로 초대한 계정. 프로젝트를 함께 편집할 수 있습니다.

## 실시간 협업

프로젝트를 열면 자동으로 Supabase Realtime 채널에 참여합니다.

- **프레즌스**: 지금 같은 프로젝트를 보고 있는 다른 사람들이 상단에 색깔 아바타로 표시되고, 사이드바에는 그 사람이 보고 있는 섹션 옆에 같은 색 점이 뜹니다.
- **거의 실시간 동기화**: 다른 탭(다른 사람 또는 나의 다른 탭)에서 타이핑하면 내용이 실시간에 가깝게 반영됩니다. 완전한 CRDT(Figma/Google Docs 수준)는 아니라서, 정확히 같은 섹션을 동시에 타이핑하는 극히 드문 경우엔 나중에 포커스를 벗어난 쪽 내용이 반영됩니다. 서로 다른 섹션을 동시에 편집하는 일반적인 경우는 충돌 없이 동작합니다.

## 하이라이트 & 코멘트

본문에서 문구를 드래그해 선택한 뒤 섹션 상단의 "＋ 하이라이트" 버튼을 누르면 그 자리에 메모를 남길 수 있습니다. 메모 색은 남긴 사람마다 자동으로 달라지고(프레즌스 아바타와 같은 색), 워크스페이스의 "코멘트" 탭에서 프로젝트 전체 코멘트를 한눈에 모아볼 수 있습니다.

## 구조

- `index.html` — 앱 셸(로그인 화면, 상단바, 탭, 모달 루트)
- `css/style.css` — 전체 스타일
- `js/supabase-config.js` — Supabase 프로젝트 URL/키
- `js/data.js` — Supabase 클라이언트 초기화 + 인증 헬퍼 (회원가입/로그인/로그아웃/세션)
- `js/app.js` — 대시보드, 저널별 워크스페이스, Fig/Ref/Author/Table Ledger, 팀원·코멘트 관리, 실시간 협업, `.docx` 내보내기를 포함한 앱 로직
- `supabase/002_auth_and_membership.sql` — 계정/프로젝트/멤버십 스키마 및 RLS
- `supabase/003_highlights.sql` — 하이라이트/코멘트 스키마 및 RLS
