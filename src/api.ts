import { query } from '@solidjs/router'

export const hello = query(async function () {
  'use server'
  console.log('on server')
  await new Promise(resolve => setTimeout(resolve, 1000))
  return 'Hello World'
}, 'hello')
