export type CreatorProfile = {
  name: string;
  title: string;
  email: string;
  location: string;
  availability: string;
  linkedinUrl: string;
  githubUrl: string;
  whatsappDisplay: string;
  whatsappUrl: string;
  portfolioUrl: string | null;
};

export const creator: CreatorProfile = {
  name: "Alson Chua",
  title: "Independent Web & App Developer",
  email: "alsonchua18@gmail.com",
  location: "Malaysia · Working with clients worldwide",
  availability: "Available for freelance projects worldwide",
  linkedinUrl: "https://www.linkedin.com/in/chua-yiz-063ba9272",
  githubUrl: "https://github.com/yiz1118",
  whatsappDisplay: "+60 11-5857 6386",
  whatsappUrl: "https://wa.me/601158576386",
  portfolioUrl: "https://alson-portfolio-nine.vercel.app/",
};

export const conceptProject = {
  name: "FORM / 27",
  status: "Independent Concept Project",
};

const greeting = `Hi ${creator.name.split(" ")[0]}`;
const whatsappMessage = `${greeting}, I came across your ${conceptProject.name} concept project and I'm interested in discussing a website/app project with you.`;
const emailSubject = `Project Inquiry — ${conceptProject.name}`;
const emailBody = `${greeting},\n\nI came across your ${conceptProject.name} concept project and would like to discuss a potential website, app, or digital product project.`;

export const creatorContactLinks = {
  whatsapp: `${creator.whatsappUrl}?text=${encodeURIComponent(whatsappMessage)}`,
  email: `mailto:${creator.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`,
};
