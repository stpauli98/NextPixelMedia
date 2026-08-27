import { defineConfig } from '@playwright/test'

// Port se čita iz okruženja (PORT), sa 3000 kao podrazumijevanim — nijedan
// port nije "ispravan" sam po sebi, samo zavisi šta je slobodno na mašini
// koja pokreće testove. `PORT=3117 npm run test:e2e` gađa dev server koji
// već radi na 3117 na ovoj mašini.
const port = process.env.PORT ?? 3000

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: `http://localhost:${port}` },
  webServer: {
    command: `npx next dev -p ${port}`,
    url: `http://localhost:${port}`,
    // U CI-ju stari server ne smije prikriti regresiju — uvijek pokreni svježi.
    reuseExistingServer: !process.env.CI,
  },
})
