import { Event } from "@/types/events";
import { HeaderSubtitle } from "../../common/header-subtitle";

const EventWishesSection = ({ event }: { event: Event }) => {
  return (
    <div className="space-y-6">
      <HeaderSubtitle
        title="Wishes"
        subtitle="Check out what people are wishing for this event"
      />

      {event?.wishes && event.wishes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {event.wishes.map((wish) => (
            <div
              key={wish.id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-lg mb-2">{wish.title}</h3>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-blue-600 border border-blue-600 rounded-full px-2 py-1 text-xs font-medium">
                  {wish.wish_type}
                </span>
                <span className="text-gray-400 text-xs">{wish.status}</span>
              </div>
              <p className="text-gray-600 text-sm">
                {wish.product
                  ? `Product ID: ${wish.product}`
                  : wish.service
                  ? `Service ID: ${wish.service}`
                  : "No additional details available"}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No wishes available for this event.</p>
      )}
    </div>
  );
};

export default EventWishesSection;
