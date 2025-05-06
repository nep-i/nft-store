import { Link } from "react-router";
import { SiAboutdotme } from "react-icons/si";
import { CiChat1 } from "react-icons/ci";
import { SiBuymeacoffee } from "react-icons/si";
import { MdForum } from "react-icons/md";

const Navigation = () => {
  const iconSize = "40";
  return (
    <nav style={{ display: "flex", gap: "2rem", width: "100%" }}>
      <Link to="/about">{SiAboutdotme({ size: iconSize })}</Link>
      <Link to="/chat">{CiChat1({ size: iconSize })}</Link>
      <Link to="/forum">{MdForum({ size: iconSize })}</Link>
      <Link to="/products">{SiBuymeacoffee({ size: iconSize })}</Link>
    </nav>
  );
};
export default Navigation;
