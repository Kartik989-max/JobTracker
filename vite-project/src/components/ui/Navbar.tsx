import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <Card className="container w-full bg-transparent py-3 px-4 border-0 flex items-center justify-center gap-[10vw] rounded-none text-white">
      <img  src="/logo.png" className="flex-2 rounded-3xl text-primary cursor-pointer"   alt="Description" width="50" />
      <ul className="hidden md:flex items-center gap-10 text-card-foreground">
        <li className="text-primary font-medium">
          <a className="text-white" href="#home">Home</a>
        </li>
        <li>
          <a className="text-white" href="#features">Features</a>
        </li>
        <li>
          <a className="text-white" href="#pricing">Pricing</a>
        </li>
        <li>
          <a className="text-white" href="#faqs">FAQs</a>
        </li>
      </ul>
      <div className="flex items-center">
        <Button variant="secondary" className="hidden md:block px-2">
          <Link to="/Login" className="text-black">
            Login
          </Link>
        </Button>
        <Button className="hidden md:block ml-2 mr-2">
          <Link className="text-white" to="/signup">
            Get Started
          </Link>
        </Button>
      </div>
      
    </Card>
  );
};

export default Navbar;


