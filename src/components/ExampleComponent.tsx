export default function ExampleComponent({ userId, myId }: { userId: string | undefined, myId: string | undefined }) {
  return (
    <div>
      Example component
      <br />
      {userId}
      <br />
      {myId}
    </div>
  )
}