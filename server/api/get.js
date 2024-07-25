export default defineEventHandler(async (event) => {
    const { url } = getQuery(event)
    
    const data = await $fetch(`https://asiafetcher.onrender.com/detail?id=${url}`);

    const details = { ...data };
    
    return { details }
})