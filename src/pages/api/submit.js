export default async function handler(
  req,
  res
) {
  const data = await req.body;

  res.status(200).json(data.prompt)
}