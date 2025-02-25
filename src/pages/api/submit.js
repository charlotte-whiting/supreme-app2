export default async function POST(
  req,
  res
) {
  const data = req
  // const hope = await req.json()
  console.log(data)
  // console.log(hope)
  // console.log(data.get('prompt'))
  // const { data } = JSON.parse(req.body)
  // const data = await req.json()
  // console.log(data)
  res.status(200).json({ "data": "hi" })
}