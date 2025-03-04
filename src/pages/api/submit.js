export default async function handler(
  req,
  res
) {
  const data = await req.body;
  // console.log('WWWWWdeeedW',data)
  
  res.status(200).json(data.prompt)
}