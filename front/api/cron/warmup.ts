export default async function handler() {
  console.log("Chạy health");
  await fetch('https://v-sport.vercel.app/health', {
    method: 'GET',
    cache: 'no-store'
  });
  return new Response('ok');
}
