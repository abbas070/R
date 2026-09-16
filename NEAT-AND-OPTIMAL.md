# Neat & Optimal

A co-op browser game for Rose and Murad: nine rounds, two neuroscience quizzes,
and a retry whenever a round is failed. Play together on one screen with a
keyboard, pointer, or the touch controls.

## Put it on GitHub Pages — no terminal needed

This package includes a tested, prebuilt `docs` folder and the editable source.

1. Create a new repository on your GitHub account, for example `neat-and-optimal`.
   Public repositories can use GitHub Pages on GitHub Free. Private-repository
   Pages requires an eligible paid plan. The site will be publicly accessible
   unless your plan supports and you configure Pages access controls.
2. Unzip this package. Open the new repository and use **Add file → Upload files**.
   Upload the **contents inside** `neat-and-optimal-github`, including its `docs`
   folder. Do not upload the ZIP itself or wrap everything in another folder.
   Commit the files to `main`.
3. Open **Settings → Pages → Build and deployment**.
4. Set **Source** to **Deploy from a branch**, select **main** and **/docs**, then
   choose **Save**.
5. Wait for GitHub's Pages deployment to finish. The Pages settings screen will
   show the live link, normally `https://YOUR-USERNAME.github.io/neat-and-optimal/`.

Only the `docs` directory is served as the website. Source files are visible in
a public repository. This export contains the game and its artwork; it does not
include the private chat archive, account credentials, or the original hosting
configuration.

If the deployment is not ready, check the repository's **Actions** tab for the
Pages build result. Keep `/docs/index.html` directly inside that folder. You can
choose a different repository name; the game's assets use relative URLs.

## Edit and rebuild

Install Node.js 24, then run these commands in this directory:

```sh
npm install --global pnpm@11.19.0
pnpm install --frozen-lockfile
pnpm dev
```

After editing:

```sh
pnpm build
pnpm preview
```

Commit both the source changes and the regenerated `docs` folder. GitHub Pages
automatically redeploys changes pushed to `main`.

The app uses React, TypeScript, and Vite. There is no backend, database, API key,
or server setup. Game progress is held in memory and resets on refresh, as in
the original game. The `noindex` tag is a request to search engines, not access
control.

## Source map

- `app/page.tsx`: game screen and input controls
- `app/globals.css`: styling
- `lib/arcade.ts`: rounds, scoring, failure and retry rules
- `lib/arcade-render.ts`: challenge rendering
- `lib/neuroscience.ts`: quiz questions and their sources
- `components/neuro-round.tsx`: quiz interface
- `assets/cosmic-playfield.webp`: background artwork

## Official GitHub instructions

- [About GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [Configure a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
