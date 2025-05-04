import { readJSON } from 'hubtools'

console.log(readJSON(process.argv[2] || 'hubJson2/all.json'))
