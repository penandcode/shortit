let nanoid
module.exports.createID = async (n) => {
  if (!nanoid) ({ nanoid } = await import('nanoid'))
  return nanoid(n) // => "V1StGXR8_Z5jdHi6B-myT"
}