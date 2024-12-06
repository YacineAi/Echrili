export default defineEventHandler(async (event) => {
    const { url } = getQuery(event)
    
    const data = await $fetch(`https://notibest.notibyte-dz.com/detail2?id=${url}`);

    const details = { ...data };
    
    return { details }
})