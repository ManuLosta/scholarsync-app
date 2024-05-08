import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import EditorMenu from './EditorMenu.tsx';
import { Underline } from '@tiptap/extension-underline';
import { Divider } from '@nextui-org/react';
import "katex/dist/katex.min.css"
import MathExtension from '@aarkue/tiptap-math-extension';

export default function Editor({
  onChange,
  error,
}: {
  onChange: (text: string) => void;
  error: string | undefined;
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
      MathExtension.configure({ evaluation: true })
    ],
    editorProps: {
      attributes: {
        class: 'prose outline-none p-3 rounded-xl w-full min-h-[30vh]',
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  return (
    <>
      <div
        className={`border flex flex-col gap-3 p-4 rounded-xl focus:border-primary ${error && 'bg-danger-50'}`}
      >
        <EditorMenu editor={editor} />
        <Divider />
        <EditorContent placeholder="Escribe tu pregunta aquí" editor={editor} />
      </div>
      {error && <p className="text-danger text-tiny">{error}</p>}
    </>
  );
}
