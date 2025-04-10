import IconGithub from "../icons/icon-github"
import IconLinkedIn from "../icons/icon-linkedin"

type Props = {
  className?: string;
}

export default function SocialMedia({ className }: Props) {
  return (
    <div className={className}>
      <a href="https://github.com/cesareuseche" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
        <IconGithub />
      </a>
      <a href="https://linkedin.com/in/cesar-useche-profile/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
        <IconLinkedIn />
      </a>
    </div>
  )
}