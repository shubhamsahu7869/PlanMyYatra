import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "AI Travel Planner",
  description: "Plan trips with AI-generated itineraries, budgets, and hotel suggestions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
