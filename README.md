# 논문 투고 워크스페이스

저널별 섹션 구성에 맞춰 논문 원고를 작성하고, 그림·참고문헌·저자 정보를 관리하다가 Word(.docx)로 내보낼 수 있는 개인용 워크스페이스입니다.

## 실행 방법

빌드 과정이 없는 정적 사이트입니다. 아무 정적 서버로 `index.html`을 열면 됩니다.

```bash
python3 -m http.server 8000
# http://localhost:8000 접속
```

## Supabase 설정 (최초 1회)

데이터(프로젝트, 그림, 참고문헌, 저자)는 Supabase에 저장됩니다.

1. [Supabase 대시보드](https://supabase.com/dashboard) → 해당 프로젝트 → **SQL Editor**에서 `supabase/schema.sql` 내용을 실행해 `app_storage` 테이블을 생성합니다.
2. `js/supabase-config.js`에 프로젝트 URL과 anon(publishable) key가 이미 채워져 있습니다. 다른 프로젝트로 바꾸려면 이 파일만 수정하면 됩니다.

anon key는 클라이언트에 노출되어도 안전하도록 설계된 키이며, 실제 접근 제어는 `app_storage` 테이블의 Row Level Security 정책으로 이루어집니다. 이 앱은 로그인 없는 개인용 도구를 전제로 anon key에 해당 테이블 전체 읽기/쓰기 권한을 부여합니다 — 여러 사용자가 쓰는 서비스로 확장하려면 `supabase/schema.sql`의 정책을 사용자별 정책으로 교체해야 합니다.

## 구조

- `index.html` — 앱 셸(상단바, 탭, 모달 루트)
- `css/style.css` — 전체 스타일
- `js/supabase-config.js` — Supabase 프로젝트 URL/키
- `js/storage-shim.js` — `window.storage.{get,set,delete}` 인터페이스를 Supabase `app_storage` 테이블 위에 구현
- `js/app.js` — 대시보드, 저널별 워크스페이스, Fig/Ref/Author Ledger, `.docx` 내보내기를 포함한 앱 로직
