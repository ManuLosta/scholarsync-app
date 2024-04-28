import { Editor } from '@tiptap/react';
import { Button, Divider } from '@nextui-org/react';
import {
  LuBold,
  LuCode,
  LuItalic,
  LuList,
  LuListOrdered,
  LuSquareCode,
  LuUnderline,
} from 'react-icons/lu';

export default function EditorMenu({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button
        onPress={() => editor.chain().focus().toggleBold().run()}
        color={editor.isActive('bold') ? 'primary' : 'default'}
        isIconOnly
        size="sm"
        tabIndex={-1}
      >
        <LuBold />
      </Button>
      <Button
        onPress={() => editor.chain().focus().toggleItalic().run()}
        color={editor.isActive('italic') ? 'primary' : 'default'}
        isIconOnly
        size="sm"
        tabIndex={-1}
      >
        <LuItalic />
      </Button>
      <Button
        onPress={() => editor.chain().focus().toggleUnderline().run()}
        color={editor.isActive('underline') ? 'primary' : 'default'}
        isIconOnly
        size="sm"
        tabIndex={-1}
      >
        <LuUnderline />
      </Button>
      <Button
        onPress={() => editor.chain().focus().toggleCode().run()}
        color={editor.isActive('code') ? 'primary' : 'default'}
        isIconOnly
        size="sm"
        tabIndex={-1}
      >
        <LuCode />
      </Button>
      <Divider orientation="vertical" />
      <Button
        onPress={() => editor.chain().focus().toggleOrderedList().run()}
        color={editor.isActive('orderedList') ? 'primary' : 'default'}
        isIconOnly
        size="sm"
        tabIndex={-1}
      >
        <LuListOrdered />
      </Button>
      <Button
        onPress={() => editor.chain().focus().toggleBulletList().run()}
        color={editor.isActive('bulletList') ? 'primary' : 'default'}
        isIconOnly
        size="sm"
        tabIndex={-1}
      >
        <LuList />
      </Button>
      <Button
        onPress={() => editor.chain().focus().toggleCodeBlock().run()}
        color={editor.isActive('codeBlock') ? 'primary' : 'default'}
        isIconOnly
        size="sm"
        tabIndex={-1}
      >
        <LuSquareCode />
      </Button>
    </div>
  );
}
