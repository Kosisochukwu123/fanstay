import PropertyCarousel from "../common/PropertyCarousel";



const TicketsTab = ({ events }) => {
  return (
    <>
      <PropertyCarousel
        title="Matches with tickets available"
        items={events}
        type="event"
        viewAllLink="/events"
      />

      {events.length === 0 && (
        <p className="empty-text">
          No ticketed matches available right now.
        </p>
      )}
    </>
  );
};

export default TicketsTab;