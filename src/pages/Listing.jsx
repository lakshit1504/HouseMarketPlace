import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MapContainer, Popup, Marker, TileLayer } from "react-leaflet";
import { getAuth } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/pagination";
import "swiper/css";
import { Pagination } from "swiper";

function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };

    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) {
    return <Spinner />;
  }
  return (
    <main>
      <Swiper
        slidesPerView={1}
        pagination={true}
        modules={[Pagination]}
        className="swiper-container"
      >
        {listing.imageUrls.map((url, index) => (
          <SwiperSlide key={index} className="swiper-container">
            <div
              className="swiperSlideDiv"
              style={{
                position: "relative",
                background: `url(${url}) center no-repeat`,
                backgroundSize: "cover",
                width: "100%",
                height: "100%"
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <img src={shareIcon} alt="share" />
      </div>

      {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}

      <div className="listingDetails">
        <p className="listingName">
          {listing.name} - $
          {listing.offer ? listing.discountedPrice : listing.regularPrice}
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">
          {listing.type === "rent" ? "Rent" : "Sale"}
        </p>
        {listing.offer && (
          <p className="discountPrice">
            ${listing.regularPrice - listing.discountedPrice} discount
          </p>
        )}
        <ul className="listingDetailsList">
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} bedrooms`
              : "1 bedroom"}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} bathrooms`
              : "1 bathroom"}
          </li>
          <li>{listing.parking && "Parking Spot"}</li>
          <li>{listing.furnished && "Furnished"}</li>
        </ul>

        <p className="listingLocationTitle">Location</p>

        <div className="leafletContainer">
          <MapContainer
            style={{ height: "100%", width: "100%" }}
            zoom={13}
            scrollWheelZoom={true}
            center={[listing.geolocation.lat, listing.geolocation.lng]}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}&listingLocation=${listing.location}`}
            className="primaryButton"
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </main>
  );
}

export default Listing;
