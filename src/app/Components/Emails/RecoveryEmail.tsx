export default function RecoveryEmailBody({user, code}: {user: string, code: string}) {
  return (
    <div>
      <h2>{user}, reset your JoJoDnD.com password using the link below.</h2>
      <br/>
      <a href={`https://www.jojodnd.com/account/recovery?code=${code}`}>https://www.jojodnd.com/account/recovery?code={code}</a>
      <br/><br/>
      <small><i>If you did not submit a recovery request, please ignore this email. Do not share your recovery link with anyone. Your recovery link is valid for 1 hour.</i></small>
    </div>
  )
}