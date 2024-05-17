import { Question } from '../../types/types';
import { Link } from 'react-router-dom';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MathExtension from '@aarkue/tiptap-math-extension';
import { useEffect } from 'react';
import { Avatar } from '@nextui-org/react';

export default function PostCard({ question }: { question: Question }) {
  const editor = useEditor({
    extensions: [StarterKit, MathExtension.configure({ evaluation: true })],
    editable: false,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert',
      },
    },
  });

  useEffect(() => {
    editor?.commands.setContent(question.content);
  }, [editor, question.content]);

  return (
    <div className="hover:bg-foreground-100 rounded-xl flex flex-col p-3 gap-2">
      <div>
        <div className="flex gap-2 items-center">
          <Avatar name={question.groupTitle} color="primary" />
          <div className="flex flex-col">
            <Link
              to={`/group/${question.groupId}`}
              className="font-bold hover:cursour-pointer text-foregorund"
            >
              {question.groupTitle}
            </Link>
            <Link
              to={`/user/${question.author.id}`}
              className="hover:cursour-pointer text-foregorund"
            >
              @{question.author.username}
            </Link>
          </div>
        </div>
      </div>
      <h2 className="text-xl font-bold">{question.title}</h2>
      <EditorContent editor={editor} />
    </div>
  );
}
