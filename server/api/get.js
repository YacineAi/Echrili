export default defineEventHandler(async (event) => {
    const { url } = getQuery(event)
    
    const data = await $fetch(`https://alifetcher.onrender.com/detail?id=${url}`);

    const details = { ...data };
    
    return { details }
})