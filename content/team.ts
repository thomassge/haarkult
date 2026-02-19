// content/team.ts
export type TeamMember = {
  name: string;
  role: string;
  image: string; // Pfad unter /public
};

export const team: TeamMember[] = [
  {
    name: "Sonia Duarte da Luz",
    role: "Stylistin & Coloristin",
    image: "/team/SoniaDuartedaLuz.jpg",
  },
  {
    name: "Maria Samartzidou",
    role: "Stylistin & Coloristin",
    image: "/team/MariaSamartzidou.jpg",
  },
];
