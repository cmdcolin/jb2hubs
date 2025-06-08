import { getAccessionById, getAllAccessions } from '../../../lib/api'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { speciesName } = await getAccessionById(id)
  return {
    title: speciesName,
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { description, speciesName, accession } = await getAccessionById(id)
  console.log({ description, speciesName })
  return (
    <div>
      <div>
        <h1>{speciesName}</h1>
        <h4>{accession}</h4>
      </div>
      <pre>{description}</pre>
    </div>
  )
}

export async function generateStaticParams() {
  const posts = await getAllAccessions()
  return posts.map(post => ({
    id: post.id,
  }))
}
