// import Image from 'next/image'

import { Editor } from "@/components/Editor";

export default function Home({ params }: {
    params: {
        'topic-id': string
        'course-id': string
    }
}) {
    const topicId = params?.['topic-id']
    const courseId = params?.["course-id"]
  return (
    <main className=''>
        {/* <p>{courseId}</p> */}
        {/* <p>{topicId}</p> */}
      <Editor content="" id={`${courseId}_${topicId}`} />
    </main>
  )
}
