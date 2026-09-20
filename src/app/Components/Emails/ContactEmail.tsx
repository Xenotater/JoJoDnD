export default function ContactEmailBody({name, message, email}: {name: string, message: string, email?: string}) {
  return (
    <div>
      <h2>Contact from &quot;{name}&quot;{email ? ` with return address "${email}"` : ""}</h2>
      <br/>
      <p>{message}</p>
    </div>
  )
}