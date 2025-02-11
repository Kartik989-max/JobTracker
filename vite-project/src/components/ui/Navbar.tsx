import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <Card className="container w-full bg-transparent py-5 px-8 border-0 flex items-center justify-between gap-[10vw] rounded-none text-white">
      <div className="md:flex items-center gap-2">
      {/* <img  src="/logo.png" className="flex-2 rounded-3xl text-primary cursor-pointer"   alt="Description" width="50" /> */}
      <h1 className="font-bold text-xl cursor-pointer">APPLYMATE</h1>
      </div>
      <ul className="hidden md:flex items-center gap-10 text-card-foreground">
        <li className="text-primary font-light">
          <a className="text-white  opacity-50 hover:opacity-100" href="#Home">Home</a>
        </li>
        <li>
          <a className="text-white opacity-50 hover:opacity-100" href="#Extension">Extension</a>
        </li>
        <li>
          <a className="text-white opacity-50 hover:opacity-100" href="#Features">Features</a>
        </li>
        <li>
          <a className="text-white  opacity-50 hover:opacity-100" href="#faqs">FAQs</a>
        </li>
      </ul>
      <div className="flex items-center">
        <Button variant="secondary" className="hidden hover:bg-black md:block px-2">
          <Link to="/Login" className="text-black hover:text-white">
            Login
          </Link>
        </Button>
        <Button className="hidden bg-[#779ECB] md:block ml-2 mr-2">
          <Link className="text-white" to="/signup">
            Get Started
          </Link>
        </Button>
      </div>
      
    </Card>
  );
};

export default Navbar;


