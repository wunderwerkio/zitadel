# wunderwerk fork of ZITADEL

`custom-login` is upstream ZITADEL plus the wunderwerk "Werkstatt" look for
Login V2 (`apps/login`), following ZITADEL's guide
[Maintain and Deploy a Customized ZITADEL Login UI](https://zitadel.com/docs/guides/integrate/login-ui/fork-and-deploy-login-app):
a full fork with our changes in `apps/login`, plus the root
`WUNDERWERK_UPSTREAM` and `.github/workflows/ww-*.yml` (see "What we change"),
built from `custom-login` into an immutable image. The design is the wunderos Storybook story `Zitadel/Werkstatt`.

```
zitadel/zitadel release vX.Y.Z
  └─ ww-upstream-sync (every 3 h)      merge into upstream/vX.Y.Z, PR, test, build
       └─ custom-login                 merged when green
            └─ ww-login-image          ghcr.io/wunderwerkio/zitadel-login:vX.Y.Z-custom.N
                 └─ wunderwerk-infra   zitadel-upgrade opens the bump PR (core + login),
                                       a human merges and syncs zitadel-prod
```

## What we change

All visual rules live in our own files; upstream files only carry `data-ww`
hooks, so merges of new releases stay small.

| Path | |
| --- | --- |
| `apps/login/src/werkstatt/` | `werkstatt.css` (the whole look), backdrop, Geist font (OFL), wunderwerk-ci line drawings |
| `apps/login/src/app/(login)/layout.tsx` | imports, font variable, backdrop, footer hook |
| `apps/login/src/components/*.tsx` | `data-ww` attributes, `aria-pressed` on the theme switch |
| `apps/login/src/werkstatt/hooks.test.tsx` | pins the hooks, so an upstream markup change fails the build |
| `.github/workflows/ww-*.yml` | image build, upstream sync |
| `WUNDERWERK_UPSTREAM` | the upstream release `custom-login` is on |

Assets are imported through CSS, never `public/`: the standalone image does
not serve `public/` under the base path. Colours, logo and texts stay in the ZITADEL label policy and hosted-login
translations (wunderwerk-infra `terraform/cloud/zitadel/branding.tf`).

Repository settings this relies on: default branch `custom-login` (scheduled
workflows run only from the default branch), Actions and Issues enabled,
upstream's own workflows disabled (the sync keeps them so).

## Updating

Automatic for every release of the current major (security fixes included):
see `.github/workflows/ww-upstream-sync.yml`. To pull an urgent security
release now: Actions → **wunderwerk upstream sync** → Run workflow
(`gh workflow run ww-upstream-sync.yml`). Whatever the sync cannot finish ends
up as an issue here.

By hand, on such an issue or a new major:

```sh
git fetch https://github.com/zitadel/zitadel.git "refs/tags/vX.Y.Z:refs/tags/vX.Y.Z"
git switch -c upstream/vX.Y.Z custom-login
git merge --no-ff vX.Y.Z           # resolve, keeping the data-ww hooks
echo vX.Y.Z > WUNDERWERK_UPSTREAM
git commit -am "chore: track upstream vX.Y.Z"
pnpm install --frozen-lockfile --filter "@zitadel/login..." --filter "@zitadel/zitadel"
NX_NO_CLOUD=true pnpm nx run-many -p @zitadel/login -t lint,test-unit,build
```

Open a PR into `custom-login` with a merge commit (never squash: the upstream
ancestry is what makes the next merge work).

## Local development

```sh
cd apps/login
printf 'ZITADEL_API_URL=http://localhost:8300\nZITADEL_SERVICE_USER_TOKEN=<PAT>\nZITADEL_SESSION_COOKIE_SECRET=<hex>\n' > .env.development.local
pnpm exec next dev -p 3100        # http://localhost:3100/ui/v2/login/loginname
```
