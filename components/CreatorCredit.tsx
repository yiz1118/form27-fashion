import { ArrowUpRight, ChevronDown } from "lucide-react";
import { conceptProject, creator, creatorContactLinks } from "@/config/creator";
import { UiIcon } from "./UiIcon";

export function CreatorCredit() {
  return (
    <section className="creator-credit" aria-labelledby="creator-name" data-project={conceptProject.name}>
      <div className="creator-identity">
        <p className="eyebrow creator-concept">{conceptProject.status}</p>
        <p className="creator-byline">Designed &amp; developed by</p>
        <h2 id="creator-name">{creator.name}</h2>
        <p className="creator-title">{creator.title}</p>
        <p className="creator-location">{creator.location}</p>
        <p className="creator-availability"><span aria-hidden="true" />{creator.availability}</p>
      </div>
      <div className="creator-inquiry">
        <p className="eyebrow">Have a similar project in mind?</p>
        <h3>Let&apos;s build<br /><em>something together.</em></h3>
        <div className="creator-actions">
          <details className="creator-contact">
            <summary data-analytics-event="creator_start_project">
              Start a Project <UiIcon icon={ChevronDown} size={18} />
            </summary>
            <div className="creator-contact-options">
              <p>Contact {creator.name.split(" ")[0]} about your website, app, or digital product.</p>
              <a href={creatorContactLinks.whatsapp} target="_blank" rel="noopener noreferrer" data-analytics-event="creator_whatsapp">
                <span>WhatsApp<small>{creator.whatsappDisplay}</small></span>
                <UiIcon icon={ArrowUpRight} size={18} /><span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a href={creatorContactLinks.email} data-analytics-event="creator_email">
                <span>Email<small>{creator.email}</small></span><UiIcon icon={ArrowUpRight} size={18} />
              </a>
            </div>
          </details>
          {creator.portfolioUrl && <a className="creator-portfolio" href={creator.portfolioUrl} target="_blank" rel="noopener noreferrer" data-analytics-event="creator_portfolio">
            View Portfolio <UiIcon icon={ArrowUpRight} size={17} /><span className="sr-only"> (opens in a new tab)</span>
          </a>}
        </div>
        <nav className="creator-socials" aria-label="Creator profiles">
          <a href={creator.linkedinUrl} target="_blank" rel="noopener noreferrer" data-analytics-event="creator_linkedin">LinkedIn <UiIcon icon={ArrowUpRight} size={14} /><span className="sr-only"> (opens in a new tab)</span></a>
          <a href={creator.githubUrl} target="_blank" rel="noopener noreferrer" data-analytics-event="creator_github">GitHub <UiIcon icon={ArrowUpRight} size={14} /><span className="sr-only"> (opens in a new tab)</span></a>
        </nav>
      </div>
    </section>
  );
}
