import { useStorage } from '#imports';

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    await useStorage('myFileSystem').setItem('rates.json', body);
    return { ok: true };
})