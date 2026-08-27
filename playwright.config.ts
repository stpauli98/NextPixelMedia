import { defineConfig } from '@playwright/test'

// Port 3000 je zauzet nevezanim procesom na ovoj mašini; dev server za ovaj
// projekat već radi na 3117 (vidi zadatak), pa Playwright cilja na njega.
// `reuseExistingServer: true` znači da se postojeći server ponovo koristi
// ako već radi, a pokreće novi (na istom portu) ako ne.
export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:3117' },
  webServer: {
    command: 'npx next dev -p 3117',
    url: 'http://localhost:3117',
    reuseExistingServer: true,
  },
})
