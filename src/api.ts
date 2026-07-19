export async function hello() {
  'use server'
  console.log('on server')
  await new Promise(resolve => setTimeout(resolve, 1000))
  return 'Hello World'
}
