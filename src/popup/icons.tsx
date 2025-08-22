export function VenmoIcon() {
  return (
    <a
      href="https://venmo.com/iambrokeunlucko"
      target="_blank"
      rel="noopener noreferrer"
    >
      {/* Using inline styles */}
      <img
        src="./images/donation.png"
        alt="Venmo"
        className="h-1 w-1"
        style={{ height: "32px", width: "32px" }}
      />
    </a>
  );
}

export function LinkedInIcon() {
  return (
    <a
      href="https://linkedin.com/in/jereme-yang"
      target="_blank"
      rel="noopener noreferrer"
    >
      {/* Using inline styles */}
      <img
        src="./images/linkedin-icon.png"
        alt="LinkedIn"
        className="h-1 w-1"
        style={{ height: "32px", width: "32px" }}
      />
    </a>
  );
}
