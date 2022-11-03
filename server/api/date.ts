export default defineEventHandler((event) => {
  return {
    date: (new Date()).toISOString()
  }
})