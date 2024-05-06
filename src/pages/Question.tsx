import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api.ts';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Group, Profile, Question as QuestionType } from '../types/types';
import { Avatar, Link } from '@nextui-org/react';

export default function Question() {
  const { id } = useParams();
  const [ question, setQuestion ] = useState<QuestionType>();
  const [ author, setAuthor ] = useState<Profile>()
  const [ group, setGroup ] = useState<Group>()
  const [ loading, setLoading ] = useState<boolean>(true)

  const editor = useEditor({
    extensions: [
      StarterKit
    ],
    editable: false
  })

  useEffect(() => {
    api.get(`questions/get-question?id=${id}`)
      .then((res) => {
        const data = res.data;
        console.log(data.body);
        setQuestion(data.body)
      })
      .catch(err => console.error(err))
  }, [id]);

  useEffect(() => {
    // Set editor content
    if (question?.content) {
      editor?.commands.setContent(question.content);
    }

    // fetch user profile
    api.get(`users/profile/${question?.authorId}`)
      .then(res => {
        const data = res.data;
        setAuthor(data);
      }).catch(err => console.error(err));

    // fetch group info
    api.get(`groups/getGroup?group_id=${question?.groupId}`)
    .then(res => {
      const data = res.data;
      setGroup(data)
    })
    .catch(err => console.error(err))

    .finally(() => setLoading(false))
  }, [editor, question]);

  return !loading && (
    <div className="col-span-9">
      <div className="p-4 flex gap-3 flex-col">
        <div className='flex gap-2 items-center'>
          <Avatar name={group?.title} color='primary' />
          <div className='flex flex-col'>
            <Link href={`/group/${group?.id}`} className='font-bold hover:cursour-pointer text-foregorund'>
              {group?.title}
            </Link>
            <Link href={`/user/${author?.id}`} className='font-bold hover:cursour-pointer text-foregorund'>
              @{author?.username}
            </Link>
          </div>
        </div>
        <h1 className="text-2xl font-bold">{question?.title}</h1>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}