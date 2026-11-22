// Prints a short, friendly summary of the test run and tells the student if the task is approved.
// Bonus tests (made with bonus() in helpers.jsx) are shown with a star and are not required for approval.

const green = (s) => `\x1b[32m${s}\x1b[0m`
const red = (s) => `\x1b[31m${s}\x1b[0m`
const yellow = (s) => `\x1b[33m${s}\x1b[0m`
const bold = (s) => `\x1b[1m${s}\x1b[0m`

function firstLine(error) {
  const line = String(error?.message ?? error ?? '')
    .split('\n')
    .find((l) => l.trim())
  return (line ?? 'unknown error').trim().slice(0, 300)
}

export default class FriendlyReporter {
  onTestRunEnd(testModules, unhandledErrors = []) {
    const out = []
    let passed = 0
    let failed = 0
    let bonusDone = 0
    let bonusTotal = 0

    const modules = [...testModules].sort((a, b) =>
      a.moduleId.localeCompare(b.moduleId),
    )

    for (const testModule of modules) {
      for (const error of testModule.errors()) {
        failed++
        out.push(`  ${red('✘')} ${testModule.relativeModuleId} could not run`)
        out.push(`      ${red('→ ' + firstLine(error))}`)
      }

      for (const testCase of testModule.children.allTests()) {
        const result = testCase.result()
        const meta = testCase.meta()

        if (meta.bonus) {
          bonusTotal++
          if (meta.bonusDone) {
            bonusDone++
            out.push(`  ${yellow('★')} ${testCase.name}`)
          } else {
            out.push(
              `  ${yellow('☆')} ${testCase.name} ${yellow('(bonus, not done yet)')}`,
            )
          }
          continue
        }

        if (result.state === 'passed') {
          passed++
          out.push(`  ${green('✔')} ${testCase.name}`)
        } else if (result.state === 'failed') {
          failed++
          out.push(`  ${red('✘')} ${testCase.name}`)
          out.push(`      ${red('→ ' + firstLine(result.errors?.[0]))}`)
        }
      }
    }

    for (const error of unhandledErrors) {
      failed++
      out.push(`  ${red('✘')} Your code threw an error outside a test`)
      out.push(`      ${red('→ ' + firstLine(error))}`)
    }

    const total = passed + failed
    out.push('')
    out.push(
      `${bold('Result:')} ${passed}/${total} tests passed` +
        (bonusTotal ? `, bonus ${bonusDone}/${bonusTotal}` : ''),
    )

    if (total > 0 && failed === 0) {
      out.push(
        green(
          bold(
            '\n✅ All tests passed - the task is APPROVED! You can move on to the next task.',
          ),
        ),
      )
      out.push(
        green('✅ כל הטסטים עברו - המשימה אושרה! אפשר לעבור למשימה הבאה.'),
      )
    } else {
      out.push(
        red(
          bold(
            `\n❌ ${failed} test(s) still failing - the task is not approved yet. Keep going!`,
          ),
        ),
      )
      out.push(red('❌ עדיין יש טסטים שנכשלים - המשימה עוד לא אושרה. תמשיכו!'))
    }

    console.log('\n' + out.join('\n') + '\n')
  }
}
