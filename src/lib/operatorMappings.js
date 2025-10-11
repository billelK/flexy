import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'src/operatorPorts.json')

export function saveDetectedOperators(operators) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(operators, null, 2))
    console.log('Saved operator mappings to', filePath)
    return true
  } catch (err) {
    console.error('Error saving operator mappings:', err)
    return false
  }
}

export function readDetectedOperators() {
  try {
    if (!fs.existsSync(filePath)) return []
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    console.error('Error reading operator mappings:', err)
    return []
  }
}
