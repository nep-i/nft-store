import { Link } from "react-router";
import { Avatar } from "primereact/avatar";
import artGallery from "./../Assets/last-gal.svg";
import aboutMe from "./../Assets/hair-salon-svgrepo-com.svg";
import feed from "./../Assets/rss-svgrepo-com.svg";
import chats from "./../Assets/chats-2-svgrepo-com.svg";

const Navigation = () => {
  const iconElm = (image: string) => {
    return (
      <div className="flex align-items-center">
        <Avatar image={image} shape="square" size="large" />
      </div>
    );
  };

  return (
    <nav style={{ display: "flex", gap: "2rem", width: "100%" }}>
      <Link to="/about">{iconElm(aboutMe)}</Link>
      <Link to="/chat">{iconElm(chats)}</Link>
      <Link to="/forum">{iconElm(feed)}</Link>
      <Link to="/products">{iconElm(artGallery)}</Link>
    </nav>
  );
};
export default Navigation;
