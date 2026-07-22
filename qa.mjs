import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const url = 'http://localhost:5173/'
const out = 'C:/Users/Dominique/prisma/shots'
mkdirSync(out, { recursive: true })

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--ignore-gpu-blocklist'],
})

async function seek(page, p) {
  await page.evaluate((prog) => {
    const l = window.__lenis
    const max = document.documentElement.scrollHeight - window.innerHeight
    if (l && l.scrollTo) l.scrollTo(max * prog, { immediate: true })
    else window.scrollTo(0, max * prog)
  }, p)
}

async function pass(name, width, height) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 })
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(String(e)))

  await page.goto(url, { waitUntil: 'load', timeout: 45000 }).catch(() => {})
  // Let frames stream + WebGL warm up + hero entrance play
  await page.waitForTimeout(4500)

  const steps = [
    ['hero', 0.0],
    ['ethos', 0.28],
    ['mid', 0.5],
    ['work', 0.72],
    ['contact', 0.97],
  ]
  for (const [label, p] of steps) {
    await seek(page, p)
    await page.waitForTimeout(1300)
    await page.screenshot({ path: `${out}/${name}-${label}.png` })
  }

  if (errors.length) console.log(`[${name}] console errors:\n` + errors.slice(0, 8).join('\n'))
  await page.close()
}

await pass('desktop', 1440, 900)
await pass('mobile', 390, 844)

await browser.close()
console.log('QA_DONE')
