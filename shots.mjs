import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const url = 'http://localhost:5173/'
const out = 'C:/Users/Dominique/prisma/shots'
mkdirSync(out, { recursive: true })

const browser = await chromium.launch({
  args: ['--autoplay-policy=no-user-gesture-required'],
})

async function pass(name, width, height) {
  const page = await browser.newPage({ viewport: { width, height } })
  await page
    .goto(url, { waitUntil: 'load', timeout: 30000 })
    .catch(() => {})
  await page.waitForTimeout(2500) // fonts + hero entrance

  await page.screenshot({ path: `${out}/${name}-1-hero.png` })

  // About = 2nd <section>
  await page.evaluate(() => {
    document.querySelectorAll('section')[1]?.scrollIntoView({ behavior: 'instant', block: 'center' })
  })
  await page.waitForTimeout(1600)
  await page.screenshot({ path: `${out}/${name}-2-about.png` })

  // Features header = 3rd <section>
  await page.evaluate(() => {
    document.querySelectorAll('section')[2]?.scrollIntoView({ behavior: 'instant', block: 'start' })
  })
  await page.waitForTimeout(1800)
  await page.screenshot({ path: `${out}/${name}-3-features.png` })

  // Bottom of page (cards fully in view)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(1400)
  await page.screenshot({ path: `${out}/${name}-4-bottom.png` })

  await page.close()
}

await pass('desktop', 1440, 900)
await pass('mobile', 390, 844)

await browser.close()
console.log('SHOTS_DONE')
