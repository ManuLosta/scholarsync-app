import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import EditorMenu from './EditorMenu.tsx';
import { Underline } from '@tiptap/extension-underline';
import { Divider } from '@nextui-org/react';

export default function Editor({
  onChange,
}: {
  onChange: (text: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: false,
          keepAttributes: false,
        },
      }),
      Underline,
    ],
    editorProps: {
      attributes: {
        class: 'prose outline-none p-3 rounded-xl w-full min-h-[30vh]',
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  return (
    <div className="border flex flex-col gap-3 p-4 rounded-xl focus:border-primary">
      <EditorMenu editor={editor} />
      <Divider />
      <EditorContent placeholder="Escribe tu pregunta aquí" editor={editor} />
    </div>
  );
}
